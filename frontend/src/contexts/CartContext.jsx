// src/contexts/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.find(item => item._id === action.payload._id);
      if (existingItem) {
        return state.map(item =>
          item._id === action.payload._id
            ? { ...item, qty: item.qty + action.payload.qty }
            : item
        );
      }
      return [...state, action.payload];
    case 'UPDATE_QTY':
      return state.map(item =>
        item._id === action.payload._id
          ? { ...item, qty: action.payload.qty }
          : item
      ).filter(item => item.qty > 0); // Remove if qty === 0
    case 'REMOVE_ITEM':
      return state.filter(item => item._id !== action.payload._id);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, undefined, () => {
    // Load from localStorage on init
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Save to localStorage on change
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...item, qty: 1 } });
  };

  const updateQty = (id, qty) => {
    dispatch({ type: 'UPDATE_QTY', payload: { _id: id, qty } });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { _id: id } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const effectivePrice = item.discountPrice || item.originalPrice || 0;
      return total + (effectivePrice * item.qty);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.qty, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQty,
      removeItem,
      clearCart,
      getTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};