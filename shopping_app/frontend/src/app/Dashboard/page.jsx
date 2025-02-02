"use client"

import React, { useState, useEffect } from 'react';
import { Search, Plus,  Settings,  Menu } from 'lucide-react';
import { AdminProductCard } from '../components/AdminProductCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthContext } from '../contexts/useAuthContext';
import axios from 'axios';
import { AdminSidebar } from '../components/AdminSidebar';

const Page = () => {
  const {info} = useAuthContext()
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    discount: '',
    imageUrl: '',
    description: ''
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchProducts = async () => {
    try {
        console.log(info)
      const response = await axios.get(`http://localhost:3000/product/admin/fetch/${info._id}`, { withCredentials: true });
    console.log(response.data.data)
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      const response = await axios.delete(`http://localhost:3000/api/products/delete/${productId}`, 
        { withCredentials: true }
      );
      
      if (!response.ok) throw new Error('Failed to delete product');
      
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    return (price - (price * discount / 100)).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingProduct 
        ? `http://localhost:3000/product/update/${editingProduct._id}`
        : 'http://localhost:3000/product/add';

      const method = editingProduct ? 'PUT' : 'POST';
      
      if (editingProduct){
      const response = await axios.patch(url, 
        {
          ...formData,
          owner_id : info._id,
          price: parseFloat(formData.price),
          discount: parseFloat(formData.discount)
        }, 
        {withCredentials: true})

      await fetchProducts();
      
      setIsModalOpen(false);
      setEditingProduct(null);}
    else {
        const res = await axios.post(url,{
            ...formData,
            owner_id: info._id,
            price: parseFloat(formData.price),
            discount: parseFloat(formData.discount)
          } , {withCredentials: true})

          await fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    

    return (
      <>
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
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
    {/* Header */}
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center ml-4">
            <svg viewBox="0 0 100 100" className="h-8 w-8">
              <path
                d="M20,80 Q30,95 50,80 Q70,95 80,80 Q90,65 80,50 Q70,35 50,50 Q30,35 20,50 Q10,65 20,80"
                fill="#4F46E5"
                className="drop-shadow-md"
              />
              <path
                d="M30,70 Q50,85 70,70"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
            </svg>
            <span className="ml-2 text-xl font-bold text-gray-900">SoleStyle</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Settings className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </header>

    <div className="flex">
        <AdminSidebar sidebarOpen={sidebarOpen} ></AdminSidebar>


        <main className="flex-1 p-6">
          {renderContent()}
        </main>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;