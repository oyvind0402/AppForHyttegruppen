package server

import (
	//"net/http"

	"context"
	"net/http"

	"bachelorprosjekt/backend/data"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

//TODO mongosh to connect
//TODO delete util.abbort...

//cabins

//get one cabin by name receives cabin name (string)
func (r repo) GetCabin(ctx *gin.Context) {
	cabinName := new(string)
	err := ctx.BindJSON(cabinName)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	var cabin []bson.M
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	cursor, err := collection.Find(
		context.Background(), 
		bson.D{{"_id", cabinName}},
	)
	cursor.All(context.Background(), &cabin)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	ctx.JSON(200, cabin)
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

	cabin := new(data.Cabin)
	err := ctx.BindJSON(cabin)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	res, err := collection.InsertOne(
		context.Background(),
		cabin)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
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


//send in [cabin name, selected field, input]; return updated cabin
func (r repo) UpdateCabinField(ctx *gin.Context){
	
	type fieldSelection struct{
		CabinName  string `json:"name"`
		ChangedField  map[string]interface{} `json:"changedField"` 
	}

	selectedField := new(fieldSelection) //key and the value
	err := ctx.BindJSON(selectedField)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	for key, val := range selectedField.ChangedField {
		res, err := collection.UpdateOne(
			context.Background(),
			bson.D{
				{"_id" , selectedField.CabinName},
			},
			bson.D{
					{"$set", bson.D{
						{key,val},
					}},
					{"$currentDate", bson.D{
						{"lastModified", true},
					}},
		})
		if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	ctx.JSON(200, res)
	}
	
}

func (r repo) UpdateCabin(ctx *gin.Context){

	
}

func (r repo) DeleteCabin(ctx *gin.Context){

	cabinName := new(string)
	err := ctx.BindJSON(cabinName)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}


	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	res, err := collection.DeleteOne(
		context.Background(), 
		bson.D{{"_id", cabinName}},
	)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	//TODO delete from psql as well
	ctx.JSON(200, res)
}

func (r repo) DeleteManyCabins(ctx *gin.Context){
	
}