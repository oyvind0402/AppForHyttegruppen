package server

import (
	"bachelorprosjekt/backend/data"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Applications
func (r repo) GetApplication(ctx *gin.Context) {
	applicationId := new(int)
	// For URL queries, use
	// localhost:8080/application/get/applicatonid=[NUMBER HERE WITHOUT BRACKETS]
	// And uncomment:
	// applicationId, err := strconv.Atoi(ctx.Request.URL.Query()["applicationid"][0])
	err := ctx.BindJSON(applicationId)
	println(applicationId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	rows, err := r.sqlDb.Query(`SELECT * FROM Applications WHERE application_id = $1 LIMIT 1`, &applicationId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	var application data.Application

	for rows.Next() {
		err = rows.Scan(&application.ApplicationId, &application.UserId, &application.AccentureId, &application.TripPurpose, &application.NumberOfCabins, &application.Season.SeasonName, &application.Winner)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}

		// Get cabins
		cabinRows, err := r.sqlDb.Query(`SELECT cabin_name FROM ApplicationCabins WHERE application_id = $1`, &applicationId)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}
		defer cabinRows.Close()

		for cabinRows.Next() {
			var cabin data.CabinShort
			err = cabinRows.Scan(&cabin.Name)
			if err != nil {
				ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
				return
			}
			application.Cabins = append(application.Cabins, cabin)
		}

		// Get periods
		periodRows, err := r.sqlDb.Query(`SELECT starting, ending FROM ApplicationPeriods WHERE application_id = $1`, &applicationId)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}
		defer periodRows.Close()

		for periodRows.Next() {
			var period data.Period
			err = periodRows.Scan(&period.Start, &period.End)
			if err != nil {
				ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
				return
			}
			application.Periods = append(application.Periods, period)
		}
	}
	ctx.JSON(200, application)
}

func (r repo) GetAllApplications(ctx *gin.Context) {
	rows, err := r.sqlDb.Query(`SELECT * FROM Applications`)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	var applications []data.Application

	for rows.Next() {
		var application data.Application

		err = rows.Scan(&application.ApplicationId, &application.UserId, &application.AccentureId, &application.TripPurpose, &application.NumberOfCabins)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}

		// Get cabins
		cabinRows, err := r.sqlDb.Query(`SELECT cabin_name FROM ApplicationCabins WHERE application_id = $1`, application.ApplicationId)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}
		defer cabinRows.Close()

		for cabinRows.Next() {
			var cabin data.CabinShort
			err = cabinRows.Scan(&cabin.Name)
			if err != nil {
				ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
				return
			}
			application.Cabins = append(application.Cabins, cabin)
		}

		// Get periods
		periodRows, err := r.sqlDb.Query(`SELECT starting, ending FROM ApplicationPeriods WHERE application_id = $1`, application.ApplicationId)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}
		defer periodRows.Close()
		for periodRows.Next() {
			var period data.Period
			err = periodRows.Scan(&period.Start, &period.End)
			if err != nil {
				ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
				return
			}
			application.Periods = append(application.Periods, period)
		}

		applications = append(applications, application)
	}

	ctx.JSON(200, applications)
}

func (r repo) PostApplication() {

}

func (r repo) UpdateApplication() {

}

func (r repo) DeleteApplication(ctx *gin.Context) {
	// curl -X DELETE -v -d "1" localhost:8080/application/delete
	applicationId := new(int)
	err := ctx.BindJSON(applicationId)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	res, err := r.sqlDb.Exec(`DELETE FROM Applications WHERE application_id = $1`, &applicationId)
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

func (r repo) DeleteLosingApplications(ctx *gin.Context) {
	// curl -X DELETE -v -d "\"winter2022\"" localhost:8080/application/deletelosing
	season := new(string)
	err := ctx.BindJSON(season)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	res, err := r.sqlDb.Exec(`DELETE FROM Applications WHERE NOT winner OR winner IS NULL AND season = $1`, &season)
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

func (r repo) DeleteApplicationsById(ctx *gin.Context) {
	// curl -X DELETE -v -d "[1, 2]" localhost:8080/application/deletemanybyid
	applicationIds := new([]int)
	err := ctx.BindJSON(applicationIds)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	var args []interface{}
	s := "DELETE FROM Applications WHERE"
	for i, val := range *applicationIds {
		if i != 0 {
			s += " OR"
		}
		s += fmt.Sprintf(" application_id = $%d", i+1)
		args = append(args, val)
	}

	res, err := r.sqlDb.Exec(s, args...)
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
