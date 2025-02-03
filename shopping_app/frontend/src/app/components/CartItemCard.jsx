import React, {useState} from 'react'
import { motion } from 'framer-motion'
import { LazyImage } from '../components/LazyImage';
import { Plus, Minus, X, ShoppingBag } from 'lucide-react';
import { useCartContext } from '../contexts/useCartContext';


export const CartItemCard = ({item, index}) => {

        const [counter, setcounter] = useState(item.quantity);

      const { 
        updateQuantity, 
        deleteFromCart
    
      } = useCartContext();
    
    
      const removeItem = (id) => {
        deleteFromCart(id);
      }
    
      const updateQuant = (id, quant) => {

            updateQuantity(id , quant + counter)
            console.log(id, quant)
            console.log(item)
            setcounter(counter + quant)
      } 

      const calculateDiscountedPrice = (originalPrice, discount) => {
        if (!discount) return originalPrice;
        return originalPrice - (originalPrice * (discount / 100));
      };
      
  return (
    <>
      <motion.li
                key={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6"
              >
                <div className="flex items-center">
                  <LazyImage
                    src={item.product_id.imageUrl}
                    alt={item.product_id.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="ml-6 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{item.product_id.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{item.product_id.brand}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQuant(item._id, -1)}
                          className="p-2 hover:bg-gray-50"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2">{counter}</span>
                        <button
                          onClick={() => updateQuant(item._id, 1)}
                          className="p-2 hover:bg-gray-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-right">
                        {item.product_id.discount > 0 ? (
                          <>
                            <p className="text-sm line-through text-gray-500">
                              ${item.product_id.price.toFixed(2)}
                            </p>
                            <p className="text-lg font-medium text-red-600">
                              ${calculateDiscountedPrice(item.product_id.price, item.product_id.discount).toFixed(2)}
                            </p>
                            <p className="text-sm text-red-600">-{item.product_id.discount}% OFF</p>
                          </>
                        ) : (
                          <p className="text-lg font-medium text-gray-900">
                            ${item.product_id.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li></>
  )
}

