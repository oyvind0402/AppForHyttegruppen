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
	router.Run("127.0.0.1:8080")
}

func setRouter(r repo) *gin.Engine {
	// Creates default gin router with Logger and Recovery middleware already attached
	router := gin.Default()
	//config := cors.DefaultConfig()
	//config.AllowAllOrigins = true
	//config.AllowedOrigins = []string{"http://localhost:3000"}
	//config.AllowedMethods = []string{"GET", "POST"}
	//router.Use(cors.New(config))

	// Enables automatic redirection if the current route can't be matched but a
	// handler for the path with (without) the trailing slash exists.
	router.RedirectTrailingSlash = true

	// Create API route groups
	periodapi := router.Group("/period")
	{
		periodapi.GET("/:id", r.GetPeriod)
		periodapi.GET("/inseason/:season", r.GetAllPeriodsInSeason)
		periodapi.GET("/inseason/open", r.GetAllPeriodsInOpenSeason)
		periodapi.GET("/all", r.GetAllPeriods)
		periodapi.POST("/post", r.PostPeriod)
		periodapi.POST("/postmany", r.PostManyPeriods)
		periodapi.PUT("/update", r.UpdatePeriod)
		periodapi.DELETE("/delete", r.DeletePeriod)
		periodapi.DELETE("/deletemany", r.DeleteManyPeriods)
	}

	seasonapi := router.Group("/season")
	{
		seasonapi.GET("/:name", r.GetSeason)
		seasonapi.GET("/open", r.GetCurrentOpenSeason)
		seasonapi.GET("/all", r.GetAllSeasons)
		seasonapi.POST("/post", r.PostSeason)
		seasonapi.PUT("/update", r.UpdateSeason)
		seasonapi.DELETE("/delete", r.DeleteSeason)
		seasonapi.DELETE("/deleteolder", r.DeleteOlderSeasons)
	}

	featureapi := router.Group("/feature")
	{
		featureapi.GET("/all")
		featureapi.PUT("/update")
		featureapi.DELETE("/delete")
		featureapi.DELETE("/deletemany")
	}

	cabinsapi := router.Group("/cabin")
	{
		cabinsapi.GET("/:name", r.GetCabin)
		cabinsapi.GET("/active/names", r.GetActiveCabinNames)
		cabinsapi.GET("/active", r.GetActiveCabins)
		cabinsapi.GET("/all", r.GetAllCabins)
		cabinsapi.POST("/post", r.PostCabin)
		cabinsapi.PATCH("/updatefield", r.UpdateCabinField)
		cabinsapi.PUT("/update", r.UpdateCabin)
		cabinsapi.DELETE("/delete", r.DeleteCabin)
	}

	applicationapi := router.Group("/application")
	{
		applicationapi.GET("/:id", r.GetApplication)
		applicationapi.GET("/byuser/:userid", r.GetUserApplications)
		applicationapi.GET("/byuser/:userid/past", r.GetPastTripsUserApplications)
		applicationapi.GET("/byuser/:userid/pending", r.GetPendingUserApplications)
		applicationapi.GET("/byuser/:userid/current", r.GetCurrentTripsUserApplications)
		applicationapi.GET("/byuser/:userid/future", r.GetFutureTripsUserApplications)
		applicationapi.GET("/all", r.GetAllApplications)
		applicationapi.GET("/winners/past", r.GetPastWinnerApplications)
		applicationapi.GET("/winners/future", r.GetFutureWinnerApplications)
		applicationapi.POST("/post", r.PostApplication)
		applicationapi.PUT("/update", r.UpdateApplication)
		applicationapi.PATCH("/setwinner", r.UpdateApplicationWinner)
		applicationapi.DELETE("/delete", r.DeleteApplication)
		applicationapi.DELETE("/deletelosing", r.DeleteLosingApplications)
		applicationapi.DELETE("/deletemanybyid", r.DeleteApplicationsById)
	}

	userapi := router.Group("/user")
	{
		userapi.GET("/:id", r.GetUser)
		userapi.GET("/all", r.GetAllUsers)
		userapi.POST("/post", r.PostUser)
		userapi.POST("/signup", r.PostUser)
		userapi.DELETE("/delete", r.DeleteUser)
		userapi.POST("/signin", r.SignIn)
	}

	faqapi := router.Group("/faq")
	{
		faqapi.GET("/:id", r.GetOneFAQ)
		faqapi.GET("/all", r.GetAllFAQs)
		faqapi.POST("/post", r.PostFAQ)
		faqapi.PUT("/update", r.UpdateFAQ)
		faqapi.DELETE("/delete", r.DeleteFAQ)
	}

	picturesapi := router.Group("/pictures")
	{
		picturesapi.POST("/one", r.PostOnePicture)
		picturesapi.POST("/many", r.PostManyPictures)
	}

	router.NoRoute(func(ctx *gin.Context) { ctx.JSON(http.StatusNotFound, gin.H{}) })

	return router
}
