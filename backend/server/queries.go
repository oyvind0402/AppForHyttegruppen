package server

import (
	//"net/http"

	// "context"
	// "fmt"
	"fmt"
	"time"

	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"

	"github.com/gin-gonic/gin"
	// "go.mongodb.org/mongo-driver/bson"
	// "go.mongodb.org/mongo-driver/bson/primitive"
)

//periods
func (r repo) GetPeriod(ctx *gin.Context) {
	row := r.sqlDb.QueryRow(`SELECT "" FROM "" WHERE ""`)

	var start time.Time
	var end time.Time
	//season

	err := row.Scan(&start, &end)
	utils.AbortWithStatus(err, *ctx)

	period := data.Period{Start: start, End: end}

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
		//season

		err = rows.Scan(&start, &end)
		utils.AbortWithStatus(err, *ctx)

		period := data.Period{Start: start, End: end}
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
		//periodValues.(period.Start, period.End)
		st += fmt.Sprintf(`($%d, $%d, $%d)`, 1+3*i, 2+3*i, 3+3*i)
	}
	st += `;`
	_, err = r.sqlDb.Exec(st, periodValues...)
	utils.AbortWithStatus(err, *ctx)

}
