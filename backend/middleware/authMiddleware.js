const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
            req.user = { id: decoded.id };
            next();
        } catch (error) {
            console.error("JWT Verification failed:", error);
            res.status(401).json({ error: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ error: "Not authorized, no token" });
    }
};

const protectOptional = async (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            req.user = { id: decoded.id };
        } catch (error) {
            console.error("JWT Verification optional failed:", error);
        }
    }
    next();
};

module.exports = { protect, protectOptional };
