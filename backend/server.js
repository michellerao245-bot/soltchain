require("dotenv").config();

// 🔥 ADD THIS (TOP PE HI)
BigInt.prototype.toJSON = function () {
  return this.toString();
};

require("dotenv").config();

// 🔥 GLOBAL BIGINT FIX
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const express = require("express");
const cors = require("cors");

const app = express();

// 🔥 Middlewares (PEHLE lagao)
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.text({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// 🔗 Routes
const createTokenRoute = require("./api/createToken");
const verifyRoutes = require("./api/verifyRoute");

app.use("/api", createTokenRoute);
app.use("/api", verifyRoutes);

// 🔥 ENV DEBUG
console.log("WSS:", process.env.WSS_RPC ? "Loaded ✅" : "Missing ❌");
console.log("ETHERSCAN API:", process.env.ETHERSCAN_API_KEY ? "Loaded ✅" : "Missing ❌");
console.log("ENV CHECK:", process.env.WSS_RPC);

// 🔥 Listener
const { startListener } = require("./modules/listeners/tokenListener");

try {
  startListener();
} catch (err) {
  console.error("❌ Listener failed:", err.message);
}

// 🚀 Health check
app.get("/", (req, res) => {
  res.send("🚀 SoltDex Backend Running");
});

// 🚀 Start server
const PORT = process.env.PORT || 5010;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/verify`);
});