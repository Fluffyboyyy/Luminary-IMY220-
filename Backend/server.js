const express = require('express');
const session = require('express-session');
const cors = require('cors');

require('dotenv').config();

const { connectDB } = require('./config/db');
const { attachUser } = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'imy220_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

app.use(attachUser);

connectDB();

app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/users'))
app.use('/api/posts', require('./routes/posts'))
app.use('/api/albums', require('./routes/albums'))
app.use('/api/friends', require('./routes/friends'))
app.use('/api/activity', require('./routes/activity'))



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});