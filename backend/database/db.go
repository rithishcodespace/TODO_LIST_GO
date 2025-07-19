package database

import (
	"log"
	"todo_list/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB // global variable - which stores db connection another is a pointer to object containing methods for querying, inserting, updating, deleting, etc.

func Connect() {
	dsn := "root:Rithish@2006@tcp(127.0.0.1:3306)/todo_db?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("DB connection failed:", err)
	}
	DB.AutoMigrate(&models.User{}, &models.Todo{})
}
