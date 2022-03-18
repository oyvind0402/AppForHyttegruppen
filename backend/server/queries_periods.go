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

//TODO change period start and endt types to pointers

// retrieves one peried by id (receives int)
func (r repo) getPeriodById(ctx *gin.Context, periodId int) (data.Period, error) {
	// Define Period
	var period data.Period

	// Retrieve period by ID
	rows, err := r.sqlDb.Query(`SELECT * FROM Periods WHERE period_id = $1 LIMIT 1`, periodId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return period, err
	}
	defer rows.Close()

	// Populate Period fields with column values
	for rows.Next() {
		// Map columns to Period fields
		if err = rows.Scan(
			&period.Id,
			&period.Name,
			&period.Season.Name,
			&period.Start,
			&period.End); err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		}
	}

	// Return period and error
	return period, err
}

/*periods*/
//retrieve one period
func (r repo) GetPeriod(ctx *gin.Context) {
	id := new(int) //new creates a pointer
	err := ctx.BindJSON(id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	
	period, err := r.getPeriodById(ctx, *id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, period)
}

/*
//get all periods from 1 season
func(r repo) GetAllInSeason(ctx *gin.Context){
	st := `SELECT name, start, end WHERE season `
	
	period := new(data.Period)
	err := ctx.BindJSON(period)
	utils.AbortWithStatus(err, *ctx)

	st += fmt.Sprint(``)
}
*/

func (r repo) GetAllPeriods(ctx *gin.Context) {
	print(r.sqlDb)
	rows, err := r.sqlDb.Query(`SELECT * FROM Periods`)
	defer rows.Close()
	utils.AbortWithStatus(err, *ctx)

	var periods []data.Period

	for rows.Next() {
		var id int
		var name string
		var season data.Season
		var start time.Time
		var end time.Time

		err = rows.Scan(&id, &name,  &season.Name, &start, &end)
		utils.AbortWithStatus(err, *ctx)

		period := data.Period{Id: id, Name: name, Season: season, Start: start, End: end}
		periods = append(periods, period)
	}

	ctx.JSON(200, periods)
}

func (r repo) PostPeriod(ctx *gin.Context) {
	period := new(data.Period)
	err := ctx.BindJSON(period)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	var resId int
	if err = r.sqlDb.QueryRow(

		`INSERT INTO Periods(period_name, season_name, starting, ending) VALUES($1, $2, $3, $4) RETURNING period_id`,
		period.Name,
		period.Season.Name,
		period.Start,
		period.End,
	).Scan(&resId); err != nil{
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	ctx.JSON(200, resId)
}
//FIXME return 
func (r repo) PostManyPeriods(ctx *gin.Context) {
	st := `INSERT INTO Periods(period_name, season_name, starting, ending) VALUES  `

	periods := new([]data.Period)
	err := ctx.BindJSON(periods)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}


	var periodValues []interface{}

	for i, period := range *periods {	
		periodValues = append(periodValues, period.Name, period.Season.Name, period.Start, period.End)
		if i != 0 {
			st += `, `
		}
		st += fmt.Sprintf(`($%d, $%d, $%d, $%d)`, 1+4*i, 2+4*i, 3+4*i, 4+4*i)
		
	}
	
	st += `;`
	res, err := r.sqlDb.Exec(st, periodValues...)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	rowsAffected, err := res.RowsAffected()
	if err != nil{
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	
	ctx.JSON(200, rowsAffected)
}

func (r repo) UpdatePeriod(ctx *gin.Context) {
	tx, err := r.sqlDb.BeginTx(ctx, nil) //starts a transaction session with the given context
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer tx.Rollback()

	period := new(data.Period)
	err = ctx.BindJSON(period)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
	}

	res, err := tx.Exec(
		`UPDATE Period SET name = $1 season = $2, start= $3, end = $4,  WHERE period_id = $4`,
		period.Name, period.Season, period.Start, period.End, period.Id,
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

// delete

//delete many
