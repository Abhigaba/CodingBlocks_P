"use client"
import { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext({
  products: [],
  loading: false,
  error: null,
  hasMore: true,
  loadMore: () => {},
  setProducts: () => {},
  refetchProducts: () => {}
});

export const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (pageNumber = 1, isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3000/product/fetch?page=${pageNumber}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      
      // Assuming backend sends both products and a total count or hasMore flag
      const newProducts = data.products;
      const hasMoreProducts = data.hasMore || newProducts.length === 10;

      setProducts(prev => isLoadMore ? [...prev, ...newProducts] : newProducts);
      setHasMore(hasMoreProducts);
      setPage(pageNumber);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching  Home:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to load more products
  const loadMore = async () => {
    if (!loading && hasMore) {
      await fetchProducts(page + 1, true);
    }
  };

  // Function to reset and refetch from first page
  const refetchProducts = () => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1, false);
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchProducts(1, false);
  }, []);

  const value = {
    products,
    loading,
    error,
    hasMore,
    loadMore,
    setProducts,
    refetchProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  
  if (!context) {
    throw new Error('useProductContext must be used within a ProductContextProvider');
  }
  
  return context;
};

export default ProductContext;