import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  TextField, Button, Box, Typography, CircularProgress, Alert
} from '@mui/material';
import { getProduct, updateProduct } from '../services/api';

interface ProductData {
  SKU: string;
  Name: string;
  Description: string;
  Quantity: number;
  Price: number;
}

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(Number(id));
        console.log('Product data received:', response.data);
        if (response.status === 204 || !response.data) {
          setError('No product data received from server.');
          return;
        }
        setProductData(response.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProductData(prev => prev ? {
      ...prev, 
      [name]: name === 'Quantity' || name === 'Price' ? Number(value) : value 
    } : null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!productData) return;

    setLoading(true);
    setError('');

    try {
      await updateProduct(Number(id), productData);
      navigate('/inventory');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update product. Please try again.');
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!productData) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="warning">No product data available.</Alert>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Product
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="SKU"
        name="SKU"
        value={productData.SKU}
        onChange={handleInputChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Name"
        name="Name"
        value={productData.Name}
        onChange={handleInputChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Description"
        name="Description"
        value={productData.Description}
        onChange={handleInputChange}
        multiline
        rows={4}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Quantity"
        name="Quantity"
        type="number"
        value={productData.Quantity}
        onChange={handleInputChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Price"
        name="Price"
        type="number"
        value={productData.Price}
        onChange={handleInputChange}
        required
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2, mr: 2 }}
        disabled={loading}
      >
        Update Product
      </Button>
      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={() => navigate('/inventory')} 
        sx={{ mt: 2 }}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default EditProductPage;
