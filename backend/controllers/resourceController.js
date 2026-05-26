const db = require('../config/db');

async function getAll(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM resources ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getOne(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM resources WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Resource not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function create(req, res) {
  const { name, type, description, stock, price } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !type || !stock || !price) {
    return res.status(400).json({ message: 'name, type, stock, price required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO resources (name, type, description, stock, image, price) VALUES (?, ?, ?, ?, ?, ?)',
      [name, type, description || null, parseInt(stock), image, parseFloat(price)]
    );
    res.status(201).json({ message: 'Resource created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function update(req, res) {
  const { name, type, description, stock, price } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const [existing] = await db.query('SELECT * FROM resources WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ message: 'Resource not found' });

    const current = existing[0];
    await db.query(
      'UPDATE resources SET name = ?, type = ?, description = ?, stock = ?, image = ?, price = ? WHERE id = ?',
      [
        name ?? current.name,
        type ?? current.type,
        description ?? current.description,
        stock !== undefined ? parseInt(stock) : current.stock,
        image ?? current.image,
        price !== undefined ? parseFloat(price) : current.price,
        req.params.id,
      ]
    );
    res.json({ message: 'Resource updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function remove(req, res) {
  try {
    const [result] = await db.query('DELETE FROM resources WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAll, getOne, create, update, remove };
