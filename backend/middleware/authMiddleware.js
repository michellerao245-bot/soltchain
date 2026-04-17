const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // FIX 1: Strict Header Validation (Bearer standard)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            error: "Invalid auth header format. Use 'Bearer <token>'" 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Isme user ka wallet address hai
        next();
    } catch (err) {
        // FIX 3: Debug Logging for Production
        console.error("🚨 JWT AUTH ERROR:", err.message);

        // FIX 2: Differentiated Error Messages
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, error: "Token expired. Please login again." });
        }

        return res.status(401).json({ success: false, error: "Invalid token. Access denied." });
    }
};