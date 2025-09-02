import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Kitchen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = '/api'; // Proxy via Netlify

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/orders`);
      const activeOrders = res.data.filter(order => order.status !== 'completed');
      setOrders(activeOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${API_BASE}/orders/${orderId}`, { status });
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status.');
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'preparing':
        return '#ffeb3b';
      case 'completed':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusTextColor = (status) =>
    (status === 'preparing' || status === 'pending') ? '#000' : '#fff';

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', background: '#f5f5f5' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid #ffeb3b', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '20px', color: '#666' }}>Loading orders...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#ff5722', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>🍽️ Kitchen Display</h2>
        <button onClick={fetchOrders} style={{ background: '#ffeb3b', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'all 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ffc107'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#ffeb3b'; e.currentTarget.style.transform = 'translateY(0px)'; }}>
          🔄 Refresh
        </button>
      </div>

      {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ef5350' }}>{error}</div>}

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.5 }}>🍽️</div>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>No active orders</h3>
          <p style={{ color: '#999', fontSize: '16px' }}>Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', border: '1px solid #e0e0e0' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'; }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#333', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Order #{order.id}</h3>
                <div style={{ background: getStatusColor(order.status), color: getStatusTextColor(order.status), padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {order.status}
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ color: '#555', marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={item.id || index} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: index < order.items.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <div style={{ width: '32px', height: '32px', background: '#ffeb3b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontWeight: 'bold', color: '#000', fontSize: '14px' }}>
                        {item.quantity}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', color: '#333', fontWeight: '500' }}>{item.product?.name || 'Unknown Item'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                  disabled={order.status === 'preparing'}
                  style={{
                    background: order.status === 'preparing' ? '#bdbdbd' : '#ffeb3b',
                    color: order.status === 'preparing' ? '#fff' : '#000',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    cursor: order.status === 'preparing' ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >⏱️ Preparing</button>

                <button
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                  disabled={order.status === 'completed'}
                  style={{
                    background: order.status === 'completed' ? '#bdbdbd' : '#4caf50',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    cursor: order.status === 'completed' ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >✅ Complete</button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Kitchen;
