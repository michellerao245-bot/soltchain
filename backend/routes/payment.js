const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

const BSC_RPC = process.env.BSC_RPC || "https://bsc-dataseed.binance.org/";
const ADMIN_WALLET = (process.env.ADMIN_WALLET || "").toLowerCase();
const PRO_PRICE_BNB = "0.1";

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/verify', protect, asyncHandler(async (req, res) => {
    const { txHash, wallet } = req.body;

    if (!ADMIN_WALLET) {
        return res.status(500).json({ success: false, error: "Server Error: Admin Wallet not configured." });
    }

    const provider = new ethers.JsonRpcProvider(BSC_RPC);

    try {
        // --- 1. WAIT FOR 3 CONFIRMATIONS (PRO SECURITY) ---
        // 3 confirmations ensure the block is very unlikely to be 're-orged'
        const receipt = await provider.waitForTransaction(txHash, 3);
        
        if (!receipt || receipt.status !== 1) {
            return res.status(400).json({ success: false, error: "Transaction failed on blockchain." });
        }

        const tx = await provider.getTransaction(txHash);
        
        // --- 2. NULL SAFETY FIX (CRITICAL) ---
        if (!tx || !tx.to) {
            return res.status(404).json({ success: false, error: "Invalid transaction or Contract creation detected." });
        }

        // --- 3. SECURE VERIFICATION ---
        if (tx.to.toLowerCase() !== ADMIN_WALLET) {
            return res.status(401).json({ success: false, error: "Payment was sent to a different address." });
        }

        if (tx.from.toLowerCase() !== wallet.toLowerCase()) {
            return res.status(401).json({ success: false, error: "Sender wallet mismatch." });
        }

        const requiredWei = ethers.parseEther(PRO_PRICE_BNB);
        if (BigInt(tx.value) < requiredWei) {
            return res.status(400).json({ success: false, error: "Insufficient BNB sent." });
        }

        // --- 4. ATOMIC UPDATE & REPLAY PROTECTION ---
        const updatedUser = await User.findOneAndUpdate(
            { 
                wallet: wallet.toLowerCase(),
                "paymentHistory.txHash": { $ne: txHash } 
            },
            { 
                isPro: true,
                $push: { 
                    paymentHistory: { 
                        txHash, 
                        amount: ethers.formatEther(tx.value), 
                        date: new Date() 
                    } 
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ success: false, error: "Transaction already processed or User not found." });
        }

        res.json({
            success: true,
            message: "🚀 PRO Status Activated! Welcome to the Elite club.",
            isPro: true
        });

    } catch (err) {
        console.error("Payment Log:", err.message);
        res.status(500).json({ success: false, error: "Verification error. Please check your transaction hash." });
    }
}));

module.exports = router;