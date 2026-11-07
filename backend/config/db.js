const mongoose = require("mongoose");

let lastDbError = null;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
        return;
    }

    try {
        if (!process.env.MONGO_URI) {
            lastDbError = "CRITICAL: MONGO_URI is missing from environment variables";
            console.error(lastDbError);
            return;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        lastDbError = null;
        console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (err) {
        lastDbError = err.message;
        console.error("MongoDB Connection Failed:", err.message);
        // Automatically retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB connection lost. Reconnecting...");
    setTimeout(connectDB, 3000);
});

mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected.");
    lastDbError = null;
});

const getDbStatus = () => {
    return {
        readyState: mongoose.connection.readyState,
        lastError: lastDbError,
        hasMongoUri: Boolean(process.env.MONGO_URI),
    };
};

module.exports = { connectDB, getDbStatus };
