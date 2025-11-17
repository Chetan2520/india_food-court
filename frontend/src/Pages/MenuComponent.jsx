import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { Star, Search, ShoppingCart, Package } from 'lucide-react';
import ReviewModal from '../Components/ReviewModal';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

export default function MenuComponent() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('both');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [animateItemId, setAnimateItemId] = useState(null);

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const { addToCart } = useCart();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [itemsRes, reviewsRes] = await Promise.all([
        axios.get(`${API_URL}/items`),
        axios.get(`${API_URL}/reviews`)
      ]);

      const reviewMap = {};
      reviewsRes.data.forEach(r => {
        reviewMap[r.itemId] = r.averageRating;
      });

      const itemsWithRatings = itemsRes.data.map(item => ({
        ...item,
        averageRating: reviewMap[item._id] || 0
      }));

      setItems(itemsWithRatings);
      const uniqueCategories = [...new Set(itemsWithRatings.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const searchMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const typeFilterMatch = selectedFilter === 'both' || item.type === selectedFilter;
    const categoryFilterMatch = selectedCategory === 'all' || item.category === selectedCategory;
    return searchMatch && typeFilterMatch && categoryFilterMatch;
  });

  const handleAddToCartClick = (item) => {
    setAnimateItemId(item._id);
    addToCart(item);
    setTimeout(() => setAnimateItemId(null), 1500);
  };

  const handleReviewClick = (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to review.');
      return;
    }
    setSelectedItemId(itemId);
    setShowReviewModal(true);
  };

  const handleModalClose = () => {
    setShowReviewModal(false);
    setSelectedItemId(null);
    fetchItems();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading menu...</div>
      </div>
    );
  }

  return (
    <div id='get-started'>
      <style>{`
        @keyframes cart {
          0% { left: -10%; }
          40%, 60% { left: 50%; }
          100% { left: 110%; }
        }
        @keyframes box {
          0%, 40% { top: -20%; }
          60% { top: 40%; left: 52%; }
          100% { top: 40%; left: 112%; }
        }
        .cart-button.animate .cart-icon { animation: cart 1.5s ease-in-out forwards; }
        .cart-button.animate .box-icon { animation: box 1.5s ease-in-out forwards; }
        .cart-button span.add-to-cart { opacity: 1; }
        .cart-button span.added { opacity: 0; }
        .cart-button.animate span.add-to-cart { opacity: 0; }
        .cart-button.animate span.added { opacity: 0; }
      `}</style>

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-emerald-500 mb-4">Our Menu</h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
              Explore our wide selection of delicious dishes.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-2 sm:gap-3">
                {[
                  { value: 'both', label: 'Both' },
                  { value: 'veg', label: 'Veg' },
                  { value: 'non-veg', label: 'Non-Veg' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedFilter(value)}
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium transition-all duration-300 ${
                      selectedFilter === value ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-8">
            <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === cat ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-2 gap-3 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const isAnimating = animateItemId === item._id;
              const displayPrice = Number(item.discountPrice || item.originalPrice || 0);
              const hasDiscount = item.discountPrice && item.originalPrice > item.discountPrice;
              const rating = item.averageRating || item.rating || 0;
              const fullStars = Math.floor(rating);

              return (
                <div key={item._id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative h-40 lg:h-58 bg-gray-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                    />
                  </div>
                  <div className="p-2 lg:p-5">
                    <div className="flex justify-between items-start mb-1 lg:mb-2">
                      <h3 className="text-sm lg:text-xl font-bold text-gray-900 flex-1">{item.name}</h3>
                      {item.bestChoice && (
                        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                        <Star className="w-3 h-3 fill-current" /> Best Choice
                                                      </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-xs lg:text-sm mb-1 lg:mb-3 line-clamp-2">{item.description || ''}</p>

                    {/* Clickable Stars */}
                    <div className="flex items-center gap-1.5 mb-1 lg:mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleReviewClick(item._id)}
                            className="p-0.5 hover:scale-125 transition-transform duration-200"
                            title="Click any star to review"
                          >
                            <Star
                              className={`w-3 h-3 lg:w-4 cursor-pointer lg:h-4 ${i < fullStars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-gray-600 font-semibold text-sm ml-2">{rating}</span>
                    </div>

                    <div className="flex gap-4 items-center mb-2 lg:mb-4">
                      <span className="text-lg lg:text-2xl font-bold text-emerald-500">₹{displayPrice.toFixed(2)}</span>
                      {hasDiscount && <span className="text-gray-400 line-through text-sm">₹{Number(item.originalPrice || 0).toFixed(2)}</span>}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      className={`cart-button relative w-full h-10 border-0 rounded-xl bg-[#10b981] hover:bg-[#059669] outline-none cursor-pointer text-white transition-all duration-300 ease-in-out overflow-hidden active:scale-[0.9] mb-4 ${isAnimating ? 'animate' : ''}`}
                      onClick={() => handleAddToCartClick(item)}
                    >
                      <div className="cart-icon absolute z-[2] top-1/2 left-[-10%] text-[1.5em] -translate-x-1/2 -translate-y-1/2 text-white">
                        <ShoppingCart size={24} />
                      </div>
                      <div className="box-icon absolute z-[3] top-[-37%] left-[52%] text-[1em] -translate-x-1/2 -translate-y-1/2 text-white">
                        <Package size={16} />
                      </div>
                      <span className="add-to-cart absolute z-[3] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-white">Add to cart</span>
                      <span className="added absolute z-[3] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-white">Added</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No items found.</p>
            </div>
          )}
        </div>

        {/* Review Modal */}
        <ReviewModal
          isOpen={showReviewModal}
          onClose={handleModalClose}
          itemId={selectedItemId}
          onReviewAdded={fetchItems}
        />
      </div>
    </div>
  );
}