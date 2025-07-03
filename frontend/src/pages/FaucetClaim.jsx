import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "../contexts/WalletContext";
import { toast } from "react-hot-toast";

// ✅ Updated token list — removed USDT
const tokenList = [
  { symbol: "TKA", address: "0x1e792D4c34c3d04Bd127aFEf0c1696E912c755aa" },
  { symbol: "TKB", address: "0x9e53abdDBFa9DC6A9bCD9D0e5DD7144F2701718D" },
  { symbol: "MOO", address: "0xA18938653750B70DCBbC0DF5a03D9F2e5958D8E8" },
];

const FAUCET_ADDRESS = "0xdC9Ac4cB6a8C8a09e5579881f2f7B463917Cc26a";

const FAUCET_ABI = [
  "function claim(address token) external",
  "function timeUntilNextClaim(address user, address token) external view returns (uint256)",
];

export default function FaucetClaim() {
  const { walletData } = useWallet();
  const address = walletData?.address;
  const [selectedToken, setSelectedToken] = useState(tokenList[0]);
  const [cooldown, setCooldown] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCooldown = async () => {
    try {
      if (!window.ethereum || !address) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, provider);
      const remaining = await contract.timeUntilNextClaim(address, selectedToken.address);
      setCooldown(Number(remaining));
    } catch (err) {
      console.error("Cooldown fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchCooldown();
  }, [address, selectedToken]);

  const handleClaim = async () => {
    try {
      if (!window.ethereum || !address) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, signer);

      setLoading(true);
      toast.loading("Claiming tokens...");

      const tx = await contract.claim(selectedToken.address);
      await tx.wait();

      toast.dismiss();
      toast.success(`🎉 Claimed 10 ${selectedToken.symbol}`);
      fetchCooldown();
    } catch (err) {
      toast.dismiss();
      toast.error("❌ Claim failed or already claimed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-purple-100">
          {/* ✅ Header with Circle logo */}
      
    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-4">
           
            MetaCow Faucet
          </h2>
          {/* Token selector & cooldown info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Select Token</label>
              <select
                className="w-full p-3 rounded-xl border border-gray-300"
                value={selectedToken.symbol}
                onChange={(e) =>
                  setSelectedToken(tokenList.find((t) => t.symbol === e.target.value))
                }
              >
                {tokenList.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              {cooldown === null ? (
                <p className="text-gray-500">Checking cooldown...</p>
              ) : cooldown === 0 ? (
                <p className="text-green-600 font-medium">
                  ✅ Ready to claim 10 {selectedToken.symbol}!
                </p>
              ) : (
                <p className="text-yellow-600 font-medium">
                  ⏳ Available in {formatTime(cooldown)}
                </p>
              )}
            </div>
          </div>

          {/* Claim button */}
          <button
            onClick={handleClaim}
            disabled={cooldown > 0 || loading}
            className={`mt-6 w-full py-4 rounded-xl font-semibold text-white text-lg transition-all ${
              cooldown > 0 || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            }`}
          >
            {loading ? "Claiming..." : `Claim 10 ${selectedToken.symbol}`}
          </button>

          {/* ✅ Circle faucet external link */}
         <div className="mt-10 border-t pt-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-4">
            <img
              src="https://developers.circle.com/logo.svg"
              alt="Circle Docs"
              className="h-8"
            />
          
          </h2>
  <h3 className="text-lg font-semibold text-gray-800 mb-2">🔗 Circle USDC Faucet</h3>
  <p className="text-gray-600 text-sm mb-2">
    You can also claim test USDC directly from Circle's official faucet. Useful for testing swaps, liquidity, and MetaMask Card simulations.
  </p>
  <a
    href="https://faucet.circle.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
  >
    🌐 Visit Circle Faucet
  </a>
</div>

        </div>
      </div>
    </div>
  );
}
