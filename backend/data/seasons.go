package data

import "time"

type Season struct {
	Name     string    `json:"name"`
	FirstDay time.Time `json:"firstDay"`
	LastDay  time.Time `json:"lastDay"`
}
