import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const ReviewModal = React.memo(({ 
  isOpen, 
  onOpenChange, 
  isEditing, 
  productName, 
  initialReview, 
  onSubmit 
}) => {
  const [rating, setRating] = useState(initialReview?.rating || 5);
  const [description, setDescription] = useState(initialReview?.description || '');

  useEffect(() => {
    if (isOpen) {
      setRating(initialReview?.rating || 5);
      setDescription(initialReview?.description || '');
    }
  }, [isOpen, initialReview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, description });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Edit Review' : `Write a Review for ${productName}`}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-2xl ${
                    rating >= star ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description</label>
            <textarea
              className="w-full border rounded p-2"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update Review' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ReviewModal;
