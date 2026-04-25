const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { publishEvent } = require('../config/redis');

const JWT_SECRET = process.env.JWT_SECRET || 'movie-ticket-secret-key-2026';

// POST /api/users/register
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    // Check if user already exists
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ error: 'Username already exists.' });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Publish USER_REGISTERED event
    await publishEvent('USER_REGISTERED', {
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/users/login
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/users/me
async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email', 'role', 'createdAt'],
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    console.error('GetProfile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { register, login, getProfile };
