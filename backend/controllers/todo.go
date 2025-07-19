package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"server.go/database"
	"server.go/models"
)

func GetTodos(c *gin.Context) {
	userId := c.Query("userId")
	var todos []models.Todo
	database.DB.Where("user_id = ?", userId).Find(&todos)
	c.JSON(http.StatusOK, todos)
}

func CreateTodo(c *gin.Context) {
	var todo models.Todo
	c.BindJSON(&todo)
	database.DB.Create(&todo)
	c.JSON(http.StatusOK, todo)
}

func UpdateTodo(c *gin.Context) {
	id := c.Param("id")
	var todo models.Todo
	database.DB.First(&todo, id)
	c.BindJSON(&todo)
	database.DB.Save(&todo)
	c.JSON(http.StatusOK, todo)
}

func DeleteTodo(c *gin.Context) {
	id := c.Param("id")
	database.DB.Delete(&models.Todo{}, id)
	c.Status(http.StatusNoContent)
}
