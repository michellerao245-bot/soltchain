require("dotenv").config();

// 🔥 Global BigInt Fix (only once)
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const express = require("express");
const cors = require("cors");

const app = express();

// 🔥 Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.text({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// 🔗 Routes Import
const signalRoutes = require("./routes/signalRoutes");
const createTokenRoute = require("./api/createToken");
const verifyRoutes = require("./api/verifyRoute");

// 🔥 Routes
app.use("/api", signalRoutes);
app.use("/api", createTokenRoute);
app.use("/api", verifyRoutes);

// 🚀 Health check
app.get("/", (req, res) => {
  res.send("🚀 SoltDex Backend Running");
});

// 🔥 ENV DEBUG
console.log("WSS:", process.env.WSS_RPC ? "Loaded ✅" : "Missing ❌");
console.log("ETHERSCAN API:", process.env.ETHERSCAN_API_KEY ? "Loaded ✅" : "Missing ❌");

// 🔥 Listener (safe start)
try {
  const { startListener } = require("./modules/listeners/tokenListener");
  startListener();
  console.log("📡 Listener started");
} catch (err) {
  console.error("❌ Listener failed:", err.message);
}

// 🚀 Start server (ONLY ONE)
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});

module.exports = app;