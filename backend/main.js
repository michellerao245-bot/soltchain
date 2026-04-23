const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const createTokenRoute = require("./api/createToken");
app.use("/api", createTokenRoute);

// ✅ ENV DEBUG (remove later)
console.log("WSS:", process.env.WSS_RPC ? "Loaded ✅" : "Missing ❌");
console.log("BSC API:", process.env.BSCSCAN_API_KEY ? "Loaded ✅" : "Missing ❌");
console.log("ENV CHECK:", process.env.WSS_RPC);

// 🔥 Listener import
const { startListener } = require("./modules/listeners/tokenListener");

// 🚀 Start Listener safely
try {
  startListener();
} catch (err) {
  console.error("❌ Listener failed:", err.message);
}

// 🔥 Middlewares
app.use(cors());

// ⚠️ IMPORTANT: dono use karo (JSON + TEXT)
app.use(express.json({ limit: "10mb" }));
app.use(express.text({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

/**
 * 🚀 Health Check
 */
app.get("/", (req, res) => {
  res.send("🚀 SoltDex Backend is running successfully");
});

/**
 * 🔗 API ROUTES
 */
const verifyRoutes = require("./api/verifyRoute");
app.use("/api", verifyRoutes);

/**
 * 🚀 SERVER START
 */
const PORT = process.env.PORT || 5010;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/verify`);
});