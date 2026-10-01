import express from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

async function buildFeed(db, activities, req) {
  const userIds = [...new Set(activities.map(a => a.user.toString()))];
  const postIds = activities.filter(a => a.post).map(a => a.post);
  const albumIds = activities.filter(a => a.album).map(a => a.album);

  const users = await db.collection('users')
    .find({ _id: { $in: userIds.map(id => new ObjectId(id)) } },
      { projection: { password: 0 } })
    .toArray();

  const posts = await db.collection('posts')
    .find({ _id: { $in: postIds } })
    .toArray();

  const albums = await db.collection('albums')
    .find({ _id: { $in: albumIds } })
    .toArray();

  // Get report counts for posts
  const reportsAgg = await db.collection('reports').aggregate([
    { $match: { post: { $in: postIds } } },
    { $group: { _id: '$post', count: { $sum: 1 } } }
  ]).toArray();
  const reportMap = {};
  reportsAgg.forEach(r => { reportMap[r._id.toString()] = r.count; });

  return activities.map(a => {
    const user = users.find(u => u._id.toString() === a.user.toString());
    const post = a.post ? posts.find(p => p._id.toString() === a.post.toString()) : null;
    const album = a.album ? albums.find(al => al._id.toString() === a.album.toString()) : null;

    let populatedPost = null;
    if (post) {
      const owner = users.find(u => u._id.toString() === post.owner.toString()) || null;
      const postLikes = post.likes || [];
      populatedPost = {
        ...post,
        owner,
        likes: postLikes.length,
        isLiked: req.user
          ? postLikes.some(id => id.toString() === req.user._id.toString())
          : false,
        reportCount: reportMap[post._id.toString()] || 0,
        isHidden: (reportMap[post._id.toString()] || 0) > 2,
      };
    }

    let populatedAlbum = null;
    if (album) {
      const owner = users.find(u => u._id.toString() === album.owner.toString()) || null;
      // Album cover: first post's image, or album.coverImage
      let coverImage = album.coverImage;
      if (!coverImage && album.posts && album.posts.length) {
        const firstPost = posts.find(p => p._id.toString() === album.posts[0].toString());
        if (firstPost) coverImage = firstPost.image;
      }
      populatedAlbum = { ...album, owner, coverImage };
    }

    return {
      _id: a._id,
      type: a.type,
      createdAt: a.createdAt,
      user,
      post: populatedPost,
      album: populatedAlbum
    };
  });
}

// GET /api/activity/local
router.get('/local', requireAuth, async (req, res) => {
  try {
    const db = getDB();

    const friendships = await db.collection('friendships')
      .find({ $or: [{ from: req.user._id }, { to: req.user._id }], status: 'accepted' })
      .toArray();

    const friendIds = friendships.map(f =>
      f.from.toString() === req.user._id.toString() ? f.to : f.from
    );

    const userIds = [req.user._id, ...friendIds];

    const activities = await db.collection('activity')
      .find({ user: { $in: userIds } })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const feed = await buildFeed(db, activities, req);
    res.json({ feed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/activity/global
router.get('/global', requireAuth, async (req, res) => {
  try {
    const db = getDB();
    const activities = await db.collection('activity')
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const feed = await buildFeed(db, activities, req);
    res.json({ feed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;