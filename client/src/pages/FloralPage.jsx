import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryPage from './CategoryPage';

const FloralPage = () => {
  return <CategoryPage category="Floral" />;
};

export default FloralPage;