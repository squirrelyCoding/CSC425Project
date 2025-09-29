require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Define Routes
app.use('/api/messages', require('./routes/messageRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));