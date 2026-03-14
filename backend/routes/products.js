const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const authMiddleware = require('../middleware/authHandlermw');

// GET route: /api/products — get all products
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/products/:id — update a product 
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  const field = Object.keys(req.body)[0];
  const value = req.body[field];

  const allowedFields = [
    "article_no",
    "product_service",
    "in_price",
    "price",
    "unit",
    "in_stock",
    "description"
  ];

  if (!allowedFields.includes(field)) {
    return res.status(400).json({ message: "Invalid field" });
  }

  try {
    const result = await pool.query(
      `UPDATE products
       SET ${field} = $1
       WHERE id = $2
       RETURNING *`,
      [value, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;