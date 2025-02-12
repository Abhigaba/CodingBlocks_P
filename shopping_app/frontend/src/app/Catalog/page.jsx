"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ProductCard } from '../components/ProductCard';
import { 
  Search, 
  SlidersHorizontal, 
  Loader2, 
  X, 
  ChevronDown,
  Check,
  Banknote,
  Tags,
  BadgeCheck
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Navbar } from '../components/Navbar';

const FilterSection = ({ filters, setFilters, brands, onClearFilters }) => {
    const handleClearFilters = () => {
      setFilters({
        search: '',
        brand: 'all',
        priceRange: [0, 1000],
        sort: 'newest'
      });
      onClearFilters?.();
    };
  
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleClearFilters}
            className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200"
          >
            Clear all
          </Button>
        </div>
  
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="brands">
              <AccordionTrigger className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                <BadgeCheck className="w-4 h-4" />
                Brands
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {brands.map(brand => (
                    <div
                      key={brand}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors duration-200"
                      onClick={() => setFilters({ ...filters, brand })}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-200
                        ${filters.brand === brand ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}
                      >
                        {filters.brand === brand && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm text-gray-700">
                        {brand === 'all' ? 'All Brands' : brand}
                      </span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
  
            <AccordionItem value="price">
              <AccordionTrigger className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                <Banknote className="w-4 h-4" />
                Price Range
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      ${filters.priceRange[0]}
                    </span>
                    <span className="text-sm text-gray-600">
                      ${filters.priceRange[1]}
                    </span>
                  </div>
                  <Slider
                    defaultValue={filters.priceRange}
                    max={1000}
                    min={0}
                    step={10}
                    onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                    className="mt-2"
                  />
                  <div className="flex gap-2 mt-4">
                    {[100, 200, 500].map((price) => (
                      <Badge 
                        key={price}
                        variant="outline"
                        className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                        onClick={() => setFilters({ 
                          ...filters, 
                          priceRange: [0, price] 
                        })}
                      >
                        Under ${price}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
  
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Tags className="w-4 h-4" />
              Sort By
            </p>
            <Select
              value={filters.sort}
              onValueChange={(value) => setFilters({ ...filters, sort: value })}
            >
              <SelectTrigger className="w-full border-gray-300 hover:border-indigo-600 transition-colors duration-200">
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
  
        {Object.values(filters).some(value => 
          value !== 'all' && 
          value !== '' && 
          (Array.isArray(value) ? value[0] !== 0 || value[1] !== 1000 : true)
        ) && (
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {filters.brand !== 'all' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.brand}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => setFilters({ ...filters, brand: 'all' })}
                  />
                </Badge>
              )}
              {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => setFilters({ ...filters, priceRange: [0, 1000] })}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    brand: 'all',
    priceRange: [0, 1000],
    sort: 'newest'
  });

  const observer = useRef();
  const lastProductRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3000/product/fetch?page=${page}&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      
      setProducts(prevProducts => {
        const newProducts = [...prevProducts, ...data.products];
        return newProducts;
      });
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const brands = ['all', ...new Set(products.map(product => product.brand))];

  const applyFilters = useCallback(() => {
    let result = [...products];

    if (filters.search) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.brand.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.brand !== 'all') {
      result = result.filter(product => product.brand === filters.brand);
    }

    result = result.filter(product => {
      const finalPrice = product.discount 
        ? product.price - (product.price * (product.discount / 100))
        : product.price;
      return finalPrice >= filters.priceRange[0] && finalPrice <= filters.priceRange[1];
    });

    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, filters]);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    applyFilters();
  }, [products, filters, applyFilters]);

  return (
    <>
    <Navbar />  
    <div className="pt-16"> {/* Add padding-top to account for fixed navbar */}
        <div className="bg-gradient-to-r from-indigo-400 to-indigo-500 relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <div className="container mx-auto px-4 relative">
            <div className="flex items-center justify-center py-1 md:py-1">
              <div className="text-center">
                <span className="text-white font-medium text-sm md:text-base lg:text-lg">
                  ✨ New Styles on Sale — Up to 40% off
                </span>

              </div>
            </div>
          </div>
        </div>
        </div>
        <div className="container mx-auto px-4">
        <div className="sticky top-16 bg-white/80 backdrop-blur-sm z-40 py-4 ">
          <div className="flex justify-end lg:hidden"> {/* Changed to justify-end and removed flex-col and other classes */}
            <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="hover:text-indigo-600 hover:border-indigo-600 transition-colors duration-200"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-gray-900">Filters</SheetTitle>
                </SheetHeader>
                <FilterSection 
                  filters={filters} 
                  setFilters={setFilters} 
                  brands={brands}
                  onClearFilters={() => setIsMobileFilterOpen(false)} 
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

      <div className="flex gap-8">
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-32 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <FilterSection filters={filters} setFilters={setFilters} brands={brands} />
          </div>
        </div>

        <div className="flex-1">
          {error && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-red-600">Error loading products</h3>
              <p className="text-gray-700 mt-2">{error}</p>
              <Button 
                onClick={() => fetchProducts()} 
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200"
              >
                Try Again
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <div
                key={product._id}
                ref={index === filteredProducts.length - 1 ? lastProductRef : null}
                className="transform transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="h-full ">
                  <ProductCard 
                    product={product} 
                    className="h-full max-w-xs mx-auto"
                  />
                </div>
              </div>
            ))}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center w-full py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
              <p className="text-gray-700 mt-2">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </>

  );
};


const Page = () => {

  return (
    <ProductCatalog />
  )
}


export default Page;