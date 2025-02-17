"use client"
import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useProductContext } from './contexts/useProductConext';
import { LoadingScreen } from './components/LoadinScreen';
import { ProductCard } from './components/ProductCard';
import {LazyImage} from "./components/LazyImage";
import {Footer} from  "./components/Footer";
import { Navbar } from './components/Navbar';
import { useRouter } from 'next/navigation';


const Home = () => {
  
  const { products, loading, error, hasMore, loadMore, refetchProducts } = useProductContext();
  const featuredProducts = products.slice(0, 4);
  const router = useRouter();
  useEffect(() => {
    refetchProducts()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button 
            onClick={refetchProducts}
            className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!products.length && loading) {
    return <LoadingScreen />;
  }

  return (
    <>
    <Navbar /> 
    <div className="min-h-screen bg-gray-50 ">
     
      <div className="relative  overflow-hidden pt-14">
        <div className="bg-gradient-to-r from-black/30 to-black/30">
          <LazyImage
            src="https://images-static.nykaa.com/uploads/f5492274-ab48-4185-9f3f-af55125012b1.jpg?tr=w-1800,cm-pad_resize"
            alt="Hero"
            className="w-full h-full border  object-cover"
          />
        </div>


        <div className={`  
          flex flex-col items-center justify-center 
          px-4 md:px-8  mt-10
        
        `}>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 text-black">
              Summer Collection 2025
            </h1>
            <p className="text-lg md:text-xl mb-6 md:mb-8 text-black/90">
              Step into style with our exclusive range
            </p>
            <button className="
              bg-black text-white 
              px-6 py-2 md:px-8 md:py-3 
              rounded-full font-semibold 
              flex items-center gap-2 
              hover:bg-gray-500 transition-colors
              mx-auto
            "
             onClick={() => {router.push('/Catalog')}}>
              Explore Now <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className='flex  justify-center items-center gap-2'>
        <LazyImage
          src={`https://images-static.nykaa.com/uploads/891808e6-ec5d-4983-9494-4f5bb6b07e3d.jpg?tr=w-450,cm-pad_resize`}
          alt = 'Men'
          className='w0full h-full object-cover'></LazyImage>
        <LazyImage
            src={`https://images-static.nykaa.com/uploads/23eb2ecb-aa41-46e0-b988-940882d324c7.jpg?tr=w-450,cm-pad_resize`}
            alt = 'Women'
            className='w0full h-full object-cover'></LazyImage>
        <LazyImage
            src={`https://images-static.nykaa.com/uploads/1836be5b-25ff-4050-b74b-44ee5afafac1.jpg?tr=w-450,cm-pad_resize`}
            alt = 'Kids'
            className='w0full h-full object-cover'></LazyImage>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">New Arrivals</h2>
          <button 
            onClick={() => router.push('/Catalog')}
            className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array(4).fill(null).map((_, index) => (
              <LoadingCard key={index} />
            ))
          ) : (
            featuredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))
          )}
        </div>
      </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Home;