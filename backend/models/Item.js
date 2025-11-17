// models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  originalPrice: { type: Number, required: true },
  discountPrice: Number,
  category: { type: String, required: true },
  type: { type: String, enum: ['veg', 'non-veg'], required: true },
  state: String,
  bestChoice: { type: Boolean, default: false },

  // ADD THESE FIELDS
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

module.exports = mongoose.model('Item', itemSchema);