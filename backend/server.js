require("dotenv").config();

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");

const { connectDB, getDbStatus } = require("./config/db");

// Passport config
require("./config/passport");

const app = express();

// Trust reverse proxy (Render, Cloudflare, Vercel)
app.set("trust proxy", 1);

connectDB();

// CORS Middleware
const allowedOrigins = [
    process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : null,
    "https://skillscope-ai-five.vercel.app",
    "http://localhost:5173",
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.some(o => origin.startsWith(o) || o.startsWith(origin))) {
            return callback(null, true);
        }
        return callback(null, true); // Permissive for API consumers
    },
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Passport initialize
app.use(passport.initialize());

// Health Check
app.get("/api/health", async (req, res) => {
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    
    // If disconnected, trigger a reconnect
    if (mongoose.connection.readyState === 0) {
        connectDB();
    }

    const status = getDbStatus();

    res.json({
        status: "ok",
        database: states[mongoose.connection.readyState] || "unknown",
        dbDetails: status,
        timestamp: new Date().toISOString()
    });
});

// Routes
const jobRoutes = require("./routes/jobRoutes");
app.use("/api", jobRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Backend Running");
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
