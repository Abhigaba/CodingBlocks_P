"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProductContext } from '@/app/contexts/useProductConext';
import { useCartContext } from '@/app/contexts/useCartContext';
import { useAuthContext } from '@/app/contexts/useAuthContext';
import { SizeSelector } from '@/app/components/SizeSelector';
import { QuantitySelector } from '@/app/components/QuantitySelector';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/app/components/Navbar';
import ProductReviews from '@/app/components/ProductReview';
import { Footer } from '@/app/components/Footer';
const ProductDetails = () => {

  const {addToCart} = useCartContext()

  const { id } = useParams();
  const { info } = useAuthContext();
  const { products } = useProductContext();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const product = products.find(p => p._id === id);
  const sizes = [7, 8, 9, 10, 11, 12];

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };

  if (!product) return null;

  return (
    <>
    <Navbar></Navbar>
    <div className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    
        <div className="relative group">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full rounded-lg shadow-lg transform transition-transform duration-300 group-hover:scale-105"
          />
          {product.discount > 0 && (
            <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full animate-bounce">
              {product.discount}% OFF
            </div>
          )}
        </div>

        <div className="space-y-6 py-16">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-indigo-600">
              ${calculateDiscountedPrice(product.price, product.discount).toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="text-lg text-gray-500 line-through">${product.price}</span>
            )}
          </div>
          <p className="text-gray-600">{product.description}</p>

          {/* Size Selection */}
          <SizeSelector sizes={sizes}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
          ></SizeSelector>

          {/* Quantity */}
                <QuantitySelector
                  quantity={quantity}
                  onDecrease={() => setQuantity(quantity - 1)}
                  onIncrease={() => setQuantity(quantity + 1)}
                ></QuantitySelector>

          <Button 
            className="w-full"
            disabled={!selectedSize || !info._id}
            onClick= {() => addToCart(product, quantity)}
          >
            Add to Cart
          </Button>
        </div>
      </div>

        <ProductReviews productId={product._id}
        productName={product.name}
        userId={info._id} ></ProductReviews>
      </div>
      <Footer></Footer>
    </>
  );
};

export default ProductDetails;