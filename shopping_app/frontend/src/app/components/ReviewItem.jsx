import { Star, Pencil, Trash2 } from 'lucide-react';
import ReviewActions from './ReviewActions';
export const ReviewItem = ({ 
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

