package server

import (
	//"bachelorprosjekt/backend/server"

	//	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	//"bachelorprosjekt/backend/server"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

//initialise the router
func initialise() *gin.Engine {
	r := StartDB()
	router := SetRouter(r)
	return router
}

func TestGetPeriodById(t *testing.T) {
	r := initialise()

	var expected string = ""
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/period/2", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, expected, w.Body.String())
}

func TestGetAllPeriodsInSeason(t *testing.T) {
	r := initialise()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "period/inseason/open", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
}
func TestGetAllPeriods(t *testing.T) {
	r := initialise()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/period/all", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code, "they should be equal")
	//assert.Equal(t, "pong", w.Body.String())
}
