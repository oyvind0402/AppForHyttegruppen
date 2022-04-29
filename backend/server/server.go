package server

import (
	//"bachelorprosjekt/backend/data"

	"bachelorprosjekt/backend/middleware"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type Args struct {
	RootPath  string
	CredsPath string
}

func Start(args Args) {
	// Handle databases
	r := startDB(args.CredsPath)
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

	emailapi := router.Group("/email")
	{
		emailapi.POST("/afterApplication", r.AfterApplication)
		emailapi.POST("/applicationApproved")
		emailapi.POST("/openPeriod")
		emailapi.POST("/periodIsClosing")
		emailapi.POST("/upcomingTrip")
		emailapi.POST("/fillFeedback")
	}
	// Create API route groups
	periodapi := router.Group("/period")
	{
		periodapi.GET("/:id", r.GetPeriod)
		periodapi.GET("/inseason/:season", r.GetAllPeriodsInSeason)
		periodapi.GET("/inseason/open", r.GetAllPeriodsInOpenSeason)
		periodapi.GET("/all", r.GetAllPeriods)
		periodapi.POST("/post", middleware.Authenticate(), r.PostPeriod)
		periodapi.POST("/postmany", middleware.Authenticate(), r.PostManyPeriods)
		periodapi.PUT("/update", middleware.Authenticate(), r.UpdatePeriod)
		periodapi.DELETE("/delete", middleware.Authenticate(), r.DeletePeriod)
		periodapi.DELETE("/deletemany", middleware.Authenticate(), r.DeleteManyPeriods)
	}

	seasonapi := router.Group("/season")
	{
		seasonapi.GET("/:name", r.GetSeason)
		seasonapi.GET("/open", r.GetCurrentOpenSeason)
		seasonapi.GET("/all", r.GetAllSeasons)
		seasonapi.POST("/post", middleware.Authenticate(), r.PostSeason)
		seasonapi.PUT("/update", middleware.Authenticate(), r.UpdateSeason)
		seasonapi.DELETE("/delete", middleware.Authenticate(), r.DeleteSeason)
		seasonapi.DELETE("/deleteolder", middleware.Authenticate(), r.DeleteOlderSeasons)
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
		cabinsapi.POST("/post", middleware.Authenticate(), r.PostCabin)
		cabinsapi.PATCH("/updatefield", middleware.Authenticate(), r.UpdateCabinField)
		cabinsapi.PUT("/update", middleware.Authenticate(), r.UpdateCabin)
		cabinsapi.PUT("/updateWithPicture", middleware.Authenticate(), r.UpdateCabinWithPicture)
		cabinsapi.DELETE("/delete", middleware.Authenticate(), r.DeleteCabin)
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
		applicationapi.GET("/winners/current", r.GetCurrentApplications)
		applicationapi.GET("/pending/future", r.GetFuturePendingApplications)
		applicationapi.GET("/pending/past", r.GetPastPendingApplications)
		applicationapi.POST("/post", middleware.Authenticate(), r.PostApplication)
		applicationapi.PUT("/update", middleware.Authenticate(), r.UpdateApplication)
		applicationapi.PATCH("/setwinner", middleware.Authenticate(), r.UpdateApplicationWinner)
		applicationapi.PATCH("/setfeedback", middleware.Authenticate(), r.UpdateApplicationFeedback)
		applicationapi.DELETE("/delete", middleware.Authenticate(), r.DeleteApplication)
		applicationapi.DELETE("/deletelosing", middleware.Authenticate(), r.DeleteLosingApplications)
		applicationapi.DELETE("/deletemanybyid", middleware.Authenticate(), r.DeleteApplicationsById)
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
		faqapi.POST("/post", middleware.Authenticate(), r.PostFAQ)
		faqapi.PUT("/update", middleware.Authenticate(), r.UpdateFAQ)
		faqapi.DELETE("/delete", middleware.Authenticate(), r.DeleteFAQ)
	}

	picturesapi := router.Group("/pictures")
	{
		picturesapi.POST("/main", middleware.Authenticate(), r.PostMainPicture)
		picturesapi.POST("/one", middleware.Authenticate(), r.PostOnePicture)
		picturesapi.POST("/replace", middleware.Authenticate(), r.PostReplaceRestPicture)
		picturesapi.POST("/replaceFirst", middleware.Authenticate(), r.PostReplaceFirstRestPicture)
	}

	router.NoRoute(func(ctx *gin.Context) { ctx.JSON(http.StatusNotFound, gin.H{}) })

	return router
}
