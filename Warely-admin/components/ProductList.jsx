import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageErrors, setImageErrors] = useState({}); // Track image loading errors

  const API_BASE = '/api'; // ✅ Uses relative URL for proxy

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      console.log('Products fetched:', res.data); // Debug log
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure to delete this product?')) return;
    try {
      await axios.delete(`${API_BASE}/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Handle image loading errors
  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  // ✅ FIXED: Get proper image URL using ONLY relative paths
  const getImageUrl = (product) => {
    if (product.image_url) {
      let imagePath = product.image_url;
      
      // If it's already a full URL, extract just the path
      if (imagePath.startsWith('http')) {
        try {
          const url = new URL(imagePath);
          imagePath = url.pathname; // Get just the path part
        } catch (e) {
          console.log('Could not parse URL:', imagePath);
          return null;
        }
      }
      
      // Ensure it starts with / for relative URL
      if (!imagePath.startsWith('/')) {
        imagePath = `/${imagePath}`;
      }
      
      // Don't add /storage/ if the path already contains /api/, /images/, /uploads/, or /storage/
      if (imagePath.startsWith('/api/') || 
          imagePath.startsWith('/images/') || 
          imagePath.startsWith('/uploads/') || 
          imagePath.startsWith('/storage/')) {
        // Use the path as-is
        console.log('🖼️ Generated relative image URL:', imagePath);
        return imagePath;
      } else {
        // Add /storage/ prefix for simple filenames
        const finalPath = `/storage${imagePath}`;
        console.log('🖼️ Generated relative image URL:', finalPath);
        return finalPath;
      }
    }
    return null;
  };

  return (
    <div style={{ padding: '20px', flexGrow: 1 }}>
      <h2>Products</h2>

      <ProductForm 
        fetchProducts={fetchProducts} 
        editingProduct={editingProduct} 
        setEditingProduct={setEditingProduct} 
      />

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px', 
          marginTop: '20px' 
        }}
      >
        {products.map(product => (
          <div 
            key={product.id}
            style={{ 
              background: '#fff', 
              padding: '10px', 
              borderRadius: '10px', 
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)', 
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* Image with fallback */}
            <div style={{ 
              width: '100%', 
              height: '120px', 
              borderRadius: '5px',
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px',
              overflow: 'hidden'
            }}>
              {!imageErrors[product.id] && getImageUrl(product) ? (
                <img 
                  src={getImageUrl(product)}
                  alt={product.name} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                  onError={() => {
                    console.log('❌ Image failed to load:', getImageUrl(product));
                    handleImageError(product.id);
                  }}
                  onLoad={() => {
                    console.log('✅ Image loaded successfully:', getImageUrl(product));
                  }}
                />
              ) : (
                <div style={{
                  textAlign: 'center',
                  color: '#999',
                  fontSize: '14px'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '5px' }}>🍽️</div>
                  <div>No Image</div>
                </div>
              )}
            </div>

            <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{product.name}</h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold', color: '#ff5722' }}>
              ${product.price}
            </p>
            {product.description && (
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>
                {product.description}
              </p>
            )}

            <div style={{ display: 'flex', gap: '5px' }}>
              <button 
                onClick={() => setEditingProduct(product)} 
                style={{ 
                  background: '#ff0', 
                  color: '#000', 
                  border: 'none', 
                  padding: '5px 10px', 
                  borderRadius: '5px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  flex: 1
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#ffc'}
                onMouseLeave={e => e.currentTarget.style.background = '#ff0'}
              >
                Edit
              </button>

              <button 
                onClick={() => deleteProduct(product.id)} 
                style={{ 
                  background: '#f44336', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '5px 10px', 
                  borderRadius: '5px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  flex: 1
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#d32f2f'}
                onMouseLeave={e => e.currentTarget.style.background = '#f44336'}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
          <h3>No products yet</h3>
          <p>Add your first product using the form above</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
