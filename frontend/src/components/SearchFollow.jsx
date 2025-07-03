import { useState, useEffect } from "react";
import axios from "axios";

export default function SearchFollow({ currentUserId }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (!currentUserId) return;
    axios
      .get(`https://metac-1.onrender.com/api/following/${currentUserId}`)
      .then((res) => setFollowing(res.data.map((u) => u._id)))
      .catch((err) => console.error("Failed to fetch following list", err));
  }, [currentUserId]);

  const search = async () => {
    if (!query.trim()) return;
    const res = await axios.get(`https://metac-1.onrender.com/api/users/search?query=${query}`);
    setResults(res.data || []);
  };

  const followUser = async (targetUserId) => {
    try {
      await axios.post(`https://metac-1.onrender.com/api/follow/${targetUserId}`, {
        followerId: currentUserId,
      });
      setFollowing((prev) => [...prev, targetUserId]);
    } catch (err) {
      console.error("Follow failed", err?.response?.data || err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 p-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100">
      <h3 className="text-xl font-bold text-purple-700 flex items-center justify-center gap-2 mb-4">
      Discover & Follow Traders
      </h3>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none bg-white shadow-sm"
            placeholder="Search by username"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
            <svg width="20" height="20" fill="none" stroke="currentColor">
              <circle cx="9" cy="9" r="7" strokeWidth="2" />
              <path d="M15 15l4 4" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <button
          onClick={search}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 rounded-xl font-semibold shadow hover:from-purple-600 hover:to-blue-600 transition"
        >
          Search
        </button>
      </div>

      {results.length > 0 && (
        <ul className="mt-6 space-y-3">
          {results.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between bg-white/80 rounded-xl px-4 py-3 shadow-sm border border-purple-50"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.profileImage || "/default-avatar.png"}
                  alt="pfp"
                  className="w-10 h-10 rounded-full border border-purple-200"
                />
                <div>
                  <div className="font-medium text-gray-800">{user.username}</div>
                </div>
              </div>
              {following.includes(user._id) ? (
                <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-lg">Following</span>
              ) : (
                <button
                  onClick={() => followUser(user._id)}
                  className="text-xs font-semibold bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1.5 rounded-lg shadow hover:from-purple-600 hover:to-blue-600 transition"
                >
                  Follow
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {results.length === 0 && (
        <p className="text-center text-sm text-gray-400 mt-4">No users found yet.</p>
      )}
    </div>
  );
}
