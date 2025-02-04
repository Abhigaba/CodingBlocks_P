import React from 'react';

export const SizeSelector = ({ 
  sizes, 
  selectedSize, 
  onSizeSelect 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Size</h3>
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className={`py-2 rounded-md transition-colors ${
              selectedSize === size
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            US {size}
          </button>
        ))}
      </div>
    </div>
  );
};
