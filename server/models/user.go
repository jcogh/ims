package models

import "time"

type User struct {
	ID           uint   `gorm:"primaryKey"`
	Username     string `gorm:"uniqueIndex"`
	Email        string `gorm:"uniqueIndex"`
	PasswordHash string
	Role         string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
