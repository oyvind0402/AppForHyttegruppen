package data

import (
	"time"
)

type Period struct {
	Id     int       `json:"id"`
	Name   string    `json:"name"`
	Start  time.Time `json:"start"`
	End    time.Time `json:"end"`
	Season Season    `json:"season"`
}
