package models

import "time"

type Product struct {
	ID          uint      `gorm:"primaryKey" json:"ID"`
	SKU         string    `gorm:"uniqueIndex;not null" json:"SKU"`
	Name        string    `gorm:"not null" json:"Name"`
	Description string    `json:"Description"`
	Quantity    uint      `gorm:"not null" json:"Quantity"`
	Price       float64   `gorm:"not null" json:"Price"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"CreatedAt"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"UpdatedAt"`
}

