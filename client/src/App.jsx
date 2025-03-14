import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import FloatingHearts from './components/common/FloatingHearts';
import Home from './pages/Home';
import About from './pages/About';
import Collections from './pages/Collections';
import Contact from './pages/Contact';
import VeloriaAdministration from './pages/admin/VeloriaAdministration.jsx';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import CollectionForm from './pages/admin/CollectionForm';
import OrderList from './pages/admin/OrderList';
import UserList from './pages/admin/UserList';
import Settings from './pages/admin/Settings';
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

  // Show Header and Footer only for non-admin routes
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <div className={`flex-grow relative ${!isAdminRoute ? 'mt-40' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<VeloriaAdministration />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/products/new" element={<ProductForm />} />
          <Route path="/admin/collection/edit/:id" element={<CollectionForm />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/account" element={<Account />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <div className='flex flex-col min-h-screen'>
        <FloatingHearts count={15} />
        <Router>
          <AppContent />
        </Router>
      </div>
    </>
  );
};

export default App;
