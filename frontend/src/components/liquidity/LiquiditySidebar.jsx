import { useState, useEffect } from "react";
import { getClaimableRewards, getPoolStats } from "../../utils/contractUtils";
import { showSuccess, showError } from "../../utils/toast";
import confetti from "canvas-confetti";

export default function LiquiditySidebar({ lpBalance, pairAddress, onClaim, address }) {
  const [claimable, setClaimable] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ tvl: "-", volume: "-", apr: "-" });

  const fetchRewards = async () => {
    if (!pairAddress || !address) return;
    try {
      const rewards = await getClaimableRewards(pairAddress, address);
      setClaimable(rewards);
    } catch (err) {
      console.warn("Failed to fetch rewards:", err);
    }
  };

  const fetchStats = async () => {
    if (!pairAddress) return;
    try {
      const { tvl, volume, apr } = await getPoolStats(pairAddress);
      setStats({
        tvl: `$${tvl.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
        volume: `$${volume.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
        apr: `${apr.toFixed(2)}%`
      });
    } catch (err) {
      console.warn("Failed to fetch pool stats:", err);
    }
  };

  useEffect(() => {
    fetchRewards();
    fetchStats();
  }, [pairAddress, address]);

  const handleClaim = async () => {
    if (!pairAddress) return;
    try {
      setLoading(true);
      await onClaim?.();
      await fetchRewards();
      showSuccess("Rewards claimed!");

      // Launch confetti 🎉
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error("Claim failed:", err);
      showError("Failed to claim rewards.");
    } finally {
      setLoading(false);
    }
  };

  const isZero = parseFloat(claimable) === 0;

  return (
    <div className="space-y-6">
      {/* LP Position Box */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Your Position
        </h3>
        <div className="text-center py-6 text-gray-500">
          <div className="text-3xl mb-2">💼</div>
          <p className="text-sm">LP Balance: {lpBalance}</p>
        </div>
      </div>

      {/* Rewards Box */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Claimable Rewards
        </h3>
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-gray-600">Token A (fees):</span>
          <span className="font-semibold">{claimable}</span>
        </div>
        <button
          onClick={handleClaim}
          disabled={loading || isZero}
          className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 ${
            isZero ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {loading ? "Claiming..." : isZero ? "Nothing to Claim" : "Claim All"}
        </button>
      </div>

      {/* Pool Stats (dynamic) */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Pool Statistics
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Value Locked:</span>
            <span className="font-semibold">{stats.tvl}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">24h Volume:</span>
            <span className="font-semibold">{stats.volume}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">APR:</span>
            <span className="font-semibold text-green-600">{stats.apr}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
