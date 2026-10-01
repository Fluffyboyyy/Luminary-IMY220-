import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, username } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const db = getDB();

    // Check existing email
    const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check username uniqueness
    if (username) {
      const existingUsername = await db.collection('users').findOne({
        username: username.toLowerCase()
      });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    const newUser = {
      email: email.toLowerCase(),
      password,
      name,
      username: username.toLowerCase() ,
      bio: '',
      profileImage: '',
      location: '',
      isAdmin: false,
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);

    req.session.userId = result.insertedId.toString();

    delete newUser.password;
    res.status(201).json({ message: 'Registered', user: { _id: result.insertedId, ...newUser } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const db = getDB();
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.userId = user._id.toString();

    delete user.password;
    res.json({ message: 'Logged in', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not logged in' });
  res.json(req.user);
});

export default router;