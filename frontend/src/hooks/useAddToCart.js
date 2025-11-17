// src/hooks/useAddToCart.js
import { useCart } from '../contexts/CartContext';

export const useAddToCart = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    // Assume item has _id, name, price, image
    const cartItem = {
      _id: item._id,
      name: item.name,
      price: item.discountPrice || item.originalPrice || item.price, // Flexible pricing
      image: item.image
    };
    addToCart(cartItem);
  };

  return { handleAddToCart };
};