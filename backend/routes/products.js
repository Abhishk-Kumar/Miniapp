const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const authMiddleware = require('../middleware/authHandlermw');

// GET /api/products — get all products (protected)
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

// PUT /api/products/:id — update a product (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const {
    article_no,
    product_service,
    in_price,
    price,
    unit,
    in_stock,
    description
  } = req.body;

  try {
    await pool.query(
      `UPDATE products SET
        article_no = COALESCE($1, article_no),
        product_service = COALESCE($2, product_service),
        in_price = COALESCE($3, in_price),
        price = COALESCE($4, price),
        unit = COALESCE($5, unit),
        in_stock = COALESCE($6, in_stock),
        description = COALESCE($7, description)
      WHERE id = $8`,
      [article_no, product_service, in_price, price, unit, in_stock, description, id]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;