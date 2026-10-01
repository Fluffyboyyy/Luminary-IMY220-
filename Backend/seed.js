require('dotenv').config();
const { connectDB, getDB } = require('./config/db');
const { ObjectId } = require('mongodb');

async function seed() {
  await connectDB();
  const db = getDB();

  console.log('Clearing existing data...');
  await Promise.all([
    db.collection('users').deleteMany({}),
    db.collection('posts').deleteMany({}),
    db.collection('albums').deleteMany({}),
    db.collection('activity').deleteMany({}),
    db.collection('friendships').deleteMany({}),
    db.collection('friendRequests').deleteMany({}),
    db.collection('reports').deleteMany({}),
    db.collection('reportReasons').deleteMany({})
  ]);

  console.log('Inserting users...');

  const user1Id = new ObjectId();
  const user2Id = new ObjectId();
  const user3Id = new ObjectId();
  const adminId = new ObjectId();

  await db.collection('users').insertMany([
    {
      _id: user1Id,
      email: 'test@test.com',
      password: 'test1234',
      name: 'Test User',
      username: 'testuser',
      bio: 'Testing account for IMY 220.',
      profileImage: '',
      isAdmin: false,
      createdAt: new Date()
    },
    {
      _id: user2Id,
      email: 'alice@example.com',
      password: 'alice1234',
      name: 'Alice Smith',
      username: 'alice',
      bio: 'Photography enthusiast.',
      profileImage: '',
      isAdmin: false,
      createdAt: new Date()
    },
    {
      _id: user3Id,
      email: 'bob@example.com',
      password: 'bob1234',
      name: 'Bob Jones',
      username: 'bob',
      bio: 'Travel and landscapes.',
      profileImage: '',
      isAdmin: false,
      createdAt: new Date()
    },
    {
      _id: adminId,
      email: 'admin@test.com',
      password: 'admin1234',
      name: 'Site Admin',
      username: 'admin',
      bio: 'Administrator',
      profileImage: '',
      isAdmin: true,
      createdAt: new Date()
    }
  ]);

  console.log('Inserting posts...');

  const post1Id = new ObjectId();
  const post2Id = new ObjectId();
  const post3Id = new ObjectId();

  await db.collection('posts').insertMany([
    {
      _id: post1Id,
      owner: user1Id,
      image: 'https://picsum.photos/seed/post1/600/400',
      description: 'My first post on this platform!',
      hashtags: ['firstpost', 'hello'],
      albums: [],
      comments: [
        {
          _id: new ObjectId(),
          user: user2Id,
          text: 'Welcome!',
          createdAt: new Date(),
          likes: [user2Id]
        }
      ],
      likes: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
      updatedAt: new Date()
    },
    {
      _id: post2Id,
      owner: user2Id,
      image: 'https://picsum.photos/seed/post2/600/400',
      description: 'Beautiful sunset today #nature',
      hashtags: ['nature', 'sunset'],
      albums: [],
      comments: [],
      likes: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      updatedAt: new Date()
    },
    {
      _id: post3Id,
      owner: user3Id,
      image: 'https://picsum.photos/seed/post3/600/400',
      description: 'Mountain views',
      hashtags: ['travel', 'mountains'],
      albums: [],
      comments: [],
      likes: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 10),
      updatedAt: new Date()
    }
  ]);

  console.log('Inserting albums...');

  const album1Id = new ObjectId();
  await db.collection('albums').insertOne({
    _id: album1Id,
    owner: user1Id,
    name: 'My Favourites',
    description: 'A collection of my best shots.',
    hashtags: ['best', 'favourites'],
    posts: [post1Id],
    coverImage: '',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Link post1 to album1
  await db.collection('posts').updateOne(
    { _id: post1Id },
    { $set: { albums: [album1Id] } }
  );

  console.log('Inserting friendships (user1 <-> user2)...');

  await db.collection('friendships').insertOne({
    from: user1Id,
    to: user2Id,
    status: 'accepted',
    createdAt: new Date()
  });

  console.log('Inserting activity...');

  await db.collection('activity').insertMany([
    {
      user: user1Id,
      type: 'post_created',
      post: post1Id,
      album: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60)
    },
    {
      user: user2Id,
      type: 'post_created',
      post: post2Id,
      album: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      user: user3Id,
      type: 'post_created',
      post: post3Id,
      album: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 10)
    },
    {
      user: user1Id,
      type: 'album_created',
      album: album1Id,
      post: null,
      createdAt: new Date()
    },
    {
      user: user1Id,
      type: 'album_post_added',
      album: album1Id,
      post: post1Id,
      createdAt: new Date()
    }
  ]);

  console.log('Inserting report reasons...');
  await db.collection('reportReasons').insertMany([
    { text: 'Inappropriate content', createdBy: adminId, createdAt: new Date() },
    { text: 'Spam', createdBy: adminId, createdAt: new Date() },
    { text: 'Harassment', createdBy: adminId, createdAt: new Date() },
    { text: 'Copyright violation', createdBy: adminId, createdAt: new Date() }
  ]);

  console.log('\nSeed complete!');
  console.log('\nLogin credentials:');
  console.log('  Regular user: test@test.com / test1234');
  console.log('  Admin:        admin@test.com / admin1234');
  console.log('  Other users:  alice@example.com / alice1234');
  console.log('                bob@example.com / bob1234');

  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});