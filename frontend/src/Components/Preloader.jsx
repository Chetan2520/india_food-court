import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onLoadComplete }) => {
  const [showTagline, setShowTagline] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Show tagline after 0.5 seconds
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 500);

    // Complete preloader after 2.5 seconds total
    const completeTimer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => {
        if (onLoadComplete) {
          onLoadComplete();
        }
      }, 800); // Extra time for exit animation
    }, 2500);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(completeTimer);
    };
  }, [onLoadComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800"
        >
          <div className="flex items-center gap-8">
            {/* Left Side - Logo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex-shrink-0"
            >
              <img
                src="/Hero.png"
                alt="Logo"
                className="w-20 h-20 object-contain filter drop-shadow-lg"
              />
            </motion.div>

            {/* Middle - Vertical Divider (Dandi) */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="w-0.5 h-24 bg-gradient-to-b from-transparent via-white to-transparent origin-top"
            />

            {/* Right Side - Welcome Text & Tagline */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {!showTagline ? (
                  <motion.h1
                    key="welcome"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                    className="text-5xl font-bold text-white tracking-wide"
                  >
                    Welcome
                  </motion.h1>
                ) : (
                  <motion.div
                    key="tagline"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center"
                  >
                    <motion.p
                      className="text-3xl font-semibold text-white mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Discover New Horizons
                    </motion.p>
                    <motion.p
                      className="text-lg text-indigo-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Your journey begins here
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Loading Bar at Bottom */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 h-1 bg-white/20 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Demo App Component
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Preloader onLoadComplete={handleLoadComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Your Website Content
        </h1>
        <p className="text-gray-600">
          Preloader successfully completed!
        </p>
      </div>
    </div>
  );
};

export default App;