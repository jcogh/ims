package models

import (
	"time"
)

type Sales struct {
	ID        uint    `gorm:"primaryKey"`
	ProductID uint    `gorm:"index"`
	Product   Product `gorm:"foreignKey:ProductID;references:ID"`
	Quantity  uint
	Total     float64
	SoldAt    time.Time
	CreatedAt time.Time
	UpdatedAt time.Time
}
