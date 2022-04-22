package server

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"bachelorprosjekt/backend/data"

	"github.com/gin-gonic/gin"
)

// Retrieve one peried by id (reusable function)
func (r repo) getPeriodById(ctx *gin.Context, periodId int) (data.Period, error) {
	// Define Period
	var period data.Period

	// Retrieve period by ID
	row := r.sqlDb.QueryRow(`SELECT * FROM Periods WHERE period_id = $1`, periodId)

	// Populate Period fields with column values
	var err error
	if err = row.Scan(
		&period.Id,
		&period.Name,
		&period.Season.Name,
		&period.Start,
		&period.End); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
	}

	// Return period and error
	return period, err
}

// Parse many *sql.Rows into []Period
func (r repo) getPeriodsFromRows(ctx *gin.Context, rows *sql.Rows) ([]data.Period, error) {
	var periods []data.Period
	var err error

	for rows.Next() {
		var id int
		var name string
		var season data.Season
		var start time.Time
		var end time.Time

		if err = rows.Scan(&id, &name, &season.Name, &start, &end); err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return nil, err
		}

		period := data.Period{Id: id, Name: name, Season: season, Start: &start, End: &end}
		periods = append(periods, period)
	}
	return periods, err
}

// Retrieve one period (receives id: int; returns Period)
func (r repo) GetPeriod(ctx *gin.Context) {
	// Get ID from context
	rec := ctx.Param("id")

	id, err := strconv.Atoi(rec)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Query for period
	period, err := r.getPeriodById(ctx, id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, period)
}

// Retrieve periods in season (receives seasonName: string; returns []Periods)
func (r repo) GetAllPeriodsInSeason(ctx *gin.Context) {
	// Get season name from context
	seasonName := ctx.Param("season")

	// Query for Periods with specified season name
	rows, err := r.sqlDb.Query(`SELECT * FROM Periods WHERE season_name = $1 ORDER BY starting ASC`, seasonName)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	// Process rows into []Period
	periods, err := r.getPeriodsFromRows(ctx, rows)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, periods)
}

// Retrieve periods in season (receives seasonName: string; returns []Periods)
func (r repo) GetAllPeriodsInOpenSeason(ctx *gin.Context) {
	curdate := time.Now()

	// Query for Periods with specified season name
	rows, err := r.sqlDb.Query(`SELECT * FROM Periods WHERE season_name = 
	(SELECT season_name
		FROM Seasons
		WHERE apply_from <= $1 AND apply_until >= $1)`, curdate)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	// Process rows into []Period
	periods, err := r.getPeriodsFromRows(ctx, rows)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, periods)
}

// Get all periods (receives NOTHING; returns []Period)
func (r repo) GetAllPeriods(ctx *gin.Context) {
	// Query for periods
	rows, err := r.sqlDb.Query(`SELECT * FROM Periods ORDER BY starting ASC`)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	// Process rows into periods
	periods, err := r.getPeriodsFromRows(ctx, rows)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, periods)
}

// Post one period (receives Period; returns periodId: int)
func (r repo) PostPeriod(ctx *gin.Context) {
	// Retrieve Period from context
	period := new(data.Period)
	err := ctx.BindJSON(period)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Post period and retrieve ID of posted period
	var resId int
	if err = r.sqlDb.QueryRow(
		`INSERT INTO Periods(period_name, season_name, starting, ending) 
			VALUES($1, $2, $3, $4)
			RETURNING period_id`,
		period.Name,
		period.Season.Name,
		period.Start,
		period.End,
	).Scan(&resId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, resId)
}

// Post many periods (receive []Period; returns rowsAffected: int)
func (r repo) PostManyPeriods(ctx *gin.Context) {
	// Retrieve periods from context
	periods := new([]data.Period)
	err := ctx.BindJSON(periods)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Array of args for query
	var periodValues []interface{}

	// Building statement for query
	st := `INSERT INTO Periods(period_name, season_name, starting, ending) VALUES  `
	for i, period := range *periods {
		periodValues = append(periodValues, period.Name, period.Season.Name, period.Start, period.End)
		if i != 0 {
			st += `, `
		}
		st += fmt.Sprintf(`($%d, $%d, $%d, $%d)`, 1+4*i, 2+4*i, 3+4*i, 4+4*i)

	}
	st += `;`

	// Post periods
	res, err := r.sqlDb.Exec(st, periodValues...)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Get number of rows affected
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, rowsAffected)
}

// Update one period (receives Period; returns rowsAffected: int)
func (r repo) UpdatePeriod(ctx *gin.Context) {
	// Retrieve period from context
	period := new(data.Period)
	err := ctx.BindJSON(period)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error() + " error after bindJS"})
		return
	}

	// Run update query
	res, err := r.sqlDb.Exec(
		`UPDATE Periods 
			SET period_name = $1, season_name = $2, starting = $3, ending = $4 
			WHERE period_id = $5;`,
		period.Name, period.Season.Name, period.Start, period.End, period.Id,
	)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Retrieve number of rows affected
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, rowsAffected)
}

// Delete one period by id (receives periodId: int; returns rowsAffected: int)
func (r repo) DeletePeriod(ctx *gin.Context) {
	// Retrieve id from context
	periodID := new(int)
	if err := ctx.BindJSON(periodID); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Run delete query
	res, err := r.sqlDb.Exec(`DELETE FROM Periods WHERE period_id = $1`, periodID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Retrieve number of rows affected
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, rowsAffected)
}

// Delete many periods by id (receives []int; returns rowsAffected: int)
func (r repo) DeleteManyPeriods(ctx *gin.Context) {
	// Retrieve id from context
	periodIDs := new([]int)
	if err := ctx.BindJSON(periodIDs); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Array of args
	var args []interface{}

	// Build statement
	stmt := `DELETE FROM Periods WHERE period_id IN(`
	for i, id := range *periodIDs {
		if i != 0 {
			stmt += ","
		}
		stmt += fmt.Sprintf("$%d", i+1)
		args = append(args, id)
	}
	stmt += `)`

	// Run delete query
	res, err := r.sqlDb.Exec(stmt, args...)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Retrieve number of rows affected
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, rowsAffected)
}
