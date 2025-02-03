import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const ReviewActions = ({ onEdit, onDelete }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onEdit}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <Pencil className="h-4 w-4 text-gray-500" />
      </button>
      <button
        onClick={onDelete}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
    </div>
  );
};

export default ReviewActions;
