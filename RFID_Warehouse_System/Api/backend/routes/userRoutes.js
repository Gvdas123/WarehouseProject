const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');


router.post('/', async (req, res) => {
  try {
    const { username, password, email, role = 'user', key = '' } = req.body;
    const missingFields = [];
    if (!username) missingFields.push('username');
    if (!password) missingFields.push('password');
    if (!email) missingFields.push('email');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missingFields
      });
    }
    if (key && key.trim() !== '') {
      const existingUserWithKey = await User.findOne({ key });
      if (existingUserWithKey) {
        return res.status(409).json({
          success: false,
          message: 'Key already in use'
        });
      }
    }

    const user = new User({
      username,
      password,
      email,
      role,
      key: key.trim()
    });

    await user.save();
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      key: user.key,
      createdAt: user.createdAt,
    };
    delete userData.password;

    res.status(201).json({
      success: true,
      data: userData
    });

  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, email, role, key } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const updateData = {
            username,
            email,
            role,
            key
        };
        if (password) {
            updateData.password = password;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = updatedUser.toObject();
        delete userData.password;
        res.json(userData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users|| [] );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); 

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;