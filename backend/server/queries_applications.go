package server

import (
	"bachelorprosjekt/backend/data"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Get cabins for a given ID (returns: []cabins, []cabinsWon, err)
func (r repo) getCabins(ctx *gin.Context, id int) (cabins []data.CabinShort, cabinsWon []data.CabinShort, err error) {
	// Execute query to fetch cabins and won information
	cabinRows, err := r.sqlDb.Query(`SELECT cabin_name, cabin_won FROM ApplicationCabins WHERE application_id = $1`, id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return cabins, cabinsWon, err
	}
	defer cabinRows.Close()

	// Add Cabins to Application.Cabins
	for cabinRows.Next() {
		// Create Cabin
		var cabin data.CabinShort
		var cabinWon bool

		// Map column to Cabin.Name
		if err = cabinRows.Scan(&cabin.Name, &cabinWon); err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return cabins, cabinsWon, err
		}

		// Append Cabin to Application.Cabins array
		cabins = append(cabins, cabin)

		// Append Cabin to Application.CabinsWon array
		if cabinWon {
			cabinsWon = append(cabinsWon, cabin)
		}
	}
	return cabins, cabinsWon, err
}

// Remove from DB all Cabins associated to an Application
func removeCabins(tx *sql.Tx, application data.Application) (*sql.Tx, error) {
	_, err := tx.Exec(
		`DELETE FROM ApplicationCabins WHERE application_id = $1`, application.ApplicationId)
	return tx, err
}

// Add/Update application cabins from a list
func addOrUpdateCabins(ctx *gin.Context, tx *sql.Tx, cabins []data.CabinShort, applicationId int, won bool) (*sql.Tx, error) {
	var err error
	for _, cabin := range cabins {
		_, err = tx.Exec(
			`INSERT INTO ApplicationCabins 
			VALUES($1, $2, $3)
			ON CONFLICT (application_id, cabin_name)
			DO UPDATE SET cabin_won = $3`,
			applicationId,
			cabin.Name,
			won,
		)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return tx, err
		}
	}
	return tx, err
}

// TODO Merge with Period queries
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

// Retrieve one application by ID (receives int)
func (r repo) GetApplication(ctx *gin.Context) {
	// curl -X GET -v -d "1" localhost:8080/application/get

	// Retrieve parameter ID
	applicationId := new(int)
	if err := ctx.BindJSON(applicationId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Select application from database
	rows, err := r.sqlDb.Query(`SELECT * FROM Applications WHERE application_id = $1 LIMIT 1`, *applicationId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	// Create Application
	var application data.Application
	for rows.Next() {
		var periodId int

		// Map columns to Application fields
		if err = rows.Scan(
			&application.ApplicationId,
			&application.UserId,
			&application.AccentureId,
			&application.TripPurpose,
			&application.NumberOfCabins,
			&periodId,
			&application.Winner); err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}

		// Get Period information
		application.Period, err = r.getPeriodById(ctx, periodId)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}

		// Get cabins
		application.Cabins, application.CabinsWon, err = r.getCabins(ctx, *applicationId)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}
	}

	// Return success and one application
	ctx.JSON(200, application)
}

// Retrieve all applications in database (receives NOTHING)
func (r repo) GetAllApplications(ctx *gin.Context) {
	// Get all applications from database
	rows, err := r.sqlDb.Query(`SELECT * FROM Applications`)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	// Create Application array
	var applications []data.Application

	// For each retrieved row, create Application and append to array
	for rows.Next() {
		var application data.Application
		var periodId int

		// Insert row values into Application
		if err = rows.Scan(
			&application.ApplicationId,
			&application.UserId,
			&application.AccentureId,
			&application.TripPurpose,
			&application.NumberOfCabins,
			&periodId,
			&application.Winner); err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}

		application.Period, err = r.getPeriodById(ctx, periodId)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}

		// Get cabins
		application.Cabins, application.CabinsWon, err = r.getCabins(ctx, application.ApplicationId)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}

		// Append Application to Applications array
		applications = append(applications, application)
	}

	// Return success and Application array
	ctx.JSON(200, applications)
}

// Post one cabin (receives Application)
func (r repo) PostApplication(ctx *gin.Context) {
	// Transactional
	tx, err := r.sqlDb.BeginTx(ctx, nil)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer tx.Rollback()

	// Retrieve Application
	application := new(data.Application)
	err = ctx.BindJSON(application)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Execute INSERT query and retrieve ID of inserted cabin
	var resId int
	if err = tx.QueryRow(
		`INSERT INTO Applications(user_id, employee_id, trip_purpose, number_of_cabins, period_id, winner) VALUES($1, $2, $3, $4, $5, $6) RETURNING application_id`,
		application.UserId,
		application.AccentureId,
		application.TripPurpose,
		application.NumberOfCabins,
		application.Period.Id,
		application.Winner,
	).Scan(&resId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Add cabins for Application
	tx, err = addOrUpdateCabins(ctx, tx, application.Cabins, resId, false)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Return success and ID of added cabin
	ctx.JSON(200, resId)
}

// Update application (ALL fields) (receives Application)
func (r repo) UpdateApplication(ctx *gin.Context) {
	// Transactional
	tx, err := r.sqlDb.BeginTx(ctx, nil)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer tx.Rollback()

	// Retrieve Application from context
	application := new(data.Application)
	if err = ctx.BindJSON(application); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Update all application fields
	res, err := tx.Exec(
		`UPDATE Applications
		SET user_id = $1, employee_id = $2, trip_purpose = $3, number_of_cabins = $4, period_id = $5, winner = $6
		WHERE application_id = $7`,
		application.UserId,
		application.AccentureId,
		application.TripPurpose,
		application.NumberOfCabins,
		application.Period.Id,
		application.Winner,
		application.ApplicationId,
	)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Retrieve number of updated rows
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Remove all cabins (in case the new Application no longer contains one or more cabins that the previous version contained)
	tx, err = removeCabins(tx, *application)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Add cabins from Application
	tx, err = addOrUpdateCabins(ctx, tx, application.Cabins, application.ApplicationId, false)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Return success and number of deleted rows
	ctx.JSON(200, rowsAffected)
}

// Update application, defining it as a winning application AND specifying cabins that were won (receives Application, requires only Id, Winner and CabinsWon)
func (r repo) UpdateApplicationWinner(ctx *gin.Context) {
	// Transactional
	tx, err := r.sqlDb.BeginTx(ctx, nil)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer tx.Rollback()

	// Retrieve data from front-end (WinnerApplication type)
	application := new(data.Application)
	if err = ctx.BindJSON(application); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Set application as winning
	res, err := tx.Exec(
		`UPDATE Applications
		SET winner = $1
		WHERE application_id = $2`,
		application.Winner,
		application.ApplicationId,
	)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Retrieve number of updated rows
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Reset all cabins from application to "not won"
	if _, err = tx.Exec(
		`UPDATE ApplicationCabins
		SET cabin_won = $1
		WHERE application_id = $2`,
		false,
		application.ApplicationId,
	); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	if application.CabinsWon == nil || len(application.CabinsWon) <= 0 {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": "Must select cabins won in application."})
		return
	}

	// Set ONLY cabins passed through WinnerApplication.CabinsWon as "won"
	tx, err = addOrUpdateCabins(ctx, tx, application.CabinsWon, application.ApplicationId, true)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Return number of applications updated
	ctx.JSON(200, rowsAffected)
}

// Delete one application with specified ID (receives [int)
func (r repo) DeleteApplication(ctx *gin.Context) {
	// curl -X DELETE -v -d "1" localhost:8080/application/delete

	// Retrieve ID parameter
	applicationId := new(int)
	if err := ctx.BindJSON(applicationId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Delete from database
	res, err := r.sqlDb.Exec(`DELETE FROM Applications WHERE application_id = $1`, &applicationId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Retrieve number of affected rows
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Return number of rows deleted
	ctx.JSON(200, rowsAffected)
}

// Delete all losing applications of a specified season (receives string)
func (r repo) DeleteLosingApplications(ctx *gin.Context) {
	// curl -X DELETE -v -d "\"winter2022\"" localhost:8080/application/deletelosing

	// Retrieve season parameter
	season := new(string)
	if err := ctx.BindJSON(season); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Delete from database
	res, err := r.sqlDb.Exec(`
		DELETE FROM Applications 
		WHERE NOT winner OR winner IS NULL 
		AND period_id IN (
			SELECT period_id
			FROM Periods
			WHERE season_name = $1
		)`, &season)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Retrieve number of affected rows
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Return success and number of deleted rows
	ctx.JSON(200, rowsAffected)
}

// Delete multiple applications by ID (receives []int)
func (r repo) DeleteApplicationsById(ctx *gin.Context) {
	// curl -X DELETE -v -d "[1, 2]" localhost:8080/application/deletemanybyid

	// Retrives array of IDs
	applicationIds := new([]int)

	if err := ctx.BindJSON(applicationIds); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Prepare statement and array of arguments for query
	var args []interface{}
	s := "DELETE FROM Applications WHERE"
	for i, val := range *applicationIds {
		if i != 0 {
			s += " OR"
		}
		s += fmt.Sprintf(" application_id = $%d", i+1)
		args = append(args, val)
	}

	// Execute query
	res, err := r.sqlDb.Exec(s, args...)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Retrieve number of deleted rows
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Return success and number of deleted rows
	ctx.JSON(200, rowsAffected)
}
