"use client"
import { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp, Loader2, LogIn } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from '../contexts/useAuthContext';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Navbar } from '../components/Navbar';

const OrderStatus = ({ status }) => {
  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

const OrderCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <Package className="h-6 w-6 text-indigo-600" />
          <div>
            <p className="font-medium text-gray-900">Order #{order.orderId}</p>
            <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <OrderStatus status={order.status} />
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="mt-4 space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image || "/api/placeholder/80/80"} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="font-medium text-gray-900">${order.subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-sm text-gray-500">Shipping</p>
                <p className="font-medium text-gray-900">${order.shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="font-medium text-indigo-600">${order.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
              <p className="text-sm text-gray-500">{order.shippingAddress.street}</p>
              <p className="text-sm text-gray-500">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { toast } = useToast();
  const { info } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        toast({
          description: 'Error fetching orders. Please try again later.',
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (info?._id) {
      fetchOrders();
    } else {
      setShowLoginModal(true);
      setIsLoading(false);
    }
  }, [info?._id, toast]);

  const handleLogin = () => {
    router.push('/Login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
    <Navbar></Navbar>
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              Please log in to view your order history and track your purchases.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <LogIn className="h-12 w-12 text-indigo-600" />
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              variant="default"
              onClick={handleLogin}
              className="w-full sm:w-auto"
            >
              Log in to continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {info?._id && (
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <OrderStatus status="All Orders" />
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="mt-1 text-sm text-gray-500">Start shopping to create your first order.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.orderId} order={order} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default Page;