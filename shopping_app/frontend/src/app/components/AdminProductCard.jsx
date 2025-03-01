import React, { useState } from 'react';
import { Edit2, Trash2, ShoppingBag } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

export const AdminProductCard = ({ 
  product, 
  handleEditProduct, 
  handleDeleteProduct,
}) => {

  const [showStockModal, setShowStockModal] = useState(false);
  const [newStockStatus, setNewStockStatus] = useState(product.in_stock);
  const { toast } = useToast();


  const handleUpdateStockStatus = async (product_id, newStockStatus) => {
      try {
          await axios.patch(`http://localhost:3000/product/update/stock/${product_id}?in_stock=${newStockStatus}`, {},{withCredentials: true});
          return true;
        }
      catch(error) {
        console.log(error.message);
        return false
      }


  }

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount / 100)).toFixed(2);
  };

  const handleStockToggle = () => {
    setShowStockModal(true);
  };

  const confirmStockUpdate = async () => {

    const change  = await handleUpdateStockStatus(product._id, newStockStatus);
    setShowStockModal(false);  
    if(change){
      setNewStockStatus(!newStockStatus);
      toast({
        title: "Success",
        description : "Item Stock successfully Updated",
        variant: "success"
      })
    }
    else {
      cancelStockUpdate();
      toast({ 
        title: "Error",
        description : "Item Stock Update Failed",
        variant: "destructive"
      })
    }
  };

  const cancelStockUpdate = () => {
    setShowStockModal(false);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${newStockStatus ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                {newStockStatus ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
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
            <div className="flex flex-col justify-between h-full w-full">
              <div className="flex items-center justify-end">
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
              <div className="mt-4 flex items-center">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Stock Status:</span>
                </div>
                <Switch 
                  className="ml-2" 
                  checked={newStockStatus}
                  onCheckedChange={() => handleStockToggle()}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showStockModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Stock Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark "{product.name}" as {newStockStatus ? 'in stock' : 'out of stock'}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelStockUpdate}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStockUpdate}
              className={newStockStatus ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};