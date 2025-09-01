import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/products');
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure to delete this product?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ padding: '20px', flexGrow: 1 }}>
      <h2>Products</h2>
      <ProductForm fetchProducts={fetchProducts} editingProduct={editingProduct} setEditingProduct={setEditingProduct} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
        {products.map(product => (
          <div key={product.id} 
               style={{ 
                  background: '#fff', 
                  padding: '10px', 
                  borderRadius: '10px', 
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)', 
                  transition:'transform 0.2s',
                  cursor:'pointer'
                }}
               onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
               onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '5px' }} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button 
              onClick={() => setEditingProduct(product)} 
              style={{ background:'#ff0', color:'#000', border:'none', padding:'5px 10px', borderRadius:'5px', marginRight:'5px', cursor:'pointer', fontWeight:'bold' }}
              onMouseEnter={e => e.currentTarget.style.background = '#ffc'}
              onMouseLeave={e => e.currentTarget.style.background = '#ff0'}
            >Edit</button>
            <button 
              onClick={() => deleteProduct(product.id)} 
              style={{ background:'#ff0', color:'#000', border:'none', padding:'5px 10px', borderRadius:'5px', cursor:'pointer', fontWeight:'bold' }}
              onMouseEnter={e => e.currentTarget.style.background = '#ffc'}
              onMouseLeave={e => e.currentTarget.style.background = '#ff0'}
            >Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
