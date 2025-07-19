package models

import "gorm.io/gorm"

type User struct {
	gorm.Model // embedded struct from GORM which gives id(primary key with auto_increment), createdAt, updatedAt, deletedAt
	Username string `json:"username" gorm:"unique"`
	Password string `json:"password"`
}