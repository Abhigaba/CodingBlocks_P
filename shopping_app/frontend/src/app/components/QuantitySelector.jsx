import React from 'react';
import { Plus, Minus } from 'lucide-react';



export const QuantitySelector = ({ 
  quantity, 
  onIncrease, 
  onDecrease 
}) => {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onDecrease}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="text-lg font-medium">{quantity}</span>
      <button
        onClick={onIncrease}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};