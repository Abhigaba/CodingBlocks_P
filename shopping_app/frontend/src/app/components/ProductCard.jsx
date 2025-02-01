import {LazyImage} from "./LazyImage"
import { ShoppingBag,  Heart } from 'lucide-react';


export const ProductCard = ({ product }) => {
  const calculateDiscountedPrice = (originalPrice, discount) => {
    if (!discount) return originalPrice;
    return originalPrice - (originalPrice * (discount / 100));
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative group">
        <LazyImage
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        {product.discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md">
            -{product.discount}%
          </div>
        )}
        <div className="absolute top-4 right-4">
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 bg-white text-black px-6 py-2 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <div className="flex items-center gap-2">
          {product.discount > 0 ? (
            <>
              <span className="text-xl font-bold text-red-600">
                ${calculateDiscountedPrice(product.price, product.discount).toFixed(2)}
              </span>
              <span className="text-gray-500 line-through text-sm">
                ${product.originalPrice}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold">
              ${product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
