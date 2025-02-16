"use client"

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  MapPin, 
  ShoppingBag, 
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { useCartContext } from '../contexts/useCartContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { useAuthContext } from '../contexts/useAuthContext';

const CheckoutPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { cart } = useCartContext();
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    console.log(cart)
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
        await axios.post('http://localhost:3000/order/place', {})
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for shopping with us.",
      });
      router.push('/order-confirmation');
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [subtotal, setSubtotal] = useState(0);
  const calculateItemPrice = (price, discount) => {
    return discount > 0 ? price * (1 - discount / 100) : price;
  };
    useEffect(() => {
  
      setSubtotal(cart.reduce((sum, item) => 
      sum + calculateItemPrice(item.product_id.price, item.product_id.discount) * item.quantity, 0))} 
   , [cart])

  return (
    <>    
    <Navbar></Navbar>
    <div className="min-h-screen bg-gray-200 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <MapPin className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-semibold ml-2">Shipping Details</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md
                    text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    transition-colors duration-200 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Place Order
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <ShoppingBag className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-semibold ml-2">Order Summary</h2>
              </div>

              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <img
                        src={item.product_id.imageUrl}
                        alt={item.name}
                        className="h-12 w-12 object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.product_id.name || 'Product Name'}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity || 1}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${item.product_id.price || '99.99'}</p>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>$12.99</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>${(subtotal * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span>${(subtotal + 12.99  + subtotal*0.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>

  );
};


const page = () => {
        const router = useRouter();
        const {info} = useAuthContext()

        const [shouldRedirect, setShouldRedirect] = useState(false)

        useEffect(() => {
          if (!info._id) {
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

  return (
    <><CheckoutPage /></>
  )
}

export default page