const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Signup route
router.post('/register', async (req, res) => {
    const { name, email, mobile, password } = req.body;
    console.log(req.body)
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({
        name,
        email,
        mobile,
        password: hashedPassword
      });
      await newUser.save();
  
      // Generate JWT token
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  
      // Return token and user data
      res.status(201).json({ token, user: { _id: newUser._id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        console.log("Errorrrr:" , error);
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Login route
router.post('/login', async (req, res) => {
  const { emailOrMobile, password } = req.body;

  try {
    // Check if the user exists with the provided email or mobile
    const user = await User.findOne({ $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }] });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // Return token and user data
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;