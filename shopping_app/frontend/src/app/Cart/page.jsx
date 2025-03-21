"use client"
import React, {useEffect, useState} from 'react';
import { useCartContext } from '../contexts/useCartContext';
import { ShoppingBag } from 'lucide-react';
import {CartItemCard} from '../components/CartItemCard';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../contexts/useAuthContext';
import axios from 'axios';

const CartContent = () => {

  const {info} = useAuthContext()

  const { cart, setCart} = useCartContext()
  const {deleteFromCart} = useCartContext()
  
  useEffect(() => {
    const getCart = async () => {
    const res = await axios.get(`http://localhost:3000/cart/fetch/${info._id}`);
    setCart(res.data.data);
    }
    if(Object.keys(cart).length > 0 ) {
    
      return}
    
    getCart()
    ;
  }, [cart])

  const removeItem = (id) => {
    deleteFromCart(id);   };

  const router = useRouter()
  

  if (!info._id) {
    router.replace('/');
  }

  const calculateItemPrice = (price, discount) => {
    return discount > 0 ? price * (1 - discount / 100) : price;
  };
  
  const [subtotal, setSubtotal] = useState(0);
  const shipping = 12.99;

  useEffect(() => {
    setSubtotal(cart.products.reduce((sum, item) => 
    sum + calculateItemPrice(item.product_id.price, (item.product_id.on_sale ? item.product_id.sale_discount : item.product_id.discount)) * item.quantity, 0))} 
 , [cart])

  const handleCheckout = async () => {
    router.push('/Checkout')
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0 flex items-center">
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {cart.products.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
            </div>
            
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
                <ShoppingBag className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
              <button onClick={() => router.push('/')} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          // Filled Cart State
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
                </div>
                <ul className="divide-y divide-gray-200">
                  {cart.products.map((item, index) => (
                    <CartItemCard item={item} sale = {cart.sale} removeItem={removeItem} key={index}></CartItemCard>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow sticky top-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                </div>
                <div className="px-6 py-4">
                  <dl className="space-y-4">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Subtotal</dt>
                      <dd className="text-gray-900">${subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Shipping</dt>
                      <dd className="text-gray-900">${shipping.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Tax</dt>
                      <dd className="text-gray-900">${(subtotal * 0.08).toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between border-t pt-4">
                      <dt className="text-lg font-medium text-gray-900">Total</dt>
                      <dd className="text-lg font-medium text-gray-900">${(subtotal + shipping  + subtotal*0.08).toFixed(2)}</dd>
                    </div>
                  </dl>
                  <button onClick={() => handleCheckout()} className="mt-6 w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors">
                    <ShoppingBag size={20} />
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const Page = () => {

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

  return <CartContent />
};

export default Page;