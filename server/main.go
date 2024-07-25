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

	log.Printf("Database Config: Host=%s, Port=%s, User=%s, DBName=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_NAME"),
	)

	db, err := utils.ConnectDB()
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}

	// Verify the connection
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get database instance:", err)
	}
	err = sqlDB.Ping()
	if err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	log.Println("Successfully connected to the database")

	log.Println("Starting database auto-migration...")
	if err := db.AutoMigrate(&models.User{}, &models.Product{}, &models.Sales{}); err != nil {
		log.Fatal("Failed to auto-migrate database schema:", err)
	}
	log.Println("Database auto-migration completed successfully")

	r := routes.SetupRouter(db)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // default port for local development
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start the server:", err)
	}
}

