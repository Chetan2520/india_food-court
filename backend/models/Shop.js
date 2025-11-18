// backend/models/Shop.js (New File - GeoJSON Format for Location)
const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'My Canteen'
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: {
      type: [Number],  // [lng, lat] format (e.g., [77.2090, 28.6139])
      required: true
    }
  }
}, {
  timestamps: true
});

// 2D Index for Geo Queries (Optional, but good for future)
shopSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shop', shopSchema);