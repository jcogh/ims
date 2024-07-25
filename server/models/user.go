package models

import (
	"time"
)

type User struct {
	ID           uint   `gorm:"primaryKey"`
	Username     string `gorm:"type:varchar(255);uniqueIndex"`
	Email        string `gorm:"type:varchar(255);uniqueIndex"`
	PasswordHash string `gorm:"type:varchar(255)"`
	Role         string `gorm:"type:varchar(50)"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

