import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { getPrediction } from '../services/api';

interface PredictionCardProps {
  productId: number;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ productId }) => {
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await getPrediction(productId);
        setPrediction(response.data);
      } catch (err) {
        console.error('Failed to fetch prediction:', err);
        setError('Failed to load prediction. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [productId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!prediction) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Prediction</Typography>
        <Typography>Predicted Demand: {prediction.predicted_demand}</Typography>
        <Typography>Current Inventory: {prediction.current_inventory}</Typography>
        <Typography>Recommended Order Quantity: {prediction.recommended_order_qty}</Typography>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
