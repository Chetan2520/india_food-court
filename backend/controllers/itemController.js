const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Item = require('../models/Item');
const fs = require('fs'); // For deleting temp files

// Multer setup (shared)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// GET all items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single item
const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST new item
const createItem = [
  upload.single('image'), 
  async (req, res) => {
    try {
      console.log('Request body fields:', req.body);  // Debug: All fields check
      console.log('Image file:', req.file ? req.file.filename : 'Missing!');  // Debug

      if (!req.file) {
        return res.status(400).json({ message: 'Image required' });
      }

      // Required fields validation
      const { name, originalPrice, category, type, bestChoice } = req.body;
      if (!name || !originalPrice || !category || !type || bestChoice === undefined) {
        return res.status(400).json({ message: 'Missing required fields: name, originalPrice, category, type, bestChoice' });
      }

      // Optional fields
      const discountPrice = req.body.discountPrice ? parseFloat(req.body.discountPrice) : undefined;
      const description = req.body.description ? req.body.description.trim() : undefined;
      const rating = req.body.rating ? parseFloat(req.body.rating) : 0;
      const state = req.body.state ? req.body.state.trim() : undefined; // New: Handle state (optional)

      // Cloudinary upload
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'restaurant_items' });
      console.log('Upload success URL:', result.secure_url);  // Debug

      // Safe temp file delete
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      const item = new Item({
        name: name.trim(),
        originalPrice: parseFloat(originalPrice),
        discountPrice,
        description,
        rating,
        image: result.secure_url,
        category,
        type,
        bestChoice: bestChoice === 'true' || bestChoice === true, // Handle string from form
        state // New: Include state if provided
      });

      const savedItem = await item.save();
      console.log('Item saved ID:', savedItem._id);  // Debug
      res.status(201).json(savedItem);
    } catch (error) {
      console.error('Create item full error:', error.stack);  // Detailed log
      // Clean up temp file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ message: error.message });
    }
  }
];

// PUT update item
const updateItem = [upload.single('image'), async (req, res) => {
  try {
    console.log('Update Request body fields:', req.body);  // Debug: All fields check
    console.log('Update Image file:', req.file ? req.file.filename : 'No new file (using old)');  // Debug

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update required/optional fields if provided
    if (req.body.name) item.name = req.body.name.trim();
    if (req.body.originalPrice) item.originalPrice = parseFloat(req.body.originalPrice);
    if (req.body.discountPrice !== undefined) item.discountPrice = parseFloat(req.body.discountPrice) || undefined;
    if (req.body.description) item.description = req.body.description.trim();
    if (req.body.rating !== undefined) item.rating = parseFloat(req.body.rating) || 0;
    if (req.body.category) item.category = req.body.category;
    if (req.body.type) item.type = req.body.type;
    if (req.body.bestChoice !== undefined) item.bestChoice = req.body.bestChoice === 'true' || req.body.bestChoice === true;
    if (req.body.state !== undefined) item.state = req.body.state ? req.body.state.trim() : undefined; // New: Handle state update

    // If new image provided, upload and update
    if (req.file) {
      console.log('Updating image...');  // Debug

      // Delete old image from Cloudinary
      const publicIdMatch = item.image.match(/restaurant_items\/([^\/]+)\.\w+$/);
      if (publicIdMatch && publicIdMatch[1]) {
        await cloudinary.uploader.destroy(publicIdMatch[1]);
        console.log('Old image deleted from Cloudinary:', publicIdMatch[1]);  // Debug
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'restaurant_items' });
      console.log('New upload success URL:', result.secure_url);  // Debug

      // Safe temp file delete
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      item.image = result.secure_url;
    }

    const updatedItem = await item.save();
    console.log('Item updated ID:', updatedItem._id);  // Debug
    res.json(updatedItem);
  } catch (error) {
    console.error('Update item full error:', error.stack);  // Detailed log
    // Clean up temp file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
}];

// DELETE item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete image from Cloudinary
    const publicIdMatch = item.image.match(/restaurant_items\/([^\/]+)\.\w+$/);
    if (publicIdMatch && publicIdMatch[1]) {
      await cloudinary.uploader.destroy(publicIdMatch[1]);
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
};