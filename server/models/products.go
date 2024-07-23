package models

type Product struct {
	ID          uint    `gorm:"primaryKey" json:"ID"`
	SKU         string  `gorm:"not null;unique" json:"SKU"`
	Name        string  `gorm:"not null" json:"Name"`
	Description string  `json:"Description"`
	Quantity    uint    `gorm:"not null" json:"Quantity"`
	Price       float64 `gorm:"not null" json:"Price"`
}

