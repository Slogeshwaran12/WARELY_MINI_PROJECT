import React from 'react';
import { useLocation } from 'react-router-dom';

const Cart = () => {
  const location = useLocation();
  const cart = location.state?.cart || [];

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Cart</h2>
      {cart.length === 0 ? <p>No items in cart.</p> :
        <div>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div style={{ fontWeight: 'bold', marginTop: '10px' }}>Total: ${total.toFixed(2)}</div>
        </div>
      }
    </div>
  );
};

export default Cart;
