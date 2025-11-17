// src/hooks/useQuantityUpdate.js
import { useCart } from '../contexts/CartContext';

export const useQuantityUpdate = () => {
  const { updateQty, removeItem, cart } = useCart();

  const increaseQty = (id) => {
    const item = cart.find(item => item._id === id);
    if (item) {
      updateQty(id, item.qty + 1);
    }
  };

  const decreaseQty = (id) => {
    const item = cart.find(item => item._id === id);
    if (item && item.qty > 1) {
      updateQty(id, item.qty - 1);
    } else if (item) {
      removeItem(id);
    }
  };

  return { increaseQty, decreaseQty };
};