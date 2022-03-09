package server

import (
	//"net/http"

	"context"
	"fmt"
	"time"

	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
	cabin := data.Cabin{
		Name:             "Utsikten",
		Active:           true,
		ShortDescription: "The cabin with the most beautiful view",
		LongDescription:  "Throughout the years, Utsikten has been described as the one with the most beautiful view. It has been favoured by projects and privates alike",
		Address:          "Hemsedal",
		Directions:       "Drive to Hemsedal",
		Price:            1200,
		CleaningPrice:    1200,
		Features: data.Features{
			Countable: data.CountableFeatures{
				Bathrooms:     2,
				Bedrooms:      4,
				SleepingSlots: 4,
				Other: map[string]int{
					"cats": 2,
					"dogs": 1,
				},
			},
			Uncountable: data.UncountableFeatures{
				Wifi:     false,
				Features: map[string]bool{},
			},
		},
		Comments: "It's beautiful!",
	}

	//TODO Make this an all-or-nothing operation

	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	res, err := collection.InsertOne(
		context.Background(),
		cabin)
	utils.AbortWithStatus(err, *ctx)

	resId, ok := res.InsertedID.(primitive.ObjectID)
	var id string
	if ok {
		id = resId.Hex()
	} else {
		utils.Panicker(nil, fmt.Sprint("Your id %v is not an ObjectID", resId))
	}

	st := `INSERT INTO Cabins("nosqlid", "cabinname", "active") values($1, $2, $3)`
	_, err = r.sqlDb.Exec(st, id, cabin.Name, cabin.Active)
	utils.AbortWithStatus(err, *ctx)

	ctx.JSON(200, res)
}

func (r repo) GetActiveCabinNames(ctx *gin.Context) {
	rows, err := r.sqlDb.Query(`SELECT cabinName FROM Cabins WHERE active = TRUE`)
	defer rows.Close()
	utils.AbortWithStatus(err, *ctx)

	var cabins []string

	for rows.Next() {
		var cabinName string
		err = rows.Scan(&cabinName)
		utils.AbortWithStatus(err, *ctx)
		cabins = append(cabins, cabinName)
	}
	utils.AbortWithStatus(err, *ctx)

	ctx.JSON(200, cabins)
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
