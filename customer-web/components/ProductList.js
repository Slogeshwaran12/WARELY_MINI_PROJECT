import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const goToCart = () => navigate('/cart', { state: { cart } });

  return (
    <div style={{ background: '#f0f0f0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <header style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '15px 30px',
        background: '#222',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '30px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        position: 'relative'
      }}>
        <div>Warely_SG</div>
        <div
          onClick={goToCart}
          style={{
            position: 'absolute',
            right: '30px',
            background: '#ff0',
            padding: '5px 15px',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#000'
          }}
        >
          Cart ({cart.length})
        </div>
      </header>

      {/* PRODUCT GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        padding: '30px',
        justifyItems: 'center',
        flexGrow: 1
      }}>
        {products.map(product => (
          <div key={product.id} style={{
            background: '#fff',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            width: '220px',
            transition: 'transform 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img 
              src={product.image_url} 
              alt={product.name} 
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />
            
            <div style={{ padding: '15px' }}>
              <h3>{product.name}</h3>
              <p style={{ fontSize: '14px', color: '#555', minHeight: '40px' }}>{product.description}</p>
              <strong>${product.price}</strong>
              <button
                onClick={() => addToCart(product)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '10px',
                  background: '#ff0',
                  color: '#000',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: '0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#ffc'}
                onMouseLeave={e => e.currentTarget.style.background = '#ff0'}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        background: '#222',
        color: '#fff',
        fontWeight: 'bold'
      }}>
        &copy; 2025 Warely_SG. All rights reserved.
      </footer>
    </div>
  );
};

export default ProductList;