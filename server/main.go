package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jcogh/ims/server/models"
	"github.com/jcogh/ims/server/routes"
	"github.com/jcogh/ims/server/utils"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file only in development
	if os.Getenv("GIN_MODE") != "release" {
		if err := godotenv.Load(); err != nil {
			log.Println("Warning: .env file not found. Using environment variables.")
		}
	}

	// Set Gin mode
	if os.Getenv("GIN_MODE") != "debug" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Connect to the database
	db, err := utils.ConnectDB()
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}

	// Auto-migrate database schema
	log.Println("Starting database auto-migration...")
	if err := db.AutoMigrate(&models.User{}); err != nil {
		log.Fatal("Failed to auto-migrate database schema:", err)
	}
	if err := db.AutoMigrate(&models.Product{}); err != nil {
		log.Fatal("Failed to auto-migrate database schema:", err)
	}
	if err := db.AutoMigrate(&models.Sales{}); err != nil {
		log.Fatal("Failed to auto-migrate database schema:", err)
	}
	log.Println("Database auto-migration completed successfully")

	// Setup router
	r := routes.SetupRouter(db)

	// Determine port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // default port for local development
	}

	// Start server
	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start the server:", err)
	}
}
