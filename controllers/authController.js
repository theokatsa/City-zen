// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// POST /login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt for username: ${username}`);

  try {
    const [userRows] = await pool.execute('SELECT * FROM user WHERE username = ?', [username]);

    if (userRows.length === 0) {
      console.log(`User not found: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userRows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      console.log(`Password mismatch for user: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 🔍 Get matching citizen ID (assuming 1-to-1 user ↔ citizen)
    const [citizenRows] = await pool.execute(
      'SELECT id FROM citizen WHERE user_id = ?',
      [user.id]
    );

    const citizenId = citizenRows.length > 0 ? citizenRows[0].id : null;

    // 🛡️ Include citizenId in JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, citizenId },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`Login successful for user: ${username}`);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /users/me
exports.getCurrentUser = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email FROM user WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
