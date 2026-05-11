const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurantId: { type: String, required: true },
    restaurantName: { type: String, required: true },
    items: [
        {
            name: String,
            price: Number,
            qty: Number
        }
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: "COD" },
    status: { type: String, default: "Preparing" }, // Can be: Preparing, On the Way, Delivered
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);