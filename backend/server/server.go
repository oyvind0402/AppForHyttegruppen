package server

import (
	//"bachelorprosjekt/backend/data"
	"bufio"
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"

	"bachelorprosjekt/backend/utils"
)

type repo struct {
	db *sql.DB
}

func Start() {
	db := startDB()
	defer db.Close()
	r := repo{db}
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

func startDB() *sql.DB {
	// Database connection information (minus credentials)
	const (
		host   = "localhost"
		port   = 5432
		dbname = "hypothetical"
	)

	// Read credentials from file
	f, err := os.Open("backend/creds")
	defer f.Close()
	utils.Panicker(err, "Cannot read credentials")

	reader := bufio.NewReader(f)
	usernameByte, _, err := reader.ReadLine()
	username := string(usernameByte)
	utils.Panicker(err, "Cannot read username")

	passwdBytes, _, err := reader.ReadLine()
	passwd := string(passwdBytes)
	utils.Panicker(err, "Cannot read password")

	// Start database
	params := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s", host, port, username, passwd, dbname)
	db, err := sql.Open("postgres", params)
	utils.Panicker(err, "Cannot open database")

	return db
}
