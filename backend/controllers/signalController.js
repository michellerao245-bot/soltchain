const axios = require('axios');
let cache = { data: [], timestamp: 0 };

exports.getSnipingSignals = async (req, res) => {
    try {
        const now = Date.now();
        // API Call (URL fixed, extra bracket removed)
        const response = await axios.get('https://api.dexscreener.com/latest/dex/search?q=WBNB%20BNB');
        const pairs = response.data?.pairs || [];
        
        const unique = new Map();
        for (const p of pairs) {
            const liq = p.liquidity?.usd || 0;
            const vol = p.volume?.h24 || 0;

            // --- LOOSE FILTERS FOR TESTING ---
            // Agar liquidity sirf $100 bhi hai toh dikhao
            if (liq < 100 || p.chainId !== 'bsc') continue; 

            const score = Math.min(100, Math.round((liq / 1000) + (vol / 2000) + 50));

            unique.set(p.baseToken.address, {
                symbol: p.baseToken?.symbol || "TOKEN",
                address: p.baseToken?.address,
                liquidity: Math.round(liq),
                volume: Math.round(vol),
                m5: (p.priceChange?.m5 || 0).toFixed(2),
                score: score,
                age: "Live",
                signal: score > 70 ? "STRONG BUY" : "WATCH",
                isRisky: liq < 500
            });
        }

        const result = Array.from(unique.values()).sort((a, b) => b.score - a.score).slice(0, 15);

        // Agar result khali hai toh test data bhej do taaki dashboard check ho sake
        if (result.length === 0) {
            return res.json({
                success: true,
                data: [{ symbol: "TEST-GEM", address: "0x000", liquidity: 5000, volume: 10000, m5: "5.0", score: 99, age: "1m", signal: "STRONG BUY", isRisky: false }],
                message: "Using Test Data"
            });
        }

        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};