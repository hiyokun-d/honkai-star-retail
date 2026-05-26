const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const CLIENTS = {
  honkai_app: 'honkai_secret_2025',
};

function validateClient(client_id, client_secret) {
  return CLIENTS[client_id] && CLIENTS[client_id] === client_secret;
}

async function token(req, res) {
  const { grant_type, client_id, client_secret, username, password, role } = req.body;

  if (!validateClient(client_id, client_secret)) {
    return res.status(401).json({ error: 'invalid_client', error_description: 'Invalid client credentials' });
  }

  if (grant_type === 'password') {
    if (!username || !password) {
      return res.status(400).json({ error: 'invalid_request', error_description: 'username and password required' });
    }

    try {
      const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length === 0) {
        return res.status(401).json({ error: 'invalid_grant', error_description: 'Invalid credentials' });
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'invalid_grant', error_description: 'Invalid credentials' });
      }

      const access_token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, client_id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        access_token,
        token_type: 'Bearer',
        expires_in: 604800,
        user: { id: user.id, username: user.username, role: user.role },
      });
    } catch (err) {
      return res.status(500).json({ error: 'server_error', error_description: err.message });
    }
  }

  if (grant_type === 'register') {
    if (!username || !password) {
      return res.status(400).json({ error: 'invalid_request', error_description: 'username and password required' });
    }

    const safeRole = role === 'admin' ? 'admin' : 'user';

    try {
      const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
      if (existing.length > 0) {
        return res.status(409).json({ error: 'username_taken', error_description: 'Username already taken' });
      }

      const hash = await bcrypt.hash(password, 10);
      const [result] = await db.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hash, safeRole]
      );

      const access_token = jwt.sign(
        { id: result.insertId, username, role: safeRole, client_id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        access_token,
        token_type: 'Bearer',
        expires_in: 604800,
        user: { id: result.insertId, username, role: safeRole },
      });
    } catch (err) {
      return res.status(500).json({ error: 'server_error', error_description: err.message });
    }
  }

  return res.status(400).json({ error: 'unsupported_grant_type', error_description: 'Supported: password, register' });
}

module.exports = { token };
