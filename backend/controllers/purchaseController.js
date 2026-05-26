const db = require('../config/db');

async function purchase(req, res) {
  const { resource_id, quantity } = req.body;
  const user_id = req.user.id;

  if (!resource_id || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'resource_id and quantity (>=1) required' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query('SELECT * FROM resources WHERE id = ? FOR UPDATE', [resource_id]);
    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Resource not found' });
    }

    const resource = rows[0];
    if (resource.stock < quantity) {
      await conn.rollback();
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const total = resource.price * quantity;

    await conn.query('UPDATE resources SET stock = stock - ? WHERE id = ?', [quantity, resource_id]);
    const [result] = await conn.query(
      'INSERT INTO purchases (user_id, resource_id, quantity, total_price) VALUES (?, ?, ?, ?)',
      [user_id, resource_id, quantity, total]
    );

    await conn.commit();
    res.status(201).json({
      message: 'Purchase successful',
      purchase_id: result.insertId,
      total_price: total,
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
}

async function getMyPurchases(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT p.id, p.quantity, p.total_price, p.created_at,
              r.name, r.type, r.image, r.price
       FROM purchases p
       JOIN resources r ON r.id = p.resource_id
       WHERE p.user_id = ?
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllPurchases(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT p.id, p.quantity, p.total_price, p.created_at,
              u.username, r.name AS resource_name, r.type
       FROM purchases p
       JOIN users u ON u.id = p.user_id
       JOIN resources r ON r.id = p.resource_id
       ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { purchase, getMyPurchases, getAllPurchases };
