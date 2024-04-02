const mongoose = require('mongoose');

// Define a schema for cart items
const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    count: {
        type: Number,
        default: 1
    }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
