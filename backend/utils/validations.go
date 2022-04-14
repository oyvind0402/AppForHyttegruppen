package utils

import (
	"regexp"
)

// Checks validity of email
func CheckEmailValidity(email string) bool {
	regex := regexp.MustCompile(`^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$`)
	return regex.MatchString(email)
}
