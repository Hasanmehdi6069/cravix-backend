const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true // Prevents two people from using the same email
    },
    password: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);