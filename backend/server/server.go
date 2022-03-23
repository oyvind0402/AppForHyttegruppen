package server

import (
	//"bachelorprosjekt/backend/data"

	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func Start() {
	// Handle databases
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
		periodapi.GET("/getallinseason", r.GetAllPeriodsInSeason)
		periodapi.GET("/getall", r.GetAllPeriods)
		periodapi.POST("/post", r.PostPeriod)
		periodapi.POST("/postmany", r.PostManyPeriods)
		periodapi.PUT("/update", r.UpdatePeriod)
		periodapi.DELETE("/delete", r.DeletePeriod)
		periodapi.DELETE("/deletemany", r.DeleteManyPeriods)
	}

	seasonapi := router.Group("/season")
	{
		seasonapi.GET("/get", r.GetSeason)
		seasonapi.GET("/getcurrentopen", r.GetCurrentOpenSeason)
		seasonapi.GET("/getall", r.GetAllSeasons)
		seasonapi.POST("/post", r.PostSeason)
		seasonapi.PUT("/update", r.UpdateSeason)
		seasonapi.DELETE("/delete", r.DeleteSeason)
		seasonapi.DELETE("/deleteolder", r.DeleteOlderSeasons)
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
		cabinsapi.GET("/get", r.GetCabin)
		cabinsapi.GET("/getactivenames", r.GetActiveCabinNames)
		cabinsapi.GET("/getall", r.GetAllCabins)
		//cabinsapi.POST("/post", r.PostCabin)
		cabinsapi.PATCH("/updatefield")
		cabinsapi.PUT("/update")
		cabinsapi.DELETE("/delete")
		cabinsapi.DELETE("/deletemany")
	}

	applicationapi := router.Group("/application")
	{
		applicationapi.GET("/get", r.GetApplication)
		applicationapi.GET("/getbyuser", r.GetUserApplications)
		applicationapi.GET("/getbyuserwon", r.GetPastTripsUserApplications)
		applicationapi.GET("/getbyuserpending", r.GetPendingUserApplications)
		applicationapi.GET("/getbyusercurrent", r.GetCurrentTripsUserApplications)
		applicationapi.GET("/getbyuserfuture", r.GetFutureTripsUserApplications)
		applicationapi.GET("/getall", r.GetAllApplications)
		applicationapi.POST("/post", r.PostApplication)
		applicationapi.PUT("/update", r.UpdateApplication)
		applicationapi.PATCH("/setwinner", r.UpdateApplicationWinner)
		applicationapi.DELETE("/delete", r.DeleteApplication)
		applicationapi.DELETE("/deletelosing", r.DeleteLosingApplications)
		applicationapi.DELETE("/deletemanybyid", r.DeleteApplicationsById)
	}

	userapi := router.Group("/user")
	{
		userapi.GET("/get", r.GetUser)
		userapi.GET("/getall", r.GetAllUsers)
		userapi.POST("/post", r.PostUser)
		userapi.POST("/signup", r.PostUser)
		userapi.DELETE("/delete", r.DeleteUser)
		userapi.GET("/signin", r.SignIn)
	}

	router.NoRoute(func(ctx *gin.Context) { ctx.JSON(http.StatusNotFound, gin.H{}) })

	return router
}
