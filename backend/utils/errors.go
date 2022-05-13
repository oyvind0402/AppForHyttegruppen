package utils

import (
	"fmt"
)

func Panicker(err error, msg string) {
	if err != nil {
		panic(fmt.Sprintf("%s. ERROR:\n%s", msg, err.Error()))
	}
}
