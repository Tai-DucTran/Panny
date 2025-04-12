'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, User } from 'lucide-react';

interface TopNavProps {
  title?: string;
}

const TopNav: React.FC<TopNavProps> = ({ title = "Your Garden" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      {/* Top navigation bar */}
      <div className="flex items-center justify-between py-4">
        <h1 className="text-[40px] font-bold">{title}</h1>
        <button 
          onClick={toggleMenu}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Slide-out menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex justify-end">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="mt-8">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/garden" 
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  <Home className="mr-3" size={20} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/profile" 
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  <User className="mr-3" size={20} />
                  <span>User Profile</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay for closing the menu when clicking outside */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default TopNav;