import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Collections from './pages/Collections';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import VeloriaAdministration from './pages/VeloriaAdministration';
const App = () => {
  return (
    <div className='flex flex-col min-h-screen pt-20'>
      <Router>
        <Navbar />
        <div className='flex-grow'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/veloriaAdministration" element={<VeloriaAdministration />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  )
};

export default App;
