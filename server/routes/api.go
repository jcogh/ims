package routes

import (
	"github.com/jmcgh/ims/server/controllers"
	"github.com/jmcgh/ims/server/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	productController := controllers.NewProductController(db)
	authController := controllers.NewAuthController(db)
	predictionController := controllers.NewPredictionController(db)

	api := r.Group("/api")
	{
		api.POST("/products", productController.CreateProduct)
		api.GET("/products", productController.GetProducts)
		api.GET("/predict/:id", predictionController.PredictOrderQuantity)
		api.PUT("/products/:id", productController.UpdateProduct)
		api.DELETE("/products/:id", productController.DeleteProduct)
		api.POST("/register", authController.Register)
		api.POST("/login", authController.Login)
	}

	return r
}
