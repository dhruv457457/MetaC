import { useEffect, useState } from "react";
import axios from "axios";
import { useWallet } from "../contexts/WalletContext";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileEdit from "../components/profile/ProfileEdit";
import RecentActivity from "../components/profile/RecentActivity";
import RegisterProfile from "../components/profile/RegisterProfile";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
const { walletData } = useWallet();
const address = walletData?.address;
const isConnected = !!address;

 useEffect(() => {
    if (!address) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/wallet/${address}`);
        setUser(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setUser(null); // ✅ Not registered
        } else {
          console.error("❌ Fetch user failed:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [address]);
  console.log("🧠 Render state - user:", user, "loading:", loading);

  if (!isConnected) {
    return (
      <div className="text-center py-20 text-gray-500">
        🔌 Connect your wallet to view your profile.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-12 text-gray-500">
        ⏳ Loading profile...
      </div>
    );
  }

  if (!user) {
    return <RegisterProfile wallet={address} onRegister={setUser} />;
  }

  if (!user.username) {
    return (
      <div className="text-center py-20">
        ⚠️ User loaded but missing username
        <pre className="mt-4 p-4 text-left bg-gray-100 rounded-xl text-sm max-w-xl mx-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Profile Header with Avatar, Name, Edit button */}
      <ProfileHeader user={user} onEdit={() => setEditing(true)} />

      {/* Profile Edit Section */}
      {editing && (
        <ProfileEdit
          user={user}
          onClose={() => setEditing(false)}
          onSave={(updatedUser) => {
            setUser(updatedUser);
            setEditing(false);
          }}
        />
      )}

      {/* Recent Transactions / Activity */}
      <RecentActivity wallet={address} />
    </div>
  );
}
