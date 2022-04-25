package server

import (
	//"bachelorprosjekt/backend/server"

	//	"fmt"

	"bachelorprosjekt/backend/data"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	//"bachelorprosjekt/backend/server"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/stretchr/testify/assert"
)

//initialise the router
func initialise() *gin.Engine {
	r := StartDB("../../credentials")
	router := SetRouter(r)
	return router
}

//checks the period recieved by id
func TestGetPeriodById(t *testing.T) {
	r := initialise()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/period/3", nil)
	r.ServeHTTP(w, req)

	jString := "{\"id\":3,\"name\":\"Week 3\",\"season\":{\"seasonName\":\"winter2022\"},\"start\":\"2022-01-17T00:00:00Z\",\"end\":\"2022-01-24T00:00:00Z\"}"
	var expected data.Period
	json.Unmarshal([]byte(jString), &expected)

	resultString := w.Body.String()
	var result data.Period
	json.Unmarshal([]byte(resultString), &result)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, expected, result)

}

//checks the size of returned periods from one seazon
func TestGetAllPeriodsInSeason(t *testing.T) {
	r := initialise()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/period/inseason/winter2022", nil)
	r.ServeHTTP(w, req)

	//converts the respose body to json
	resultString := w.Body.String()
	var resultArray []data.Period
	json.Unmarshal([]byte(resultString), &resultArray)
	result := len(resultArray)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, 17, result)
}

//checks the size of returned periods in open season
func TestGetPeriodInOpenPeriod(t *testing.T) {
	r := initialise()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/period/inseason/open", nil)
	r.ServeHTTP(w, req)

	//converts the respose body to json
	resultString := w.Body.String()
	var resultArray []data.Period
	json.Unmarshal([]byte(resultString), &resultArray)
	result := len(resultArray)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, 1, result)

}

func TestGetAllPeriods(t *testing.T) {
	r := initialise()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/period/all", nil)
	r.ServeHTTP(w, req)

	//converts the respose body to json
	resultString := w.Body.String()
	var resultArray []data.Period
	json.Unmarshal([]byte(resultString), &resultArray)
	result := len(resultArray)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, 18, result)

}

func TestPostPeriod(t *testing.T) {

	s := "weoigf"
	body := bytes.NewBufferString(s)
	secret := "randomString"
	token := jwt.EncodeSegment([]byte(secret))

	r := initialise()
	w := httptest.NewRecorder()
	//FIXME fix authentication problem
	//periodapi.POST("/post", middleware.Authenticate(), r.PostPeriod)
	//send token properly ?
	req, _ := http.NewRequest("POST", "/period/post", body)
	// req.Header.Set("token", token)
	req.Header.Add("token", token)

	r.ServeHTTP(w, req)

	assert.Equal(t, 1, w.Body.String())
	assert.Equal(t, 200, w.Code)
}

func TestPostManyPeriods(t *testing.T) {
	r := initialise()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/period/all", nil)
	r.ServeHTTP(w, req)

}

func TestUpdate(t *testing.T) {
	r := initialise()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/period/all", nil)
	r.ServeHTTP(w, req)

}

func TestDeletePeriod(t *testing.T) {
	r := initialise()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/period/all", nil)
	r.ServeHTTP(w, req)

}

func TestDeleteMany(t *testing.T) {
	r := initialise()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/period/all", nil)
	r.ServeHTTP(w, req)

}
