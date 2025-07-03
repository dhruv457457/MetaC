import { useEffect, useState } from "react";
import axios from "axios";
import { getTokenSymbol } from "../../utils/transactionLog";
import { useNavigate } from "react-router-dom";
import { UsersIcon } from "lucide-react";

const ITEMS_PER_PAGE = 5;

export default function SocialFeed({ wallet }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get(`https://metac-1.onrender.com/api/feed/${wallet}`);
        setFeed(res.data?.events || []);
      } catch (err) {
        console.error("❌ Failed to fetch feed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (wallet) fetchFeed();
  }, [wallet]);

  const handleCopyTrade = (event) => {
    navigate("/swap", {
      state: {
        tokenA: event.tokenIn,
        tokenB: event.tokenOut,
        amountIn: event.amountIn,
      },
    });
  };

  const totalPages = Math.ceil(feed.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = feed.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
    <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100 mt-6">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
        <UsersIcon size={18} /> Social Feed
      </h3>

      <ul className="space-y-3">
        {currentItems.map((event, i) => (
          <li key={i} className="bg-gray-100 px-4 py-3 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                  {event.profileImage ? (
                    <img
                      src={event.profileImage}
                      alt="avatar"
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gray-300" />
                  )}
                  {event.username || event.actor.slice(0, 6) + "..." + event.actor.slice(-4)}
                  <span className="text-gray-400 ml-1 text-xs">
                    #{startIdx + i + 1}
                  </span>
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {getTokenSymbol(event.tokenIn)} → {getTokenSymbol(event.tokenOut)} |{" "}
                  {event.amountIn} → {event.amountOut}
                </p>

                <p className="text-xs text-gray-500 font-mono mt-1">
                  Tx: {event.txHash.slice(0, 10)}... |{" "}
                  {new Date(event.timestamp * 1000).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleCopyTrade(event)}
                className="text-purple-600 text-xs underline hover:text-purple-800"
              >
                🔁 Copy Trade
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50"
        >
          ◀ Prev
        </button>

        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => handlePageChange(idx + 1)}
            className={`px-3 py-1 text-sm border rounded ${
              currentPage === idx + 1 ? "bg-purple-100 text-purple-800 font-bold" : ""
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
