// controllers/reviewController.js
const Review = require('../models/Review');
const Item = require('../models/Item');

// POST: Create Review
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const itemId = req.params.itemId;
    const userId = req.user.id;

    if (!itemId) {
      return res.status(400).json({ error: 'Item ID is required.' });
    }

    const existingReview = await Review.findOne({ user: userId, item: itemId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this item.' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    const review = new Review({
      user: userId,
      item: itemId,
      rating,
      comment
    });

    await review.save();

    // Update average rating
    const reviews = await Review.find({ item: itemId });
    const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

    await Item.findByIdAndUpdate(
      itemId,
      {
        rating: parseFloat(averageRating),
        $push: { reviews: review._id }
      },
      { new: true }
    );

    const populatedReview = await Review.findById(review._id).populate('user', 'name email');

    res.status(201).json({
      message: 'Review added successfully!',
      review: populatedReview
    });
  } catch (error) {
    console.error('Create Review Error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// GET: All reviews for an item
exports.getReviews = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!itemId) return res.status(400).json({ error: 'Item ID is required.' });

    const reviews = await Review.find({ item: itemId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

    res.json({
      reviews,
      averageRating: parseFloat(averageRating)
    });
  } catch (error) {
    console.error('Get Reviews Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// NEW: Get all reviews with avg (for frontend optimization)
exports.getAllReviewsWithAvg = async (req, res) => {
  try {
    const reviews = await Review.find().select('item rating');
    const itemMap = {};

    reviews.forEach(r => {
      if (!itemMap[r.item]) {
        itemMap[r.item] = { sum: 0, count: 0 };
      }
      itemMap[r.item].sum += r.rating;
      itemMap[r.item].count += 1;
    });

    const result = Object.keys(itemMap).map(itemId => ({
      itemId,
      averageRating: parseFloat((itemMap[itemId].sum / itemMap[itemId].count).toFixed(1))
    }));

    res.json(result);
  } catch (error) {
    console.error('Get All Reviews Avg Error:', error);
    res.status(500).json({ error: error.message });
  }
};