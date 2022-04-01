package server

import (
	"context"
	"encoding/json"
	"net/http"

	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

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
	// Gets cabin names from psql that are set to active
	rows, err := r.sqlDb.Query(`SELECT cabin_name FROM Cabins WHERE active = TRUE`)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer rows.Close()

	var cabins []string

	// Add the cabin names from the rows to the list
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

//Retrieve cabins that are set to be active, (returns list of cabins)
func (r repo) GetActiveCabins(ctx *gin.Context) {
	var cabins []data.Cabin
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	filter := bson.D{primitive.E{Key: "active", Value: true}}
	cursor, err := collection.Find(
		context.Background(),
		filter,
	)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	err = cursor.All(context.Background(), &cabins)

	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, cabins)
}

// Retrieves all cabins
func (r repo) GetAllCabins(ctx *gin.Context) {
	var cabins []data.Cabin
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins") //collectio = table
	//gets documents that exist in the collectiom
	cursor, err := collection.Find(
		context.Background(),
		bson.D{},
	)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	err = cursor.All(context.Background(), &cabins)

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
	type UpdateData struct {
		CabinName    string                 `json:"name"`
		ChangedField map[string]interface{} `json:"changedField"`
	}

	updateData := new(UpdateData) //key and the value
	err := ctx.BindJSON(updateData)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")

	var updateable bson.D
	for key, val := range updateData.ChangedField {
		field := utils.ObjToPrimitive(key, val)
		updateable = append(updateable, field)
	}

	res, err := collection.UpdateOne(
		context.Background(),
		bson.D{
			primitive.E{Key: "_id", Value: updateData.CabinName},
		},
		bson.D{
			primitive.E{Key: "$set", Value: updateable},
		},
	)

	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	ctx.JSON(200, res)

}

//Updates the whole cabin, send in cabin (returns documents affected?)
func (r repo) UpdateCabin(ctx *gin.Context) {
	cabin := new(data.Cabin)
	err := ctx.BindJSON(cabin)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	var idlessCabin map[string]interface{}
	inCabin, err := json.Marshal(cabin)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	if err = json.Unmarshal(inCabin, &idlessCabin); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}
	delete(idlessCabin, "name")

	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	filter := bson.D{primitive.E{Key: "_id", Value: cabin.Name}}
	res := collection.FindOneAndReplace(
		context.Background(), filter, idlessCabin)
	if res.Err() == mongo.ErrNoDocuments {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": res.Err().Error()})
		return
	}
	if res.Err() != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": res.Err().Error()})
		return
	}

	// Retrieve response value
	var preUpdateDoc data.Cabin
	if err := res.Decode(&preUpdateDoc); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, preUpdateDoc)
}

//delete one cabin by name
func (r repo) DeleteCabin(ctx *gin.Context) {
	// Get cabin name from context
	cabinName := new(string)
	err := ctx.BindJSON(cabinName)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Open transaction for PostgreSQL
	tx, err := r.sqlDb.BeginTx(context.TODO(), nil)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}
	defer tx.Rollback()

	// Delete from SQL (not yet committed)
	resSql, err := tx.Exec(`DELETE FROM CabinShort WHERE cabinName = $1`, &cabinName)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Store number of rows affected in PostgreSQL
	deletedSQL, err := resSql.RowsAffected()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Start MongoDB query
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	// Callback: either delete document or signal to rollback (false = rollback; true = proceed)
	callback := func(sessCtx mongo.SessionContext) (interface{}, error) {
		resNoSql, err := collection.DeleteOne(
			context.Background(),
			bson.D{primitive.E{Key: "_id", Value: cabinName}},
		)
		if err != nil {
			return false, err
		}

		// If number of deletions matches, all good
		return deletedSQL == resNoSql.DeletedCount, err
	}

	// Start MongoDB session
	mongoCtx := context.Background()
	session, err := r.noSqlDb.StartSession()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}
	defer session.EndSession(mongoCtx)

	// Start MongoDB transaction
	success, err := session.WithTransaction(mongoCtx, callback)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// If MongoDB transaction fails, abort; if it succeeds, commit to MongoDB
	if success != true {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}
	err = tx.Commit()
	if err != nil {
		// If commit for PostgreSQL fails, abort transaction for MongoDB
		session.AbortTransaction(mongoCtx)
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	ctx.JSON(200, deletedSQL)
}
