import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallet } from "../contexts/WalletContext";
import LiquidityHeader from "../components/liquidity/LiquidityHeader";
import LiquidityForm from "../components/liquidity/LiquidityForm";
import LiquiditySidebar from "../components/liquidity/LiquiditySidebar";
import TransactionList from "../components/TransactionList";
import { getPairAddress, getLPBalance, claimRewards } from "../utils/contractUtils";
import { getUserTransactions } from "../utils/transactionLog";
import { showSuccess, showError } from "../utils/toast";

export default function Liquidity() {
  const { walletData } = useWallet();
const address = walletData?.address;
const signer = walletData?.signer;
const isConnected = !!address;

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

   const [tokenA, setTokenA] = useState(DEFAULT_TOKENS.TKA);
  const [tokenB, setTokenB] = useState(DEFAULT_TOKENS.TKB);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [amountLP, setAmountLP] = useState("");
  const [pairAddress, setPairAddress] = useState(null);
  const [lpBalance, setLpBalance] = useState("0.0");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!tokenA || !tokenB || !address) return;
      try {
        const pair = await getPairAddress(tokenA.address, tokenB.address);
        if (!pair || pair === ethers.ZeroAddress) return;
        setPairAddress(pair);

        const lp = await getLPBalance(pair, address);
        setLpBalance(lp);

        const txs = await getUserTransactions(pair, address);
        setTransactions(txs);
      } catch (err) {
        console.error("Error fetching pair details:", err);
      }
    };

    fetchDetails();
  }, [tokenA, tokenB, address]);

  const refetchTransactionsAndLP = async () => {
    if (!pairAddress || !address) return;
    const lp = await getLPBalance(pairAddress, address);
    setLpBalance(lp);

    try {
      const txs = await getUserTransactions(pairAddress, address);
      setTransactions(txs);
    } catch (err) {
      console.warn("Failed to refresh transactions:", err);
    }
  };

  const handleClaim = async () => {
    if (!pairAddress) return;
    try {
      setLoading(true);
      showSuccess("Claiming rewards...");
      await claimRewards(pairAddress);
      await refetchTransactionsAndLP();
      showSuccess("Rewards successfully claimed!");
    } catch (err) {
      console.error("Claim failed:", err);
      showError("Reward claim failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">💧</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Connect Your Wallet
          </h3>
          <p className="text-gray-600 mb-6">
            Connect your wallet to provide liquidity and earn rewards on MetaCow DEX
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <LiquidityHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LiquidityForm
            tokenA={tokenA}
            setTokenA={setTokenA}
            tokenB={tokenB}
            setTokenB={setTokenB}
            amountA={amountA}
            setAmountA={setAmountA}
            amountB={amountB}
            setAmountB={setAmountB}
            amountLP={amountLP}
            setAmountLP={setAmountLP}
            lpBalance={lpBalance}
            pairAddress={pairAddress}
            signer={signer}
            address={address}
            loading={loading}
            setLoading={setLoading}
            onTxUpdate={refetchTransactionsAndLP}
          />
        </div>

        <LiquiditySidebar
          lpBalance={lpBalance}
          pairAddress={pairAddress}
          address={address}
          onClaim={handleClaim}
        />
      </div>

      <div className="mt-10 bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Transactions
        </h3>
        <TransactionList userAddress={address} transactions={transactions} />
      </div>
    </div>
  );
}
