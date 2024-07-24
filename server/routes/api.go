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
		AllowOrigins:     []string{"http://localhost:3000"}, // Replace with your frontend URL
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

	api := r.Group("/api")

	api.GET("/inventory/summary", inventoryController.GetInventorySummary)
	{
		// Product routes
		api.POST("/products", productController.CreateProduct)
		api.GET("/products", productController.GetProducts)
		api.GET("/products/:id", productController.GetProduct)
		api.PUT("/products/:id", productController.UpdateProduct)
		api.DELETE("/products/:id", productController.DeleteProduct)
		api.GET("/products/recent", productController.GetRecentProducts)

		// Prediction route
		api.GET("/predict/:id", predictionController.PredictOrderQuantity)

		// Auth routes
		api.POST("/register", authController.Register)
		api.POST("/login", authController.Login)
	}

	return r
}
