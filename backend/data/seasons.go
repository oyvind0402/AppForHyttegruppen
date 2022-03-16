package data

import "time"

type Season struct {
	Name     string     `json:"seasonName"`
	FirstDay *time.Time `json:"firstDay,omitempty"`
	LastDay  *time.Time `json:"lastDay,omitempty"`
}
