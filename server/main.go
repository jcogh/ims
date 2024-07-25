package main

import (
	"log"
	"os"

	"github.com/jcogh/ims/server/migrations"
	"github.com/jcogh/ims/server/models"
	"github.com/jcogh/ims/server/routes"
	"github.com/jcogh/ims/server/utils"
	"github.com/joho/godotenv"
)

func main() {
	if os.Getenv("GIN_MODE") != "release" {
		if err := godotenv.Load(); err != nil {
			log.Println("Warning: .env file not found. Using environment variables.")
		}
	}

	db, err := utils.ConnectDB()
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}

	if err := migrations.AddTimestampsToProducts(db); err != nil {
		log.Printf("Migration warning: %v", err)
	}

	db.AutoMigrate(&models.Product{}, &models.User{}, &models.Sales{})

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

