import { useEffect, useState } from "react";
import axios from "axios";
import { getTokenSymbol } from "../../utils/transactionLog"; // or tokenUtils.js

export default function RecentActivity({ wallet }) {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSwaps = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/swaps/recent?user=${wallet}`);
        setSwaps(res.data || []);
      } catch (err) {
        console.error("Failed to fetch swaps:", err);
      } finally {
        setLoading(false);
      }
    };

    if (wallet) fetchSwaps();
  }, [wallet]);

  if (loading) return <div className="text-center text-gray-500">⏳ Loading swaps...</div>;

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📜 Recent Swaps</h3>

      {swaps.length === 0 ? (
        <div className="text-center text-gray-500 py-6">No swap history found.</div>
      ) : (
        <div className="space-y-4">
          {swaps.map((swap) => (
            <div key={swap.txHash} className="p-3 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-800">
                💱 Swapped <strong>{swap.inputAmount}</strong> {getTokenSymbol(swap.inputToken)} for{" "}
                <strong>{swap.outputAmount}</strong> {getTokenSymbol(swap.outputToken)}
              </div>
              <div className="text-xs text-gray-500 font-mono">
                Tx: {swap.txHash.slice(0, 10)}... | {new Date(swap.timestamp * 1000).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
