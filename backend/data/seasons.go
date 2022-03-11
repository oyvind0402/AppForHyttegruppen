package data

import "time"

type Season struct {
	SeasonName string    `json:"seasonName"`
	FirstDay   time.Time `json:"firstDay"`
	LastDay    time.Time `json:"lastDay"`
}
