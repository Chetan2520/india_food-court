import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ArrowLeft, Star, ShoppingCart, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import ReviewModal from '../Components/ReviewModal';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

export default function Explore() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState(null);
  const [stateSearchQuery, setStateSearchQuery] = useState('');
  const [itemSearchQuery, setItemSearchQuery] = useState('');

  // NEW: Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // NEW: Cart states
  const [animateItemId, setAnimateItemId] = useState(null);
  const { addToCart } = useCart();

  const indianStates = ['Madhya Pradesh', 'Maharashtra','Punjab','Uttar Pradesh','Bihar','Goa', 'Gujarat', 'Haryana','Rajasthan',
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',  'Chhattisgarh',
     'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala',  'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 
     'Sikkim', 'Tamil Nadu', 'Telangana', 
    
  ];

  const stateImages = {
    'Andhra Pradesh': '/states_img/andhrap.png',
    'Arunachal Pradesh': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'Assam': 'https://media.istockphoto.com/id/1310708373/photo/assam-laksa-is-a-special-malaysian-popular-food.webp?a=1&b=1&s=612x612&w=0&k=20&c=-cdZ4myftdLy-nBZVZHGh9DPFMKFNPmbj5rG_ncY_hE=',
    'Bihar': 'https://media.istockphoto.com/id/2222352974/photo/traditional-indian-bihari-dish-litti-chokha-served-on-a-plate-popular-spicy-and-healthy.webp?a=1&b=1&s=612x612&w=0&k=20&c=zu2v5CMTR15NLTZIdWp0NYPjdlJQ8Gl9ar7pAhqYUs4=',
    'Chhattisgarh': 'https://media.istockphoto.com/id/1436785340/photo/food-traditional-indian-gujarati-dish-surti-undhiyu-its-a-mixed-vegetable-dish-cooked-with.webp?a=1&b=1&s=612x612&w=0&k=20&c=MH8ghtFGedmhw52_XAnf-uPBrwHJv93QtsbEm0jgkmw=',
    'Goa': 'https://images.unsplash.com/photo-1761314036698-a7a6e8514905?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8RmlzaCUyMEN1cnJ5JTIwUmljZXxlbnwwfHwwfHx8MA%3D%3D',
    'Gujarat': 'https://media.istockphoto.com/id/1307786779/photo/khaman-dhokla.webp?a=1&b=1&s=612x612&w=0&k=20&c=cmcQ4PMdPZvttrwDAgzfkrSZyfm50iilbWU5XYcOeEU=',
    'Haryana': 'https://media.istockphoto.com/id/974889766/photo/kadhi-pakoda-or-pakora-indian-cuisine-selective-focus.webp?a=1&b=1&s=612x612&w=0&k=20&c=k8shb0kxxbeqM9AfL9M7qRub-SjS6YqmJC86Ef53jqM=',
    'Himachal Pradesh': 'https://media.istockphoto.com/id/1413558009/photo/himachal-pradesh-special-dish-siddu-its-a-steamed-wheat-flour-bread-stuffed-with-split-black.webp?a=1&b=1&s=612x612&w=0&k=20&c=J18eVupHKsFlK0di5EiRnNaD8awPeISAvwHrlxBqrdM=',
    'Jharkhand': 'https://media.istockphoto.com/id/1301621469/photo/til-pitha-a-traditional-food-of-assam-isolated-stock-image.webp?a=1&b=1&s=612x612&w=0&k=20&c=Gf35lhjfPNPpprJgAzDD0-kjRZS8ojyE3J8evOoVz4c=',
    'Karnataka': '/states_img/karnataka.jpg',
    'Kerala': '/states_img/kerala.webp',
    'Madhya Pradesh': '/states_img/mp.webp',
    'Maharashtra': '/states_img/maharastra.avif',
    'Manipur': '/states_img/manipur.webp',
    'Meghalaya': '/states_img/meghalaya.avif',
    'Mizoram': '/states_img/mijoram.avif',
    'Nagaland': '/states_img/nagaland.avif',
    'Odisha': '/states_img/odisa.jpg',
    'Punjab': '/states_img/punjab.jpg',
    'Rajasthan': '/states_img/rajasthan.jpg',
    'Sikkim': '/states_img/sikkim.avif',
    'Tamil Nadu': '/states_img/tamilnadu.jpg',
    'Telangana': '/states_img/hederabad.avif',
    'Uttar Pradesh': '/states_img/up.avif',
    
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // src/pages/Explore.jsx (only fetchItems part)
const fetchItems = async () => {
  try {
    setLoading(true);
    const [itemsRes, reviewsRes] = await Promise.all([
      axios.get(`${API_URL}/api/items`),
      axios.get(`${API_URL}/api/reviews`)
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
  } catch (error) {
    console.error('Error fetching items:', error);
  } finally {
    setLoading(false);
  }
};

  const filteredStates = indianStates.filter(state =>
    state.toLowerCase().includes(stateSearchQuery.toLowerCase())
  );

  const filteredItems = selectedState
    ? items.filter(item => item.state === selectedState && item.name.toLowerCase().includes(itemSearchQuery.toLowerCase()))
    : [];

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setItemSearchQuery('');
  };

  const handleBackToStates = () => {
    setSelectedState(null);
    setStateSearchQuery('');
  };

  // NEW: Handle review click
  const handleReviewClick = (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to review.');
      return;
    }
    setSelectedItemId(itemId);
    setShowReviewModal(true);
  };

  // NEW: Handle add to cart click
  const handleAddToCartClick = (item) => {
    setAnimateItemId(item._id);
    addToCart(item);
    setTimeout(() => setAnimateItemId(null), 1500);
  };

  const handleModalClose = () => {
    setShowReviewModal(false);
    setSelectedItemId(null);
    fetchItems(); // Refresh
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading famous dishes...</div>
      </div>
    );
  }

  return (
    <>
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
          {selectedState ? (
            // State-specific Items View - UPDATED
            <>
              <div className="flex items-center justify-between gap-4 mb-8">
                <button
                  onClick={handleBackToStates}
                  className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to States
                </button>
                <h1 className="text-3xl font-bold text-emerald-600">
                  Famous Dishes from {selectedState}
                </h1>
              </div>

              {/* Item Search - unchanged */}
              <div className="mb-8">
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search dishes in this state..."
                    value={itemSearchQuery}
                    onChange={(e) => setItemSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map((item) => {
                    const rating = item.averageRating || item.rating || 0; // UPDATED
                    const isAnimating = animateItemId === item._id;
                    return (
                      <div key={item._id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                        <div className="relative overflow-hidden rounded-xl mb-4">
                          <img src={item.image} alt={item.name} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description || 'A famous dish from ' + selectedState}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-emerald-600 font-bold text-xl bg-emerald-50 px-3 py-1 rounded-full">
                            ₹{item.discountPrice || item.originalPrice}
                          </span>
                          {item.discountPrice && (
                            <span className="text-gray-400 line-through text-sm">₹{item.originalPrice}</span>
                          )}
                        </div>
                        <div className="mb-4">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded-lg">{item.category}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded-lg">{item.type}</span>
                            {item.bestChoice && (
                              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" /> Best Choice
                              </span>
                            )}
                          </div>
                        </div>
                        {/* NEW: Add to Cart Button */}
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
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-sm font-medium text-blue-600">From {selectedState}</span>
                          {rating > 0 && (
                            <span className="text-sm text-yellow-600 font-semibold">★ {rating}</span> // UPDATED
                          )}
                          {/* NEW: Write Review Button */}
                          <button
                            onClick={() => handleReviewClick(item._id)}
                            className="text-sm text-emerald-600 hover:underline"
                          >
                            Write Review
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg mb-4">No famous dishes yet for {selectedState}</p>
                  <p className="text-sm text-gray-400">Add some via Admin Dashboard!</p>
                </div>
              )}
            </>
          ) : (
            // States Grid View - unchanged
            <>
              <div className="mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-emerald-500 mb-3">
                  Explore Regions
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                  Find the best food from different states of India.
                </p>
              </div>

              <div className="mb-10">
                <div className="relative max-w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for a state..."
                    value={stateSearchQuery}
                    onChange={(e) => setStateSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredStates.map((state) => {
                  const dishCount = items.filter(item => item.state === state).length;
                  return (
                    <button
                      key={state}
                      onClick={() => handleStateSelect(state)}
                      className=" w-40 h-32 lg:w-58 lg:h-40 rounded-2xl  shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-3 group border border-gray-100 hover:border-emerald-200 cursor-pointer relative overflow-hidden"
                    >
                      <div className="relative w-40 h-32 lg:w-58 lg:h-40 rounded-md overflow-hidden group-hover:ring-2 group-hover:ring-emerald-200 transition-all duration-300 bg-emerald-50 group-hover:bg-emerald-100">
                        <img
                          src={stateImages[state]}
                          alt={`${state} landmark`}
                          className="w-full h-full object-cover absolute inset-0"
                          onError={(e) => {
                            e.target.src = '' + state.charAt(0);
                          }}
                        />
                        {/* Black overlay */}
                        {/* <div className="absolute inset-0 bg-black/40" /> */}
                        {/* Text overlay at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1">
                          <h3 className="text-white text-center text-sm lg:text-base font-bold bg-black/80 px-5 py-1 rounded-t">
                            {state}
                          </h3>
                        </div>
                        {/* Notification badge at top right */}
                        {dishCount > 0 && (
                          <div className="absolute top-2 right-2 bg-[#00bc7d] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                            {dishCount}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {filteredStates.length === 0 && stateSearchQuery !== '' && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No states found matching "{stateSearchQuery}"</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* NEW: Review Modal */}
        <ReviewModal
          isOpen={showReviewModal}
          onClose={handleModalClose}
          itemId={selectedItemId}
          onReviewAdded={fetchItems}
        />
      </div>
    </>
  );
}