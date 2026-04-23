const { ethers } = require('ethers');
const { Queue } = require('bullmq');
require('dotenv').config();

// 1. Redis Connection Setup
const connection = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
};

const tokenQueue = new Queue('blockchain-events', { connection });

// 2. Provider & Contract Details
const provider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
const factoryAddress = process.env.FACTORY_CONTRACT_ADDRESS;

// ABI: Sirf wahi events jo Factory mein hain
const factoryAbi = [
    "event TokenCreated(address indexed owner, address indexed token, string tokenType)"
];

// Token ABI: Name, Symbol, Supply nikalne ke liye
const tokenAbi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function decimals() view returns (uint8)"
];

async function startListener() {
    console.log("📡 Listening for SoltDex Factory Events...");

    const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, provider);

    // 🚀 Listen for 'TokenCreated' Event
    factoryContract.on("TokenCreated", async (owner, tokenAddress, tokenType, event) => {
        console.log(`\n🆕 New Token Detected: ${tokenType}`);
        console.log(`📍 Address: ${tokenAddress}`);

        try {
            // 3. Token ki extra details nikalna (Verification ke liye zaroori hain)
            const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);

            // Saare calls ek sath karo (Optimization)
            const [name, symbol, totalSupply, decimals] = await Promise.all([
                tokenContract.name(),
                tokenContract.symbol(),
                tokenContract.totalSupply(),
                tokenContract.decimals()
            ]);

            // 4. Job Data prepare karo (Worker isi data ko use karega)
            const jobData = {
                tokenAddress: tokenAddress,
                tokenType: tokenType, // 'Standard', 'Burnable', 'FeeToken'
                owner: owner,
                name: name,
                symbol: symbol,
                // Supply ko human-readable format mein convert karo (bina decimals ke)
                totalSupply: ethers.formatUnits(totalSupply, decimals), 
                decimals: decimals,
                txHash: event.log.transactionHash,
                blockNumber: event.log.blockNumber,
                // Note: FeeToken ke liye agar extra data chahiye toh yahan add kar sakte ho
                tax: tokenType === 'FeeToken' ? 1000 : 0, 
                devWallet: process.env.DEV_WALLET || owner
            };

            // 5. Redis Queue mein job add karo
            await tokenQueue.add('verify-job', jobData, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5000 }
            });

            console.log(`✅ Job added to Queue for verification: ${symbol}`);

        } catch (err) {
            console.error(`❌ Error fetching token details for ${tokenAddress}:`, err.message);
        }
    });
}

// Start the listener
startListener().catch((err) => {
    console.error("💀 Listener Failed to start:", err);
});

module.exports = { startListener };