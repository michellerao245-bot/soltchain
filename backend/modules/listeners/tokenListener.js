const { ethers } = require('ethers');
const { Queue } = require('bullmq');
require('dotenv').config();

// 🔥 GLOBAL BigInt FIX (extra safety)
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// 🔥 Redis Connection
const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined
};

const tokenQueue = new Queue('blockchain-events', { connection });

// 🔥 Provider
const provider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
const factoryAddress = process.env.FACTORY_CONTRACT_ADDRESS;

// 🔥 ABIs
const factoryAbi = [
  "event TokenCreated(address indexed owner, address indexed token, string tokenType)"
];

const tokenAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// 🔥 Safe JSON converter
function safe(obj) {
  return JSON.parse(
    JSON.stringify(obj, (_, v) =>
      typeof v === "bigint" ? v.toString() : v
    )
  );
}

async function startListener() {
  console.log("📡 Listening for SoltDex Factory Events...");

  const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, provider);

  factoryContract.on("TokenCreated", async (...args) => {
    const [owner, tokenAddress, tokenType, event] = args;

    console.log("\n🆕 New Token Detected:", String(tokenType));
    console.log("📍 Address:", String(tokenAddress));

    try {
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);

      // 🔥 Parallel calls
      const [name, symbol, totalSupply, decimals] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.totalSupply(),
        tokenContract.decimals()
      ]);

      // 🔥 SAFE event values
      const blockNumber = event?.log?.blockNumber
        ? Number(event.log.blockNumber)
        : 0;

      const txHash = event?.log?.transactionHash || "";

      // 🚀 Prepare job data
      const jobData = {
        tokenAddress: String(tokenAddress),
        tokenType: String(tokenType),
        owner: String(owner),

        name: String(name),
        symbol: String(symbol),

        totalSupply: ethers.formatUnits(totalSupply, decimals), // string

        decimals: Number(decimals),

        txHash: txHash,
        blockNumber: blockNumber,

        tax: tokenType === 'FeeToken' ? 1000 : 0,
        devWallet: process.env.DEV_WALLET || String(owner)
      };

      // 🔥 FINAL SAFE OBJECT
      const safeData = safe(jobData);

      // 🧪 Debug (optional)
      console.log("📦 Prepared Data:", safeData);

      // 🚀 Add to queue
      await tokenQueue.add('verify-job', safeData, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 }
      });

      console.log(`✅ Job added to Queue for verification: ${symbol}`);

    } catch (err) {
      console.error(`❌ Error fetching token details for ${tokenAddress}:`, err.message);
    }
  });
}


  

module.exports = { startListener };