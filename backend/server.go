package server

import (
	
	"github.com/gin-gonic/gin"
	"server.go/database"
	"server.go/routes"
)

func main() {
   database.Connect()
   r := gin.Default() // gives default server
   routes.RegisterRoutes(r)
   r.Run(":8080")
}