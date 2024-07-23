package migrations

import (
	"gorm.io/gorm"
)

func AddTimestampsToProducts(db *gorm.DB) error {
	return db.Exec(`
		ALTER TABLE products
		ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
	`).Error
}
