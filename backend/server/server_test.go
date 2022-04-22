package server

import (
	//"bachelorprosjekt/backend/server"

	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	//"bachelorprosjekt/backend/server"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

//initialise the router
func initialise() *gin.Engine {
	fmt.Println("before  startDB")
	r := StartDB()
	fmt.Println("before SetRouter")
	router := SetRouter(r)
	return router
}

func TestGetPeriodById(t *testing.T) {
	r := initialise()
	start, _ := time.Parse("2022-01-10T00:00:00Z", "2022-01-10T00:00:00Z")
	end, _ := time.Parse("2022-01-17T00:00:00Z", "2022-01-17T00:00:00Z")
	//seasonNane data.Season =  {"winter2022",nil, nil, nil,nil}

	/* season := data.Season{
		Name:       "winter2022",
		FirstDay:   nil,
		LastDay:    nil,
		ApplyFrom:  nil,
		ApplyUntil: nil,
	}

	period := data.Period{
		Id:   2,
		Name: "Week 2",
		Season: data.Season{
			Name:       "winter2022",
			FirstDay:   nil,
			LastDay:    nil,
			ApplyFrom:  nil,
			ApplyUntil: nil,
		},
		Start: &start,
		End:   &end,
	} */

	//var expected string = period
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/period/2", nil)
	r.ServeHTTP(w, req)

	var output = w.Body
	fmt.Printf("var1 = %T\n", output)
	fmt.Println(w.Body.String())
	assert.Equal(t, 200, w.Code)
	//assert.Equal(t, String(expected), w.Body.String())
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

	assert.Equal(t, 200, w.Code)
	//assert.Equal(t, "pong", w.Body.String())
}
