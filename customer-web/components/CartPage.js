import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(location.state?.cart || []);
  const [loading, setLoading] = useState(false);

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

  const removeItem = (id) => setCart(prev => prev.filter(item => item.id !== id));

  const confirmOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    try {
      setLoading(true);
      const items = cart.map(item => ({ product_id: item.id, quantity: item.quantity }));
      
      console.log('Sending order data:', { items }); // Debug log
      
      const response = await axios.post('http://127.0.0.1:8000/api/orders', { items }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('Order response:', response.data); // Debug log
      
      alert('Order placed successfully!');
      setCart([]);
      navigate('/');
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to place order: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
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
          Home
        </div>
      </header>

      {/* CART ITEMS */}
      <div style={{ padding: '30px', flexGrow: 1 }}>
        {cart.length === 0 ? <p>Your cart is empty.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#fff',
                padding: '15px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                <div>
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price}</p>
                  <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                  <div>
                    <button onClick={() => increaseQty(item.id)} style={{ marginRight: '5px', padding: '5px', cursor: 'pointer', background:'#c0c0c0', border:'none', borderRadius:'3px' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#ff0'}
                      onMouseLeave={e => e.currentTarget.style.background = '#c0c0c0'}
                    >+</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => decreaseQty(item.id)} style={{ marginLeft: '5px', padding: '5px', cursor: 'pointer', background:'#c0c0c0', border:'none', borderRadius:'3px' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#ff0'}
                      onMouseLeave={e => e.currentTarget.style.background = '#c0c0c0'}
                    >-</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} style={{ marginTop: '5px', padding: '5px 10px', background: '#c0c0c0', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight:'bold' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ff0'}
                    onMouseLeave={e => e.currentTarget.style.background = '#c0c0c0'}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '20px' }}>
              Total Cost: ${total.toFixed(2)}
            </div>

            <button
              onClick={confirmOrder}
              disabled={loading}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: '#ff0',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: '0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#c0c0c0'}
              onMouseLeave={e => e.currentTarget.style.background = '#ff0'}
            >
              {loading ? 'Placing Order...' : 'Confirm Order'}
            </button>
          </div>
        )}
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

export default CartPage;