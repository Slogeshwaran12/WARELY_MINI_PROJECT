import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// API Configuration - Different URLs for development vs production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Netlify proxy URL for production
  : 'http://13.62.45.220:8000/api';  // Direct EC2 URL for development

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/products`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 10000
        });
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f0f0f0'
      }}>
        <div style={{ fontSize: '20px', color: '#555' }}>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f0f0f0',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '20px', color: '#d32f2f', marginBottom: '20px' }}>
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '10px 20px',
            background: '#ff0',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: '#f0f0f0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        padding: '30px',
        justifyItems: 'center',
        flexGrow: 1
      }}>
        {products.length === 0 ? (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            fontSize: '18px', 
            color: '#666',
            padding: '50px'
          }}>
            No products available
          </div>
        ) : (
          products.map(product => (
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
                src={(() => {
                  const imageUrl = product.image_url || product.image;
                  if (!imageUrl) return '/placeholder-image.jpg';
                  
                  // If in production (Netlify), convert EC2 URLs to use proxy
                  if (process.env.NODE_ENV === 'production' && imageUrl.startsWith('http://13.62.45.220:8000')) {
                    return imageUrl.replace('http://13.62.45.220:8000', '');
                  }
                  
                  return imageUrl;
                })()} 
                alt={product.name} 
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
              
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{product.name}</h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#555', 
                  minHeight: '40px', 
                  margin: '0 0 10px 0',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {product.description}
                </p>
                <strong style={{ fontSize: '18px', color: '#2e7d32' }}>
                  ${parseFloat(product.price).toFixed(2)}
                </strong>
                <button
                  onClick={() => addToCart(product)}
                  disabled={!product.is_available}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginTop: '10px',
                    background: product.is_available ? '#ff0' : '#ccc',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: product.is_available ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold',
                    transition: '0.3s',
                    opacity: product.is_available ? 1 : 0.6
                  }}
                  onMouseEnter={e => {
                    if (product.is_available) {
                      e.currentTarget.style.background = '#ffc';
                    }
                  }}
                  onMouseLeave={e => {
                    if (product.is_available) {
                      e.currentTarget.style.background = '#ff0';
                    }
                  }}
                >
                  {product.is_available ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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
