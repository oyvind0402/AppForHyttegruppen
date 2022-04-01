package utils

import (
	"errors"
	"fmt"
	"reflect"
	"regexp"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func NormaliseTime(inTime string) (time.Time, error) {
	layout := "2006-01-02T00:00:00Z"
	var date time.Time
	var err error

	if match, _ := regexp.MatchString("([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z)", inTime); match {
		// Convert to Time
		date, err = time.Parse(layout, inTime)
		if err != nil {
			return date, err
		}

		return date, err
	}

	if match, _ := regexp.MatchString("([0-9]{4}-[0-9]{2}-[0-9]{2})", inTime); match {
		// Append time 00:00
		inTime += "T00:00:00Z"

		// Convert to Time
		date, err = time.Parse(layout, inTime)
		if err != nil {
			return date, err
		}

		return date, err
	}

	err = errors.New("string does not match time format 2006-01-02T00:00:00Z or 2006-01-02")
	return date, err
}

func ObjToPrimitive(initkey string, obj interface{}) primitive.E {
	if reflect.ValueOf(obj).Kind() == reflect.Map {
		for k, v := range obj.(map[string]interface{}) {
			return ObjToPrimitive(fmt.Sprintf("%s.%s", initkey, k), v)
		}
	}
	return primitive.E{Key: initkey, Value: obj}
}
