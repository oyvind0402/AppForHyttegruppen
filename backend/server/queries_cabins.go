package server

import (
	//"net/http"

	"context"
	"net/http"

	"bachelorprosjekt/backend/data"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

//TODO C:\Program Files\MongoDB\Server\5.0\bin  to connect to mongodb
//TODO delete util.abbort...

//cabins

//get one cabin by name
func (r repo) GetCabin(ctx *gin.Context) {

	//binding cabin name from context
	name := new(string)
	err := ctx.BindJSON(name)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")

	//filter out the name of the cabin
	filterCursor, err := collection.Find(ctx, bson.M{"_id": name})
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	//stores the filtered cabin in var
	var cabinsFiltered bson.M
	if err = filterCursor.All(ctx, &cabinsFiltered); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, cabinsFiltered)
}

func (r repo) GetActiveCabinNames(ctx *gin.Context) {
	rows, err := r.sqlDb.Query(`SELECT cabin_name FROM Cabins WHERE active = TRUE`)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	var cabins []string

	for rows.Next() {
		var cabinName string
		err = rows.Scan(&cabinName)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}
		cabins = append(cabins, cabinName)
	}
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, cabins)
}

func (r repo) GetAllCabins(ctx *gin.Context) {
	var cabins []bson.M
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins") //collectio = table
	cursor, err := collection.Find(
		context.Background(),
		bson.D{},
	)
	cursor.All(context.Background(), &cabins)

	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, cabins)
}

func (r repo) PostCabin(ctx *gin.Context) {

	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	cabin := new(data.Cabin)
	err := ctx.BindJSON(cabin)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error() + " /*error in binding JSon*/"})
		return
	}
	res, err := collection.InsertOne(
		context.Background(),
		cabin)
	// If there is an error, stop here
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error() + " /*error in inserting cabin*/"})
		return
	}
	resId := res.InsertedID

	st := `INSERT INTO Cabins("cabin_name", "active") values($1, $2)`
	_, err = r.sqlDb.Exec(st, resId, cabin.Active)
	// If there is an error, delete entry from MongoDB and stop
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		r.noSqlDb.Disconnect(ctx)
		_, err = collection.DeleteOne(
			context.Background(),
			bson.M{"_id": resId})
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		}
		return
	}

	ctx.JSON(200, res)
}
