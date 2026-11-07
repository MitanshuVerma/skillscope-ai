const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

const clientUrl = (
    process.env.CLIENT_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://skillscope-ai-five.vercel.app' : 'http://localhost:5173')
).replace(/\/$/, "");

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err) {
            console.error("Google OAuth Callback Error:", err);
            const errorMsg = encodeURIComponent(err.message || 'Authentication error');
            return res.redirect(`${clientUrl}/?auth_error=${errorMsg}`);
        }
        if (!user) {
            console.error("Google OAuth No User:", info);
            return res.redirect(`${clientUrl}/?auth_error=User%20authentication%20failed`);
        }

        try {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
                expiresIn: '30d',
            });
            return res.redirect(`${clientUrl}/dashboard?token=${token}`);
        } catch (jwtErr) {
            console.error("JWT signing error:", jwtErr);
            return res.redirect(`${clientUrl}/?auth_error=Token%20generation%20failed`);
        }
    })(req, res, next);
});

// @desc    Get current logged in user
// @route   GET /api/auth/current-user
router.get('/current-user', protect, async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json(null);
        }
        res.json(user);
    } catch (err) {
        console.error("Failed to fetch current user:", err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// @desc    Logout user (client-side only for JWT, but keep route for backward compatibility)
// @route   GET /api/auth/logout
router.get('/logout', (req, res) => {
    res.redirect(`${clientUrl}/`);
});

// @desc    Clear user skills
// @route   POST /api/auth/clear-skills
router.post('/clear-skills', protect, async (req, res) => {
    try {
        console.log("Hitting clear-skills endpoint!");
        const User = require('../models/User');
        const user = await User.findByIdAndUpdate(req.user.id, { $set: { skills: [] } }, { new: true });
        res.json(user);
    } catch (err) {
        console.error("Failed to clear skills:", err);
        res.status(500).json({ error: "Failed to clear skills" });
    }
});

module.exports = router;
