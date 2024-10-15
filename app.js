require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/dbConnect');
const userRoutes = require('./src/routes/userRoutes');
const atividadeRoutes = require('./src/routes/atividadeRoutes');
const app = express();

// Config json response
app.use(express.json());

// Routes
app.use(userRoutes);
app.use(atividadeRoutes);

// Connect to MongoDB
connectDB();

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
