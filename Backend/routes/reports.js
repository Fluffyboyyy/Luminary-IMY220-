import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reports/reasons
router.get('/reasons', async (req, res) => {
  try {
    const db = getDB();
    const reasons = await db.collection('reportReasons').find({}).toArray();
    res.json({ reasons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reports - Report a post
router.post('/', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const { postId, reasonId } = req.body;
    if (!postId || !reasonId) {
      return res.status(400).json({ message: 'postId and reasonId are required' });
    }

    const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot report your own post' });
    }

    // One report per user per post
    const existing = await db.collection('reports').findOne({
      post: post._id,
      reportedBy: req.user._id
    });
    if (existing) {
      return res.status(400).json({ message: 'You already reported this post' });
    }

    await db.collection('reports').insertOne({
      post: post._id,
      reportedBy: req.user._id,
      reason: new ObjectId(reasonId),
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Post reported' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;