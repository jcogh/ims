package models

import "time"

type Product struct {
	ID          uint   `gorm:"primaryKey"`
	SKU         string `gorm:"type:varchar(255);uniqueIndex"`
	Name        string
	Description string
	Quantity    uint
	Price       float64
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
