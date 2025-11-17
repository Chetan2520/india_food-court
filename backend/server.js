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
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes 
app.use("/api/reviews", reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});