// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth'); // Assume JWT auth middleware

// POST /api/orders
router.post('/', auth, async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    if (!userId || !items || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const order = new Order({
      userId,
      items,
      totalAmount
    });

    const savedOrder = await order.save();
    res.status(201).json({ orderId: savedOrder._id });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;