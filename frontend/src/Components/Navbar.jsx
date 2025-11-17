// Navbar.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, ShoppingBasket } from 'lucide-react';

export default function Navbar({ onBasketClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Home');

  const navItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Explore', icon: Compass, href: '/explore' },
    { name: 'Baskets', icon: ShoppingBasket, isCart: true }
  ];

  // Sync activeTab with current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = navItems.find(item => item.href === currentPath);
    if (activeItem) {
      setActiveTab(activeItem.name);
    }
  }, [location.pathname]);

  const handleNavigation = (item) => {
    // If it's the basket/cart button, trigger the cart sidebar
    if (item.isCart && onBasketClick) {
      setActiveTab(item.name);
      onBasketClick();
    } else {
      setActiveTab(item.name);
      navigate(item.href);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className="flex flex-col items-center justify-center gap-1 flex-1 relative group transition-all duration-300 bg-transparent border-none cursor-pointer"
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-emerald-500 rounded-b-full"></div>
                )}
                
                {/* Icon */}
                <Icon 
                  className={`w-6 h-6 transition-colors mt-0.5 lg:mt-1.5 duration-300 ${
                    isActive ? 'text-emerald-500' : 'text-gray-500 group-hover:text-emerald-400'
                  }`}
                  strokeWidth={2.5}
                />
                
                {/* Label */}
                <span 
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isActive ? 'text-emerald-500' : 'text-gray-600 group-hover:text-emerald-400'
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
          
        </div>
        
      </div>
      
    </nav>
  );
}