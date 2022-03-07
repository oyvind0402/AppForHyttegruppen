package server

import (
	//"net/http"
	"time"

	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"

	"github.com/gin-gonic/gin"
)

func (r repo) GetPeriod(ctx *gin.Context) {
	row := r.db.QueryRow(`SELECT "" FROM "" WHERE ""`)

	var start time.Time
	var end time.Time

	err := row.Scan(&start, &end)
	utils.AbortWithStatus(err, *ctx)

	period := data.Period{Start: start, End: end}

	ctx.JSON(200, period)
}

func (r repo) GetAllPeriods(ctx *gin.Context) {
	rows, err := r.db.Query(`SELECT "" FROM ""`)
	defer rows.Close()
	utils.AbortWithStatus(err, *ctx)

	var periods []data.Period

	for rows.Next() {
		var start time.Time
		var end time.Time

		err = rows.Scan(&start, &end)
		utils.AbortWithStatus(err, *ctx)

		period := data.Period{Start: start, End: end}
		periods = append(periods, period)
	}

	ctx.JSON(200, periods)
}

func (r repo) PostPeriod(ctx *gin.Context) {
	st := `INSERT INTO ""("", "") values($1, $2)`
	_, err := r.db.Exec(st, "", "")
	utils.AbortWithStatus(err, *ctx)
}