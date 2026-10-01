const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// Attach req.user if session exists
async function attachUser(req, res, next) {
  if (req.session && req.session.userId) {
    try {
      const db = getDB();
      const user = await db.collection('users').findOne(
        { _id: new ObjectId(req.session.userId) },
        { projection: { password: 0 } }
      );
      if (user) req.user = user;
    } catch (err) {
      // Ignore - user stays undefined
    }
  }
  next();
}

// Require login
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}

// Require admin
function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

module.exports = { attachUser, requireAuth, requireAdmin };