package server

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// Retrieve one faq by ID (receives string; returns FAQ)
func (r repo) GetOneFAQ(ctx *gin.Context) {
	// Retrieve parameter ID
	faqId := new(string)
	if err := ctx.BindJSON(faqId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Select faq from database
	collection := r.noSqlDb.Database("hyttegruppen").Collection("faq")
	res := collection.FindOne(
		context.Background(),
		bson.D{{"_id", *faqId}},
	)
	if res.Err() == mongo.ErrNoDocuments {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": res.Err().Error()})
		return
	}
	if res.Err() != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": res.Err().Error()})
		return
	}

	var faq bson.M
	if err := res.Decode(faq); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Return success and one faq
	ctx.JSON(http.StatusOK, faq)
}

// Retrieve all faqs in database (receives NOTHING; returns []bson)
func (r repo) GetAllFAQs(ctx *gin.Context) {
	// Retrieve parameter ID
	faqId := new(string)
	if err := ctx.BindJSON(faqId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Select faq from database
	collection := r.noSqlDb.Database("hyttegruppen").Collection("faq")
	cursor, err := collection.Find(context.Background(), bson.D{})
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Create FAQ array
	var faqs []bson.M
	err = cursor.All(context.Background(), &faqs)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Return success and FAQ array
	ctx.JSON(200, faqs)
}

// Post one faq (receives FAQ: interface{}; returns InsertedId: interface{})
func (r repo) PostFAQ(ctx *gin.Context) {
	// Retrieve FAQ
	faq := new(interface{})
	err := ctx.BindJSON(faq)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Add faq to database
	collection := r.noSqlDb.Database("hyttegruppen").Collection("faq")
	res, err := collection.InsertOne(
		context.Background(),
		faq,
	)

	// Return success and ID of added faq
	ctx.JSON(200, res.InsertedID)
}

// Update one faq with specified ID (receives faq: interface{}; returns preUpdateFaq: bson.D)
func (r repo) UpdateFAQ(ctx *gin.Context) {
	// Retrieve ID parameter
	faqId := new(interface{})
	if err := ctx.BindJSON(faqId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Update on database
	collection := r.noSqlDb.Database("hyttegruppen").Collection("faq")
	res := collection.FindOneAndReplace(context.Background(), bson.D{{"_id", faqId}}, faqId)
	if res.Err() == mongo.ErrNoDocuments {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": res.Err().Error()})
		return
	}
	if res.Err() != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": res.Err().Error()})
		return
	}

	// Retrieve response value
	var preUpdateDoc bson.M
	if err := res.Decode(preUpdateDoc); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Return the document as it was BEFORE deletion
	ctx.JSON(200, preUpdateDoc)
}

// Delete one faq with specified ID (receives faqId: string; returns deletedFaq: bson.D)
func (r repo) DeleteFAQ(ctx *gin.Context) {
	// Retrieve ID parameter
	faqId := new(string)
	if err := ctx.BindJSON(faqId); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Delete from database
	collection := r.noSqlDb.Database("hyttegruppen").Collection("faq")
	res := collection.FindOneAndDelete(context.Background(), bson.D{{"_id", faqId}})
	if res.Err() == mongo.ErrNoDocuments {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": res.Err().Error()})
		return
	}
	if res.Err() != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": res.Err().Error()})
		return
	}

	// Retrieve response value
	var deletedDoc bson.M
	if err := res.Decode(deletedDoc); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
		return
	}

	// Return the document as it was BEFORE deletion
	ctx.JSON(200, deletedDoc)
}
