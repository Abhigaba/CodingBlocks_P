"use client"
import { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  LogOut, 
  ShoppingCart, 
  Heart, 
  LayoutDashboard, 
  Menu, 
  X,
  LogIn,
  MoreVertical,
  User,
  Package
} from 'lucide-react';
import { useAuthContext } from '../contexts/useAuthContext';
import { useToast } from "@/hooks/use-toast"
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import { useCartContext } from '../contexts/useCartContext';

export const Navbar = () => {
  const { toast } = useToast()
  const router = useRouter()
  const {info, setinfo} = useAuthContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [wishlistCount] = useState(2);
  const dropdownRef = useRef(null);
  const observerRef = useRef(null);
  const {cart} = useCartContext();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 1.0 }
    );

    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '20px';
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    sentinel.style.pointerEvents = 'none';
    document.body.appendChild(sentinel);

    observer.observe(sentinel);
    observerRef.current = { observer, sentinel };
    
    return () => {
      if (observerRef.current) {
        observerRef.current.observer.disconnect();
        observerRef.current.sentinel.remove();
      }
    };
  }, []);

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!info?._id) {
      toast({
        description : 'Please login to view your cart', 
        variant: "destructive"
      });
      return;
    }
    router.push('/Cart');
  };

  const handleLogout = async () => {
    await fetch('http://localhost:3000/auth/logout');
    setinfo({name: "", email: "", isAdmin:false});
    setIsDropdownOpen(false);
  };

  const NavLink = ({ href, icon: Icon, label, count, onClick }) => (
    <Link
      href={href}
      className="flex items-center px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200
                 lg:px-3 group relative"
      onClick={onClick}
    >
      <Icon className="h-5 w-5 lg:mr-2 shrink-0" />
      <span className="ml-3 lg:ml-0">{label}</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
      <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-indigo-600 transform origin-left scale-x-0 
                     transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );

  const DropdownItem = ({ icon: Icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 
                 transition-colors duration-200"
    >
      <Icon className="h-5 w-5 mr-2" />
      <span>{label}</span>
    </button>
  );

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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

          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <NavLink href="/" icon={Home} label="Home" />
            <NavLink 
              href="/cart" 
              icon={ShoppingCart} 
              label="Cart" 
              count={cart.length}
              onClick={handleCartClick}
            />
            <NavLink href="/wishlist" icon={Heart} label="Wishlist" count={wishlistCount} />
            {info.isAdmin ==='admin' && (
              <NavLink href="/Dashboard" icon={LayoutDashboard} label="Dashboard" />
            )}
            {info.name ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 
                            transition-colors duration-200 focus:outline-none"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <DropdownItem 
                      icon={Package} 
                      label="Orders" 
                      onClick={() => router.push('/Orders')} 
                    />
                    <DropdownItem 
                      icon={User} 
                      label="Profile" 
                      onClick={() => router.push('/profile')} 
                    />
                    <DropdownItem 
                      icon={LogOut} 
                      label="Logout" 
                      onClick={handleLogout} 
                    />
                  </div>
                )}
              </div>
            ) : (
              <button
                className="flex items-center px-4 py-2 text-gray-700 hover:text-indigo-600 
                          transition-colors duration-200 border border-gray-300 rounded-md
                          hover:border-indigo-600 focus:outline-none focus:ring-2 
                          focus:ring-indigo-500 focus:border-transparent"
                onClick={() => router.push('/Login')}
              >
                <LogIn className="h-5 w-5 mr-2" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 
                       focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500
                       transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen 
          ? 'max-h-96 opacity-100 visible' 
          : 'max-h-0 opacity-0 invisible'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <NavLink href="/" icon={Home} label="Home" />
          <NavLink 
            href="/cart" 
            icon={ShoppingCart} 
            label="Cart" 
            count={cart.length}
            onClick={handleCartClick}
          />
          <NavLink href="/wishlist" icon={Heart} label="Wishlist" count={wishlistCount} />
          {info.isAdmin === 'admin' && (
            <NavLink href="/Dashboard" icon={LayoutDashboard} label="Dashboard" />
          )}
          {info.name ? (
            <>
              <NavLink href="/orders" icon={Package} label="Orders" />
              <NavLink href="/profile" icon={User} label="Profile" />
              <button
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:text-indigo-600 
                           transition-colors duration-200"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:text-indigo-600 
                         transition-colors duration-200"
              onClick={() => router.push('/Login')}
            >
              <LogIn className="h-5 w-5 mr-2" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};