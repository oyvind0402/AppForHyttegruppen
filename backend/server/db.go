package server

import (
	"bachelorprosjekt/backend/utils"
	"context"
	"database/sql"
	"fmt"
	"net/url"
	"os"
	"time"

	_ "github.com/lib/pq"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Defines all databases
// IMPORTANT: if changing databases, remember to change close statements in server.go > Start()
type repo struct {
	sqlDb   *sql.DB
	noSqlDb *mongo.Client
}

func startDB() repo {
	path := os.Getenv("hyttecreds")
	sqlDb := startSqlDB(path)
	noSqlDb := startNoSqlDB(path)
	r := repo{sqlDb, noSqlDb}
	return r
}

func startSqlDB(path string) *sql.DB {
	// Database connection information
	const (
		host   = "localhost"
		port   = 5432
		dbname = "hyttegruppen"
	)
	username, passwd := utils.GetCreds(fmt.Sprintf("%s/screds", path))

	// Start database
	params := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, username, passwd, dbname)
	db, err := sql.Open("postgres", params)
	utils.Panicker(err, "Cannot open database")

	return db
}

func startNoSqlDB(path string) *mongo.Client {
	// Database connection information
	const (
		host       = "localhost"
		port       = 27017
		authSource = "admin"
	)
	username, passwd := utils.GetCreds(fmt.Sprintf("%s/nscreds", path))
	passwd = url.QueryEscape(passwd)

	// Start client and connect to database
	mdbURI := fmt.Sprintf("mongodb://%s:%s@%s:%d/?authSource=%s", username, passwd, host, port, authSource)
	db, err := mongo.NewClient(options.Client().ApplyURI(mdbURI))
	utils.Panicker(err, "Could not authenticate into MongoDB (client)")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = db.Connect(ctx)
	utils.Panicker(err, "Could not connect to MongoDB")

	return db
}
