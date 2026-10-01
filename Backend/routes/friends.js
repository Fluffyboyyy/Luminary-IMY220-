import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/friends/requests
router.get('/requests', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const requests = await db.collection('friendRequests')
      .find({ to: req.user._id, status: 'pending' })
      .toArray();

    const fromIds = requests.map(r => r.from);
    const users = await db.collection('users')
      .find({ _id: { $in: fromIds } }, { projection: { password: 0 } })
      .toArray();

    const populated = requests.map(r => ({
      ...r,
      from: users.find(u => u._id.toString() === r.from.toString())
    }));

    res.json({ requests: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/friends/request/:userId
router.post('/request/:userId', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const toId = new ObjectId(req.params.userId);

    if (toId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot friend yourself' });
    }

    const target = await db.collection('users').findOne({ _id: toId });
    if (!target) return res.status(404).json({ message: 'User not found' });

    const existing = await db.collection('friendships').findOne({
      $or: [
        { from: req.user._id, to: toId },
        { from: toId, to: req.user._id }
      ]
    });
    if (existing) {
      return res.status(400).json({ message: 'Already friends' });
    }

    const pending = await db.collection('friendRequests').findOne({
      from: req.user._id,
      to: toId,
      status: 'pending'
    });
    if (pending) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    await db.collection('friendRequests').insertOne({
      from: req.user._id,
      to: toId,
      status: 'pending',
      createdAt: new Date()
    });

    res.json({ message: 'Friend request sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/friends/accept/:requestId
router.post('/accept/:requestId', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const request = await db.collection('friendRequests').findOne({
      _id: new ObjectId(req.params.requestId)
    });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create friendship
    await db.collection('friendships').insertOne({
      from: request.from,
      to: request.to,
      status: 'accepted',
      createdAt: new Date()
    });

    await db.collection('friendRequests').deleteOne({ _id: request._id });

    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/friends/decline/:requestId
router.post('/decline/:requestId', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const request = await db.collection('friendRequests').findOne({
      _id: new ObjectId(req.params.requestId)
    });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await db.collection('friendRequests').deleteOne({ _id: request._id });
    res.json({ message: 'Friend request declined' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/friends/:userId
router.delete('/:userId', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const friendId = new ObjectId(req.params.userId);

    await db.collection('friendships').deleteOne({
      $or: [
        { from: req.user._id, to: friendId },
        { from: friendId, to: req.user._id }
      ]
    });

    res.json({ message: 'Unfriended' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;