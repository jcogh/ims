package utils

import (
	"time"
)

func ForecastDemand(dates []time.Time, quantities []float64) float64 {
	period := 30
	movingAverage := calculateMovingAverage(quantities, period)
	predictedDemand := movingAverage[len(movingAverage)-1]
	return predictedDemand
}

func calculateMovingAverage(data []float64, window int) []float64 {
	if len(data) < window {
		return nil
	}

	movingAverage := make([]float64, len(data)-window+1)
	for i := 0; i <= len(data)-window; i++ {
		sum := 0.0
		for j := i; j < i+window; j++ {
			sum += data[j]
		}
		movingAverage[i] = sum / float64(window)
	}

	return movingAverage
}

func CalculateOrderQuantity(predictedDemand, currentInventory float64) float64 {
	// Calculate the recommended order quantity based on predicted demand and current inventory
	// Here, we use a simple reorder point strategy
	reorderPoint := 100.0 // Reorder when inventory falls below this level
	recommendedOrderQuantity := predictedDemand - currentInventory
	if recommendedOrderQuantity < 0 {
		recommendedOrderQuantity = 0
	}
	if currentInventory < reorderPoint {
		recommendedOrderQuantity += reorderPoint - currentInventory
	}
	return recommendedOrderQuantity
}
