const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { requireAuth } = require('../middleware/auth');

// Helper: parse hashtags
function parseHashtags(hashtags) {
  if (!Array.isArray(hashtags)) return [];
  return hashtags
    .map(h => String(h).replace(/^#/, '').toLowerCase().trim())
    .filter(h => h.length > 0);
}

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const post = await db.collection('posts').findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const owner = await db.collection('users').findOne(
      { _id: post.owner },
      { projection: { password: 0 } }
    );

    // Populate comment users
    const commentUserIds = post.comments.map(c => c.user);
    const commentUsers = await db.collection('users')
      .find({ _id: { $in: commentUserIds } }, { projection: { password: 0 } })
      .toArray();

    post.comments = post.comments.map(c => {
      const commentLikes = c.likes || [];
      return {
        ...c,
        user: commentUsers.find(u => u._id.toString() === c.user.toString()) || null,
        likes: commentLikes.length,
        isLiked: req.user
          ? commentLikes.some(id => id.toString() === req.user._id.toString())
          : false,
      };
    });

    // Populate albums
    const albums = await db.collection('albums')
      .find({ _id: { $in: post.albums || [] } })
      .toArray();

    // Report count
    const reportCount = await db.collection('reports').countDocuments({ post: post._id });

    // Like count / isLiked
    const postLikes = post.likes || [];
    const likes = postLikes.length;
    const isLiked = req.user
      ? postLikes.some(id => id.toString() === req.user._id.toString())
      : false;

    res.json({
      post: { ...post, owner, albums, likes, isLiked },
      reportCount,
      isHidden: reportCount > 2,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts - Create a post
router.post('/', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const { image, description, hashtags } = req.body;

    if (!image) return res.status(400).json({ message: 'Image is required' });

    const newPost = {
      owner: req.user._id,
      image,
      description: description || '',
      hashtags: parseHashtags(hashtags),
      albums: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('posts').insertOne(newPost);

    // Create activity entry
    await db.collection('activity').insertOne({
      user: req.user._id,
      type: 'post_created',
      post: result.insertedId,
      album: null,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Post created', post: { _id: result.insertedId, ...newPost } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/posts/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const post = await db.collection('posts').findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { description, hashtags } = req.body;
    const update = { updatedAt: new Date() };
    if (description !== undefined) update.description = description;
    if (hashtags !== undefined) update.hashtags = parseHashtags(hashtags);

    await db.collection('posts').updateOne({ _id: post._id }, { $set: update });
    const updated = await db.collection('posts').findOne({ _id: post._id });

    res.json({ message: 'Post updated', post: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/posts/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const post = await db.collection('posts').findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const albums = await db.collection('albums').find({ posts: post._id }).toArray();
    for (const album of albums) {
      const remaining = album.posts.filter(p => p.toString() !== post._id.toString());
      if (remaining.length === 0) {
        await db.collection('albums').deleteOne({ _id: album._id });
        await db.collection('activity').deleteMany({ album: album._id });
      } else {
        await db.collection('albums').updateOne(
          { _id: album._id },
          { $set: { posts: remaining } }
        );
      }
    }

    await db.collection('activity').deleteMany({ post: post._id });
    await db.collection('reports').deleteMany({ post: post._id });
    await db.collection('posts').deleteOne({ _id: post._id });

    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts/:id/comments - Add a comment
router.post('/:id/comments', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text required' });
    }

    const post = await db.collection('posts').findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      _id: new ObjectId(),
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date()
    };

    await db.collection('posts').updateOne(
      { _id: post._id },
      { $push: { comments: comment } }
    );

    res.status(201).json({ message: 'Comment added', comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/posts/:id/comments/:commentId
router.delete('/:id/comments/:commentId', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const post = await db.collection('posts').findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.find(c => c._id.toString() === req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await db.collection('posts').updateOne(
      { _id: post._id },
      { $pull: { comments: { _id: new ObjectId(req.params.commentId) } } }
    );

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts/:id/like — toggle like on a post
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const postId = new ObjectId(req.params.id);
    const userId = req.user._id;

    const post = await db.collection('posts').findOne({ _id: postId });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const likes = post.likes || [];
    const hasLiked = likes.some(id => id.toString() === userId.toString());

    if (hasLiked) {
      await db.collection('posts').updateOne(
        { _id: postId },
        { $pull: { likes: userId } }
      );
    } else {
      await db.collection('posts').updateOne(
        { _id: postId },
        { $addToSet: { likes: userId } }
      );
    }

    const updated = await db.collection('posts').findOne({ _id: postId });
    res.json({
      likes: updated.likes?.length || 0,
      isLiked: !hasLiked,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST /api/posts/:id/comments/:commentId/like
router.post('/:id/comments/:commentId/like', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const postId = new ObjectId(req.params.id);
    const commentId = new ObjectId(req.params.commentId);
    const userId = req.user._id;

    const post = await db.collection('posts').findOne({ _id: postId });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.find(c => c._id.toString() === commentId.toString());
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const likes = comment.likes || [];
    const hasLiked = likes.some(id => id.toString() === userId.toString());

    if (hasLiked) {
      await db.collection('posts').updateOne(
        { _id: postId, 'comments._id': commentId },
        { $pull: { 'comments.$.likes': userId } }
      );
    } else {
      await db.collection('posts').updateOne(
        { _id: postId, 'comments._id': commentId },
        { $addToSet: { 'comments.$.likes': userId } }
      );
    }

    const updated = await db.collection('posts').findOne({ _id: postId });
    const updatedComment = updated.comments.find(c => c._id.toString() === commentId.toString());
    const updatedLikes = updatedComment.likes || [];

    res.json({
      likes: updatedLikes.length,
      isLiked: !hasLiked,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;