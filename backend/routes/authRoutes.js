const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : 'http://localhost:5173';

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: `${clientUrl}/`, session: false }),
    (req, res) => {
        // Successful authentication
        // Generate JWT
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: '30d',
        });
        
        // Redirect to dashboard with token
        res.redirect(`${clientUrl}/dashboard?token=${token}`);
    }
);

// @desc    Get current logged in user
// @route   GET /api/auth/current-user
router.get('/current-user', protect, async (req, res) => {
    // Re-fetch to ensure we have latest skills and populated fields if needed
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(401).json(null);
    }
    res.json(user);
});

// @desc    Logout user (client-side only for JWT, but keep route for backward compatibility)
// @route   GET /api/auth/logout
router.get('/logout', (req, res) => {
    res.redirect(`${clientUrl}/`);
});

// @desc    Clear user skills
// @route   POST /api/auth/clear-skills
router.post('/clear-skills', protect, async (req, res) => {
    console.log("Hitting clear-skills endpoint!");
    const User = require('../models/User');
    const user = await User.findByIdAndUpdate(req.user.id, { $set: { skills: [] } }, { new: true });
    res.json(user);
});

module.exports = router;
