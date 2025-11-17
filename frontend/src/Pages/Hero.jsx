import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from "react-scroll";
export default function FoodDeliveryHero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 relative pt-20 lg:py-0 overflow-hidden">
     

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between   lg:gap-12">
        
        {/* Left Content */}
        <div className="max-w-2xl z-10 text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-gray-900 mb-3 sm:mb-4 leading-none">
            Hungry?
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-500 mb-4 sm:mb-6">
            Get It Fast
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0">
            Fresh, fast, and tailored to your taste.
          </p>
       
           <Link  className="bg-emerald-500 w-40 lg:w-50 hover:bg-emerald-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto lg:mx-0"
           to="get-started"
        smooth={true}
        duration={600}
        offset={-70}   
      >
        Get Started
            <ArrowRight className="w-5 h-5" />
      </Link>
        </div>

        {/* Right Image */}
        <div className="relative w-full lg:w-1/2 flex items-center justify-center mt-8 lg:mt-0">
          <img 
            src="/Hero.png" 
            alt="Fast Delivery"
            className="w-full  max-w-sm sm:max-w-md lg:max-w-2xl object-contain drop-shadow-2xl"
          />
          
          
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-200/30 to-transparent"></div>
    </div>
  );
}