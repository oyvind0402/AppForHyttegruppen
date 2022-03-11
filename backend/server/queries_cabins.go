package server

import (
	//"net/http"

	"context"
	"net/http"

	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

//cabins
func (r repo) PostCabin(ctx *gin.Context) {
	// UNCOMMENT IF YOU WANT TO TEST POSTCABIN (will delete Utsikten)
	// coll := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	// _, error := coll.DeleteOne(
	// 	context.Background(),
	// 	bson.M{"_id": "Utsikten"})
	// utils.AbortWithStatus(error, *ctx)

	// TODO Uncomment when getting from front-end
	// cabin := new(data.Cabin)
	// err := ctx.Bind(cabin)
	// utils.AbortWithStatus(err)

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
				Other: &map[string]int{
					"cats": 2,
					"dogs": 1,
				},
			},
			Uncountable: data.UncountableFeatures{
				Wifi:     false,
				Features: &map[string]bool{},
			},
		},
		Comments: "It's beautiful!",
	}

	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	res, err := collection.InsertOne(
		context.Background(),
		cabin)
	// If there is an error, stop here
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	resId := res.InsertedID

	st := `INSERT INTO Cabins("cabinname", "active") values($1, $2)`
	_, err = r.sqlDb.Exec(st, resId, cabin.Active)
	// If there is an error, delete entry from MongoDB and stop
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		r.noSqlDb.Disconnect(ctx)
		_, err = collection.DeleteOne(
			context.Background(),
			bson.M{"_id": resId})
		if err != nil {
			utils.Panicker(err, "Repeated database failures: could not add to Postgres, and could not delete from MongoDB when handling error")
		}
		return
	}

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
