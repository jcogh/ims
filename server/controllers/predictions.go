package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/jcogh/ims/server/models"
	"github.com/jcogh/ims/server/utils"
	"gorm.io/gorm"
	"log"
	"net/http"
	"time"
)

type PredictionController struct {
	DB *gorm.DB
}

func NewPredictionController(db *gorm.DB) *PredictionController {
	return &PredictionController{DB: db}
}

func (pc *PredictionController) PredictOrderQuantity(c *gin.Context) {
	productID := c.Param("id")

	var sales []models.Sales
	if err := pc.DB.Where("product_id = ?", productID).Order("sold_at").Find(&sales).Error; err != nil {
		log.Printf("Error fetching sales data: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sales data"})
		return
	}

	if len(sales) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "No sales data available for prediction", "recommendedOrder": 0})
		return
	}

	// Extract dates and quantities
	var dates []time.Time
	var quantities []float64
	for _, sale := range sales {
		dates = append(dates, sale.SoldAt)
		quantities = append(quantities, float64(sale.Quantity))
	}

	// Use your prediction logic here
	predictedDemand := utils.ForecastDemand(dates, quantities)

	// Fetch current inventory
	var product models.Product
	if err := pc.DB.First(&product, productID).Error; err != nil {
		log.Printf("Error fetching product data: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch product data"})
		return
	}

	recommendedOrder := utils.CalculateOrderQuantity(predictedDemand, float64(product.Quantity))

	c.JSON(http.StatusOK, gin.H{
		"predictedDemand":  predictedDemand,
		"currentInventory": product.Quantity,
		"recommendedOrder": recommendedOrder,
	})
}

func calculateMovingAverage(sales []models.Sales) int {
	if len(sales) == 0 {
		return 0
	}

	totalSales := 0
	for _, sale := range sales {
		totalSales += int(sale.Quantity)
	}

	return totalSales / len(sales)
}

func calculateRecommendedQuantity(predictedDemand, currentInventory int) int {
	safetyStock := 10 // You might want to make this configurable
	reorderPoint := predictedDemand + safetyStock

	if currentInventory < reorderPoint {
		return reorderPoint - currentInventory
	}
	return 0
}
