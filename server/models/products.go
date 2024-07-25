package models

import (
	"time"
)

type Product struct {
	ID          uint   `gorm:"primaryKey"`
	SKU         string `gorm:"type:varchar(255);uniqueIndex"`
	Name        string `gorm:"type:varchar(255)"`
	Description string `gorm:"type:text"`
	Quantity    uint
	Price       float64
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

