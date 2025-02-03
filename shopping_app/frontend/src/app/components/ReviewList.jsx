import React from 'react';
import { Star, Pencil, Trash2 } from 'lucide-react';
import ReviewActions from './ReviewActions';

const ReviewItem = ({ 
  review, 
  userId, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        {userId && review.viewer_id._id === userId && (
          <ReviewActions 
            onEdit={() => onEdit(review)}
            onDelete={() => onDelete(review)}
          />
        )}
      </div>
      <p className="text-gray-600 mb-2">{review.description}</p>
      <p className="text-sm text-gray-500">By {review.viewer_id.name}</p>
    </div>
  );
};

const ReviewList = ({ 
    reviews, 
    userId, 
    productName, 
    onEdit, 
    onDelete 
    }) => {
    if (reviews.length === 0) {
        return (
        <div className="text-center py-8">
            <p className="text-gray-600">
            {userId ? 
                "No reviews yet. Be the first one to review this product!" : 
                "No reviews yet. Please log in to add a review."}
            </p>
        </div>
        );
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {reviews.map((review, index) => (
        <ReviewItem
          key={index}
          review={review}
          userId={userId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ReviewList;