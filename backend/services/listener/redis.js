const Redis = require('ioredis');

const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    
    // 1️⃣ BullMQ Requirement
    maxRetriesPerRequest: null, 

    // 2️⃣ Performance: Connection tabhi banega jab pehla command jayega
    lazyConnect: true, 

    // 3️⃣ Production Stability: Reconnect logic
    retryStrategy: (times) => {
        // Har retry par delay badhayega (Max 2 seconds tak)
        const delay = Math.min(times * 50, 2000);
        return delay;
    },

    // Cloud/Production pe timeout issues se bachne ke liye
    reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            return true; // Force reconnect agar cluster mode mein slave pe hit ho jaye
        }
        return false;
    }
};

const redisClient = new Redis(redisConfig);

// Event Listeners
redisClient.on('connect', () => console.log('🚀 Listener-Redis: Connected!'));
redisClient.on('error', (err) => console.error('❌ Listener-Redis Error:', err.message));

// Connection initiate karne ke liye (since we used lazyConnect)
redisClient.connect().catch(() => {
    /* Errors handled by 'error' event */
});

module.exports = redisClient;