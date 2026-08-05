require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

const connectDB = require("./config/db");

// Passport config
require("./config/passport");

const app = express();

connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Sessions
app.set("trust proxy", 1);
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,
            sameSite: 'none'
        }
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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