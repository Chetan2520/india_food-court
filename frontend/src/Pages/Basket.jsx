// Basket.js (Enhanced: Better location handling - persistent denial check, force fetch only once)
import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useQuantityUpdate } from '../hooks/useQuantityUpdate';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Basket({ isOpen, onClose }) {
  const { cart, getTotal, removeItem, clearCart } = useCart();
  const { increaseQty, decreaseQty } = useQuantityUpdate();
  const navigate = useNavigate();

  // Location states
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [locationDenied, setLocationDenied] = useState(false); // New: Track permanent denial
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const cartItems = cart;

  // Load location from localStorage on mount (if pre-fetched from hero)
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
    }
  }, []);

  // Get user location (with denial tracking)
  const getUserLocation = () => {
    if (locationDenied) {
      setLocationError('Location access permanently denied! Enable in browser settings to order.');
      return;
    }

    if (navigator.geolocation) {
      setIsCheckingLocation(true);
      setLocationError(''); // Clear previous errors
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setUserLocation(location);
          localStorage.setItem('userLocation', JSON.stringify(location)); // Save for persistence
          setLocationError('');
          setIsCheckingLocation(false);
          setLocationDenied(false);
        },
        (err) => {
          console.error('Geolocation error:', err);
          if (err.code === 1) { // PERMISSION_DENIED
            setLocationDenied(true);
            setLocationError('Location access denied! Please enable GPS in browser settings to place orders.');
          } else {
            setLocationError('Failed to get location. Please try again or enable GPS.');
          }
          setIsCheckingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setLocationError('Geolocation not supported by your browser!');
      setIsCheckingLocation(false);
    }
  };

  // Calculate distance (Haversine for client-side UX)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Handle Proceed: Strict checks
  const handleProceedToCheckout = async () => {
    // Check location first
    if (!userLocation) {
      getUserLocation();
      return;
    }

    if (locationDenied || locationError) {
      setLocationError('Cannot place order without location access. Please enable GPS.');
      return;
    }

    // Client-side distance check (Deny if <=500m)
    const shopLocation = { lat: 22.755048346589977, lng: 75.90500545632862 };
    const distance = calculateDistance(
      userLocation.lat, userLocation.lng,
      shopLocation.lat, shopLocation.lng
    );

    console.log('Calculated distance:', distance); // Debug log

    if (distance <= 500) {
      setLocationError(`You are only ${Math.round(distance)}m away from the shop! Orders are not allowed within 500m.`);
      return;
    }

    setIsPlacingOrder(true);
    setLocationError('');

    try {
      const response = await axios.post('http://localhost:5000/api/orders', {
        items: cartItems,
        totalAmount: getTotal(),
        userLat: userLocation.lat,
        userLng: userLocation.lng
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        clearCart();
        onClose();
        alert(`Order placed successfully! ID: ${response.data.orderId}`);
        navigate('/orders');
      }
    } catch (err) {
      let errorMsg = 'Error placing order! Please try again.';
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      setLocationError(errorMsg);
      console.error(err);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        {isOpen && <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose}></div>}
        <div className={`fixed top-0 right-0 h-screen w-full sm:w-96 md:w-[600px] bg-white z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out flex flex-col`}>
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-500">Your Cart</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-all duration-300">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-y-auto">
            <div className="mb-4 sm:mb-6">
              <ShoppingCart className="w-24 h-24 sm:w-32 sm:h-32 text-gray-300 mx-auto" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Your Cart is Empty</h3>
            <p className="text-gray-500 text-sm sm:text-base mb-6 px-4">Add some delicious food to get started!</p>
            <Link to="/" className="bg-emerald-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-emerald-600 transition shadow-lg" onClick={onClose}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 transition-opacity duration-300 bg-black/50" onClick={onClose}></div>}
      <div className={`fixed top-0 right-0 h-screen w-full sm:w-96 md:w-[600px] lg:w-[768px] xl:w-[800px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-500">Shopping Cart</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-all duration-300">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            {cartItems.map((item) => {
              const effectivePrice = item.discountPrice || item.originalPrice || 0;
              const safePrice = effectivePrice.toFixed(2);
              const itemTotal = (effectivePrice * (item.qty || 1)).toFixed(2);
              return (
                <div key={item._id} className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 border border-gray-200">
                  <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">₹{safePrice}</p>
                    <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-0">{item.description || 'No description'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
                      <button onClick={() => decreaseQty(item._id)} className="flex-1 sm:flex-none w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition text-gray-600 hover:text-gray-800">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-center font-bold text-lg text-gray-900 min-w-[2rem]">{item.qty || 1}</span>
                      <button onClick={() => increaseQty(item._id)} className="flex-1 sm:flex-none w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition text-gray-600 hover:text-gray-800">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item._id)} className="w-full sm:w-auto text-red-500 hover:text-red-700 font-semibold text-sm px-3 py-1 rounded-md hover:bg-red-50 transition">
                      Remove
                    </button>
                  </div>
                  <div className="text-right sm:text-left w-full sm:w-auto">
                    <p className="text-lg sm:text-xl font-bold text-emerald-600">₹{itemTotal}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error Display */}
          {locationError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mx-4 sm:mx-6 mb-4">
              <p className="text-red-600 text-sm font-medium">{locationError}</p>
              {!locationDenied && (
                <button
                  onClick={getUserLocation}
                  className="text-red-500 text-xs underline mt-1"
                >
                  Retry Location
                </button>
              )}
            </div>
          )}

          {/* Fixed Bottom Total Section */}
          <div className="flex-none bg-gradient-to-r from-gray-50 to-white rounded-b-xl shadow-inner p-4 sm:p-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg sm:text-xl font-semibold text-gray-900">Total: </span>
              <span className="text-2xl sm:text-3xl font-bold text-emerald-600">₹{getTotal().toFixed(2)}</span>
            </div>
            <button
              onClick={handleProceedToCheckout}
              disabled={!userLocation || isCheckingLocation || isPlacingOrder || locationDenied || locationError}
              className={`w-full ${
                !userLocation || isCheckingLocation || isPlacingOrder || locationDenied || locationError
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
              } text-white py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg text-center block transition-all duration-200 shadow-lg hover:shadow-xl`}
            >
              {isPlacingOrder ? 'Placing Order...' : isCheckingLocation ? 'Checking Location...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}