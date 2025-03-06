"use client"
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuthContext } from '../contexts/useAuthContext';
import axios from 'axios';
import { AdminSidebar } from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminMain from '../components/AdminMain';

const DashboardContext = () => {
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
    discount: '', // Regular discount
    inSale: false,
    sale_discount: '', // Sale discount
    imageUrl: '',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchProducts = async () => {
    try {
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

  const handleSaleToggle = (checked) => {
    setFormData(prev => ({
      ...prev,
      inSale: checked,
      // Reset sale discount if sale is turned off
      sale_discount: checked ? prev.sale_discount : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingProduct 
        ? `http://localhost:3000/product/update/${editingProduct._id}`
        : 'http://localhost:3000/product/add';
  
      if (editingProduct){
        const response = await axios.patch(url, 
          {
            ...formData,
            owner_id : info._id,
            price: parseFloat(formData.price),
            discount: parseFloat(formData.discount) || 0,
            sale_discount: formData.inSale ? parseFloat(formData.sale_discount) : 0
          }, 
          {withCredentials: true})

        await fetchProducts();
        
        setIsModalOpen(false);
        setEditingProduct(null);
      } else {
        const res = await axios.post(url,{
          ...formData,
          owner_id: info._id,
          price: parseFloat(formData.price),
          discount: parseFloat(formData.discount) || 0,
          sale_discount: formData.inSale ? parseFloat(formData.sale_discount) : 0
        }, {withCredentials: true})

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

  // When editing a product, set the initial form data
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        brand: editingProduct.brand,
        price: editingProduct.price.toString(),
        discount: editingProduct.discount > 0 ? editingProduct.discount.toString() : '',
        inSale: editingProduct.sale_discount > 0,
        sale_discount: editingProduct.sale_discount > 0 ? editingProduct.sale_discount.toString() : '',
        imageUrl: editingProduct.imageUrl,
        description: editingProduct.description
      });
    } else {
      // Reset form when not editing
      setFormData({
        name: '',
        brand: '',
        price: '',
        discount: '',
        inSale: false,
        sale_discount: '',
        imageUrl: '',
        description: ''
      });
    }
  }, [editingProduct]);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader toggleSidebar={toggleSidebar}></AdminHeader>
      <div className="flex">
        <AdminSidebar sidebarOpen={sidebarOpen} ></AdminSidebar>
        <main className="flex-1 p-6">
          <AdminMain 
            setEditingProduct={setEditingProduct} 
            products={products}
            setIsModalOpen={setIsModalOpen}
            setFormData={setFormData} 
            setProducts={setProducts}
            fetchProducts={fetchProducts}>
          </AdminMain>
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
                  <Label htmlFor="discount">Regular Discount (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="Regular Discount"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  id="inSale"
                  checked={formData.inSale}
                  onCheckedChange={handleSaleToggle}
                />
                <Label htmlFor="inSale">Include in Sale</Label>
              </div>
              <div>
                <Label htmlFor="sale_discount">Sale Discount (%)</Label>
                <Input
                  id="sale_discount"
                  name="sale_discount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.sale_discount}
                  onChange={handleInputChange}
                  disabled={!formData.inSale}
                  placeholder={!formData.inSale ? 'Sale not enabled' : 'Enter sale discount'}
                />
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

const Page = () => {
  const router = useRouter();
  const {info} = useAuthContext()

  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    if (!info._id) {
      setShouldRedirect(true)
    }
    else if(info.isAdmin === 'client'){
      setShouldRedirect(true)
    }
  }, [info?._id])

  useEffect(() => {
    if (shouldRedirect) {
      router.replace('./')
    }
  }, [shouldRedirect, router])

  if (!info._id) {
    return null
  }

  return <DashboardContext />
};
export default Page;