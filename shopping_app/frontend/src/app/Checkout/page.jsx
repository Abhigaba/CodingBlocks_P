"use client"

import React, { useState, useEffect } from 'react';
import { useCartContext } from '../contexts/useCartContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { useAuthContext } from '../contexts/useAuthContext';
import { MapPin, ShoppingBag, Tag, X, ChevronRight } from 'lucide-react';

import axios from 'axios';

const CheckoutPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { cart, setCart } = useCartContext();
  const { info } = useAuthContext();
  
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      const orderResponse = await axios.post('http://localhost:3000/order/place', {
        amount: calculateTotal().toFixed(0) * 100, // Convert to paise for Razorpay
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        products: cart.products.map(item => ({
          productId: item.product_id._id,
          quantity: item.quantity,
        }))
      }, {withCredentials: true});

      console.log(orderResponse)
      const { order, key } = orderResponse.data;

      // Initialize Razorpay payment
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Solestyle',
        description: `Order #${order.receipt}`,
        order_id: order.id,
        prefill: {
          name: formData.fullName,
          email: info.email,
          contact: formData.phone
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}`
        },
        theme: {
          color: '#3399cc'
        },
        handler: async function(response) {
          try {
            const verifyResponse = await axios.post('http://localhost:3000/order/verify-payment', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderDetails: {
                userId: info._id,
                
                items: cart.products.map(item => ({
                  product_id: item.product_id._id,
                  price: calculateItemPrice(item.product_id.price, (cart.sale ? item.product_id.sale_discount : item.product_id.discount)),
                  quantity: item.quantity,
                })),
                
                total: calculateTotal().toFixed(2),
                
                paymentInfo: {
                  id: response.razorpay_payment_id,
                  status: 'completed'
                }
              },
            }, {withCredentials : true});
            
            if (verifyResponse.data.success) {
              // Clear cart on successful payment
              setCart({ products: [] });
              
              // Navigate to success page with order details
              router.push('/Order');
              
              toast({
                title: "Order Placed Successfully!",
                description: "Thank you for shopping with us.",
              });

            } else {
              
              toast({
                title: "Payment Failed",
                description: verifyResponse.data.message || "Payment verification failed",
                variant: "destructive"
              });
            }
          } catch (error) {
            router.push('/order-failure');
            
            toast({
              title: "Payment Error",
              description: error.response?.data?.message || "Something went wrong with the payment",
              variant: "destructive"
            });
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
            toast({
              title: "Payment Cancelled",
              description: "You have cancelled the payment process",
              variant: "destructive"
            });
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code.",
        variant: "destructive"
      });
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const discountProducts = cart.products.map((item) => {
        return {product_id: item.product_id._id, quantity: item.quantity}
      });

      const response = await axios.post(`/api/apply-coupon`, {
        code: couponCode,
        products: discountProducts
      }, {withCredentials: true});
      
      setAppliedCoupon({code: couponCode, discountedAmount: response.data.discountedAmount});
      toast({
        title: "Coupon Applied!",
        description: `${response.data.discountedAmount}% discount has been applied to your order.`,
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to validate coupon. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed from your order.",
    });
  };

  const [subtotal, setSubtotal] = useState(0);
  
  const calculateItemPrice = (price, discount) => {
    return discount > 0 ? price * (1 - discount / 100) : price;
  };
  
  useEffect(() => {
    if (cart.products && cart.products.length > 0) {
      setSubtotal(cart.products.reduce((sum, item) => 
        sum + calculateItemPrice(item.product_id.price, (cart.sale ? item.product_id.sale_discount : item.product_id.discount)) * item.quantity, 0));
    }
  }, [cart]);

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    return (subtotal * appliedCoupon.discountedAmount / 100);
  };

  const calculateTotal = () => {
    const shipping = 12.99;
    const tax = subtotal * 0.08;
    const discount = calculateDiscount();
    return subtotal + shipping + tax - discount;
  };

  // Add a script loader for Razorpay
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>    
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
                  disabled={isSubmitting || !cart.products || cart.products.length === 0}
                  className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md
                    text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    transition-colors duration-200 ${isSubmitting || !cart.products || cart.products.length === 0 ? 'opacity-75 cursor-not-allowed' : ''}`}
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

              {/* Coupon Code Section */}
              <div className="mb-6 border-b pb-6">
                <div className="flex items-center mb-3">
                  <Tag className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-lg font-medium ml-2">Discount Coupon</h3>
                </div>
                
                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center justify-between">
                    <div>
                      <span className="text-green-800 font-medium">{appliedCoupon.code}</span>
                      <p className="text-sm text-green-600">
                        {appliedCoupon.discountedAmount}% discount applied
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-gray-500 hover:text-gray-700"
                      type="button"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={handleCouponChange}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={isValidatingCoupon}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      type="button"
                    >
                      {isValidatingCoupon ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {cart.products && cart.products.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <img
                        src={item.product_id.imageUrl}
                        alt={item.product_id.name}
                        className="h-12 w-12 object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.product_id.name || 'Product Name'}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity || 1}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(calculateItemPrice(item.product_id.price, (cart.sale ? item.product_id.sale_discount : item.product_id.discount)) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({appliedCoupon.discountedAmount}%)</span>
                      <span>-${calculateDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  
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
                    <span>${calculateTotal().toFixed(2)}</span>
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

const Page = () => {
  const router = useRouter();
  const { info } = useAuthContext();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!info || !info._id) {
      setShouldRedirect(true);
    }
  }, [info]);

  useEffect(() => {
    if (shouldRedirect) {
      router.replace('/Login');
    }
  }, [shouldRedirect, router]);

  if (shouldRedirect) {
    return null;
  }

  return (
    <>
      <Navbar />
      <CheckoutPage />
    </>
  );
};

export default Page;