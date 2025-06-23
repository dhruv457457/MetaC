import { Pencil } from "lucide-react";

export default function ProfileHeader({ user, onEdit }) {
  const truncate = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="flex items-center gap-6 bg-white rounded-3xl shadow-md p-6 border border-gray-100">
      <img
        src={user.profileImage || "/assets/default-avatar.png"}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover border border-gray-300"
      />
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-800">
          {user.username || truncate(user.wallet)}
        </h2>
        <p className="text-sm text-gray-500 font-mono">{truncate(user.wallet)}</p>
        {user.bio && <p className="mt-2 text-gray-600">{user.bio}</p>}
      </div>
      <button
        onClick={onEdit}
        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-200"
      >
        <Pencil size={16} />
        Edit
      </button>
    </div>
  );
}
