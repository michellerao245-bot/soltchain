const redis = require('redis');

// 1️⃣ Cloud-Ready Config with Reconnect & Timeout Safety
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        // Retry Limit: 20 baar koshish ke baad error throw karega (Anti-Infinite Loop)
        reconnectStrategy: (retries) => {
            if (retries > 20) {
                console.error("❌ Redis: Max retry limit reached. Manual intervention needed.");
                return new Error("Redis retry limit reached");
            }
            return Math.min(retries * 50, 500);
        },
        connectTimeout: 5000 
    }
});

// 2️⃣ Event Listeners for Real-time Monitoring
redisClient.on('connect', () => console.log('⏳ Redis: Connecting...'));
redisClient.on('ready', () => console.log('✅ Redis: Ready & Syncing'));
redisClient.on('error', (err) => console.error('❌ Redis: Error ->', err.message));
redisClient.on('end', () => console.warn('⚠️ Redis: Connection Closed'));

// 3️⃣ Graceful Shutdown (SIGINT & SIGTERM)
// SIGINT (Ctrl+C) aur SIGTERM (Cloud/Docker shutdown) dono handle honge
const gracefulShutdown = async (signal) => {
    console.log(`\n⚠️ SoltDex: ${signal} received. Closing Redis connection...`);
    try {
        if (redisClient.isOpen) {
            await redisClient.quit();
            console.log('✅ Redis: Connection closed gracefully.');
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ Redis: Error during shutdown ->', err.message);
        process.exit(1);
    }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// 4️⃣ Manual Connect Wrapper
const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (err) {
        console.error('❌ Redis: Initial Connection Failed ->', err.message);
    }
};

connectRedis();

module.exports = redisClient;