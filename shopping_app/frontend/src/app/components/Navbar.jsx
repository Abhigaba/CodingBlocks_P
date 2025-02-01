"use client"
import { useState, useEffect } from 'react';
import { 
  Home, 
  LogOut, 
  ShoppingCart, 
  Heart, 
  LayoutDashboard, 
  Menu, 
  X, 
  ChevronDown 
} from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount] = useState(3); // Example cart count
  const [wishlistCount] = useState(2); // Example wishlist count
  const [isAdmin] = useState(true); // Example admin status

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ href, icon: Icon, label, count }) => (
    <a
      href={href}
      className="flex items-center px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200
                 lg:px-3 group relative"
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
    </a>
  );

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <NavLink href="/" icon={Home} label="Home" />
            <NavLink href="/cart" icon={ShoppingCart} label="Cart" count={cartCount} />
            <NavLink href="/wishlist" icon={Heart} label="Wishlist" count={wishlistCount} />
            {isAdmin && (
              <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            )}
            <button
              className="flex items-center px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200"
              onClick={() => console.log('Logout clicked')}
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
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

      {/* Mobile Navigation */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen 
          ? 'max-h-96 opacity-100 visible' 
          : 'max-h-0 opacity-0 invisible'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <NavLink href="/" icon={Home} label="Home" />
          <NavLink href="/cart" icon={ShoppingCart} label="Cart" count={cartCount} />
          <NavLink href="/wishlist" icon={Heart} label="Wishlist" count={wishlistCount} />
          {isAdmin && (
            <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          )}
          <button
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:text-indigo-600 
                       transition-colors duration-200"
            onClick={() => console.log('Logout clicked')}
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

