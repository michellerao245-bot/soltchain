const express = require('express');
const router = express.Router();
const supabase = require('../database/supabase');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const redisClient = require('../utils/redis'); 

// 1️⃣ CRITICAL: Environment Guard (Server start hone se pehle hi check)
if (!process.env.JWT_SECRET) {
    console.error("❌ FATAL ERROR: JWT_SECRET is not defined in .env!");
    process.exit(1); 
}

// 2️⃣ Rate Limiter (IP + Wallet Throttling)
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 15,
    keyGenerator: (req) => req.ip + (req.params.wallet || req.body.walletAddress || ""),
    message: { error: "Security Alert: Too many requests. Try again later." }
});

// 🚀 PHASE 1: Generate Nonce (Secure & Scalable)
router.get('/nonce/:wallet', authLimiter, async (req, res) => {
    const { wallet } = req.params;
    
    if (!wallet || !ethers.isAddress(wallet)) {
        return res.status(400).json({ error: "Invalid Wallet Address" });
    }
    
    const walletLower = wallet.toLowerCase();
    const nonce = crypto.randomBytes(16).toString('hex');
    
    // Future PRO: Chain ID (56 for BSC) check can be added in the message
    const message = `Welcome to SoltDex!\n\nNonce: ${nonce}\n\nSecurity Code: 0x${walletLower.slice(2, 8)}`;
    
    try {
        await redisClient.setEx(`nonce:${walletLower}`, 300, JSON.stringify({ nonce, message }));
        res.json({ message });
    } catch (err) {
        console.error("❌ Redis Error:", err.message);
        res.status(500).json({ error: "Session storage failed" });
    }
});

// 🚀 PHASE 2: Verify & Login (The Final Boss)
router.post('/login', authLimiter, async (req, res) => {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature || !ethers.isAddress(walletAddress)) {
        return res.status(400).json({ error: "Invalid login credentials" });
    }

    const walletLower = walletAddress.toLowerCase();

    try {
        // 3️⃣ Redis Fetch & Safe Parsing
        const rawData = await redisClient.get(`nonce:${walletLower}`);
        if (!rawData) return res.status(400).json({ error: "Session expired or not found" });

        let storedData;
        try {
            storedData = JSON.parse(rawData);
        } catch (parseErr) {
            console.error("❌ Corrupted Session Data:", parseErr);
            return res.status(500).json({ error: "Internal session error" });
        }

        // 4️⃣ Security Verification
        const recoveredAddress = ethers.verifyMessage(storedData.message, signature);
        if (recoveredAddress.toLowerCase() !== walletLower) {
            return res.status(401).json({ error: "Signature mismatch! Auth denied." });
        }

        // 5️⃣ Consumable Nonce (One-time use)
        await redisClient.del(`nonce:${walletLower}`);

        // 6️⃣ Database Sync (Supabase)
        let { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('wallet_address', walletLower)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (!user) {
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([{ 
                    wallet_address: walletLower,
                    username: `Solt_${walletLower.slice(2, 8)}`,
                    role: 'user'
                }])
                .select().single();
            if (createError) throw createError;
            user = newUser;
        }

        // 7️⃣ JWT Generation (Enterprise Grade)
        const token = jwt.sign(
            { id: user.id, wallet: user.wallet_address, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d', algorithm: 'HS256' }
        );

        res.json({
            success: true,
            token,
            user: {
                wallet: user.wallet_address,
                username: user.username,
                role: user.role,
                balance: user.balance
            }
        });

    } catch (err) {
        console.error("❌ Critical Auth Failure:", err.message);
        res.status(500).json({ error: "Authentication system failure" });
    }
});

module.exports = router;