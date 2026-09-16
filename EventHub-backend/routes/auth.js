const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, phone, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered. Please login instead.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role === 'organizer' ? 'organizer' : 'attendee',
      phone: phone || '',
      bio: bio || '',
      avatar: `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(name.trim())}`,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || 'eventhub_default_secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        bio: newUser.bio,
        avatar: newUser.avatar,
      },
      message: 'Account created successfully!',
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup. Please try again.' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. No user found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'eventhub_default_secret',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'attendee',
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(user.name)}`,
      },
      message: 'Welcome back!',
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login. Please try again.' });
  }
});

// GET CURRENT USER PROFILE
router.get('/me', auth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'attendee',
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(user.name)}`,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Fetch me error:', err);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// UPDATE PROFILE
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, bio, role, avatar } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (role && ['attendee', 'organizer'].includes(role)) user.role = role;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bio: user.bio,
        avatar: user.avatar,
      },
      message: 'Profile updated successfully!',
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

module.exports = router;