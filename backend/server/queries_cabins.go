package server

import (
	//"net/http"

	"context"
	"net/http"

	"bachelorprosjekt/backend/data"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

//TODO mongosh to connect

//cabins

//Retrieves one cabin by given name("_id") (returns Cabin)
func (r repo) GetCabin(ctx *gin.Context) {
	//Gets cabin name
	cabinName := new(string)
	err := ctx.BindJSON(cabinName)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	var cabin []bson.M
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	//finds the document with the right cabin name
	cursor, err := collection.Find(
		context.Background(),
		bson.D{primitive.E{Key: "_id", Value: cabinName}},
	)
	cursor.All(context.Background(), &cabin)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	ctx.JSON(200, cabin)
}

//Retrieve cabins that are set to be active, (returns list of cabin names)
func (r repo) GetActiveCabinNames(ctx *gin.Context) {
	//gets cabin names from psql that are set to active
	rows, err := r.sqlDb.Query(`SELECT cabin_name FROM Cabins WHERE active = TRUE`)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	var cabins []string

	//TODO maybe return cabins rather than names
	//add the cabin names from the rows to the list
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

//Retrieves all cabins
func (r repo) GetAllCabins(ctx *gin.Context) {
	var cabins []bson.M
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins") //collectio = table
	//gets documents that exist in the collectiom
	cursor, err := collection.Find(
		context.Background(),
		bson.D{},
	)
	//itterates through the documents and adds names to the list
	cursor.All(context.Background(), &cabins)

	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, cabins)
}

//Post one Cabin. Receives a cabin (returns: inserted cabin)
func (r repo) PostCabin(ctx *gin.Context) {

	//instantiats a cabin
	cabin := new(data.Cabin)
	//binds information from
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

//Updates one field, send in [cabin name, [selected field, input]]; returns updated field
func (r repo) UpdateCabinField(ctx *gin.Context) {

	//creating struct for updated field
	type fieldSelection struct {
		CabinName    string                 `json:"name"`
		ChangedField map[string]interface{} `json:"changedField"`
	}

	selectedField := new(fieldSelection) //key and the value
	err := ctx.BindJSON(selectedField)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	//itterates the map
	for key, val := range selectedField.ChangedField {
		//updates the field
		res, err := collection.UpdateOne(
			context.Background(),
			bson.D{
				primitive.E{Key: "_id", Value: selectedField.CabinName},
			},
			bson.D{
				primitive.E{Key: "$set", Value: bson.D{
					primitive.E{Key: key, Value: val},
				}},
			})
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
			return
		}
		ctx.JSON(200, res)
	}

}

//Updates the whole cabin, send in cabin (returns documents affected?)
func (r repo) UpdateCabin(ctx *gin.Context) {
	cabin := new(data.Cabin)
	err := ctx.BindJSON(cabin)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	//TODO pop out the struct
	//https://github.com/oyvind0402/AppForHyttegruppen/commit/fde5f7b037d366a1c52983d673a51cc22ed59e3b

	/**
	var idlessFaq map[string]interface{}
	inrec, _ := json.Marshal(newFaq)
	json.Unmarshal(inrec, &idlessFaq)
	idlessFaq.Delete("id")
	*/

	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	filter := bson.D{primitive.E{Key: "_id", Value: cabin.Name}}
	replacement := bson.D{
		primitive.E{Key: "active", Value: cabin.Active},
		primitive.E{Key: "shortDescription", Value: cabin.ShortDescription},
		primitive.E{Key: "longDescription", Value: cabin.LongDescription},
		primitive.E{Key: "address", Value: cabin.Address},
		primitive.E{Key: "directions", Value: cabin.Directions},
		primitive.E{Key: "price", Value: cabin.Price},
		primitive.E{Key: "cleaningPrice", Value: cabin.CleaningPrice},
		primitive.E{Key: "features", Value: bson.A{
			primitive.E{Key: "features", Value: cabin.Features},
		}},
		primitive.E{Key: "comments", Value: cabin.Comments},
	}

	res, err := collection.ReplaceOne(
		context.Background(), filter, replacement)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	ctx.JSON(200, res)

}

//delete one cabin by name
func (r repo) DeleteCabin(ctx *gin.Context) {

	cabinName := new(string)
	err := ctx.BindJSON(cabinName)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	//TODO seperate code and add comments

	//open transaction for sql
	tx, err := r.sqlDb.BeginTx(context.TODO(), nil)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	//if anything fails rollback
	defer tx.Rollback()

	resSql, err := tx.Exec(`DELETE FROM CabinShort WHERE cabinName = $1`, &cabinName)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	deletedSQL, err := resSql.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	//callback function to roll back if something fails
	callback := func(sessCtx mongo.SessionContext) (interface{}, error) {
		resNoSql, err := collection.DeleteOne(
			context.Background(),
			bson.D{primitive.E{Key: "_id", Value: cabinName}},
		)
		if err != nil {
			return false, err
		}

		return deletedSQL == resNoSql.DeletedCount, err

	}

	mongoCtx := context.Background()
	session, err := r.noSqlDb.StartSession()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}
	defer session.EndSession(mongoCtx)
	success, err := session.WithTransaction(mongoCtx, callback)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	if success != true {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}
	err = tx.Commit()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		session.AbortTransaction(mongoCtx)
		return
	}
	ctx.JSON(200, deletedSQL)
}
