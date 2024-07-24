import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Card, CardContent, Grid, Button, CircularProgress, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { getProduct, deleteProduct } from '../services/api';
import PredictionCard from './PredictionCard';

interface Product {
  ID: number;
  SKU: string;
  Name: string;
  Description: string;
  Quantity: number;
  Price: number;
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(Number(id));
        setProduct(response.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteProduct(Number(id));
      navigate('/inventory');
    } catch (err) {
      console.error('Failed to delete product:', err);
      setError('Failed to delete product. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box m={2}>
        <Alert severity="warning">Product not found.</Alert>
      </Box>
    );
  }

  return (
    <Box m={2}>
      <Button onClick={() => navigate('/inventory')} variant="outlined" sx={{ mb: 2 }}>
        Back to Inventory
      </Button>
      
      <Typography variant="h4" gutterBottom>
        Product Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
              <Typography><strong>SKU:</strong> {product.SKU}</Typography>
              <Typography><strong>Name:</strong> {product.Name}</Typography>
              <Typography><strong>Description:</strong> {product.Description}</Typography>
              <Typography><strong>Quantity:</strong> {product.Quantity}</Typography>
              <Typography><strong>Price:</strong> ${product.Price.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <PredictionCard productId={product.ID} />
        </Grid>
      </Grid>

      <Box mt={2}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(`/edit-product/${product.ID}`)}
          sx={{ mr: 1 }}
        >
          Edit Product
        </Button>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Product
        </Button>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductDetailPage;
