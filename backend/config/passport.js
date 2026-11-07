const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');
const { connectDB } = require('./db');

const backendUrl = (
    process.env.BACKEND_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://skillscope-ai-b0xp.onrender.com' : 'http://localhost:5000')
).replace(/\/$/, '');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
            callbackURL: `${backendUrl}/api/auth/google/callback`,
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Ensure database is connected before querying
                if (mongoose.connection.readyState !== 1) {
                    await connectDB();
                }

                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
                const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
                const name = profile.displayName || (email ? email.split('@')[0] : 'User');

                // Check by googleId first, then by email to link existing accounts and avoid unique constraint crashes
                let user = await User.findOne({ googleId: profile.id });

                if (!user && email) {
                    user = await User.findOne({ email });
                }

                if (user) {
                    let needsSave = false;
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        needsSave = true;
                    }
                    if (!user.picture && picture) {
                        user.picture = picture;
                        needsSave = true;
                    }
                    if (!user.name && name) {
                        user.name = name;
                        needsSave = true;
                    }
                    if (needsSave) {
                        await user.save();
                    }
                    return done(null, user);
                }

                if (!email) {
                    return done(new Error("No email address provided by Google account"), null);
                }

                // If not, create a new user
                user = await User.create({
                    googleId: profile.id,
                    name,
                    email,
                    picture,
                });

                return done(null, user);
            } catch (error) {
                console.error("Error in Google Strategy:", error);
                return done(error, null);
            }
        }
    )
);
