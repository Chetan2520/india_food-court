// src/pages/PlaceOrder.jsx
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useQuantityUpdate } from '../hooks/useQuantityUpdate';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlaceOrder = () => {
  const { cart, getTotal, clearCart } = useCart();
  const { increaseQty, decreaseQty } = useQuantityUpdate();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const orderData = {
        userId: 'user_from_token', // Extract from JWT in real app
        items: cart.map(item => ({ ...item, qty: item.qty })),
        totalAmount: getTotal()
      };

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const orderId = response.data.orderId;
      clearCart();
      navigate(`/order-status/${orderId}`);
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Place Order</h1>
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500 ml-2">x{item.qty}</span>
                </div>
                <span>₹{(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-lg font-semibold">Total: </span>
            <span className="text-2xl font-bold text-emerald-600">₹{getTotal().toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={loading || cart.length === 0}
          className="w-full bg-emerald-500 text-white py-4 rounded-full font-semibold text-lg hover:bg-emerald-600 transition shadow-lg disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;