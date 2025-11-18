// routes/review.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// POST: Create review (auth required)
router.post('/:itemId', reviewController.createReview);

// GET: Reviews for item (PUBLIC)
router.get('/:itemId', reviewController.getReviews);

// GET: All reviews + avg (for frontend)
router.get('/', reviewController.getAllReviewsWithAvg);

module.exports = router;