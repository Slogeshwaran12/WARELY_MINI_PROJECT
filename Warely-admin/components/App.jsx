import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ProductList from './ProductList';
import OrdersList from './OrderList';
import Kitchen from './Kitchen'; // New Kitchen component

const AppContent = () => {
  const location = useLocation();
  
  // Updated to handle kitchen route
  let activePage = 'products';
  if (location.pathname.includes('orders')) activePage = 'orders';
  else if (location.pathname.includes('kitchen')) activePage = 'kitchen';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header activePage={activePage} />

      <div style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/products" element={<ProductList />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/kitchen" element={<Kitchen />} /> {/* New Kitchen route */}
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
