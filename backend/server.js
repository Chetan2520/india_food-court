// backend/server.js (Updated: Fixed shop coordinates insertion to [lng, lat] format)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const reviewRoutes = require('./routes/review');

dotenv.config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log('Cloudinary keys loaded:', !!process.env.CLOUDINARY_API_KEY ? 'Yes' : 'No');  // Debug log
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174',"https://india-food-court.vercel.app"],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Temp uploads folder

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    
    // Auto-insert Shop location (mongoose.connect success के बाद)
    const Shop = require('./models/Shop');  // Shop model import
    
    Shop.countDocuments().then(count => {
      if (count === 0) {
        new Shop({
          name: 'India Food Court Canteen',  // अपना name रखें
          location: {
            type: 'Point',
            coordinates: [75.90500545632862, 22.755048346589977]  // Fixed: [lng, lat] (Google Maps से)
          }
        }).save()
        .then(() => console.log('Shop location added successfully!'))
        .catch(err => console.error('Error adding shop:', err));
      } else {
        console.log('Shop already exists in DB.');
      }
    });
    
  })
  .catch(err => console.log(err));

// Routes 
app.use("/api/reviews", reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', require('./routes/orders')); // Orders route

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});