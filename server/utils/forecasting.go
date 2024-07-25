package utils

import (
	"time"
)

func ForecastDemand(dates []time.Time, quantities []float64) float64 {
	if len(quantities) == 0 {
		return 0
	}

	total := 0.0
	for _, q := range quantities {
		total += q
	}
	return total / float64(len(quantities))
}

func CalculateOrderQuantity(predictedDemand, currentInventory float64) float64 {
	reorderPoint := 100.0
	recommendedOrderQuantity := predictedDemand - currentInventory
	if recommendedOrderQuantity < 0 {
		recommendedOrderQuantity = 0
	}
	if currentInventory < reorderPoint {
		recommendedOrderQuantity += reorderPoint - currentInventory
	}
	return recommendedOrderQuantity
}

