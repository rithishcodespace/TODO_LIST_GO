package routes

import (
	"github.com/gin-gonic/gin"
	"server.go/controllers" 
)

func RegisterRoutes(r *gin.Engine) {

	r.POST("/login", controllers.Login)
	r.GET("/todos", controllers.GetTodos)
	r.POST("/todos", controllers.CreateTodo)
	r.PUT("/todos/:id", controllers.UpdateTodo)
	r.DELETE("/todos/:id", controllers.DeleteTodo)
}
