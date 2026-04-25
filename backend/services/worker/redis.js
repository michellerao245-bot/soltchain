require("dotenv").config();
const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,

  maxRetriesPerRequest: null,
  lazyConnect: true,

  retryStrategy: (times) => Math.min(times * 50, 2000),

  reconnectOnError: (err) => {
    if (err.message.includes("READONLY")) return true;
    return false;
  },
});

redis.on("connect", () => console.log("🚀 Redis Connected"));
redis.on("error", (err) => console.error("❌ Redis Error:", err.message));

// connect manually (lazyConnect ke liye)
redis.connect().catch(() => {});

module.exports = redis;