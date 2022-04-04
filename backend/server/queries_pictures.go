package server

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (r repo) PostOnePicture(ctx *gin.Context) {

	fmt.Println(ctx.Request.FormValue("cabinName"))

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err1": err.Error()})
		fmt.Println(err)
	}
	cabinName := ctx.Request.FormValue("cabinName")

	fmt.Println(cabinName)
	//Save picture to array to cabin
	//file.Filename
	//alt needs to be added

	//If everything goes well we want to save the picture
	err = ctx.SaveUploadedFile(file, "./frontend/public/assets/pictures/"+file.Filename)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"err": err.Error()})
		fmt.Println(err)
	}

	//cabinName
	//update cabin pictures push
	//[filename, filenmae, filename, ]

	ctx.String(http.StatusOK, file.Filename)
}

func (r repo) PostManyPictures(ctx *gin.Context) {
	//Maybe later
}
