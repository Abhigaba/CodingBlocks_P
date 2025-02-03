import React, {useState} from 'react'
import { AdminProductCard } from './AdminProductCard'
import { Plus } from 'lucide-react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import { VisuallyHidden } from '@/components/ui/visually-hidden';


const LoadingModal = ({ isOpen }) => {
  return (
    <Dialog open={isOpen}>
    <DialogContent className="sm:max-w-md flex items-center justify-center">
      <VisuallyHidden>
        <DialogTitle>Deleting Product</DialogTitle>
      </VisuallyHidden>
      <div className="flex flex-col items-center p-6 space-y-4">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-500">Deleting product...</p>
      </div>
    </DialogContent>
  </Dialog>
  );
};
const AdminMain = ({products, setProducts, setFormData, setEditingProduct, setIsModalOpen, fetchProducts}) => {

    const [loading, setloading] = useState(false)
    const handleAddProduct = () => {
        setEditingProduct(null);
        setFormData({
          name: '',
          brand: '',
          price: '',
          discount: '',
          imageUrl: '',
          description: ''
        });
        setIsModalOpen(true);
      };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setFormData({
          name: product.name,
          brand: product.brand,
          price: product.price,
          discount: product.discount,
          imageUrl: product.imageUrl,
          description: product.description
        });
        setIsModalOpen(true);
      };
        

    const handleDeleteProduct = async (productId) => {

        try {
          setloading(true)
          const response = await axios.delete(`http://localhost:3000/product/delete/${productId}`, 
            { withCredentials: true }
          );
          
          await fetchProducts();
          setloading(false)
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      };
  return (
    <>

    <LoadingModal isOpen={loading} />
    <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
    <button
      onClick={handleAddProduct}
      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
    >
      <Plus className="h-5 w-5 mr-2" />
      Add Product
    </button>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((product, index) => (
      <AdminProductCard key={index} 
      product={product} 
      handleEditProduct={handleEditProduct} 
      handleDeleteProduct={handleDeleteProduct}></AdminProductCard>
    ))}
  </div>
  </>
  )
}

export default AdminMain