import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useWallet } from "../contexts/WalletContext";
import { showSuccess, showError, showWarning } from "../utils/toast";
import {
  getPairAddress,
  getReserves,
  swap,
} from "../utils/contractUtils";
import {
  saveSwapToBackend,
  getAllSwapsAcrossPairs,
} from "../utils/transactionLog";

import SwapForm from "../components/swap/SwapForm";
import SwapChart from "../components/swap/SwapChart";
import TransactionList from "../components/TransactionList";
import { ethers } from "ethers";

// ✅ Default tokens (TKA & TKB)
const DEFAULT_TOKENS = {
  TKA: {
    symbol: "TKA",
    address: "0x1e792D4c34c3d04Bd127aFEf0c1696E912c755aa",
  },
  TKB: {
    symbol: "TKB",
    address: "0x9e53abdDBFa9DC6A9bCD9D0e5DD7144F2701718D",
  },
};

export default function Swap() {
  const [tokenA, setTokenA] = useState(DEFAULT_TOKENS.TKA);
  const [tokenB, setTokenB] = useState(DEFAULT_TOKENS.TKB);
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");
  const [pairAddress, setPairAddress] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const { walletData } = useWallet();
  const address = walletData?.address;
  const isConnected = !!address;
  const [loading, setLoading] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { tokenA: tokenAAddr, tokenB: tokenBAddr, amountIn } = location.state;
      if (tokenAAddr && tokenBAddr) {
        setTokenA({ address: tokenAAddr, symbol: "TKA" });
        setTokenB({ address: tokenBAddr, symbol: "TKB" });
      }
      if (amountIn) setAmountIn(amountIn);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchEstimate = async () => {
      if (tokenA && tokenB && amountIn) {
        try {
          const pair = await getPairAddress(tokenA.address, tokenB.address);
          if (!pair || pair === ethers.ZeroAddress) {
            setAmountOut("0.0");
            setPairAddress(null);
            return;
          }

          setPairAddress(pair);
          const { reserveA, reserveB } = await getReserves(pair);
          const [inputReserve, outputReserve] =
            tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
              ? [reserveA, reserveB]
              : [reserveB, reserveA];

          const input = parseFloat(amountIn);
          const inputWithFee = input * 997;
          const output =
            (inputWithFee * outputReserve) / (inputReserve * 1000 + inputWithFee);
          setAmountOut(output.toFixed(6));
        } catch {
          setAmountOut("0.0");
        }
      } else {
        setAmountOut("");
      }
    };

    fetchEstimate();
  }, [tokenA, tokenB, amountIn]);

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const allTxs = await getAllSwapsAcrossPairs(200);
      setTransactions(allTxs.slice(0, 10));

      const filteredTxs = allTxs.filter(
        (tx) =>
          (tx.inputTokenSymbol === tokenA?.symbol &&
            tx.outputTokenSymbol === tokenB?.symbol) ||
          (tx.inputTokenSymbol === tokenB?.symbol &&
            tx.outputTokenSymbol === tokenA?.symbol)
      );

      const processed = filteredTxs.map((tx) => {
        const price =
          tx.inputTokenSymbol === tokenA?.symbol
            ? parseFloat(tx.outputAmount) / parseFloat(tx.inputAmount)
            : parseFloat(tx.inputAmount) / parseFloat(tx.outputAmount);

        return {
          timestamp: tx.timestamp,
          price,
          volume: parseFloat(tx.inputAmount),
        };
      });

      setRecentTransactions(filteredTxs.slice(0, 5));
      setPriceHistory(processed.sort((a, b) => a.timestamp - b.timestamp));
    } catch (err) {
      console.error("Error fetching txs:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    if (tokenA && tokenB) fetchTransactions();
  }, [address, tokenA, tokenB]);

  const handleSwap = async () => {
    if (!tokenA || !tokenB || !amountIn || !pairAddress) {
      showWarning("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      const parsedIn = ethers.parseUnits(amountIn, 18);
      const receipt = await swap(pairAddress, parsedIn, tokenA.address);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const block = await provider.getBlock(receipt.blockNumber);

      await saveSwapToBackend({
        user: address,
        pairAddress: pairAddress.toLowerCase(),
        inputToken: tokenA.address,
        outputToken: tokenB.address,
        inputAmount: amountIn,
        outputAmount: amountOut,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        timestamp: block.timestamp,
      });

      showSuccess("Swap successful and saved!");
      fetchTransactions();
    } catch (err) {
      console.error("Swap failed:", err);
      showError("Swap failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = () => {
    setTokenA(tokenB);
    setTokenB(tokenA);
    setAmountIn(amountOut);
    setAmountOut("");
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center text-gray-700">
        <p className="text-lg font-medium">
          Please connect your wallet to use MetaCow Swap 🐮
        </p>
      </div>
    );
  }

return (
  <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Left - Swap Form */}
    <div>
      <SwapForm
        tokenA={tokenA}
        tokenB={tokenB}
        amountIn={amountIn}
        amountOut={amountOut}
        onAmountInChange={setAmountIn}
        onTokenAChange={setTokenA}
        onTokenBChange={setTokenB}
        onSwitch={handleSwitch}
        onSwap={handleSwap}
        loading={loading}
      />
    </div>

    {/* Right - Chart */}
    <div>
      <SwapChart
        tokenA={tokenA}
        tokenB={tokenB}
        chartData={priceHistory}
        onRefresh={fetchTransactions}
        onClearLive={() => setPriceHistory([])}
        loading={loadingTransactions}
      />
    </div>

    {/* Full-width TransactionList */}
    <div className="lg:col-span-2 mt-10 bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Public Transactions
      </h3>
      <TransactionList userAddress={address} transactions={transactions} />
    </div>
  </div>
);
}