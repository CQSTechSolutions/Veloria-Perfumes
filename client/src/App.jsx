import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import FloatingHearts from './components/common/FloatingHearts';
import Home from './pages/Home';
import About from './pages/About';
import Collections from './pages/Collections';
import Contact from './pages/Contact';
import VeloriaAdministration from './pages/VeloriaAdministration';
import Account from './pages/Account';
import Cart from './pages/Cart';
import FAQ from './pages/FAQ';
import Wishlist from './pages/Wishlist';
import { Toaster } from 'react-hot-toast';

// Create a separate component for the app content
const AppContent = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('expirationTime');
    if (token && expirationTime && Date.now() > expirationTime) {
      localStorage.clear();
      navigate('/');
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <div className='flex-grow relative'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/veloriaAdministration" element={<VeloriaAdministration />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/account" element={<Account />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <div className='flex flex-col min-h-screen pt-35'>
        <FloatingHearts count={15} />
        <Router>
          <AppContent />
        </Router>
      </div>
    </>
  );
};

export default App;
