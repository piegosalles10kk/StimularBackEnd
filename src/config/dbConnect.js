const mongoose = require('mongoose');

const connectDB = async () => {
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASS;
    const dbURI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.uenfp.mongodb.net/Stimulardb001?retryWrites=true&w=majority&appName=Cluster0`;

    try {
        await mongoose.connect(dbURI);
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
