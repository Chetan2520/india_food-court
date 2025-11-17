// src/components/CartPage.jsx
import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useQuantityUpdate } from '../hooks/useQuantityUpdate';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, getTotal, removeItem } = useCart();
  const { increaseQty, decreaseQty } = useQuantityUpdate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <Link to="/menu" className="bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-600 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center md:items-start gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">₹{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">{item.qty}</span>
                  <button
                    onClick={() => increaseQty(item._id)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 hover:text-red-700 font-semibold text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="text-right md:text-left">
                <p className="text-lg font-bold text-emerald-600">₹{(item.price * item.qty).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 mt-8 sticky bottom-0">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total: </span>
            <span className="text-2xl font-bold text-emerald-600">₹{getTotal().toFixed(2)}</span>
          </div>
          <Link
            to="/place-order"
            className="w-full bg-emerald-500 text-white py-3 rounded-full font-semibold text-center block hover:bg-emerald-600 transition shadow-lg"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;