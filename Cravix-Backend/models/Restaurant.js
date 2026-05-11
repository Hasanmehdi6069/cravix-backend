const mongoose = require('mongoose');

// Blueprint for a single food item
const menuItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    desc: String,
    isVeg: Boolean,
    img: String
});

// Blueprint for the whole restaurant
const restaurantSchema = new mongoose.Schema({
    idKey: { type: String, required: true, unique: true }, // e.g., 'burgerking'
    name: String,
    tags: String,
    rating: String,
    loc: String,
    logo: String,
    bg: String,
    // The menu is a Map (dictionary) where categories like "Recommended" point to an array of items
    menu: {
        type: Map,
        of: [menuItemSchema] 
    }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);