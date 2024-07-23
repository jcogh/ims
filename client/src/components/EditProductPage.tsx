import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  TextField, Button, Box, Typography, CircularProgress 
} from '@mui/material';
import { getProducts, updateProduct } from '../services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      const foundProduct = response.data.find((p: Product) => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError('Product not found');
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch product. Please try again later.');
      setLoading(false);
      console.error('Error fetching product:', err);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!product) return;

    try {
      await updateProduct(id!, product);
      navigate('/inventory');
    } catch (err) {
      setError('Failed to update product. Please try again.');
      console.error('Error updating product:', err);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProduct(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (!product) {
    return <Typography color="error">Product not found.</Typography>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
      Edit Product
    </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
            </Typography>
        )}
        <TextField
        fullWidth
        margin="normal"
        label="Name"
        name="name"
        value={product.name}
        onChange={handleInputChange}
        required
      />
        <TextField
        fullWidth
        margin="normal"
        label="Description"
        name="description"
        value={product.description}
        onChange={handleInputChange}
        multiline
        rows={4}
      />
        <TextField
        fullWidth
        margin="normal"
        label="Quantity"
        name="quantity"
        type="number"
        value={product.quantity}
        onChange={handleInputChange}
        required
      />
        <TextField
        fullWidth
        margin="normal"
        label="Price"
        name="price"
        type="number"
        value={product.price}
        onChange={handleInputChange}
        required
      />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
        Update Product
      </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/inventory')} sx={{ mt: 2 }}>
        Cancel
      </Button>
      </Box>
  );
};

export default EditProductPage;
