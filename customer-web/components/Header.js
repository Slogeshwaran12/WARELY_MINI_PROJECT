import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ cartCount }) => {
  const navigate = useNavigate();

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      background: '#ff5722',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '20px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '26px', textAlign: 'center', flexGrow: 1 }}>Warely_SG</div>
      <div
        style={{ cursor: 'pointer', fontSize: '16px' }}
        onClick={() => navigate('/cart')}
      >
        Cart ({cartCount})
      </div>
    </header>
  );
};

export default Header;
