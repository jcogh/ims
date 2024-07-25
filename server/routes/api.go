package routes

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jcogh/ims/server/controllers"
	"gorm.io/gorm"
	"time"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	// Add CORS middleware
	config := cors.Config{
		AllowOrigins:     []string{"https://ims-app-vtrea.ondigitalocean.app", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	r.Use(cors.New(config))

	productController := controllers.NewProductController(db)
	authController := controllers.NewAuthController(db)
	predictionController := controllers.NewPredictionController(db)
	inventoryController := controllers.NewInventoryController(db)

	// Auth routes
	r.POST("/register", authController.Register)
	r.POST("/login", authController.Login)

	// Inventory summary route
	r.GET("/inventory/summary", inventoryController.GetInventorySummary)

	// Product routes
	r.POST("/products", productController.CreateProduct)
	r.GET("/products", productController.GetProducts)
	r.GET("/products/:id", productController.GetProduct)
	r.PUT("/products/:id", productController.UpdateProduct)
	r.DELETE("/products/:id", productController.DeleteProduct)
	r.GET("/products/recent", productController.GetRecentProducts)

	// Prediction route
	r.GET("/predict/:id", predictionController.PredictOrderQuantity)

	return r
}

