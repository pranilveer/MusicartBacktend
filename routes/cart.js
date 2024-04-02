const express = require('express');
const router = express.Router();
const CartItem = require('../models/cartItem');

// Route to add product to cart
router.post('/', async (req, res) => {
  const { productId } = req.body;

  try {
    // Check if the product is already in the cart
    let cartItem = await CartItem.findOne({ productId });

    if (cartItem) {
      // If the product is already in the cart, increment its count by 1
      cartItem.count++;
    } else {
      // If the product is not in the cart, create a new cart item
      cartItem = new CartItem({ productId });
    }

    // Save the cart item
    await cartItem.save();

    return res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Route to get cart items
router.get('/', async (req, res) => {
  try {
    // Fetch all cart items
    const cartItems = await CartItem.find().populate('productId');
    return res.status(200).json({ cartItems });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
