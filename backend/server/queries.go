package server

import (
	//"net/http"

	"context"
	"time"

	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func (r repo) GetPeriod(ctx *gin.Context) {
	row := r.sqlDb.QueryRow(`SELECT "" FROM "" WHERE ""`)

	var start time.Time
	var end time.Time

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

		err = rows.Scan(&start, &end)
		utils.AbortWithStatus(err, *ctx)

		period := data.Period{Start: start, End: end}
		periods = append(periods, period)
	}

	ctx.JSON(200, periods)
}

func (r repo) PostPeriod(ctx *gin.Context) {
	st := `INSERT INTO ""("", "") values($1, $2)`
	_, err := r.sqlDb.Exec(st, "", "")
	utils.AbortWithStatus(err, *ctx)
}

func (r repo) PostCabin(ctx *gin.Context) {
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	res, err := collection.InsertOne(
		context.Background(),
		bson.D{
			{"item", "test"},
			{"time", time.Now()},
		})
	utils.Panicker(err, "Failed to add cabin")
	ctx.JSON(200, res)
}

type Test struct {
	item string
	time time.Time
}

func (r repo) GetAllCabins(ctx *gin.Context) {
	var cabins []bson.M
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	cursor, err := collection.Find(
		context.Background(),
		bson.D{},
	)
	cursor.All(context.Background(), &cabins)

	utils.Panicker(err, "Could not get all cabins")

	ctx.JSON(200, cabins)
}
