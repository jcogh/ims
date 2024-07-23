package main

import (
	"github.com/jmcgh/ims/server/models"
	"github.com/jmcgh/ims/server/routes"
	"github.com/jmcgh/ims/server/utils"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Connect to the database
	db, err := utils.ConnectDB()
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}

	// Auto-migrate the database schema
	db.AutoMigrate(&models.Product{}, &models.User{})

	// Set up the router
	r := routes.SetupRouter(db)

	// Start the server
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start the server:", err)
	}
}
