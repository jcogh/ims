package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/jcogh/ims/server/models"
	"gorm.io/gorm"
	"net/http"
)

type InventoryController struct {
	DB *gorm.DB
}

func NewInventoryController(db *gorm.DB) *InventoryController {
	return &InventoryController{DB: db}
}

func (ic *InventoryController) GetInventorySummary(c *gin.Context) {
	var totalProducts int64
	var lowStockItems int64
	var totalValue float64

	if err := ic.DB.Model(&models.Product{}).Count(&totalProducts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch total products"})
		return
	}

	if err := ic.DB.Model(&models.Product{}).Where("quantity < ?", 10).Count(&lowStockItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch low stock items"})
		return
	}

	if err := ic.DB.Model(&models.Product{}).Select("SUM(quantity * price) as total_value").Row().Scan(&totalValue); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate total inventory value"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"totalProducts": totalProducts,
		"lowStockItems": lowStockItems,
		"totalValue":    totalValue,
	})
}
