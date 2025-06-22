const express = require("express");
const router = express.Router();
const swapController = require("../controllers/swapController");

// @route   POST /api/swaps
// @desc    Save a new swap transaction
router.post("/", swapController.createSwap);

// @route   GET /api/swaps/recent?user=0x123&limit=10
// @desc    Get recent swap transactions (optionally filtered by user)
router.get("/recent", swapController.getRecentSwaps);

module.exports = router;
