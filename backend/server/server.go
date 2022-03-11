package server

import (
	//"bachelorprosjekt/backend/data"

	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func Start() {
	r := startDB()
	defer r.sqlDb.Close()
	defer r.noSqlDb.Disconnect(context.Background())
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
		periodapi.GET("/getallinseason")
		periodapi.GET("/getall", r.GetAllPeriods)
		periodapi.POST("/post", r.PostPeriod)
		periodapi.POST("/postmany")
		periodapi.PUT("/update")
		periodapi.DELETE("/delete")
		periodapi.DELETE("/deletemany")
	}

	seasonapi := router.Group("/season")
	{
		seasonapi.GET("/get")
		seasonapi.GET("/getall")
		seasonapi.POST("/post")
		seasonapi.PUT("/update")
		seasonapi.DELETE("/delete")
		seasonapi.DELETE("/deletemany")
	}

	featureapi := router.Group("/feature")
	{
		featureapi.GET("/getall")
		featureapi.PUT("/update")
		featureapi.DELETE("/delete")
		featureapi.DELETE("/deletemany")
	}

	cabinsapi := router.Group("/cabin")
	{
		cabinsapi.GET("/get")
		cabinsapi.GET("/getactivenames", r.GetActiveCabinNames)
		cabinsapi.GET("/getall", r.GetAllCabins)
		cabinsapi.POST("/post", r.PostCabin)
		cabinsapi.PATCH("/updatefield")
		cabinsapi.PUT("/update")
		cabinsapi.DELETE("/delete")
		cabinsapi.DELETE("/deletemany")
	}

	entryapi := router.Group("/entry")
	{
		entryapi.GET("/get")
		entryapi.GET("/getall")
		entryapi.POST("/post")
		entryapi.PUT("/update")
		entryapi.DELETE("/delete")
		entryapi.DELETE("/deletemany")
	}

	userapi := router.Group("/user")
	{
		userapi.GET("/get")
		userapi.GET("/getall")
		userapi.POST("/post")
		userapi.PUT("/update")
		userapi.DELETE("/delete")
		userapi.DELETE("/deletemany")
	}

	router.NoRoute(func(ctx *gin.Context) { ctx.JSON(http.StatusNotFound, gin.H{}) })

	return router
}
