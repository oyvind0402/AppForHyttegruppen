package server

import (
	//"bachelorprosjekt/backend/data"
	"bufio"
	"database/sql"
	"fmt"

	// "net/http"
	"os"

	// "github.com/gin-gonic/gin"
	_ "github.com/lib/pq"

	"bachelorprosjekt/backend/utils"
)

// Defines all databases
// IMPORTANT: if changing databases, remember to change close statements in server.go > Start()
type repo struct {
	sqlDb *sql.DB
	// noSqlDb
}

func startDB() repo {
	sqlDb := startSqlDB()
	r := repo{sqlDb}
	return r
}

func startSqlDB() *sql.DB {
	// Database connection information (minus credentials)
	const (
		host   = "localhost"
		port   = 5432
		dbname = "hyttegruppen"
	)

	// Read credentials from file
	f, err := os.Open("backend/screds")
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
