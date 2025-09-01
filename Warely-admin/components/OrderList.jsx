import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const totalRevenue = orders.reduce((sum, order) => {
    const orderTotal = order.items.reduce((s, item) => s + item.quantity * item.product.price, 0);
    return sum + orderTotal;
  }, 0);

  return (
    <div style={{ padding: '30px', flexGrow: 1, background: '#f5f5f5', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '20px', color: '#ff5722' }}>Previous Orders</h2>
      <div style={{ fontWeight: 'bold', marginBottom: '20px', fontSize: '18px' }}>Total Revenue: ${totalRevenue.toFixed(2)}</div>

      {orders.length === 0 && <p>No orders found.</p>}

      {orders.map(order => (
        <div key={order.id} style={{
          background: '#fff',
          padding: '20px',
          marginBottom: '15px',
          borderRadius: '12px',
          boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s'
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <strong style={{ color: '#222' }}>Order #{order.id} | Status: <span style={{ color: '#ff5722' }}>{order.status}</span></strong>
          <div style={{ marginTop: '10px' }}>
            {order.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #eee' }}>
                <span>{item.product.name} x {item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;
