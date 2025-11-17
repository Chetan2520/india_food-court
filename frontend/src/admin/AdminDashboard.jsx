import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit3, Plus, Search, LogOut, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;


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

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: '',
    discountPrice: '',
    description: '',
    rating: '',
    category: '',
    type: '',
    state: '', // New: State field
    bestChoice: false,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchItems(); // No token check, direct fetch
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/items`); // No auth header
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/admin'; // Simple redirect
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'image') {
          submitData.append(key, formData[key]);
        } else if (formData.image) {
          submitData.append(key, formData.image);
        }
      });

      if (editingItem) {
        await axios.put(`${API_URL}/items/${editingItem._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' } // No auth
        });
      } else {
        await axios.post(`${API_URL}/items`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' } // No auth
        });
      }
      fetchItems();
      closeModal();
    } catch (error) {
      console.error('Error saving item:', error);
      alert(error.response?.data?.message || 'Error saving item');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      originalPrice: item.originalPrice,
      discountPrice: item.discountPrice || '',
      description: item.description || '',
      rating: item.rating || '',
      category: item.category,
      type: item.type,
      state: item.state || '', // New: Pre-fill state
      bestChoice: item.bestChoice || false,
    });
    setImagePreview(item.image);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(`${API_URL}/items/${id}`); // No auth
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const openModal = () => {
    setEditingItem(null);
    setFormData({ 
      name: '', 
      originalPrice: '', 
      discountPrice: '', 
      description: '', 
      rating: '', 
      category: '', 
      type: '', 
      state: '', // New: Reset state
      bestChoice: false 
    });
    setImagePreview(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setImagePreview(null);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 flex items-center justify-center text-gray-900">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-xl border-b border-emerald-100 p-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white/70 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-lg backdrop-blur-sm"
            />
          </div>
          <button onClick={openModal} className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Add Item
          </button>
          <button onClick={handleLogout} className="text-gray-500 hover:text-emerald-600 transition-all duration-200 hover:scale-110">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <div key={item._id} className="group bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 p-6 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 transform hover:-translate-y-2 ">
              <div className="relative overflow-hidden rounded-2xl mb-4">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover  transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description || 'No description'}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-emerald-600 font-bold text-xl bg-emerald-50 px-3 py-1 rounded-full">₹{item.discountPrice || item.originalPrice}</span>
                <span className="text-gray-400 line-through text-sm">₹{item.originalPrice}</span>
              </div>
              <div className="text-xs text-gray-500 mb-6 flex flex-wrap items-center gap-2">
                <span className="bg-gray-100 px-2 py-1 rounded-lg">{item.category}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-lg">|{item.type}</span>
                {item.state && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">| {item.state}</span>} {/* New: Show state */}
                {item.bestChoice && (
                  <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    Best Choice
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleEdit(item)} className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-md font-semibold hover:from-emerald-600 hover:to-emerald-700 flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="flex-1 border border-gray-400 text-black py-3 rounded-md font-semibold  flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md border border-white/50 rounded-3xl p-8 max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Item Name *"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="px-5 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-lg backdrop-blur-sm"
                  required
                />
                <input
                  type="number"
                  name="originalPrice"
                  placeholder="Original Price *"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="px-5 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-lg backdrop-blur-sm"
                  required
                />
              </div>
              <input
                type="number"
                name="discountPrice"
                placeholder="Discount Price (Optional)"
                value={formData.discountPrice}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-lg backdrop-blur-sm"
              />
              <textarea
                name="description"
                placeholder="Description (Optional)"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-5 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none shadow-lg backdrop-blur-sm"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4"> {/* Adjusted grid for 3 fields */}
                <input
                  type="number"
                  name="rating"
                  placeholder="Rating (0-5, Optional)"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="px-5 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-lg backdrop-blur-sm"
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="px-5 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-lg backdrop-blur-sm"
                  required
                >
                  <option value="">Select Category *</option>
                  <option value="beverages">Beverages</option>
                  <option value="deserts">Deserts</option>
                  <option value="starters">Starters</option>
                  <option value="main-courses">Main Courses</option>
                </select>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="px-5 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-lg backdrop-blur-sm"
                  required
                >
                  <option value="">Select Type *</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
                {/* New: State select */}
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="px-5 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-lg backdrop-blur-sm col-span-2 md:col-span-1"
                >
                  <option value="">Select State (Optional)</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center space-x-3 text-gray-700 font-medium">
                <input
                  type="checkbox"
                  name="bestChoice"
                  checked={formData.bestChoice}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span>Mark as Best Choice?</span>
              </label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full px-5 py-4 bg-white/70 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-lg backdrop-blur-sm file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-emerald-500 file:to-emerald-600 file:text-white hover:file:from-emerald-600 hover:file:to-emerald-700"
                required={!editingItem}
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-2xl mt-4 border border-gray-200 shadow-lg" />
              )}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-white/70 border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {uploading ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}