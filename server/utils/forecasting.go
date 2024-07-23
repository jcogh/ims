package utils

import (
	"time"

	"github.com/montanaflynn/stats"
)

func ForecastDemand(dates []time.Time, quantities []float64) float64 {
	// Perform time series forecasting using a suitable algorithm
	// Here, we use a simple moving average as an example
	period := 30 // Number of days to consider for the moving average
	movingAverage, _ := stats.MovingAverage(quantities, period)
	predictedDemand := movingAverage[len(movingAverage)-1]
	return predictedDemand
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
