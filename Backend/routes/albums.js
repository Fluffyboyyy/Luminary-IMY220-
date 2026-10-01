import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function parseHashtags(hashtags) {
  if (!Array.isArray(hashtags)) return [];
  return hashtags
    .map(h => String(h).replace(/^#/, '').toLowerCase().trim())
    .filter(h => h.length > 0);
}

// GET /api/albums/:id
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const album = await db.collection('albums').findOne({ _id: new ObjectId(req.params.id) });
    if (!album) return res.status(404).json({ message: 'Album not found' });

    const owner = await db.collection('users').findOne(
      { _id: album.owner },
      { projection: { password: 0 } }
    );

    const posts = await db.collection('posts')
      .find({ _id: { $in: album.posts || [] } })
      .toArray();

    res.json({ album: { ...album, owner, posts } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/albums - Create album
router.post('/', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const { name, description, hashtags } = req.body;
    if (!name) return res.status(400).json({ message: 'Album name is required' });

    const newAlbum = {
      owner: req.user._id,
      name,
      description: description || '',
      hashtags: parseHashtags(hashtags),
      posts: [],
      coverImage: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('albums').insertOne(newAlbum);

    await db.collection('activity').insertOne({
      user: req.user._id,
      type: 'album_created',
      album: result.insertedId,
      post: null,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Album created', album: { _id: result.insertedId, ...newAlbum } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/albums/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const album = await db.collection('albums').findOne({ _id: new ObjectId(req.params.id) });
    if (!album) return res.status(404).json({ message: 'Album not found' });

    if (album.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, description, hashtags } = req.body;
    const update = { updatedAt: new Date() };
    if (name) update.name = name;
    if (description !== undefined) update.description = description;
    if (hashtags !== undefined) update.hashtags = parseHashtags(hashtags);

    await db.collection('albums').updateOne({ _id: album._id }, { $set: update });
    const updated = await db.collection('albums').findOne({ _id: album._id });

    res.json({ message: 'Album updated', album: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/albums/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const album = await db.collection('albums').findOne({ _id: new ObjectId(req.params.id) });
    if (!album) return res.status(404).json({ message: 'Album not found' });

    if (album.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Remove album ref from posts
    await db.collection('posts').updateMany(
      { albums: album._id },
      { $pull: { albums: album._id } }
    );

    await db.collection('activity').deleteMany({ album: album._id });
    await db.collection('albums').deleteOne({ _id: album._id });

    res.json({ message: 'Album deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/albums/:id/posts - Add post to album
router.post('/:id/posts', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const { postId } = req.body;
    const album = await db.collection('albums').findOne({ _id: new ObjectId(req.params.id) });
    if (!album) return res.status(404).json({ message: 'Album not found' });

    if (album.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (!album.posts.some(p => p.toString() === postId)) {
      await db.collection('albums').updateOne(
        { _id: album._id },
        { $push: { posts: post._id } }
      );
      await db.collection('posts').updateOne(
        { _id: post._id },
        { $addToSet: { albums: album._id } }
      );
      await db.collection('activity').insertOne({
        user: req.user._id,
        type: 'album_post_added',
        album: album._id,
        post: post._id,
        createdAt: new Date()
      });
    }

    const updated = await db.collection('albums').findOne({ _id: album._id });
    res.json({ message: 'Post added to album', album: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/albums/:id/posts/:postId - Remove post from album
router.delete('/:id/posts/:postId', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const album = await db.collection('albums').findOne({ _id: new ObjectId(req.params.id) });
    if (!album) return res.status(404).json({ message: 'Album not found' });

    if (album.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await db.collection('albums').updateOne(
      { _id: album._id },
      { $pull: { posts: new ObjectId(req.params.postId) } }
    );
    await db.collection('posts').updateOne(
      { _id: new ObjectId(req.params.postId) },
      { $pull: { albums: album._id } }
    );

    res.json({ message: 'Post removed from album' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;