package server

import (
	//"bachelorprosjekt/backend/data"

	"bachelorprosjekt/backend/middleware"
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

	router.SetTrustedProxies([]string{"localhost:3000", "159.223.16.218"})

	// Create API route groups
	periodapi := router.Group("/api/period")
	{
		periodapi.GET("/:id", r.GetPeriod)
		periodapi.GET("/inseason/:season", r.GetAllPeriodsInSeason)
		periodapi.GET("/inseason/open", r.GetAllPeriodsInOpenSeason)
		periodapi.GET("/all", r.GetAllPeriods)
		periodapi.POST("/post", middleware.AuthenticateAdmin(), r.PostPeriod)
		periodapi.POST("/postmany", middleware.AuthenticateAdmin(), r.PostManyPeriods)
		periodapi.PUT("/update", middleware.AuthenticateAdmin(), r.UpdatePeriod)
		periodapi.DELETE("/delete", middleware.AuthenticateAdmin(), r.DeletePeriod)
		periodapi.DELETE("/deletemany", middleware.AuthenticateAdmin(), r.DeleteManyPeriods)
	}

	emailapi := router.Group("/api/email")
	{
		emailapi.POST("/afterApplication", r.AfterApplicationSent)
		emailapi.POST("/applicationApproved", r.AfterApplicationApproved)
		emailapi.POST("/openPeriod")
		emailapi.POST("/filledFeedback", r.AfterFeedbackSent)
		emailapi.POST("/cancelledTrip", r.AfterTripCancelled)
	}

	seasonapi := router.Group("/api/season")
	{
		seasonapi.GET("/:name", r.GetSeason)
		seasonapi.GET("/open", r.GetCurrentOpenSeason)
		seasonapi.GET("/all", r.GetAllSeasons)
		seasonapi.POST("/post", middleware.AuthenticateAdmin(), r.PostSeason)
		seasonapi.PUT("/update", middleware.AuthenticateAdmin(), r.UpdateSeason)
		seasonapi.DELETE("/delete", middleware.AuthenticateAdmin(), r.DeleteSeason)
		seasonapi.DELETE("/deleteolder", middleware.AuthenticateAdmin(), r.DeleteOlderSeasons)
	}

	featureapi := router.Group("/api/feature")
	{
		featureapi.GET("/all")
		featureapi.PUT("/update")
		featureapi.DELETE("/delete")
		featureapi.DELETE("/deletemany")
	}

	cabinsapi := router.Group("/api/cabin")
	{
		cabinsapi.GET("/:name", r.GetCabin)
		cabinsapi.GET("/active/names", r.GetActiveCabinNames)
		cabinsapi.GET("/active", r.GetActiveCabins)
		cabinsapi.GET("/all", r.GetAllCabins)
		cabinsapi.POST("/post", middleware.AuthenticateAdmin(), r.PostCabin)
		cabinsapi.PATCH("/updatefield", middleware.AuthenticateAdmin(), r.UpdateCabinField)
		cabinsapi.PUT("/update", middleware.AuthenticateAdmin(), r.UpdateCabin)
		cabinsapi.PUT("/updateWithPicture", middleware.AuthenticateAdmin(), r.UpdateCabinWithPicture)
		cabinsapi.DELETE("/delete", middleware.AuthenticateAdmin(), r.DeleteCabin)
	}

	applicationapi := router.Group("/api/application")
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
		applicationapi.PUT("/update", middleware.AuthenticateAdmin(), r.UpdateApplication)
		applicationapi.PATCH("/setwinner", middleware.AuthenticateAdmin(), r.UpdateApplicationWinner)
		applicationapi.PATCH("/setfeedback", middleware.Authenticate(), r.UpdateApplicationFeedback)
		applicationapi.DELETE("/delete", middleware.Authenticate(), r.DeleteApplication)
		applicationapi.DELETE("/deletelosing", middleware.AuthenticateAdmin(), r.DeleteLosingApplications)
		applicationapi.DELETE("/deletemanybyid", middleware.AuthenticateAdmin(), r.DeleteApplicationsById)
	}

	userapi := router.Group("/api/user")
	{
		userapi.GET("/:email", r.GetUserByEmail)
		userapi.GET("/all", r.GetAllUsers)
		userapi.POST("/post", r.PostUser)
		userapi.POST("/signup", r.PostUser)
		userapi.DELETE("/delete", r.DeleteUser)
		userapi.POST("/signin", r.SignIn)
		userapi.GET("/logout", r.LogOut)
		userapi.PATCH("/setadmin", middleware.AuthenticateAdmin(), r.UpdateUserAdminAccess)
	}

	faqapi := router.Group("/api/faq")
	{
		faqapi.GET("/:id", r.GetOneFAQ)
		faqapi.GET("/all", r.GetAllFAQs)
		faqapi.POST("/post", middleware.AuthenticateAdmin(), r.PostFAQ)
		faqapi.PUT("/update", middleware.AuthenticateAdmin(), r.UpdateFAQ)
		faqapi.DELETE("/delete", middleware.AuthenticateAdmin(), r.DeleteFAQ)
	}

	picturesapi := router.Group("/api/pictures")
	{
		picturesapi.POST("/main", middleware.AuthenticateAdmin(), r.PostMainPicture)
		picturesapi.POST("/one", middleware.AuthenticateAdmin(), r.PostOnePicture)
		picturesapi.POST("/replace", middleware.AuthenticateAdmin(), r.PostReplaceRestPicture)
		picturesapi.POST("/replaceFirst", middleware.AuthenticateAdmin(), r.PostReplaceFirstRestPicture)
		picturesapi.POST("/deletepictures", middleware.AuthenticateAdmin(), r.DeletePictures)
	}

	adminapi := router.Group("/api/admin_email")
	{
		adminapi.GET("/all", r.GetAllAdminEmailAddresses)
		adminapi.POST("/post", middleware.AuthenticateAdmin(), r.PostAdminEmailAddress)
		adminapi.PUT("/update", middleware.AuthenticateAdmin(), r.UpdateAdminEmailAddress)
		adminapi.DELETE("/delete", middleware.AuthenticateAdmin(), r.DeleteAdminEmailAddress)
	}

	router.NoRoute(func(ctx *gin.Context) { ctx.JSON(http.StatusNotFound, gin.H{}) })

	return router
}
