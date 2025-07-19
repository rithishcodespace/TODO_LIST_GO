package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
   "time"
	"server.go/database"
	"server.go/routes"
)

func main() {
	database.Connect()

	r := gin.Default()

	// Proper CORS config
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},                   // ❌ No slash at end
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"}, // ✅ Include OPTIONS
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "Server running"})
	})

	routes.RegisterRoutes(r)

	r.Run(":8080") // Start server
}
