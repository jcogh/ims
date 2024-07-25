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

	var product models.Product
	if err := pc.DB.First(&product, productID).Error; err != nil {
		log.Printf("Error fetching product data: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch product data"})
		return
	}

	var sales []models.Sales
	if err := pc.DB.Where("product_id = ?", productID).Order("sold_at").Find(&sales).Error; err != nil {
		log.Printf("Error fetching sales data: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sales data"})
		return
	}

	var dates []time.Time
	var quantities []float64
	for _, sale := range sales {
		dates = append(dates, sale.SoldAt)
		quantities = append(quantities, float64(sale.Quantity))
	}

	predictedDemand := utils.ForecastDemand(dates, quantities)
	recommendedOrder := utils.CalculateOrderQuantity(predictedDemand, float64(product.Quantity))

	response := gin.H{
		"predicted_demand":      predictedDemand,
		"current_inventory":     product.Quantity,
		"recommended_order_qty": recommendedOrder,
	}

	log.Printf("Prediction for product %s: %+v", productID, response)
	c.JSON(http.StatusOK, response)
}

