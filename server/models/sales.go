package models

import "time"

type Sales struct {
	ID        uint      `gorm:"primaryKey"`
	ProductID uint      `gorm:"not null"`
	Quantity  uint      `gorm:"not null"`
	Date      time.Time `gorm:"not null"`
}

