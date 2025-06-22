// pages/Swap.jsx
import { useEffect, useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import { showSuccess, showError, showWarning } from "../utils/toast";
import { getPairAddress, getReserves, swap } from "../utils/contractUtils";
import { getAllUserSwaps } from "../utils/transactionLog";

import SwapForm from "../components/swap/SwapForm";
import SwapChart from "../components/swap/SwapChart";
import TransactionList from "../components/TransactionList";
import { ethers } from "ethers";

export default function Swap() {
  const { address, isConnected } = useWallet();

  const [tokenA, setTokenA] = useState(null);
  const [tokenB, setTokenB] = useState(null);
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");
  const [pairAddress, setPairAddress] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

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
      const allTxs = await getAllUserSwaps(address, 100); // 🔁 CHANGED: passed address
      setTransactions(allTxs.slice(0, 10)); // for TransactionList

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
      await swap(pairAddress, parsedIn, tokenA.address);
      showSuccess("Swap successful!");
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
        <p className="text-lg font-medium">Please connect your wallet to use MetaCow Swap 🐮</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
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

      <SwapChart
        tokenA={tokenA}
        tokenB={tokenB}
        chartData={priceHistory}
        onRefresh={fetchTransactions}
        onClearLive={() => setPriceHistory([])}
        loading={loadingTransactions}
      />

      <div className="mt-10 bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Transactions
        </h3>
        <TransactionList userAddress={address} transactions={transactions} />
      </div>
    </div>
  );
}
