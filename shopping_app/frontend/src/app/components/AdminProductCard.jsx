
import { Edit2 } from "lucide-react";
import { Trash2 } from "lucide-react";
import { 
    Card, 
    CardHeader,
    CardContent 
  } from '@/components/ui/card';


export const AdminProductCard = ({ product, handleEditProduct, handleDeleteProduct }) => 

{
  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount / 100)).toFixed(2);
  };

    
    return (
    <Card className="overflow-hidden">
        <CardHeader className="p-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <div className="flex gap-2">
                <button 
                    onClick={() => handleEditProduct(product)}
                    className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                >
                    <Edit2 className="h-5 w-5" />
                        </button>
                <button 
                    onClick={() => handleDeleteProduct(product._id)}
                    className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    >
                    <Trash2 className="h-5 w-5" />
                        </button>
                  </div>
                </div>
              </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center space-x-4">
          <img
            src={product.imageUrl || '/api/placeholder/80/80'}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex items-center justify-end w-full">
            <div className="space-y-2">
              {product.discount > 0 ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ${calculateDiscountedPrice(product.price, product.discount)}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                      {product.discount}% OFF
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              )}
      
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )};