package server

import (
	"bachelorprosjekt/backend/data"
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// func (r repo) sendEmailToUser(id string) {
// 	var userEmail = new(string)
// 	row := r.sqlDb.QueryRow(`SELECT email FROM Users WHERE user_id = $1 LIMIT 1`, id)
// 	err := row.Scan(
// 		&userEmail,
// 	)
// 	if err != nil {
// 		fmt.Println("from error: ")
// 		fmt.Println(err)
// 		return
// 	}
// 	fmt.Println("from send email function:  " + *userEmail)
// 	SendEmail(*userEmail)
// }

// Get cabins for a given ID (returns: []cabins, []cabinsWon, err)
func (r repo) getCabins(ctx *gin.Context, id int) (cabins []data.CabinShort, cabinsWon []data.CabinShort, requestStatus int, err error) {
	// Execute query to fetch cabins and won information
	cabinRows, err := r.sqlDb.Query(`SELECT cabin_name, cabin_won FROM ApplicationCabins WHERE application_id = $1`, id)
	if err != nil {
		return cabins, cabinsWon, http.StatusBadRequest, err
	}
	defer cabinRows.Close()

	// Add Cabins to Application.Cabins
	for cabinRows.Next() {
		// Create Cabin
		var cabin data.CabinShort
		var cabinWon bool

		// Map column to Cabin.Name
		if err = cabinRows.Scan(&cabin.Name, &cabinWon); err != nil {
			return cabins, cabinsWon, http.StatusBadRequest, err
		}

		// Append Cabin to Application.Cabins array
		cabins = append(cabins, cabin)

		// Append Cabin to Application.CabinsWon array
		if cabinWon {
			cabinsWon = append(cabinsWon, cabin)
		}
	}
	return cabins, cabinsWon, http.StatusOK, err
}

// Remove from DB all Cabins associated to an Application
func removeCabins(tx *sql.Tx, application data.Application) (*sql.Tx, error) {
	_, err := tx.Exec(
		`DELETE FROM ApplicationCabins WHERE application_id = $1`, application.ApplicationId)
	return tx, err
}

// Add/Update application cabins from a list
func addOrUpdateCabins(ctx *gin.Context, tx *sql.Tx, cabins []data.CabinShort, applicationId int, won bool) (*sql.Tx, int, error) {
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
			return tx, http.StatusBadRequest, err
		}
	}
	return tx, http.StatusOK, err
}

// Get applications from Query
func (r repo) getApplications(ctx *gin.Context, query string, args []interface{}) ([]data.Application, int, error) {
	// Create Application array
	var applications []data.Application

	rows, err := r.sqlDb.Query(query, args...)
	if err != nil {
		return applications, http.StatusBadRequest, err
	}
	defer rows.Close()

	// For each retrieved row, create Application and append to array
	for rows.Next() {
		var application data.Application
		var periodId int
		var userId string

		// Insert row values into Application
		if err = rows.Scan(
			&application.ApplicationId,
			&userId,
			&application.AnsattnummerWBS,
			&application.AccentureId,
			&application.TripPurpose,
			&application.NumberOfCabins,
			&application.Kommentar,
			&application.CabinAssignment,
			&periodId,
			&application.Winner,
			&application.FeedbackSent); err != nil {
			return applications, http.StatusBadRequest, err
		}

		// Get period
		application.Period, err = r.getPeriodById(ctx, periodId)
		if err != nil {
			return applications, http.StatusBadRequest, err
		}

		// Get user
		application.User, err = r.getUserById(ctx, userId)
		if err != nil {
			return applications, http.StatusBadRequest, err
		}

		var status int
		// Get cabins
		application.Cabins, application.CabinsWon, status, err = r.getCabins(ctx, application.ApplicationId)
		if err != nil {
			return applications, status, err
		}

		// Append Application to Applications array
		applications = append(applications, application)
	}
	return applications, http.StatusOK, err
}

// Retrieve one application by ID (receives int; returns Application)
func (r repo) GetApplication(ctx *gin.Context) {
	// curl -X GET -v -d "1" localhost:8080/application/get

	// Retrieve parameter ID
	rec := ctx.Param("id")

	applicationId, err := strconv.Atoi(rec)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Select application from database
	row := r.sqlDb.QueryRow(`SELECT * FROM Applications WHERE application_id = $1`, applicationId)

	// Create Application
	var application data.Application
	var periodId int
	var userId string

	// Map columns to Application fields
	if err = row.Scan(
		&application.ApplicationId,
		&userId,
		&application.AnsattnummerWBS,
		&application.AccentureId,
		&application.TripPurpose,
		&application.NumberOfCabins,
		&application.Kommentar,
		&application.CabinAssignment,
		&periodId,
		&application.Winner,
		&application.FeedbackSent); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Get Period information
	application.Period, err = r.getPeriodById(ctx, periodId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Get User information
	application.User, err = r.getUserById(ctx, userId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"err": err.Error()})
	}

	// Get cabins
	var status int
	application.Cabins, application.CabinsWon, status, err = r.getCabins(ctx, applicationId)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// Return success and one application
	ctx.JSON(200, application)
}

// Retrieve all applications for a userid (receives userId: string; returns []Application)
func (r repo) GetUserApplications(ctx *gin.Context) {
	// Retrieve ID parameter
	userId := ctx.Param("userid")

	// Get all applications from database
	stmt := `SELECT * FROM Applications WHERE user_id = $1`
	args := []interface{}{userId}

	applications, status, err := r.getApplications(ctx, stmt, args)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// Return success and Application array
	ctx.JSON(200, applications)
}

// Retrieve applications for a userid where winner=true and end_date < today (receives userId: string; returns []Application)
func (r repo) GetPastTripsUserApplications(ctx *gin.Context) {
	// Retrieve ID parameter
	userId := ctx.Param("userid")

	curdate := time.Now()

	// Get applications from database
	stmt := `
	SELECT * FROM Applications 
	WHERE user_id = $1 
	AND winner = True 
	AND period_id IN (
		SELECT period_id
		FROM Periods
		WHERE ending < $2
	) `
	args := []interface{}{userId, curdate}

	applications, status, err := r.getApplications(ctx, stmt, args)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// Return success and Application array
	ctx.JSON(200, applications)
}

// Retrieve applications for a userid where winner=false and start_date > today (receives userId: string; returns []Application)
func (r repo) GetPendingUserApplications(ctx *gin.Context) {
	// Retrieve ID parameter
	userId := ctx.Param("userid")

	curdate := time.Now()

	// Get applications from database
	stmt := `
	SELECT * FROM Applications 
	WHERE user_id = $1 
	AND winner = False 
	AND period_id IN (
		SELECT period_id
		FROM Periods
		WHERE starting > $2
	) `
	args := []interface{}{userId, curdate}

	applications, status, err := r.getApplications(ctx, stmt, args)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// Return success and Application array
	ctx.JSON(200, applications)
}

// Retrieve applications for a userid where winner=true and start_date < today < end_date (receives userId: string; returns []Application)
func (r repo) GetCurrentTripsUserApplications(ctx *gin.Context) {
	// Retrieve ID parameter
	userId := ctx.Param("userid")

	curdate := time.Now()

	// Get applications from database
	stmt := `
	SELECT * FROM Applications 
	WHERE user_id = $1 
	AND winner = True 
	AND period_id IN (
		SELECT period_id
		FROM Periods
		WHERE starting <= $2 AND ending >= $2
	) `
	args := []interface{}{userId, curdate}

	applications, status, err := r.getApplications(ctx, stmt, args)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// Return success and Application array
	ctx.JSON(200, applications)
}

// Retrieve applications for a userid where winner=true and start_date > today (receives userId: string; returns []Application)
func (r repo) GetFutureTripsUserApplications(ctx *gin.Context) {
	// Retrieve ID parameter
	userId := ctx.Param("userid")

	curdate := time.Now()

	// Get applications from database
	stmt := `
	SELECT * FROM Applications 
	WHERE user_id = $1 
	AND winner = True 
	AND period_id IN (
		SELECT period_id
		FROM Periods
		WHERE starting > $2
	) `
	args := []interface{}{userId, curdate}

	applications, status, err := r.getApplications(ctx, stmt, args)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// Return success and Application array
	ctx.JSON(200, applications)
}

// Retrieve all applications in database where ending date is before the current date (receives NOTHING; returns []Application)
func (r repo) GetPastWinnerApplications(ctx *gin.Context) {
	curdate := time.Now()

	// Get applications from database
	stmt := `SELECT * FROM Applications 
	WHERE winner = True 
	AND period_id IN (
		SELECT period_id
		FROM Periods
		WHERE ending < $1
	)`
	args := []interface{}{curdate}

	applications, status, err := r.getApplications(ctx, stmt, args)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// Return success and Application array
	ctx.JSON(200, applications)
}

// Retrieve all applications in database where starting date is after current date (receives NOTHING; returns []Application)
func (r repo) GetFutureWinnerApplications(ctx *gin.Context) {
	curdate := time.Now()

	// Get all applications from database
	stmt := `SELECT * FROM Applications 
	WHERE winner = True 
	AND period_id IN (
		SELECT period_id
		FROM Periods
		WHERE starting > $1
	)`
	args := []interface{}{curdate}

	applications, status, err := r.getApplications(ctx, stmt, args)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// Return success and Application array
	ctx.JSON(200, applications)
}

// Retrieve all pending applications in database where starting date is after current date (receives NOTHING; returns []Application)
func (r repo) GetFuturePendingApplications(ctx *gin.Context) {
	curdate := time.Now()

	// Get all applications from database
	stmt := `SELECT * FROM Applications 
	WHERE winner = False 
	AND period_id IN (
		SELECT period_id
		FROM Periods
		WHERE starting > $1
	)`
	args := []interface{}{curdate}

	applications, status, err := r.getApplications(ctx, stmt, args)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// Return success and Application array
	ctx.JSON(200, applications)
}

// Retrieve all pending applications in database where ending date is after current date (receives NOTHING; returns []Application)
func (r repo) GetPastPendingApplications(ctx *gin.Context) {
	curdate := time.Now()

	// Get all applications from database
	stmt := `SELECT * FROM Applications 
	WHERE winner = False 
	AND period_id IN (
		SELECT period_id
		FROM Periods
		WHERE ending < $1
	)`
	args := []interface{}{curdate}

	applications, status, err := r.getApplications(ctx, stmt, args)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// Return success and Application array
	ctx.JSON(200, applications)
}

// Retrieve all winning applications in database where starting date is before current date and ending date is after current date (receives NOTHING; returns []Application)
func (r repo) GetCurrentApplications(ctx *gin.Context) {
	curdate := time.Now()

	// Get all applications from database
	stmt := `SELECT * FROM Applications 
	WHERE winner = True 
	AND period_id IN (
		SELECT period_id
		FROM Periods
		WHERE starting < $1 AND ending > $1
	)`
	args := []interface{}{curdate}

	applications, status, err := r.getApplications(ctx, stmt, args)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// Return success and Application array
	ctx.JSON(200, applications)
}

// Retrieve all applications in database (receives NOTHING; returns []Application)
func (r repo) GetAllApplications(ctx *gin.Context) {
	// Get all applications from database
	stmt := `SELECT * FROM Applications ORDER BY application_id`
	args := []interface{}{}

	applications, status, err := r.getApplications(ctx, stmt, args)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// Return success and Application array
	ctx.JSON(200, applications)
}

// Post one cabin (receives Application; returns application_id: int)
func (r repo) PostApplication(ctx *gin.Context) {
	type PostedApplication struct {
		ApplicationId   int               `json:"applicationId,omitempty"`
		UserId          string            `json:"userId"`
		AnsattnummerWBS string            `json:"ansattnummerWBS"`
		AccentureId     string            `json:"accentureId"`
		TripPurpose     string            `json:"tripPurpose"`
		Period          data.Period       `json:"period"`
		NumberOfCabins  int               `json:"numberOfCabins"`
		CabinAssignment string            `json:"cabinAssignment"`
		Cabins          []data.CabinShort `json:"cabins"`
		Kommentar       string            `json:"kommentar"`
		CabinsWon       []data.CabinShort `json:"cabinsWon,omitempty"`
		Winner          bool              `json:"winner"`
		FeedbackSent    bool              `json:"feedback,omitempty"`
	}
	// Transactional
	tx, err := r.sqlDb.BeginTx(ctx, nil)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer tx.Rollback()

	// Retrieve Application
	application := new(PostedApplication)
	err = ctx.BindJSON(application)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	application.FeedbackSent = false

	// Execute INSERT query and retrieve ID of inserted cabin
	var resId int
	if err = tx.QueryRow(
		`INSERT INTO Applications(user_id, ansattnummerWBS, employee_id, trip_purpose, number_of_cabins, kommentar, cabin_assignment, period_id, winner, feedback) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING application_id`,
		application.UserId,
		application.AnsattnummerWBS,
		application.AccentureId,
		application.TripPurpose,
		application.NumberOfCabins,
		application.Kommentar,
		application.CabinAssignment,
		application.Period.Id,
		application.Winner,
		application.FeedbackSent,
	).Scan(&resId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Add cabins for Application
	tx, status, err := addOrUpdateCabins(ctx, tx, application.Cabins, resId, false)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
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

// Update application (ALL fields) (receives Application; returns rowsAffected: int)
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
		SET user_id = $1, ansattnummerWBS= $2, employee_id = $3, trip_purpose = $4, number_of_cabins = $5, kommentar = $6, cabin_assignment = $7, period_id = $8, winner = $9, feedback = $10
		WHERE application_id = $11`,
		application.User.Id,
		application.AnsattnummerWBS,
		application.AccentureId,
		application.TripPurpose,
		application.NumberOfCabins,
		application.Kommentar,
		application.CabinAssignment,
		application.Period.Id,
		application.Winner,
		application.FeedbackSent,
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
	tx, status, err := addOrUpdateCabins(ctx, tx, application.Cabins, application.ApplicationId, false)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
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

// Update application, defining it as a winning application AND specifying cabins that were won (receives Application, requires only Id, Winner and CabinsWon; returns rowsAffected: int)
func (r repo) UpdateApplicationWinner(ctx *gin.Context) {
	type CabinsWon struct {
		ApplicationId int               `json:"applicationId"`
		CabinsWon     []data.CabinShort `json:"cabinsWon"`
		Winner        bool              `json:"winner"`
	}

	// Transactional
	tx, err := r.sqlDb.BeginTx(ctx, nil)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer tx.Rollback()

	// Retrieve data from front-end (WinnerApplication type)
	application := new(CabinsWon)
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
	tx, status, err := addOrUpdateCabins(ctx, tx, application.CabinsWon, application.ApplicationId, true)
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
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

func (r repo) UpdateApplicationFeedback(ctx *gin.Context) {
	// Set application ID to be an int
	applicationId := new(int)

	// Transactional
	tx, err := r.sqlDb.BeginTx(ctx, nil)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer tx.Rollback()

	// Get data from frontend
	if err := ctx.BindJSON(applicationId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Update the feedback sent bool
	res, err := r.sqlDb.Exec(`UPDATE Applications SET feedback = $1 WHERE application_id = $2`, true, applicationId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Get rows affected
	rowsAffected, err := res.RowsAffected()
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

// Delete one application with specified ID (receives int; returns rowsAffected: int)
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

// Delete all losing applications of a specified season (receives string; returns rowsAffected: int)
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

// Delete multiple applications by ID (receives []int; returns rowsAffected: int)
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
