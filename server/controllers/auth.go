package controllers

import (
	"github.com/jcogh/ims/server/models"
	"github.com/jcogh/ims/server/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthController struct {
	DB *gorm.DB
}

func NewAuthController(db *gorm.DB) *AuthController {
	return &AuthController{DB: db}
}

func (ac *AuthController) Register(c *gin.Context) {
	var input struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		log.Printf("Registration error: Invalid input data - %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data", "details": err.Error()})
		return
	}

	// Check if username already exists
	var existingUser models.User
	if err := ac.DB.Where("username = ?", input.Username).First(&existingUser).Error; err == nil {
		log.Printf("Registration error: Username '%s' already exists", input.Username)
		c.JSON(http.StatusConflict, gin.H{"error": "Username already exists"})
		return
	} else if err != gorm.ErrRecordNotFound {
		log.Printf("Registration error: Database error while checking username - %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	// Check if email already exists
	if err := ac.DB.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
		log.Printf("Registration error: Email '%s' already exists", input.Email)
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	} else if err != gorm.ErrRecordNotFound {
		log.Printf("Registration error: Database error while checking email - %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Registration error: Failed to hash password - %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password"})
		return
	}

	user := models.User{
		Username:     input.Username,
		Email:        input.Email,
		PasswordHash: string(hashedPassword),
		Role:         "user", // Default role
	}

	if err := ac.DB.Create(&user).Error; err != nil {
		log.Printf("Registration error: Failed to create user - %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	log.Printf("User registered successfully: ID=%d, Username=%s", user.ID, user.Username)
	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully", "userId": user.ID})
}

func (ac *AuthController) Login(c *gin.Context) {
	var loginData struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&loginData); err != nil {
		log.Printf("Login error: Invalid input data - %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data", "details": err.Error()})
		return
	}

	var user models.User
	if err := ac.DB.Where("username = ?", loginData.Username).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			log.Printf("Login error: User not found - Username: %s", loginData.Username)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		} else {
			log.Printf("Login error: Database error while fetching user - %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		}
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(loginData.Password)); err != nil {
		log.Printf("Login error: Invalid password for user %s", user.Username)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	token, err := utils.GenerateJWT(user.ID, user.Role)
	if err != nil {
		log.Printf("Login error: Failed to generate token - %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate authentication token"})
		return
	}

	log.Printf("Login successful: User %s (ID: %d) logged in", user.Username, user.ID)
	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"role":     user.Role,
		},
	})
}

