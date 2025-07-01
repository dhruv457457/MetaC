const User = require("../models/User");
const Follow = require("../models/Follow");
const Swap = require("../models/Swap");

exports.getSocialFeed = async (req, res) => {
  try {
    const wallet = req.params.wallet?.toLowerCase();
    const user = await User.findOne({ wallet });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Get followed user IDs
    const follows = await Follow.find({ follower: user._id }).select("following");
    const followedUserIds = follows.map(f => f.following);

    // Get followed users' wallets
    const followedUsers = await User.find({ _id: { $in: followedUserIds } });
    const followedWallets = followedUsers.map(u => u.wallet.toLowerCase());

    // Fetch their swaps
    const events = await Swap.find({ user: { $in: followedWallets } })
      .sort({ timestamp: -1 })
      .limit(30);

    // Optionally enrich with profile data
    const enriched = events.map(e => ({
      actor: e.user,
      type: e.type || "swap",
      tokenIn: e.inputToken,
      tokenOut: e.outputToken,
      amountIn: e.inputAmount,
      amountOut: e.outputAmount,
      txHash: e.txHash,
      timestamp: e.timestamp,
    }));

    res.json({ events: enriched });
  } catch (err) {
    console.error("❌ Social feed error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
