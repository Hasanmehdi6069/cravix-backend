// ==========================================
// CRAVIX BACKEND - THE MASTER ENGINE
// ==========================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // This loads our secret .env file

// Initialize the App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 🟢 CONNECTING OUR ROUTES
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const restaurantRoutes = require('./routes/restaurant');
app.use('/api/restaurants', restaurantRoutes);

const orderRoutes = require('./routes/order');
app.use('/api/orders', orderRoutes);

// 🟢 DATABASE CONNECTION LOGIC
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('🟢 THE VAULT IS OPEN: Connected to MongoDB Atlas Successfully!');
    })
    .catch((err) => {
        console.error('🔴 DATABASE CONNECTION FAILED:', err.message);
    });

// 🟢 Test Route
app.get('/', (req, res) => {
    res.send('🔥 Cravix Backend Engine is LIVE and Connected to the DB! 🔥');
});

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 CRAVIX SERVER IGNITED ON PORT ${PORT}`);
});