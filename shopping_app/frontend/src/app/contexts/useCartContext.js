"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from './useAuthContext';
import axios from 'axios'

const cartContext = createContext({
    cart: [],
    setCart: () => {},
    updateQuantity: () => {},
    addToCart: () => {},
    deleteFromCart: () => {},
    calculateTotals : () => {},
})

export const CartProvider = ({children}) => {

    const {info} = useAuthContext()
    const[cart, setCart] = useState([]) 
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        console.log(info)
      if (info._id){
        fetchCartItems(info._id)}
    }, [info._id])

    const fetchCartItems = async (id) => {
        try {
          setLoading(true);

          const response = await axios.get(`http://localhost:3000/cart/fetch/${id}`);
          setCart(response.data.data);
          console.log(!response)
          if (!response) { 
            throw new Error(response)
          }
          setLoading(false);            
        } catch (error) {
                console.log(error)
        } 
      };


      const addToCart = async (product, quantity = 1) => {
        try {
          setLoading(true);
          const existingItemIndex = cart.products.findIndex(
            item => item.product_id._id === product._id
          );
      
          if (existingItemIndex >= 0) { 
            updateQuantity(cart.products[existingItemIndex]._id, 1);
          }
          else {
            const response = await axios.post(`http://localhost:3000/cart/add`, {
              user_id: info._id,
              product_id: product._id,
              quantity: parseInt(quantity)
            },{ withCredentials: true });
            
            const item = {
                _id : response.data.data._id, 
                product_id : {
                    _id : product.id,
                    name : product.name , 
                    imageUrl : product.imageUrl,
                    price: product.price ,
                    discount : product.discount,
                    brand: product.brand
                },
                quantity : 1 
            }
            console.log(item)
            setCart(prevItems => [...prevItems, item]);
            toast.success('Added to cart');}
            

        } catch (error) {
          console.error('Cart operation error:', error);
          toast.error(error.response?.data?.message || 'Failed to update cart');
        } finally {
          setLoading(false);
        }
      };


    const updateQuantity = async (id, newQuantity) => {
        try {

            const res = await axios.patch(`http://localhost:3000/cart/update/${id}`, 
                { quantity: newQuantity }, 
                { withCredentials: true } // Ensures cookies are sent
              );

              setCart(prev => ({
                ...prev,
                products: prev.products.map(item =>
                  item._id === id
                    ? { ...item, quantity: newQuantity }
                    : item
                )
              }));
          toast.success('Cart updated');
          console.log(res)
          
        } catch (error) {
          toast.error('Failed to update quantity');
        } 
      };
    
      // Remove from cart
      const deleteFromCart = async (productId) => {
        try {
          setLoading(true);
          await axios.delete(`http://localhost:3000/cart/delete/${productId}`,{withCredentials:true});
    
          setCart(prev => 
            prev.filter(item => item._id !== productId)
          );
          toast.success('Item removed from cart');
        } catch (error) {
          toast.error('Failed to remove item');
        } finally {
          setLoading(false);
        }
      };
    

      const calculateTotals = () => {
        const subtotal = cart.reduce((sum, item) => 
          sum + (item.price * (1 - item.discount / 100)) * item.quantity, 0
        );
        const shipping = cart.length > 0 ? 5.99 : 0;
        const total = subtotal + shipping;
    
        return { subtotal, shipping, total };
      };
    

    const value = {
        cart,
        setCart, 
        updateQuantity,
        addToCart,
        calculateTotals,
        deleteFromCart,
        loading,
        setLoading,
    }


    return (
        <cartContext.Provider value={value}>
            {children}
        </cartContext.Provider>
    )
} 

export const useCartContext = () => {
    return useContext(cartContext)
}