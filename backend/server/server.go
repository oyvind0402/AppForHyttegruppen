package server

import (
	//"bachelorprosjekt/backend/data"

	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func Start() {
	r := startDB()
	defer r.sqlDb.Close()
	router := setRouter(r)
	// Start listening and serving requests
	router.Run(":8080")
}

func setRouter(r repo) *gin.Engine {
	// Creates default gin router with Logger and Recovery middleware already attached
	router := gin.Default()

	// Enables automatic redirection if the current route can't be matched but a
	// handler for the path with (without) the trailing slash exists.
	router.RedirectTrailingSlash = true

	// Create API route groups
	periodapi := router.Group("/period")
	{
		periodapi.GET("/get", r.GetPeriod)
		periodapi.GET("/getall", r.GetAllPeriods)
		periodapi.POST("/post", r.PostPeriod)
	}

	userapi := router.Group("/user")
	{
		userapi.GET("/get")
		userapi.GET("/getall")
		userapi.POST("/post")
	}

	cabinsapi := router.Group("/cabin")
	{
		cabinsapi.GET("/get")
		cabinsapi.GET("/getall")
		cabinsapi.POST("/post")
	}

	entryapi := router.Group("/entry")
	{
		entryapi.GET("/get")
		entryapi.GET("/getall")
		entryapi.POST("/post")
	}

	router.NoRoute(func(ctx *gin.Context) { ctx.JSON(http.StatusNotFound, gin.H{}) })

	return router
}
