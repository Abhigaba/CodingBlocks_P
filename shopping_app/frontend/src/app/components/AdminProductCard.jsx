import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Trash2 } from "lucide-react";
import { 
    Card, 
    CardHeader,
    CardContent 
  } from '@/components/ui/card';


export const AdminProductCard = ({ product, handleEditProduct, handleDeleteProduct }) => (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleEditProduct(product)} className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100">
            <Edit2 className="h-5 w-5" />
          </button>
          <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between space-x-4">
          <img src={product.imageUrl || "/api/placeholder/80/80"} alt={product.name} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
          <div className="flex justify-end items-center space-y-2">
            <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );