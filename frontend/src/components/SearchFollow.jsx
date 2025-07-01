import { useState, useEffect } from "react";
import axios from "axios";

export default function SearchFollow({ currentUserId }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    // Fetch current user's following list
    const fetchFollowing = async () => {
      if (!currentUserId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/following/${currentUserId}`);
        const followedIds = res.data.map((u) => u._id);
        setFollowing(followedIds);
      } catch (err) {
        console.error("Failed to fetch following list", err);
      }
    };
    fetchFollowing();
  }, [currentUserId]);

  const search = async () => {
    if (!query.trim()) return;
    const res = await axios.get(`http://localhost:5000/api/users/search?query=${query}`);
    setResults(res.data || []);
  };

  const followUser = async (targetUserId) => {
    try {
      await axios.post(`http://localhost:5000/api/follow/${targetUserId}`, {
        followerId: currentUserId,
      });
      setFollowing((prev) => [...prev, targetUserId]);
    } catch (err) {
      console.error("Follow failed", err?.response?.data || err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-3xl shadow-md border border-gray-200">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">🔍 Search & Follow Users</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg p-2"
          placeholder="Search usernames (e.g. dhruv)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={search}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Search
        </button>
      </div>

      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between border-b pb-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.profileImage || "/default-avatar.png"}
                  alt="pfp"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-800">{user.username}</div>
                  <div className="text-sm text-gray-500">{user.bio || "No bio"}</div>
                </div>
              </div>

              {following.includes(user._id) ? (
                <span className="text-sm text-green-600">Following ✅</span>
              ) : (
                <button
                  onClick={() => followUser(user._id)}
                  className="text-sm bg-purple-500 text-white px-3 py-1 rounded-lg hover:bg-purple-600"
                >
                  Follow
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">No users found yet.</div>
      )}
    </div>
  );
}
