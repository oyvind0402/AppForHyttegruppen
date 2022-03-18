package server

import (
	//"net/http"

	// "context"
	// "fmt"

	"net/http"
	"time"

	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"

	"github.com/gin-gonic/gin"
	// "go.mongodb.org/mongo-driver/bson"
	// "go.mongodb.org/mongo-driver/bson/primitive"
)

// curl -X GET -v -d "1" localhost:8080/application/get
// -X -> type of request (POST/GET...) -d -> data that you send in.
/*
	var end *string address = 1
	add(end) -> object itself in the array
	add(*end) -> takes a pointer and returns the variable
	add(&end) -> creates a pointer


*/

func (r repo) GetSeason(ctx *gin.Context) {
	row := r.sqlDb.QueryRow(`SELECT "" FROM "" WHERE ""`)

	var name string
	var firstDay time.Time
	var lastDay time.Time

	err := row.Scan(&name, &firstDay, &lastDay)
	utils.AbortWithStatus(err, *ctx)

	season := data.Season{Name: name, FirstDay: &firstDay, LastDay: &lastDay}  //why pointers here? 

	ctx.JSON(200, season)
}

func (r repo) GetAllSeasons(ctx *gin.Context) {
	print(r.sqlDb)
	rows, err := r.sqlDb.Query(`SELECT * FROM Season`)
	defer rows.Close()
	utils.AbortWithStatus(err, *ctx)

	var seasons []data.Season

	for rows.Next() {

		var name string
		var firstDay time.Time
		var lastDay time.Time

		err = rows.Scan(&name, &firstDay, &lastDay)
		utils.AbortWithStatus(err, *ctx)

		season := data.Season{Name: name, FirstDay: &firstDay, LastDay: &lastDay}
		seasons = append(seasons, season)
	}

	ctx.JSON(200, seasons)
}

func (r repo) PostSeason(ctx *gin.Context) {
	st := `INSERT INTO "Season"( "seasonName","firstDay", "lastDay") values($1, $2, $3)`
	_, err := r.sqlDb.Exec(st, "Winter2023", "01-02.2023", "31-03-2023")
	utils.AbortWithStatus(err, *ctx)
}

func (r repo) UpdateSeason(ctx *gin.Context) {
	tx, err := r.sqlDb.BeginTx(ctx, nil) //starts a transaction session with the given context
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer tx.Rollback()

	season := new(data.Season)
	err = ctx.BindJSON(season)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
	}

	res, err := tx.Exec(
		`UPDATE Season SET first_day = $1, last_day = $2WHERE season_name = $3`,
		season.FirstDay, season.LastDay, season.Name,
	)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	ctx.JSON(200, rowsAffected)
}

func (r repo) DeleteSeason(ctx *gin.Context) {
	seasonId := new(string)

	err := ctx.BindJSON(seasonId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	res, err := r.sqlDb.Exec(`DELETE FROM Season WHERE season_name = $1`, &seasonId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, rowsAffected)
}

func (r repo) DeleteSeasons(ctx *gin.Context) {
	inputDate := new(string)

	err := ctx.BindJSON(inputDate)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	res, err := r.sqlDb.Exec(`DELETE FREOM Seasons WHERE last_day < $1`, inputDate)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	ctx.JSON(200, rowsAffected)
}
