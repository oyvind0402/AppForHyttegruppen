package data

import (
	"time"
)

type Period struct {
	Id     int        `json:"id"`
	Name   string     `json:"name"`
	Season Season     `json:"season"`
	Start  *time.Time `json:"start"`
	End    *time.Time `json:"end"`
}
