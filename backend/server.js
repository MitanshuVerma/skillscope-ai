require("dotenv").config();

const express = require("express");
const cors = require("cors");
const passport = require("passport");

const connectDB = require("./config/db");

// Passport config
require("./config/passport");

const app = express();

connectDB();

// CORS Middleware
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : 'http://localhost:5173';
app.use(cors({
    origin: clientUrl,
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Passport initialize
app.use(passport.initialize());

// Routes
const jobRoutes = require("./routes/jobRoutes");
app.use("/api", jobRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});