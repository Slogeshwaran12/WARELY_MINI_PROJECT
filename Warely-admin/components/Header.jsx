import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ activePage }) => {
  const navigate = useNavigate();

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      background: '#222',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '20px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '26px', cursor: 'pointer' }} onClick={() => navigate('/products')}>
        Warely_SG Admin
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <button
          style={{
            padding: '5px 15px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: activePage === 'products' ? 'bold' : 'normal',
            background: activePage === 'products' ? '#ff0' : '#555',
            color: activePage === 'products' ? '#000' : '#fff'
          }}
          onClick={() => navigate('/products')}
        >
          Products
        </button>
        <button
          style={{
            padding: '5px 15px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: activePage === 'orders' ? 'bold' : 'normal',
            background: activePage === 'orders' ? '#ff0' : '#555',
            color: activePage === 'orders' ? '#000' : '#fff'
          }}
          onClick={() => navigate('/orders')}
        >
          Orders
        </button>
      </div>
    </header>
  );
};

export default Header;