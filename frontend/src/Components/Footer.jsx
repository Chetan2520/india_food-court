import React from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Get It Fast Section */}
          <div>
            <h3 className="text-2xl font-bold text-emerald-500 mb-3">
              Get It Fast
            </h3>
            <p className="text-gray-600">
              Fresh, fast, and tailored to your taste.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#menu" className="text-gray-600 hover:text-emerald-500 transition-colors duration-300">
                  Menu
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-600 hover:text-emerald-500 transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-emerald-500 transition-colors duration-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              Follow Us
            </h4>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-emerald-500 hover:text-emerald-500 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-gray-600 text-sm">
            © 2025 Get It Fast. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}