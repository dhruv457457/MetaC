const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  wallet: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, unique: true },
  profileImage: { type: String },
  bio: String,
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
