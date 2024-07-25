package models

import (
	"time"
)

type Sales struct {
	ID        uint `gorm:"primaryKey"`
	ProductID uint
	Product   Product
	Quantity  uint
	Total     float64
	SoldAt    time.Time
	CreatedAt time.Time
	UpdatedAt time.Time
}

