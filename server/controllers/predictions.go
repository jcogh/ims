package controllers

import (
	"github.com/jcogh/ims/server/models"
	"github.com/jcogh/ims/server/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PredictionController struct {
	DB *gorm.DB
}

func NewPredictionController(db *gorm.DB) *PredictionController {
	return &PredictionController{DB: db}
}

func (pc *PredictionController) PredictOrderQuantity(c *gin.Context) {
	productID := c.Param("id")

	// Fetch historical sales data for the product
	var salesData []models.Sales
	if err := pc.DB.Where("product_id = ?", productID).Find(&salesData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sales data"})
		return
	}

	// Prepare the sales data for forecasting
	var dates []time.Time
	var quantities []float64
	for _, sale := range salesData {
		dates = append(dates, sale.Date)
		quantities = append(quantities, float64(sale.Quantity))
	}

	// Apply a forecasting algorithm to predict future demand
	predictedQuantity := utils.ForecastDemand(dates, quantities)

	// Generate recommended order quantity based on predicted demand and current inventory level
	var product models.Product
	if err := pc.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	recommendedOrderQuantity := utils.CalculateOrderQuantity(predictedQuantity, product.Quantity)

	c.JSON(http.StatusOK, gin.H{
		"product_id":                 productID,
		"predicted_quantity":         predictedQuantity,
		"recommended_order_quantity": recommendedOrderQuantity,
	})
}
