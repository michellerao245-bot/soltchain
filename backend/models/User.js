const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // 1. Identity & Validation
    wallet: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true,
        match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address']
    },

    // 2. SaaS Plan Management (NEW: Future Proof)
    plan: { 
        type: String, 
        enum: ['FREE', 'PRO', 'ELITE'], // Scale karne ke liye ready
        default: 'FREE' 
    },
    isPro: { 
        type: Boolean, 
        default: false 
    },
    proExpiresAt: { 
        type: Date 
    },

    // 3. Payment Ledger (Audit-Ready)
    // NOTE: Backend logic will check: User.findOne({ "payments.txHash": hash })
    payments: [
        {
            txHash: { type: String, required: true },
            amount: { type: Number, required: true, min: 0 },
            chain: { 
                type: String, 
                enum: ['BSC', 'ETH', 'POLYGON'], 
                default: 'BSC' 
            },
            date: { type: Date, default: Date.now }
        }
    ],

    joinedAt: { 
        type: Date, 
        default: Date.now 
    }

}, { 
    timestamps: true 
});

// Fast lookups for login & duplicate tx detection
UserSchema.index({ wallet: 1 });
UserSchema.index({ "payments.txHash": 1 });

module.exports = mongoose.model('User', UserSchema);