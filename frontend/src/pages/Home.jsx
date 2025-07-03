import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useWallet } from "../contexts/WalletContext";
import metaCowLogo from "../assets/MetaCowLogo.png";
import SearchFollow from "../components/SearchFollow";
import { motion } from "framer-motion";
export default function Home() {
  const { walletData } = useWallet();
  const address = walletData?.address;
  const isConnected = !!address;
  const [userId, setUserId] = useState(null);
const features = [
  {
    title: "Lightning Fast",
    description: "Execute trades in milliseconds with our optimized smart contracts and advanced routing algorithms.",
    icon: "⚡",
    cardBg: "bg-gradient-to-br from-purple-50 to-blue-50",
    borderColor: "border-purple-100",
    iconBg: "bg-gradient-to-r from-purple-500 to-blue-500",
    shadowColor: "purple-500",
  },
  {
    title: "Ultra Secure",
    description: "Audited smart contracts and battle-tested security measures protect your assets 24/7.",
    icon: "🔒",
    cardBg: "bg-gradient-to-br from-green-50 to-emerald-50",
    borderColor: "border-green-100",
    iconBg: "bg-gradient-to-r from-green-500 to-emerald-500",
    shadowColor: "green-500",
  },
  {
    title: "Low Fees",
    description: "Enjoy minimal trading fees and maximize your profits with our efficient fee structure.",
    icon: "💰",
    cardBg: "bg-gradient-to-br from-orange-50 to-red-50",
    borderColor: "border-orange-100",
    iconBg: "bg-gradient-to-r from-orange-500 to-red-500",
    shadowColor: "orange-500",
  },
  {
    title: "Deep Liquidity",
    description: "Access deep liquidity pools for seamless trading with minimal slippage.",
    icon: "🌊",
    cardBg: "bg-gradient-to-br from-blue-50 to-indigo-50",
    borderColor: "border-blue-100",
    iconBg: "bg-gradient-to-r from-blue-500 to-indigo-500",
    shadowColor: "blue-500",
  },
  {
    title: "Mobile First",
    description: "Trade anywhere, anytime with our responsive design optimized for all devices.",
    icon: "📱",
    cardBg: "bg-gradient-to-br from-pink-50 to-rose-50",
    borderColor: "border-pink-100",
    iconBg: "bg-gradient-to-r from-pink-500 to-rose-500",
    shadowColor: "pink-500",
  },
  {
    title: "Smart Routing",
    description: "Get the best prices with our intelligent routing system that finds optimal trading paths.",
    icon: "🎯",
    cardBg: "bg-gradient-to-br from-teal-50 to-cyan-50",
    borderColor: "border-teal-100",
    iconBg: "bg-gradient-to-r from-teal-500 to-cyan-500",
    shadowColor: "teal-500",
  },
];

  useEffect(() => {
    const fetchUser = async () => {
      if (!address) return;
      try {
        const res = await axios.get(`https://metac-1.onrender.com/api/users/wallet/${address}`);
        setUserId(res.data._id);
      } catch (err) {
        console.error("Failed to fetch user ID", err);
      }
    };

    fetchUser();
  }, [address]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-blue-100 to-white text-gray-900">
  {/* Decorative blur circles */}
  <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl z-0"></div>
  <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl z-0"></div>

 <div className="relative z-10 max-w-7xl mx-auto px-2 pt-20 pb-28 md:pt-14 md:pb-24">
    <div className="text-center">

      {/* Logo */}
      <div className="flex justify-center ">
        <div className="relative">
          <img
            src={metaCowLogo}
            alt="MetaCow"
            className="w-32 h-32 md:w-40 md:h-40 drop-shadow-xl animate-bounce"
          />
          <div className="absolute -inset-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-30 blur-2xl"></div>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent ">
        MetaCow DEX
      </h1>

      {/* Subheading */}
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed ">
        Lightning-fast. Ultra-secure. Built for the next-gen DeFi explorer.
      </p>

        <div className="mb-6">
          <SearchFollow currentUserId={userId} />
        </div>
      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          to="/swap"
          className="group bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-purple-400/30 transition-all duration-300 transform hover:scale-105"
        >
          <span className="flex items-center gap-2">
            🚀 Start Trading
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </Link>

        <Link
          to="/liquidity"
          className="bg-white/50 backdrop-blur-sm border border-purple-200 text-purple-800 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white transition-all duration-300"
        >
          💧 Add Liquidity
        </Link>
      </div>

 
      {/* Social Discovery */}
  
    
    </div>
  </div>
</section>

      {/* Search and Follow Section */}

     
<section className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-white">
  <div className="max-w-7xl mx-auto px-4">
    {/* Heading */}
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-4">
        Why Choose MetaCow?
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Experience the future of decentralized trading with our cutting-edge features
      </p>
    </motion.div>

    {/* Features Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          className={`group ${feature.cardBg} p-8 rounded-3xl border ${feature.borderColor} hover:shadow-2xl hover:shadow-${feature.shadowColor}/20 transition-all duration-300 hover:-translate-y-2`}
        >
          <div className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            <span className="text-2xl">{feature.icon}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

    {/* CTA Section */}
<section className="py-24 bg-gradient-to-br from-purple-100 via-blue-100 to-white text-gray-900">
  <div className="max-w-4xl mx-auto text-center px-4">
    <h2 className="text-4xl md:text-5xl font-bold mb-6">
      Ready to Start Trading?
    </h2>
    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
      Join thousands of traders who trust MetaCow for their DeFi needs.
      {isConnected
        ? " You're all set to begin!"
        : " Connect your wallet to get started."}
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        to="/swap"
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-purple-400/30 transition-all duration-300 transform hover:scale-105"
      >
        🔄 Start Swapping
      </Link>
      <Link
        to="/create-pair"
        className="bg-white/50 backdrop-blur-md border border-purple-200 text-purple-800 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white transition-all duration-300"
      >
        ➕ Create New Pair
      </Link>
    </div>
  </div>
</section>


    {/* Footer */}
<footer className="bg-gradient-to-t from-white via-blue-50 to-purple-50 text-gray-700 py-12 border-t border-purple-100 shadow-inner">
  <div className="max-w-7xl mx-auto px-4 text-center">
    <div className="flex items-center justify-center gap-3 mb-4">
      <img src={metaCowLogo} alt="MetaCow" className="w-8 h-8" />
      <span className="text-xl font-bold text-purple-700">MetaCow DEX</span>
    </div>
    <p className="text-gray-500 mb-3">
      Built with ❤️ for the DeFi community
    </p>
    <div className="flex justify-center gap-6 text-sm text-purple-500">
      <span>🌐 Ethereum Network</span>
      <span>⚡ Powered by MetaMask SDK</span>
      <span>🔒 Audited & Secure</span>
    </div>
  </div>
</footer>

    </div>
  );
}
