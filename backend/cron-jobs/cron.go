package cron

import (
	"fmt"

	"github.com/jasonlvhit/gocron"
)

func task() {
	fmt.Println("A TASK IS HAPPENING!")
}

func main() {
	gocron.Every(1).Minute().Do(task)
}
