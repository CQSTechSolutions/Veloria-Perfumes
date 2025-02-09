import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import FloatingHearts from './components/common/FloatingHearts';
import Home from './pages/Home';
import About from './pages/About';
import Collections from './pages/Collections';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import VeloriaAdministration from './pages/VeloriaAdministration';
import Account from './pages/Account';
import Cart from './pages/Cart';

const App = () => {
  return (
    <div className='flex flex-col min-h-screen pt-35'>
      <FloatingHearts count={15} />
      <Router>
        <Header />
        <div className='flex-grow relative'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/veloriaAdministration" element={<VeloriaAdministration />} />
            <Route path="/account" element={<Account />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  )
};

export default App;
