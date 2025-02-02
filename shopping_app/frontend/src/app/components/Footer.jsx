import React from 'react';
import { Instagram, Facebook, Twitter, MapPin, Mail, Phone } from 'lucide-react';

export  const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top section with logo and social */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center mb-4">
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
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-indigo-600">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Men's Collection</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Women's Collection</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">New Arrivals</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Sale</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Shipping Info</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Returns</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Size Guide</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Refund Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-indigo-600">Cookie Policy</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Newsletter</h3>
            <p className="text-gray-600">Stay updated with our latest offers.</p>
            <div className="flex max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-4 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-l focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              />
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-r hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-wrap justify-center gap-6 text-gray-600 text-sm">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>1-800-SOLESTYLE</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <span>support@solestyle.com</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>123 Fashion Street, Style City, SC 12345</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} SoleStyle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

