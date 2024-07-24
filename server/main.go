package main

import (
	"github.com/jcogh/ims/server/migrations"
	"github.com/jcogh/ims/server/models"
	"github.com/jcogh/ims/server/routes"
	"github.com/jcogh/ims/server/utils"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
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

	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start the server:", err)
	}
}

