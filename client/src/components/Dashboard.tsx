import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Grid, CircularProgress, 
  List, ListItem, ListItemText, Button, Card, CardContent
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getRecentProducts, getInventorySummary } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Product {
  ID: number;
  Name: string;
  SKU: string;
  CreatedAt: string;
  Quantity: number;
  Price: number;
}

interface InventorySummary {
  totalProducts: number;
  lowStockItems: number;
  totalValue: number;
}

const Dashboard: React.FC = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [inventorySummary, setInventorySummary] = useState<InventorySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, summaryResponse] = await Promise.all([
          getRecentProducts(),
          getInventorySummary()
        ]);
        setRecentProducts(productsResponse.data);
        setInventorySummary(summaryResponse.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = recentProducts.map(product => ({
    name: product.Name,
    quantity: product.Quantity
  }));

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          {/* Inventory Summary */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Inventory Summary</Typography>
                {loading ? (
                  <CircularProgress />
                ) : inventorySummary ? (
                  <>
                    <Typography>Total Products: {inventorySummary.totalProducts}</Typography>
                    <Typography>Low Stock Items: {inventorySummary.lowStockItems}</Typography>
                    <Typography>Total Value: ${inventorySummary.totalValue.toFixed(2)}</Typography>
                  </>
                ) : (
                  <Typography color="error">Failed to load summary</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Product Quantity Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: 300 }}>
              <Typography variant="h6" gutterBottom>Product Quantities</Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Recently Added Products */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recently Added Products
              </Typography>
              {loading ? (
                <CircularProgress />
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : recentProducts.length > 0 ? (
                <List>
                  {recentProducts.map((product) => (
                    <ListItem key={product.ID}>
                      <ListItemText
                        primary={product.Name}
                        secondary={`SKU: ${product.SKU} | Added: ${new Date(product.CreatedAt).toLocaleDateString()}`}
                      />
                      <Button 
                        component={Link} 
                        to={`/product/${product.ID}`}
                        size="small"
                        variant="outlined"
                      >
                        View
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No recent products found.</Typography>
              )}
              <Button 
                component={Link} 
                to="/inventory" 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }}
              >
                View All Products
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
