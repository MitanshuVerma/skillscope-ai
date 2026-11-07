const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("CRITICAL: MONGO_URI is not set in environment variables!");
            return;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (err) {
        console.error("MongoDB Connection Failed:", err.message);
        if (err.message.includes("querySrv ENOTFOUND")) {
            console.error("ACTION REQUIRED: The MongoDB Atlas cluster could not be resolved. This usually means the free cluster was PAUSED on MongoDB Atlas due to inactivity. Log into https://cloud.mongodb.com and resume the cluster.");
        }
    }
};

mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB connection lost.");
});

mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected.");
});

module.exports = connectDB;
