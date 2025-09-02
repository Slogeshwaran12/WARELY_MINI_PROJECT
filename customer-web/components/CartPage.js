import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// API Configuration - Different URLs for development vs production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Netlify proxy URL for production
  : 'http://13.62.45.220:8000/api';  // Direct EC2 URL for development

const CartPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(location.state?.cart || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const increaseQty = (id) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQty = (id) => {
    setCart(prev => prev.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    setError(null);
  };

  const confirmOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: total
      };
      
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 15000
      });
      
      const orderMessage = response.data.order_id 
        ? `Order placed successfully! Order ID: ${response.data.order_id}`
        : 'Order placed successfully!';
      
      alert(orderMessage);
      setCart([]);
      navigate('/', { state: { orderSuccess: true } });
      
    } catch (error) {
      console.error('Order error:', error);
      
      let errorMessage = 'Failed to place order. Please try again.';
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 422) {
          errorMessage = 'Invalid order data. Please check your cart and try again.';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '15px 30px',
        background: '#000',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '30px',
        position: 'relative',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
      }}>
        <div>Warely_SG</div>
        <div
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            left: '20px',
            background: '#c0c0c0',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#000',
            transition: '0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#ff0'}
          onMouseLeave={e => e.currentTarget.style.background = '#c0c0c0'}
        >
          ← Back to Menu
        </div>
        
        <div style={{
          position: 'absolute',
          right: '20px',
          fontSize: '16px',
          color: '#ff0'
        }}>
          {cart.length} items - ${total.toFixed(2)}
        </div>
      </header>

      {error && (
        <div style={{
          background: '#ffebee',
          border: '1px solid #f44336',
          color: '#c62828',
          padding: '15px',
          margin: '20px 30px',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#c62828',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            ×
          </button>
        </div>
      )}

      <div style={{ padding: '30px', flexGrow: 1 }}>
        {cart.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px',
            background: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <h2>Your cart is empty</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Add some delicious items to get started!
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '10px 20px',
                background: '#ff0',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#fff',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#333' }}>
                    {item.name}
                  </h3>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    Unit Price: <strong>${parseFloat(item.price).toFixed(2)}</strong>
                  </p>
                  <p style={{ margin: '5px 0', color: '#2e7d32', fontWeight: 'bold' }}>
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '10px',
                  minWidth: '120px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    background: '#f5f5f5',
                    padding: '5px 10px',
                    borderRadius: '5px'
                  }}>
                    <button 
                      onClick={() => decreaseQty(item.id)} 
                      disabled={item.quantity <= 1}
                      style={{ 
                        padding: '5px 8px', 
                        cursor: item.quantity > 1 ? 'pointer' : 'not-allowed', 
                        background: item.quantity > 1 ? '#c0c0c0' : '#e0e0e0', 
                        border: 'none', 
                        borderRadius: '3px',
                        fontWeight: 'bold',
                        opacity: item.quantity > 1 ? 1 : 0.5
                      }}
                      onMouseEnter={e => {
                        if (item.quantity > 1) {
                          e.currentTarget.style.background = '#ff0';
                        }
                      }}
                      onMouseLeave={e => {
                        if (item.quantity > 1) {
                          e.currentTarget.style.background = '#c0c0c0';
                        }
                      }}
                    >
                      −
                    </button>
                    <span style={{ 
                      minWidth: '20px', 
                      textAlign: 'center', 
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => increaseQty(item.id)} 
                      style={{ 
                        padding: '5px 8px', 
                        cursor: 'pointer', 
                        background: '#c0c0c0', 
                        border: 'none', 
                        borderRadius: '3px',
                        fontWeight: 'bold'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#ff0'}
                      onMouseLeave={e => e.currentTarget.style.background = '#c0c0c0'}
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.id)} 
                    style={{ 
                      padding: '6px 12px', 
                      background: '#f44336', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '5px', 
                      cursor: 'pointer', 
                      fontWeight: 'bold',
                      fontSize: '12px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#d32f2f'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f44336'}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div style={{ 
              background: '#fff', 
              padding: '20px', 
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              border: '2px solid #ff0'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }}>
                  Total: ${total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={confirmOrder}
                disabled={loading || cart.length === 0}
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  background: loading ? '#ccc' : '#ff0',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  transition: '0.2s',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    e.currentTarget.style.background = '#ffeb3b';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                  }
                }}
                onMouseLeave={e => {
                  if (!loading) {
                    e.currentTarget.style.background = '#ff0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {loading ? 'Placing Order...' : `Confirm Order - $${total.toFixed(2)}`}
              </button>
            </div>
          </div>
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

export default CartPage;
