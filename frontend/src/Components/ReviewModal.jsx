// File: src/Components/ReviewModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { X, Star } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const ReviewModal = ({ isOpen, onClose, itemId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
    setError('');
  };

 // src/Components/ReviewModal.jsx → handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  if (rating === 0 || !comment.trim()) {
    setError('Please select a rating and enter a comment.');
    return;
  }

  setSubmitting(true);
  setError('');

  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Please login to submit a review.');

    const response = await axios.post(
      `${API_URL}/api/reviews/${itemId}`,
      { rating, comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 201) {
      alert('Review submitted successfully!');
      setRating(0);
      setComment('');
      onReviewAdded(); // This will refresh items
      onClose();
    }
  } catch (err) {
    setError(err.response?.data?.error || err.message || 'Something went wrong.');
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Rating Stars */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                >
                  <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">Select your rating (1-5 stars)</p>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this item..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={submitting || rating === 0 || !comment.trim()}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;