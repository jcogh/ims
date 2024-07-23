import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, CircularProgress, 
  Button, Alert
} from '@mui/material';
import { getProducts } from '../services/api';

interface Product {
  ID: number;
  Name: string;
  Description: string;
  Quantity: number;
  Price: number;
}

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inventory
        </Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>
          Add New Product
        </Button>
        <TableContainer component={Paper}>
          <Table>
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
                <TableRow key={product.ID}>
                  <TableCell>{product.Name}</TableCell>
                  <TableCell>{product.Description}</TableCell>
                  <TableCell align="right">{product.Quantity}</TableCell>
                  <TableCell align="right">${product.Price.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Button size="small" color="primary">Edit</Button>
                    <Button size="small" color="secondary">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Inventory;

