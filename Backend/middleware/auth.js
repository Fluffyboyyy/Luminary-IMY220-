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
    }
  }
  next();
}

module.exports = { attachUser };