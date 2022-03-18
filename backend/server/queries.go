package server

import (
	//"net/http"

	// "context"
	// "fmt"
	"fmt"
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
//periods
func (r repo) GetPeriod(ctx *gin.Context) {
	row := r.sqlDb.QueryRow(`SELECT "start, end" FROM "Period" WHERE period_id=$1`) // decides which db to send querry to

	var start time.Time
	var end time.Time
	var season Season

	err := row.Scan(&start, &end, &season)
	utils.AbortWithStatus(err, *ctx)

	period := data.Period{Start: start, End: end, Season: season}

	ctx.JSON(200, period)
}

func (r repo) GetAllPeriods(ctx *gin.Context) {
	print(r.sqlDb)
	rows, err := r.sqlDb.Query(`SELECT * FROM Periods`)
	defer rows.Close()
	utils.AbortWithStatus(err, *ctx)

	var periods []data.Period

	for rows.Next() {
		var start time.Time
		var end time.Time
		var season Season

		err = rows.Scan(&start, &end, &season)
		utils.AbortWithStatus(err, *ctx)

		period := data.Period{Start: start, End: end, Season: season}
		periods = append(periods, period)
	}

	ctx.JSON(200, periods)
}

func (r repo) PostPeriod(ctx *gin.Context) {
	st := `INSERT INTO "Period"("start", "end", "season") values($1, $2, $3)`
	_, err := r.sqlDb.Exec(st, "01-02.2002", "28-04-2022")
	utils.AbortWithStatus(err, *ctx)
}

func (r repo) PostManyPeriods(ctx *gin.Context) {
	st := `INSERT INTO "Periods"("starting","ending") VALUES  `

	periods := new([]data.Period)
	err := ctx.Bind(periods)
	utils.AbortWithStatus(err, *ctx)

	var periodValues []interface{}

	for i, period := range *periods {
		periodValues = append(periodValues, period.Start, period.End, period.Season)
		st += fmt.Sprintf(`($%d, $%d, $%d)`, 1+3*i, 2+3*i, 3+3*i)
	}
	st += `;`
	_, err = r.sqlDb.Exec(st, periodValues...)
	utils.AbortWithStatus(err, *ctx)
}

func (r repo) UpdatePeriod(ctx *gin.Context) {
	tx, err := r.sqlDb.BeginTx(ctx, nil) //starts a transaction session with the given context
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer tx.Rollback()

	periodId := new(time.Time)
	period := new(data.Period)
	err = ctx.BindJSON(period)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
	}

	err := ctx.BindJSON(periodId)

	res, err := tx.Exec(
		`UPDATE Period SET start= $1, end = $2, season = $3 WHERE start = $4`,
		season.FirstDay, season.LastDay, season.SeasonName, periodId,
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

//season
func (r repo) GetSeason(ctx *gin.Context) {
	row := r.sqlDb.QueryRow(`SELECT "" FROM "" WHERE ""`)

	var seasonName string
	var firstDay time.Time
	var lastDay time.Time

	err := row.Scan(&seasonName, &firstDay, &lastDay)
	utils.AbortWithStatus(err, *ctx)

	season := data.Season{SeasonName: seasonName, FirstDay: &firstDay, LastDay: &lastDay}

	ctx.JSON(200, season)
}

func (r repo) GetAllSeasons(ctx *gin.Context) {
	print(r.sqlDb)
	rows, err := r.sqlDb.Query(`SELECT * FROM Season`)
	defer rows.Close()
	utils.AbortWithStatus(err, *ctx)

	var seasons []data.Season

	for rows.Next() {

		var seasonName string
		var firstDay time.Time
		var lastDay time.Time

		err = rows.Scan(&seasonName, &firstDay, &lastDay)
		utils.AbortWithStatus(err, *ctx)

		season := data.Season{SeasonName: seasonName, FirstDay: &firstDay, LastDay: &lastDay}
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
		season.FirstDay, season.LastDay, season.SeasonName,
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
