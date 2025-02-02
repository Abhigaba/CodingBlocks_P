"use client"

import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Package, Settings, Users, LogOut, Menu } from 'lucide-react';
import { 
  Card, 
  CardHeader,
  CardContent 
} from '@/components/ui/card';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([
    { id: 1, name: 'Running Shoes X1', price: 129.99, stock: 45, image: '/api/placeholder/80/80' },
    { id: 2, name: 'Sport Sneakers Pro', price: 159.99, stock: 32, image: '/api/placeholder/80/80' },
    { id: 3, name: 'Casual Comfort Elite', price: 89.99, stock: 58, image: '/api/placeholder/80/80' },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-sm transition-all duration-300 h-[calc(100vh-64px)]`}>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center p-3 text-indigo-600 bg-indigo-50 rounded-lg">
                  <Package className="h-6 w-6" />
                  {sidebarOpen && <span className="ml-3">Products</span>}
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Users className="h-6 w-6" />
                  {sidebarOpen && <span className="ml-3">Customers</span>}
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <Settings className="h-6 w-6" />
                  {sidebarOpen && <span className="ml-3">Settings</span>}
                </a>
              </li>
              <li className="mt-auto">
                <a href="#" className="flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <LogOut className="h-6 w-6" />
                  {sidebarOpen && <span className="ml-3">Logout</span>}
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100">
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">${product.price}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stock} units</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;