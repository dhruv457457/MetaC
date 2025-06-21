import { useState, useEffect } from "react";
import { getClaimableRewards } from "../../utils/contractUtils";
import { showSuccess, showError } from "../../utils/toast";

export default function LiquiditySidebar({ lpBalance, pairAddress, onClaim, address }) {
  const [claimable, setClaimable] = useState("0.00");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRewards = async () => {
      if (!pairAddress || !address) return;
      try {
        const rewards = await getClaimableRewards(pairAddress, address);
        setClaimable(rewards);
      } catch (err) {
        console.warn("Failed to fetch rewards:", err);
      }
    };
    fetchRewards();
  }, [pairAddress, address]);

  const handleClaim = async () => {
    if (!pairAddress) return;
    try {
      setLoading(true);
      await onClaim?.();
      showSuccess("Rewards claimed!");
    } catch (err) {
      console.error("Claim failed:", err);
      showError("Failed to claim rewards.");
    } finally {
      setLoading(false);
    }
  };

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
          disabled={loading}
          className="w-full bg-green-500 text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Claiming..." : "Claim All"}
        </button>
      </div>

      {/* Pool Stats (static placeholder) */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Pool Statistics
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Value Locked:</span>
            <span className="font-semibold">$1.2M</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">24h Volume:</span>
            <span className="font-semibold">$45.6K</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">APR:</span>
            <span className="font-semibold text-green-600">12.5%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
