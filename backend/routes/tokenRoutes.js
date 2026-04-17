const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const tokenController = require('../controllers/tokenController');
const protect = require('../middleware/authMiddleware');

// --- 1. SPAM PROTECTION (Anti-Bot Shield) ---
// Ek user 1 minute mein maximum 5 tokens hi create kar payega
const createTokenLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 Minute
    max: 5, 
    message: { error: "Too many token creation requests. Please wait a minute." }
});

// --- 2. THE ROUTES ---

/**
 * @desc    Deploy a new BEP-20 Token
 * @route   POST /api/v1/tokens/create
 * @access  Private (Logged-in Users Only)
 */
router.post(
    '/create', 
    protect, 
    createTokenLimiter, 
    tokenController.createToken
);

// Future Upgrade: Minting logic (Same controller or separate)
// router.post('/mint', protect, tokenController.mintTokens);

module.exports = router;