import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, Button, Box, Typography, CircularProgress 
} from '@mui/material';
import { addProduct } from '../services/api';

interface ProductData {
  name: string;
  description: string;
  quantity: number;
  price: number;
}

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addProduct(productData);
      navigate('/inventory');
    } catch (err) {
      setError('Failed to add product. Please try again.');
      console.error('Error adding product:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Product
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
        value={productData.name}
        onChange={handleInputChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Description"
        name="description"
        value={productData.description}
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
        value={productData.quantity}
        onChange={handleInputChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Price"
        name="price"
        type="number"
        value={productData.price}
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
        {loading ? <CircularProgress size={24} /> : 'Add Product'}
      </Button>
      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={() => navigate('/inventory')} 
        sx={{ mt: 2 }}
        disabled={loading}
      >
        Cancel
      </Button>
    </Box>
  );
};

export default AddProductPage;
