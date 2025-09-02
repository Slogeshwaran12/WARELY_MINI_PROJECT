import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = ({ fetchProducts, editingProduct, setEditingProduct }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Fixed: Uses relative URL for proxy
  const API_BASE = '/api';

  // Populate form when editing a product
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setPrice(editingProduct.price || '');
      setDescription(editingProduct.description || '');
      setImageFile(null); // Reset image selection
    } else {
      setName('');
      setPrice('');
      setDescription('');
      setImageFile(null);
    }
    setError('');
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !price) {
      setError("Name and Price are required.");
      return;
    }

    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      setError("Image file must be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description || '');
    if (imageFile) {
      formData.append('image', imageFile);
    }

    if (editingProduct) {
      formData.append('_method', 'PUT');
    }

    try {
      setLoading(true);
      let response;

      if (editingProduct) {
        response = await axios.post(
          `${API_BASE}/products/${editingProduct.id}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        console.log('Product updated successfully:', response.data);
      } else {
        response = await axios.post(
          `${API_BASE}/products`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        console.log('Product created successfully:', response.data);
      }

      // Refresh product list and reset form
      fetchProducts();
      setEditingProduct(null);
      setName('');
      setPrice('');
      setDescription('');
      setImageFile(null);
      setError('');
    } catch (err) {
      console.error('Operation error details:', err);
      if (err.response) {
        const status = err.response.status;
        const message =
          err.response.data?.message ||
          err.response.data?.error ||
          JSON.stringify(err.response.data) ||
          'Unknown server error';

        if (status === 413) setError("File too large. Please choose a smaller image.");
        else if (status === 422) setError(`Validation error: ${message}`);
        else if (status === 404) setError("API endpoint not found. Check backend.");
        else if (status === 500) setError("Server error. Check backend logs.");
        else setError(`Error ${status}: ${message}`);
      } else if (err.request) {
        setError("Cannot connect to server. Make sure backend is running.");
      } else {
        setError(`Operation failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: '20px',
        marginBottom: '20px',
        background: '#fff9c4',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}
    >
      <h3 style={{ marginBottom: '15px' }}>
        {editingProduct ? 'Edit Product' : 'Add Product'}
      </h3>

      {error && (
        <div
          style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
            border: '1px solid #ef5350'
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          alignItems: 'center'
        }}
      >
        {/* Product Name Input */}
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            flex: '1 1 200px'
          }}
        />

        {/* Price Input */}
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            flex: '1 1 100px'
          }}
        />

        {/* Image Upload Box */}
        <div
          style={{
            flex: '1 1 250px',
            border: '2px dashed #fbc02d',
            borderRadius: '10px',
            padding: '15px',
            textAlign: 'center',
            background: '#fffde7',
            cursor: 'pointer',
            transition: '0.3s',
          }}
          onClick={() => document.getElementById('fileInput').click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 0) setImageFile(files[0]);
          }}
        >
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files;
              if (files.length > 0) setImageFile(files[0]);
            }}
            style={{ display: 'none' }}
          />
          <div style={{ color: '#f57f17', fontWeight: 'bold' }}>
            {imageFile ? (
              <>
                <p>✅ {imageFile.name}</p>
                <p style={{ fontSize: '12px', color: '#555' }}>
                  {(imageFile.size / 1024 / 1024).toFixed(2)}MB
                </p>
              </>
            ) : editingProduct ? (
              <p>📁 Click to change image (optional)</p>
            ) : (
              <p>📁 Click or drag an image here to upload</p>
            )}
          </div>
        </div>

        {/* Description Input */}
        <input
          type="text"
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            flex: '1 1 300px'
          }}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#ffeb3b',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            transition: '0.2s'
          }}
        >
          {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
        </button>

        {/* Cancel Edit Button */}
        {editingProduct && (
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setName('');
              setPrice('');
              setDescription('');
              setImageFile(null);
              setError('');
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: '0.2s'
            }}
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
