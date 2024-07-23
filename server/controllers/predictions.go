package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/jcogh/ims/server/models"
	"gorm.io/gorm"
	"net/http"
)

type PredictionController struct {
	DB *gorm.DB
}

func NewPredictionController(db *gorm.DB) *PredictionController {
	return &PredictionController{DB: db}
}

func (pc *PredictionController) PredictOrderQuantity(c *gin.Context) {
	productID := c.Param("id")

	// Fetch historical sales data
	var sales []models.Sales
	if err := pc.DB.Where("product_id = ?", productID).Order("date").Find(&sales).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sales data"})
		return
	}

	// Perform simple moving average prediction
	prediction := calculateMovingAverage(sales)

	// Get current inventory
	var product models.Product
	if err := pc.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Calculate recommended order quantity
	recommendedQuantity := calculateRecommendedQuantity(prediction, int(product.Quantity))

	c.JSON(http.StatusOK, gin.H{
		"predicted_demand":      prediction,
		"current_inventory":     product.Quantity,
		"recommended_order_qty": recommendedQuantity,
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

