import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ProductList from './ProductList';
import OrdersList from './OrderList'; // Temporarily commented out

const AppContent = () => {
  const location = useLocation();
  const activePage = location.pathname.includes('orders') ? 'orders' : 'products';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header activePage={activePage} />

      <div style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/products" element={<ProductList />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="*" element={<Navigate to="/products" />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;