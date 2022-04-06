package server

import (
	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"
	"context"
	"errors"
	"fmt"
	"mime/multipart"
	"net/http"

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

	if err := ctx.SaveUploadedFile(file, "./frontend/public/assets/pictures/"+filename); err != nil {
		return ctx, http.StatusFailedDependency, err
	}

	// TODO: Handle duplicates

	return ctx, http.StatusOK, nil
}

func (r repo) PostOnePicture(ctx *gin.Context) {
	// Retrieve file, cabin name and alternative text
	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": err.Error()})
		return
	}
	cabinName := ctx.Request.FormValue("cabinName")
	//FIXME Comment out when altText is passed
	// altText := ctx.Request.FormValue("altText")
	altText := "altText"

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
			return false, errors.New(fmt.Sprintf("%d element(s) modified. Expected: 1", modified))
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

func (r repo) PostManyPictures(ctx *gin.Context) {
	//Maybe later
}