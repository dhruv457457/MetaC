import { useEffect, useState } from "react";
import axios from "axios";
import { getTokenSymbol } from "../../utils/transactionLog";

export default function SocialFeed({ wallet }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/feed/${wallet}`);
        setFeed(res.data?.events || []);
      } catch (err) {
        console.error("❌ Failed to fetch feed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (wallet) fetchFeed();
  }, [wallet]);

  if (loading) {
    return <div className="text-center text-gray-500">📡 Loading feed...</div>;
  }

  if (!feed.length) {
    return (
      <div className="text-center text-gray-500 py-6">
        No social activity from wallets you follow yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">👥 Social Feed</h3>

      <div className="space-y-4">
        {feed.map((event, i) => (
          <div key={i} className="p-3 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-800">
              🧑‍💼 <span className="font-medium">
                {event.actor.slice(0, 6)}...{event.actor.slice(-4)}
              </span>{" "}
              {event.type === "copyTrade"
                ? "made a swap you can copy!"
                : "performed a swap"}
            </div>
            <div className="text-sm text-gray-700">
              {getTokenSymbol(event.tokenIn)} → {getTokenSymbol(event.tokenOut)} |{" "}
              {event.amountIn} → {event.amountOut}
            </div>
            <div className="text-xs text-gray-500 font-mono">
              Tx: {event.txHash.slice(0, 10)}... |{" "}
              {new Date(event.timestamp * 1000).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
