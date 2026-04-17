require('dotenv').config();
const express = require('express');
const supabase = require('./database/supabase');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');

const app = express();

// --- 1. SECURITY & OPTIMIZATION ---
app.use(helmet()); 
app.use(cors({ origin: process.env.CLIENT_URL || '*' })); // FIX 3: Restricted Access

// FIX 4: Payload Limit (Anti-DOS)
app.use(express.json({ limit: "10kb" })); 

// FIX 5: Smart Logging
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

// --- 2. BOT PROTECTION ---
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, try again later." }
});
app.use('/api/', limiter);

// --- 3. DATABASE (PRO CONFIG) ---
// FIX 1: Connection Pooling & Timeouts
const dbOptions = {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10, // Handle concurrent users efficiently
};





// --- 4. ROUTES ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/payment', paymentRoutes);


// ✅ YE ADD KARO: Base API Route
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: "SOLTDEX API is Live!",
        version: "v1",
        endpoints: ["/api/v1/auth", "/api/v1/payment"]
    });
});

// ✅ YE BHI ADD KARO: Taaki /api/v1 par bhi error na aaye
app.get('/api/v1', (req, res) => {
    res.json({ message: "Welcome to SoltDex API V1" });
});
// --- 5. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// --- 6. GRACEFUL SHUTDOWN (FIX 2) ---
process.on('SIGINT', async () => {
    console.log('⚠️ Shutting down gracefully...');
    
    process.exit(0);
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 SOLTDEX LIVE: http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});