package data

import (
	"time"
)

type Period struct {
	Start  time.Time `json:"start"`
	End    time.Time `json:"end"`
	Season Season    `json:"season"`
}
