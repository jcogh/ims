package migrations

import (
	"gorm.io/gorm"
)

func AddTimestampsToProducts(db *gorm.DB) error {
	// Check if created_at column exists
	if !db.Migrator().HasColumn(&Product{}, "created_at") {
		if err := db.Exec(`ALTER TABLE products ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`).Error; err != nil {
			return err
		}
	}

	// Check if updated_at column exists
	if !db.Migrator().HasColumn(&Product{}, "updated_at") {
		if err := db.Exec(`ALTER TABLE products ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;`).Error; err != nil {
			return err
		}
	}

	return nil
}

type Product struct {
	ID        uint
	CreatedAt string
	UpdatedAt string
}

