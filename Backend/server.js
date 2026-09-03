const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const mockUsers = [
  {
    id: 1,
    name: 'Alice Johnson',
    username: 'alicej',
    email: 'alice@example.com',
    password: 'password123',
    avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=6C63FF&color=fff&size=60'
  },
  {
    id: 2,
    name: 'Bob Smith',
    username: 'bobs',
    email: 'bob@example.com',
    password: 'password123',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=FF6584&color=fff&size=60'
  }
];

// ========================================
//           Sign In
// ========================================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  setTimeout(() => {
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword
    });
  }, 500);
});

// ========================================
//              Sign Up
// ========================================
app.post('/api/auth/register', (req, res) => {
  const { name, username, email, password } = req.body;

  setTimeout(() => {
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const existingUsername = mockUsers.find(u => u.username === username);
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'Username already taken'
      });
    }

    const newUser = {
      id: mockUsers.length + 1,
      name,
      username,
      email,
      password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6C63FF&color=fff&size=60`
    };

    mockUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    res.json({
      success: true,
      message: 'Registration successful',
      user: userWithoutPassword
    });
  }, 500);
});

// ========================================
// Start Server
// ========================================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Mock users:`, mockUsers.map(u => ({ email: u.email, password: u.password })));
});