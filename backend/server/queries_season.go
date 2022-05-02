package server

import (
	"net/http"
	"time"

	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"

	"github.com/gin-gonic/gin"
)

// Retrieves one season by season name (receives season_name: string; returns Seasons)
func (r repo) GetSeason(ctx *gin.Context) {
	// Retrieve season name/id from context
	seasonName := ctx.Param("name")

	// Run select query
	row := r.sqlDb.QueryRow(`SELECT * FROM Seasons WHERE season_name = $1`, seasonName)

	// Read values into object
	var season data.Season
	if err := row.Scan(&season.Name, &season.FirstDay, &season.LastDay, &season.ApplyFrom, &season.ApplyUntil); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, season)
}

// Retrieves information about ongoing application season (receives NOTHING; returns {bool, []Season})
func (r repo) GetCurrentOpenSeason(ctx *gin.Context) {
	currdate := time.Now()

	// Run select query
	rows, err := r.sqlDb.Query(`
		SELECT * 
		FROM Seasons 
		WHERE apply_from < $1 
			AND apply_until > $1`, currdate)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	// Parse open seasons into []Season
	var openSeasons []data.Season
	for rows.Next() {
		// Read values into object
		var season data.Season
		if err := rows.Scan(&season.Name, &season.FirstDay, &season.LastDay, &season.ApplyFrom, &season.ApplyUntil); err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}
		openSeasons = append(openSeasons, season)
	}

	// restult type indicates whether there is a period open (IsOpen) and, if so, which one(s)
	type result struct {
		IsOpen  bool          `json:"isOpen"`
		Seasons []data.Season `json:"seasons,omitempty"`
	}

	// Only include array if a period is open
	var res result
	if len(openSeasons) > 0 {
		res.IsOpen = true
		res.Seasons = openSeasons
	} else {
		res.IsOpen = false
	}

	ctx.JSON(200, res)
}

// Retrieve all seasons (receives NOTHING; returns []Season)
func (r repo) GetAllSeasons(ctx *gin.Context) {
	// Get seasons from table
	rows, err := r.sqlDb.Query(`SELECT * FROM Seasons ORDER BY first_day DESC`)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	// Create seasons array
	var seasons []data.Season
	for rows.Next() {
		// Create Season
		var season data.Season
		err = rows.Scan(&season.Name, &season.FirstDay, &season.LastDay, &season.ApplyFrom, &season.ApplyUntil)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}

		// Add Season to array
		seasons = append(seasons, season)
	}

	ctx.JSON(200, seasons)
}

// Post one season (receives Season; returns rowsAffected: int)
func (r repo) PostSeason(ctx *gin.Context) {
	// Get Season from context
	season := new(data.Season)
	err := ctx.BindJSON(season)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	//Getting seasons that have a start day or end day in the middle of the posted period
	gtseason := `SELECT * FROM seasons WHERE (first_day >= $1 AND first_day < $2) OR (last_day > $1 AND last_day <= $2)`

	rows, err := r.sqlDb.Query(gtseason, season.FirstDay, season.LastDay)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	var seasons []data.Season
	for rows.Next() {
		// Create Season
		var season data.Season
		rows.Scan(&season.Name,
			&season.FirstDay,
			&season.LastDay,
			&season.ApplyFrom,
			&season.ApplyUntil)

		seasons = append(seasons, season)
	}

	//If the array is not empty we abort, since there is already an active season
	if len(seasons) != 0 {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": "A season is already created for that timeperiod"})
		return
	}

	// Insert values into table
	stmt := `INSERT INTO Seasons(
		season_name,
		first_day,
		last_day,
		apply_from,
		apply_until) 
		VALUES($1, $2, $3, $4, $5)`
	res, err := r.sqlDb.Exec(stmt,
		season.Name,
		season.FirstDay,
		season.LastDay,
		season.ApplyFrom,
		season.ApplyUntil)
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

// Update season (receives Season; returns rowsAffected: int)
func (r repo) UpdateSeason(ctx *gin.Context) {
	// Get Season from context
	season := new(data.Season)
	err := ctx.BindJSON(season)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Run update
	res, err := r.sqlDb.Exec(
		`UPDATE Seasons 
			SET 
				first_day = $1, 
				last_day = $2, 
				apply_from = $3,
				apply_until = $4
			WHERE season_name = $5`,
		season.FirstDay, season.LastDay, season.ApplyFrom, season.ApplyUntil, season.Name,
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

// Delete season by name (receives season_name: string; returns rowsAffected: int)
func (r repo) DeleteSeason(ctx *gin.Context) {
	// Get season name/id from context
	seasonId := new(string)
	err := ctx.BindJSON(seasonId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Run delete query
	res, err := r.sqlDb.Exec(`DELETE FROM Seasons WHERE season_name = $1`, &seasonId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Retrieve rows affected
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, rowsAffected)
}

// Delete seasons (receives date Time "2006-01-02T00:00:00Z" OR "2006-01-02"; returns rowsAffected: int)
func (r repo) DeleteOlderSeasons(ctx *gin.Context) {
	// Retrieve date from context
	input := new(string)
	err := ctx.BindJSON(input)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	inputDate, err := utils.NormaliseTime(*input)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Execute delete query
	res, err := r.sqlDb.Exec(`DELETE FROM Seasons WHERE last_day < $1`, inputDate)
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
