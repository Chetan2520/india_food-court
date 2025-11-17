// App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './Pages/Hero';
import MenuComponent from './Pages/MenuComponent';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import Explore from './Pages/Explore';
import Basket from './Pages/Basket';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AuthForm from './Components/AuthForm';
// import ScrollToTop from './ScrollToTop';

const Home = () => {
  return (
    <>
      <Hero />
      <MenuComponent />
    </>
  );
};

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
  
    
      <div className="pb-20"> {/* Add padding bottom for fixed navbar */}
        <Navbar onBasketClick={() => setIsCartOpen(true)} />
        <Basket isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        
        <Footer />
      </div>
  );
};

export default App;