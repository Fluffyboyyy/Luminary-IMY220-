import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/:id - View profile (own or other)
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const userId = new ObjectId(req.params.id);

    const user = await db.collection('users').findOne(
      { _id: userId },
      { projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isOwnProfile = req.user && req.user._id.toString() === req.params.id;

    // Check friendship
    let friendshipStatus = 'not_friends';
    let areFriends = false;

    if (req.user && !isOwnProfile) {
      const friendship = await db.collection('friendships').findOne({
        $or: [
          { from: req.user._id, to: userId, status: 'accepted' },
          { from: userId, to: req.user._id, status: 'accepted' }
        ]
      });
      if (friendship) {
        friendshipStatus = 'friends';
        areFriends = true;
      } else {
        const pending = await db.collection('friendRequests').findOne({
          from: req.user._id, to: userId, status: 'pending'
        });
        if (pending) friendshipStatus = 'request_sent';
        else {
          const received = await db.collection('friendRequests').findOne({
            from: userId, to: req.user._id, status: 'pending'
          });
          if (received) friendshipStatus = 'request_received';
        }
      }
    }

    // Limited view for non-friends
    if (!isOwnProfile && !areFriends && req.user) {
      return res.json({
        user: { _id: user._id, name: user.name, username: user.username, profileImage: user.profileImage },
        friendshipStatus,
        limited: true
      });
    }

    // Full profile: posts, albums, friends
    const posts = await db.collection('posts')
      .find({ owner: userId })
      .sort({ createdAt: -1 })
      .toArray();

    const albums = await db.collection('albums')
      .find({ owner: userId })
      .sort({ createdAt: -1 })
      .toArray();

    let friends = [];
    if (isOwnProfile || areFriends) {
      const friendships = await db.collection('friendships')
        .find({ $or: [{ from: userId }, { to: userId }], status: 'accepted' })
        .toArray();

      const friendIds = friendships.map(f =>
        f.from.toString() === req.params.id ? f.to : f.from
      );

      if (friendIds.length) {
        friends = await db.collection('users')
          .find({ _id: { $in: friendIds } }, { projection: { password: 0 } })
          .toArray();
      }
    }

    res.json({
      user,
      posts,
      albums,
      friends,
      friendshipStatus,
      isOwnProfile,
      limited: false
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/me - Update own profile
router.put('/me', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const { name, username, bio, profileImage } = req.body;

    const update = {};
    if (name) update.name = name;
    if (bio !== undefined) update.bio = bio;
    if (profileImage !== undefined) update.profileImage = profileImage;

    if (username && username.toLowerCase() !== req.user.username) {
      const existing = await db.collection('users').findOne({ username: username.toLowerCase() });
      if (existing) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      update.username = username.toLowerCase();
    }

    await db.collection('users').updateOne(
      { _id: req.user._id },
      { $set: update }
    );

    const updated = await db.collection('users').findOne(
      { _id: req.user._id },
      { projection: { password: 0 } }
    );

    res.json({ message: 'Profile updated', user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/me - Delete own account
router.delete('/me', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const userId = req.user._id;

    await db.collection('posts').deleteMany({ owner: userId });
    await db.collection('albums').deleteMany({ owner: userId });
    await db.collection('friendships').deleteMany({
      $or: [{ from: userId }, { to: userId }]
    });
    await db.collection('friendRequests').deleteMany({
      $or: [{ from: userId }, { to: userId }]
    });
    await db.collection('reports').deleteMany({ reportedBy: userId });
    await db.collection('activity').deleteMany({ user: userId });
    await db.collection('users').deleteOne({ _id: userId });

    req.session.destroy();
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;