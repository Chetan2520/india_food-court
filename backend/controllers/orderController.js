// backend/controllers/orderController.js (Updated: No auth required, use dummy userId)
const geolib = require('geolib');
const Shop = require('../models/Shop');
const Order = require('../models/Order');

// Helper: Get shop location
const getShopLocation = async () => {
  const shop = await Shop.findOne();
  if (!shop) throw new Error('Shop not found!');
  return { lat: shop.location.coordinates[1], lng: shop.location.coordinates[0] };
};

// Create Order with Inverted Location Validation (Allow only if >500m)
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, userLat, userLng } = req.body;
    // const userId = req.user.id; // Commented out for no-login mode
    const userId = 'anonymous_user'; // Dummy userId for testing

    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items required!' });
    }
    if (!totalAmount) {
      return res.status(400).json({ message: 'Total amount required!' });
    }
    if (!userLat || !userLng) {
      return res.status(400).json({ message: 'Location required!' });
    }

    // Distance Check (Inverted: Deny if <=500m)
    const shopLocation = await getShopLocation();
    const distance = geolib.getDistance(
      { latitude: userLat, longitude: userLng },
      { latitude: shopLocation.lat, longitude: shopLocation.lng }
    );

    if (distance <= 500) {
      return res.status(403).json({ 
        message: `You are only ${Math.round(distance)}m away! Must be more than 500m from the shop to order.` 
      });
    }

    // Prepare Items (Match Your Model)
    const orderItems = items.map(item => ({
      _id: item._id,
      name: item.name,
      price: item.discountPrice || item.originalPrice || 0,
      image: item.image,
      qty: item.qty || 1
    }));

    // Save Order
    const order = new Order({
      userId,
      items: orderItems,
      totalAmount
    });

    const savedOrder = await order.save();
    res.status(201).json({ 
      success: true,
      message: 'Order placed successfully!',
      orderId: savedOrder._id 
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder };