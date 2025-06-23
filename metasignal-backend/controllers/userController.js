const User = require("../models/User");

// Register or login user (wallet connect)
exports.registerUser = async (req, res) => {
  const { wallet } = req.body;
  if (!wallet) return res.status(400).json({ error: "Wallet address required" });

  let user = await User.findOne({ wallet: wallet.toLowerCase() });
  if (!user) user = await User.create({ wallet: wallet.toLowerCase() });

  res.status(200).json(user);
};

// Update profile
exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  const { username, profileImage, bio } = req.body;

  try {
    const updated = await User.findByIdAndUpdate(
      id,
      { username, profileImage, bio },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by wallet address
exports.getUserByWallet = async (req, res) => {
  const { wallet } = req.params;
  const user = await User.findOne({ wallet: wallet.toLowerCase() });
  if (!user) return res.status(404).json({ message: "Not found" });
  res.json(user);
};
