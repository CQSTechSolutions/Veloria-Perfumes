import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Store from './pages/Store';
import BestSellersPage from './pages/BestSellers';
import ProductDetail from './pages/ProductDetail';
import FloralPage from './pages/FloralPage';
import OrientalPage from './pages/OrientalPage';
import WoodyPage from './pages/WoodyPage';
import FreshPage from './pages/FreshPage';
import CitrusPage from './pages/CitrusPage';
import GourmandPage from './pages/GourmandPage';
import Discover from './pages/Discover';
import Search from './pages/Search';
import Cart from './pages/Cart';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Store />} />
        <Route path="/bestsellers" element={<BestSellersPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/floral" element={<FloralPage />} />
        <Route path="/category/oriental" element={<OrientalPage />} />
        <Route path="/category/woody" element={<WoodyPage />} />
        <Route path="/category/fresh" element={<FreshPage />} />
        <Route path="/category/citrus" element={<CitrusPage />} />
        <Route path="/category/gourmand" element={<GourmandPage />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;