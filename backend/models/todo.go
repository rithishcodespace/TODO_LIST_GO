package models

import "gorm.io/gorm"

type Todo struct {
	gorm.Model // embedded struct from GORM which gives id(primary key with auto_increment), createdAt, updatedAt, deletedAt
	Title     string `json:"title"`
	Completed bool   `json:"completed"`
	UserID    uint   `json:"userId"`
}