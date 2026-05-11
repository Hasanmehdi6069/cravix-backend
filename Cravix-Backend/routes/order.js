const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyToken = require('../Middleware/verifyToken'); // 🟢 THE BOUNCER

// 🟢 PROTECTED ROUTE: Place a New Order
router.post('/place', verifyToken, async (req, res) => {
    try {
        const verifiedUserId = req.user.id;
        const { userId, restaurantId, restaurantName, items, totalAmount, paymentMethod } = req.body;

        // 🛡️ SECURITY CHECK: Make sure the hacker isn't ordering under someone else's ID!
        if (verifiedUserId !== userId) {
            return res.status(403).json({ success: false, message: "Security Breach: User ID mismatch!" });
        }

        // Create the new order in the Vault
        const newOrder = new Order({
            userId, restaurantId, restaurantName, items, totalAmount, paymentMethod
        });

        await newOrder.save();
        console.log(`🍔 Secure Order Saved to DB from User ID: ${verifiedUserId}`);

        res.status(201).json({ success: true, message: "Order placed successfully!", orderId: newOrder._id });

    } catch (error) {
        console.error("🔴 Order Placement Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// 🟢 GET Route: Fetch Past Orders for a User (Also Protected!)
router.get('/history/:userId', verifyToken, async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ success: false, message: "Access Denied to other user's history." });
        }
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("🔴 Fetch Orders Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;