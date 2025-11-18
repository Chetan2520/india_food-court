// backend/routes/orders.js (Updated: Removed auth middleware for testing)
const express = require('express');
const router = express.Router();
// const auth = require('../middleware/auth'); // Commented out for no-login mode
const { createOrder } = require('../controllers/orderController'); // Import controller

// POST /api/orders - Create order (no auth for now)
router.post('/', createOrder); // Removed auth middleware

module.exports = router;