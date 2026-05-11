const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 🟢 ADD THIS
const User = require('../models/User');

// 🟢 ROUTE 1: NATIVE SIGN UP (Create Account)
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: "Email and Password required!" });

        // 1. Check if user already exists
        let existingUser = await User.findOne({ email: email });
        if (existingUser) return res.status(400).json({ success: false, message: "User already exists! Please Log In." });

        // 2. The Bcrypt Armor (Hash the password)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save to Vault
        const newUser = new User({ email: email, password: hashedPassword });
        await newUser.save();

        console.log(`🟢 New User Registered: ${email}`);
        res.status(200).json({ success: true, message: "Account Created Successfully!", user: { _id: newUser._id, email: newUser.email } });

    } catch (error) {
        console.error("🔴 Register Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// 🟢 ROUTE 2: NATIVE LOG IN (Verify Account & Generate JWT)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find User in the Vault
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ success: false, message: "Invalid Email or Password." });

        // 2. Check Password against the encrypted Hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid Email or Password." });

        // 3. 🛡️ FORGE THE DIGITAL KEY (JWT)
        const token = jwt.sign(
            { id: user._id }, // Payload: We lock their ID inside the token
            process.env.JWT_SECRET, // The Master Secret
            { expiresIn: '7d' } // Key expires in 7 days
        );

        // 4. Open the Vault & Hand over the Key
        console.log(`🔵 User Logged In & Key Forged: ${email}`);
        res.status(200).json({ 
            success: true, 
            message: "Login Successful!", 
            token: token, // 🔑 Sending the key to the frontend!
            user: { _id: user._id, email: user.email } 
        });

    } catch (error) {
        console.error("🔴 Login Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
// 🟢 ROUTE 3: GOOGLE AUTH HANDSHAKE
router.post('/google', async (req, res) => {
    try {
        const { email, name } = req.body;
        
        // 1. Check if this Google user is already in our Vault
        let user = await User.findOne({ email: email });

        // 2. If they are new, create an account for them automatically!
        if (!user) {
            // We generate a random scrambled password since Google handles their real security
            const randomPassword = Math.random().toString(36).slice(-10);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = new User({ email: email, password: hashedPassword });
            await user.save();
            console.log(`🟢 New Google User Registered: ${email}`);
        }

        // 3. 🛡️ FORGE THE DIGITAL KEY (JWT)
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        console.log(`🔵 Google User Authorized: ${email}`);
        res.status(200).json({ 
            success: true, 
            token: token, 
            user: { _id: user._id, email: user.email, name: name } 
        });

    } catch (error) {
        console.error("🔴 Google Auth Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});
module.exports = router;