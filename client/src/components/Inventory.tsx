import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, CircularProgress, 
  Button, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../services/api';

interface Product {
  ID: number;
  SKU: string;
  Name: string;
  Description: string;
  Quantity: number;
  Price: number;
}

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const navigate = useNavigate();

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

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.ID);
        setProducts(products.filter(p => p.ID !== productToDelete.ID));
        setDeleteDialogOpen(false);
      } catch (err) {
        console.error('Failed to delete product:', err);
        setError('Failed to delete product. Please try again later.');
      }
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
        <Button 
          component={Link} 
          to="/add-product" 
          variant="contained" 
          color="primary" 
          sx={{ mb: 2 }}
        >
          Add New Product
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
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
                  <TableCell>{product.SKU}</TableCell>
                  <TableCell>{product.Name}</TableCell>
                  <TableCell>{product.Description}</TableCell>
                  <TableCell align="right">{product.Quantity}</TableCell>
                  <TableCell align="right">${product.Price.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Button 
                      onClick={() => navigate(`/product/${product.ID}`)}
                      size="small" 
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      View Details
                    </Button>
                    <Button 
                      component={Link} 
                      to={`/edit-product/${product.ID}`} 
                      size="small" 
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="secondary" 
                      onClick={() => handleDeleteClick(product)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {products.length === 0 && (
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            No products found. Add a new product to get started.
          </Typography>
        )}
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product "{productToDelete?.Name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Inventory;
