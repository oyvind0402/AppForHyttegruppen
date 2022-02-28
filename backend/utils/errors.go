package utils

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Panicker(err error, msg string) {
	if err != nil {
		panic(fmt.Sprintf("%s. ERROR:\n%s", msg, err.Error()))
	}
}

func AbortWithStatus(err error, ctx gin.Context) {
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"err": err.Error()})
	}
}
