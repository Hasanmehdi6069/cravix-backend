const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// 🟢 GET ALL RESTAURANTS (The Global Search API)
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json({ success: true, data: restaurants });
    } catch (error) {
        console.error("🔴 Search API Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// 🟢 GET SINGLE RESTAURANT (For the Menu Page)
router.get('/:idKey', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ idKey: req.params.idKey });
        if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found!" });
        res.status(200).json({ success: true, data: restaurant });
    } catch (error) {
        console.error("🔴 Menu API Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// 🟢 POST A NEW RESTAURANT (The CEO God Route)
router.post('/add', async (req, res) => {
    try {
        const { name, tags, rating, loc, logo, bg, menu } = req.body;

        // 1. Auto-generate a database ID key (e.g., "Taco Bell" -> "tacobell")
        const idKey = name.toLowerCase().replace(/[^a-z0-9]/g, '');

        // 2. Check if it already exists
        const existing = await Restaurant.findOne({ idKey: idKey });
        if (existing) {
            return res.status(400).json({ success: false, message: "A restaurant with this name already exists!" });
        }

        // 3. Forge the new Restaurant
        const newRestaurant = new Restaurant({
            idKey, name, tags, rating, loc, logo, bg, menu
        });

        // 4. Lock it in the Vault
        await newRestaurant.save();
        console.log(`👑 CEO Deployed New Restaurant: ${name}`);

        res.status(201).json({ success: true, message: "Restaurant successfully deployed to Live Servers!" });

    } catch (error) {
        console.error("🔴 Admin Deployment Error:", error);
        res.status(500).json({ success: false, message: "Server Error during deployment." });
    }
});

module.exports = router;