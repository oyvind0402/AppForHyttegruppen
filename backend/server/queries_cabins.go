package server

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func (r repo) syncDBs() (httpStatus int, err error) {
	tx, err := r.sqlDb.BeginTx(context.Background(), nil)
	if err != nil {
		return http.StatusFailedDependency, err
	}
	defer tx.Rollback()

	// Gets cabin names from psql
	rows, err := tx.Query(`SELECT * FROM Cabins`)
	if err != nil {
		return http.StatusFailedDependency, err
	}
	defer rows.Close()

	// Add the cabin names from the rows to the list
	sqlCabins := make(map[string]bool)
	for rows.Next() {
		var cabin data.CabinShort
		err = rows.Scan(&cabin.Name, &cabin.Active)
		if err != nil {
			return
		}
		sqlCabins[cabin.Name] = cabin.Active
	}
	if err != nil {
		return http.StatusInternalServerError, err
	}

	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	cursor, err := collection.Find(
		context.Background(),
		bson.D{},
	)
	if err != nil {
		return http.StatusFailedDependency, err
	}

	var res []data.CabinShort
	if err = cursor.All(context.Background(), &res); err != nil {
		return http.StatusInternalServerError, err
	}

	stmt := `
		INSERT INTO Cabins (cabin_name, active)
		VALUES ($1, $2)
		ON CONFLICT (cabin_name) DO UPDATE SET active = $2
	`

	for _, nosqlCabin := range res {
		if _, err = tx.Exec(stmt, nosqlCabin.Name, nosqlCabin.Active); err != nil {
			return http.StatusFailedDependency, err
		}
		delete(sqlCabins, nosqlCabin.Name)
	}

	if len(sqlCabins) > 0 {
		stmtDel := `DELETE FROM Cabins WHERE cabin_name IN (`

		i := 0
		var args []interface{}
		for k := range sqlCabins {
			if i != 0 {
				stmtDel += ", "
			}
			i++
			stmtDel += fmt.Sprintf("$%d", i)
			args = append(args, k)
		}
		stmtDel += `)`
		if _, err := tx.Exec(stmtDel, args...); err != nil {
			return http.StatusFailedDependency, err
		}
	}

	if err = tx.Commit(); err != nil {
		return http.StatusFailedDependency, err
	}

	return http.StatusOK, err
}

//Retrieves one cabin by given name("_id") (returns Cabin)
func (r repo) GetCabin(ctx *gin.Context) {
	//Gets cabin name
	cabinName := ctx.Param("name")

	var cabins []data.Cabin
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	//finds the document with the right cabin name
	cursor, err := collection.Find(
		context.Background(),
		bson.D{primitive.E{Key: "_id", Value: primitive.Regex{Pattern: fmt.Sprintf("^%s$", cabinName), Options: "i"}}},
	)
	cursor.All(context.Background(), &cabins)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	if len(cabins) == 1 {
		ctx.JSON(http.StatusOK, cabins[0])
	} else {
		ctx.JSON(http.StatusNoContent, nil)
	}
}

//Retrieve cabins that are set to be active, (returns list of cabin names)
func (r repo) GetActiveCabinNames(ctx *gin.Context) {

	status, err := r.syncDBs()
	if err != nil {
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

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

	validated := utils.CheckCabinValidation(cabin.Name,
		cabin.Address,
		cabin.Coordinates.Latitude,
		cabin.Coordinates.Longitude,
		cabin.Directions,
		cabin.LongDescription,
		cabin.ShortDescription,
		cabin.Price,
		cabin.CleaningPrice,
		cabin.Features.Bathrooms,
		cabin.Features.SleepingSlots,
		cabin.Features.Bedrooms)

	if !validated {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": "Cabin input is not valid!"})
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
		updateable = append(updateable, field...)
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

	validated := utils.CheckCabinValidation(cabin.Name,
		cabin.Address,
		cabin.Coordinates.Latitude,
		cabin.Coordinates.Longitude,
		cabin.Directions,
		cabin.LongDescription,
		cabin.ShortDescription,
		cabin.Price,
		cabin.CleaningPrice,
		cabin.Features.Bathrooms,
		cabin.Features.SleepingSlots,
		cabin.Features.Bedrooms)
	if !validated {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": "Cabin input not valid!"})
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

func (r repo) UpdateCabinWithPicture(ctx *gin.Context) {
	cabin := new(data.Cabin)
	err := ctx.BindJSON(cabin)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	validated := utils.CheckCabinValidation(cabin.Name,
		cabin.Address,
		cabin.Coordinates.Latitude,
		cabin.Coordinates.Longitude,
		cabin.Directions,
		cabin.LongDescription,
		cabin.ShortDescription,
		cabin.Price,
		cabin.CleaningPrice,
		cabin.Features.Bathrooms,
		cabin.Features.SleepingSlots,
		cabin.Features.Bedrooms)
	if !validated {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": "Cabin input not valid!"})
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
	resSql, err := tx.Exec(`DELETE FROM Cabins WHERE cabin_name = $1`, &cabinName)
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
