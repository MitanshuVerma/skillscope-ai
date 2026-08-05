const express = require('express');
const passport = require('passport');

const router = express.Router();

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : 'http://localhost:5173';

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
    '/google/callback',
    (req, res, next) => {
        passport.authenticate('google', { failureRedirect: `${clientUrl}/` })(req, res, next);
    },
    (req, res) => {
        // Successful authentication, redirect to dashboard.
        res.redirect(`${clientUrl}/dashboard`);
    }
);

// @desc    Get current logged in user
// @route   GET /api/auth/current-user
router.get('/current-user', async (req, res) => {
    if (!req.user) {
        return res.json(null);
    }
    // Re-fetch to ensure we have latest skills and populated fields if needed
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    res.json(user);
});

// @desc    Logout user
// @route   GET /api/auth/logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect(`${clientUrl}/`);
    });
});

// @desc    Clear user skills
// @route   POST /api/auth/clear-skills
router.post('/clear-skills', async (req, res) => {
    console.log("Hitting clear-skills endpoint!");
    if (!req.user) {
        console.log("Not authenticated!");
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const User = require('../models/User');
    const user = await User.findByIdAndUpdate(req.user.id, { $set: { skills: [] } }, { new: true });
    res.json(user);
});

module.exports = router;
