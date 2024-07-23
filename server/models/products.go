package models

type Product struct {
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"not null"`
	Description string
	Quantity    uint    `gorm:"not null"`
	Price       float64 `gorm:"not null"`
}

