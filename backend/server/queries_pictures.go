package server

import (
	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"
	"context"
	"fmt"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func SaveFile(ctx *gin.Context, file *multipart.FileHeader) (context *gin.Context, status int, err error) {
	filename, err := utils.CheckFilename(file.Filename)
	if err != nil {
		return ctx, http.StatusBadRequest, err
	}

	path := os.Getenv("hytteroot")
	if err := ctx.SaveUploadedFile(file, fmt.Sprintf("%s/frontend/public/assets/pictures/%s", path, filename)); err != nil {
		return ctx, http.StatusFailedDependency, err
	}

	return ctx, http.StatusOK, nil
}

func (r repo) PostMainPicture(ctx *gin.Context) {
	// Retrieve file, cabin name and alternative text
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": err.Error()})
		return
	}
	cabinName := ctx.Request.FormValue("cabinName")
	altText := ctx.Request.FormValue("altText")

	// Check that file name is valid (done also before file saving to avoid SQL injection)
	filename, err := utils.CheckFilename(file.Filename)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	var picture = data.Picture{
		Filename: filename,
		AltText:  altText,
	}

	// Start MongoDB query
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	// Callback: either update document or signal to rollback (false = rollback; true = proceed)
	callback := func(sessCtx mongo.SessionContext) (interface{}, error) {
		filter := bson.D{primitive.E{Key: "_id", Value: cabinName}}
		change := bson.M{"$set": bson.M{"pictures.mainPicture": picture}}
		resNoSql, err := collection.UpdateOne(
			context.Background(),
			filter,
			change,
		)
		if err != nil {
			return false, err
		}

		//If number of modified matches, all good
		modified := resNoSql.ModifiedCount
		if modified == 1 {
			return true, nil
		} else {
			return false, fmt.Errorf("%d element(s) modified. Expected: 1", modified)
		}
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
	defer session.AbortTransaction(mongoCtx)

	// If MongoDB transaction fails, abort
	if success != true {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	// Save picture
	ctx, status, err := SaveFile(ctx, file)
	if err != nil {
		// If saving fails, abort transaction for MongoDB
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// On success, commit and return success
	session.CommitTransaction(mongoCtx)
	ctx.String(http.StatusOK, file.Filename)

}

func (r repo) PostOnePicture(ctx *gin.Context) {
	// Retrieve file, cabin name and alternative text
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": err.Error()})
		return
	}
	cabinName := ctx.Request.FormValue("cabinName")
	altText := ctx.Request.FormValue("altText")

	// Check that file name is valid (done also before file saving to avoid SQL injection)
	filename, err := utils.CheckFilename(file.Filename)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	var picture = data.Picture{
		Filename: filename,
		AltText:  altText,
	}

	// Start MongoDB query
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	// Callback: either update document or signal to rollback (false = rollback; true = proceed)
	callback := func(sessCtx mongo.SessionContext) (interface{}, error) {
		filter := bson.D{primitive.E{Key: "_id", Value: cabinName}}
		change := bson.M{"$push": bson.M{"pictures.otherPictures": picture}}
		resNoSql, err := collection.UpdateOne(
			context.Background(),
			filter,
			change,
		)
		if err != nil {
			return false, err
		}

		// If number of modified matches, all good
		modified := resNoSql.ModifiedCount
		if modified == 1 {
			return true, nil
		} else {
			return false, fmt.Errorf("%d element(s) modified. Expected: 1", modified)
		}
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
	defer session.AbortTransaction(mongoCtx)

	// If MongoDB transaction fails, abort
	if success != true {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	// Save picture
	ctx, status, err := SaveFile(ctx, file)
	if err != nil {
		// If saving fails, abort transaction for MongoDB
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// On success, commit and return success
	session.CommitTransaction(mongoCtx)
	ctx.String(http.StatusOK, file.Filename)
}

func (r repo) PostReplaceRestPicture(ctx *gin.Context) {
	// Retrieve file, cabin name and alternative text
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": err.Error()})
		return
	}
	cabinName := ctx.Request.FormValue("cabinName")
	altText := ctx.Request.FormValue("altText")

	// Check that file name is valid (done also before file saving to avoid SQL injection)
	filename, err := utils.CheckFilename(file.Filename)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	type Picture struct {
		Filename string `json:"filename" bson:"filename"`
		AltText  string `json:"altText,omitempty" bson:"altText,omitempty"`
	}

	picture := []Picture{
		{
			Filename: filename,
			AltText:  altText,
		},
	}

	// Start MongoDB query
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	// Callback: either update document or signal to rollback (false = rollback; true = proceed)
	callback := func(sessCtx mongo.SessionContext) (interface{}, error) {
		filter := bson.D{primitive.E{Key: "_id", Value: cabinName}}
		change := bson.M{"$set": bson.M{"pictures.otherPictures": picture}}
		resNoSql, err := collection.UpdateOne(
			context.Background(),
			filter,
			change,
		)
		if err != nil {
			return false, err
		}

		// If number of modified matches, all good
		modified := resNoSql.ModifiedCount
		if modified == 1 {
			return true, nil
		} else {
			return false, fmt.Errorf("%d element(s) modified. Expected: 1", modified)
		}
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
	defer session.AbortTransaction(mongoCtx)

	// If MongoDB transaction fails, abort
	if success != true {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	// Save picture
	ctx, status, err := SaveFile(ctx, file)
	if err != nil {
		// If saving fails, abort transaction for MongoDB
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// On success, commit and return success
	session.CommitTransaction(mongoCtx)
	ctx.String(http.StatusOK, file.Filename)
}

func (r repo) PostReplaceFirstRestPicture(ctx *gin.Context) {
	// Retrieve file, cabin name and alternative text
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": err.Error()})
		return
	}
	cabinName := ctx.Request.FormValue("cabinName")
	altText := ctx.Request.FormValue("altText")

	// Check that file name is valid (done also before file saving to avoid SQL injection)
	filename, err := utils.CheckFilename(file.Filename)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	type Picture struct {
		Filename string `json:"filename" bson:"filename"`
		AltText  string `json:"altText,omitempty" bson:"altText,omitempty"`
	}

	var picture Picture
	picture.Filename = filename
	picture.AltText = altText

	var cabins []data.Cabin
	// Start MongoDB query
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	cursor, err := collection.Find(
		context.Background(),
		bson.D{primitive.E{Key: "_id", Value: cabinName}},
	)
	cursor.All(context.Background(), &cabins)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	if len(cabins) == 1 {
		cabins[0].Pictures.Other[0] = data.Picture(picture)
	} else {
		ctx.JSON(http.StatusNoContent, nil)
	}

	// Callback: either update document or signal to rollback (false = rollback; true = proceed)
	callback := func(sessCtx mongo.SessionContext) (interface{}, error) {
		filter := bson.D{primitive.E{Key: "_id", Value: cabinName}}
		change := bson.M{"$set": bson.M{"pictures.otherPictures": cabins[0].Pictures.Other}}
		resNoSql, err := collection.UpdateOne(
			context.Background(),
			filter,
			change,
		)
		if err != nil {
			return false, err
		}

		// If number of modified matches, all good
		modified := resNoSql.ModifiedCount
		if modified == 1 {
			return true, nil
		} else {
			return false, fmt.Errorf("%d element(s) modified. Expected: 1", modified)
		}
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
	defer session.AbortTransaction(mongoCtx)

	// If MongoDB transaction fails, abort
	if success != true {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	// Save picture
	ctx, status, err := SaveFile(ctx, file)
	if err != nil {
		// If saving fails, abort transaction for MongoDB
		ctx.AbortWithStatusJSON(status, gin.H{"err": err.Error()})
		return
	}

	// On success, commit and return success
	session.CommitTransaction(mongoCtx)
	ctx.String(http.StatusOK, file.Filename)
}

func (r repo) DeletePictures(ctx *gin.Context) {
	//os.Remove("path/to/file") golang for removing the pictures in the backend

	file := ctx.Request.FormValue("file")
	cabinName := ctx.Request.FormValue("cabinName")

	var cabins []data.Cabin
	// Start MongoDB query
	collection := r.noSqlDb.Database("hyttegruppen").Collection("cabins")
	cursor, err := collection.Find(
		context.Background(),
		bson.D{primitive.E{Key: "_id", Value: cabinName}},
	)
	cursor.All(context.Background(), &cabins)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	newArray := cabins[0].Pictures.Other

	if len(cabins) == 1 {
		var index int
		for k, element := range newArray {
			if file == element.Filename {
				index = k
			}
		}

		newArray = RemoveIndex(newArray, index)
	} else {
		ctx.JSON(http.StatusNoContent, nil)
	}

	// Callback: either update document or signal to rollback (false = rollback; true = proceed)
	callback := func(sessCtx mongo.SessionContext) (interface{}, error) {
		filter := bson.D{primitive.E{Key: "_id", Value: cabinName}}
		change := bson.M{"$set": bson.M{"pictures.otherPictures": newArray}}
		resNoSql, err := collection.UpdateOne(
			context.Background(),
			filter,
			change,
		)
		if err != nil {
			return false, err
		}

		// If number of modified matches, all good
		modified := resNoSql.ModifiedCount
		if modified == 1 {
			return true, nil
		} else {
			return false, fmt.Errorf("%d element(s) modified. Expected: 1", modified)
		}
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
	defer session.AbortTransaction(mongoCtx)

	// If MongoDB transaction fails, abort
	if success != true {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	// Delete the picture
	root := os.Getenv("hytteroot")
	path := fmt.Sprintf("%s/frontend/public/assets/pictures/%s", root, file)
	error := os.Remove(path) // remove a single file
	if error != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
	}

	// On success, commit and return success
	session.CommitTransaction(mongoCtx)
	ctx.JSON(200, cabinName)

}

func RemoveIndex(s []data.Picture, index int) []data.Picture {
	return append(s[:index], s[index+1:]...)
}
