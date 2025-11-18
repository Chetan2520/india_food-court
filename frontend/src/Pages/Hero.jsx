// FoodDeliveryHero.jsx (Updated: Added location fetch and display using OpenStreetMap Nominatim)
import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from "react-scroll";

export default function FoodDeliveryHero() {
  const [userLocation, setUserLocation] = useState(null);
  const [userAddress, setUserAddress] = useState('Detecting your location...');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setUserLocation(location);
          
          // Save to localStorage for Basket
          localStorage.setItem('userLocation', JSON.stringify(location));

          try {
            // Reverse geocode using OpenStreetMap Nominatim (free, no key)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`
            );
            const data = await response.json();
            const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setUserAddress(address.split(', ').slice(0, 3).join(', ')); // Shorten address
          } catch (err) {
            console.error('Reverse geocode error:', err);
            setUserAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
          setIsLoadingLocation(false);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setLocationError('Could not detect location. Please enable GPS.');
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setLocationError('Geolocation not supported.');
      setIsLoadingLocation(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 relative pt-20 lg:py-0 overflow-hidden">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between lg:gap-12">
        
        {/* Left Content */}
        <div className="max-w-2xl z-10 text-center lg:text-left">
          {/* Location Display */}
          <div className="flex items-center justify-center w-80 lg:justify-start gap-2 mb-6 sm:mb-8 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md ">
            <MapPin className="w-5 h-5 text-emerald-500" />
            {isLoadingLocation ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-600">Detecting location...</span>
              </div>
            ) : locationError ? (
              <span className="text-sm text-red-500">{locationError}</span>
            ) : (
              <span className="text-sm font-medium text-gray-700 truncate">{userAddress}</span>
            )}
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-gray-900 mb-3 sm:mb-4 leading-none">
            Hungry?
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-500 mb-4 sm:mb-6">
            Get It Fast
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0">
            Fresh, fast, and tailored to your taste.
          </p>
          
        
       
          <Link className="bg-emerald-500 w-40 lg:w-50 hover:bg-emerald-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto lg:mx-0"
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
            className="w-full max-w-sm sm:max-w-md lg:max-w-2xl object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-200/30 to-transparent"></div>
    </div>
  );
}