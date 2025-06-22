require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const swapRoutes = require("./routes/swapRoutes");
const pairRoutes = require("./routes/pairRoutes");
const alchemyRoutes = require("./routes/alchemyRoutes"); // ✅ ADD THIS

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/swaps", swapRoutes);
app.use("/api/pairs", pairRoutes);
app.use("/api/alchemy", alchemyRoutes); // ✅ Mount the Alchemy route

app.get("/", (req, res) => {
  res.send("✅ MetaCow backend is live");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
