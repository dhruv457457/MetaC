const Swap = require("../models/Swap");

// POST /api/swaps
exports.createSwap = async (req, res) => {
  try {
    const {
      user,
      pairAddress,
      inputToken,
      outputToken,
      inputAmount,
      outputAmount,
      txHash,
      blockNumber,
      timestamp,
    } = req.body;

    // Check if already exists to avoid duplicates
    const exists = await Swap.findOne({ txHash });
    if (exists) return res.status(200).json({ message: "Already saved." });

 const swap = new Swap({
  user,
  pairAddress,
  inputToken,
  outputToken,
  inputAmount,
  outputAmount,
  txHash,
  blockNumber,
  timestamp,
  type: "swap", // ✅ Add this field
});

    await swap.save();
    res.status(201).json({ message: "Swap saved", swap });
  } catch (err) {
    console.error("Error saving swap:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/swaps/recent?user=0x123...&limit=10
exports.getRecentSwaps = async (req, res) => {
  try {
    const { user, limit = 10 } = req.query;
    const query = user ? { user: user.toLowerCase() } : {};

    const swaps = await Swap.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json(swaps);
  } catch (err) {
    console.error("Error fetching swaps:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
