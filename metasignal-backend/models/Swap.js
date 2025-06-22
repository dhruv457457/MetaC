const mongoose = require("mongoose");

const SwapSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    lowercase: true,
  },
  pairAddress: {
    type: String,
    required: true,
    lowercase: true,
  },
  inputToken: {
    type: String,
    required: true,
  },
  outputToken: {
    type: String,
    required: true,
  },
  inputAmount: {
    type: String,
    required: true,
  },
  outputAmount: {
    type: String,
    required: true,
  },
  txHash: {
    type: String,
    required: true,
    unique: true,
  },
  blockNumber: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Swap", SwapSchema);
