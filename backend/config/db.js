const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");
    } catch (err) {
        console.log("MongoDB connection failed, but continuing without it:", err.message);
    }
};

module.exports = connectDB;