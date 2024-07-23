import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Typography, Box, CircularProgress
} from '@mui/material';
import { getProducts, deleteProduct } from '../services/api';

interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      setLoading(false);
      console.error('Error fetching products:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        setError('Failed to delete product. Please try again.');
        console.error('Error deleting product:', err);
      }
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Inventory
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Button variant="contained" color="primary" href="/add-product" sx={{ mb: 2 }}>
        Add New Product
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="inventory table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell component="th" scope="row">
                  {product.name}
                </TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell align="right">{product.quantity}</TableCell>
                <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Button color="primary" href={`/edit-product/${product.id}`}>Edit</Button>
                  <Button color="secondary" onClick={() => handleDelete(product.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InventoryPage;
