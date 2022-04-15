package utils

import (
	"regexp"
	"unicode"
)

// User validation
func CheckUserValidity(email string, firstname string, lastname string) bool {
	emailRegex := regexp.MustCompile(`^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$`)
	firstnameRegex := regexp.MustCompile(`^[a-zA-ZøæåØÆÅ. \\-]{2,20}$`)
	lastnameRegex := regexp.MustCompile(`^[a-zA-ZøæåØÆÅ. \\-]{2,30}$`)
	return emailRegex.MatchString(email) && firstnameRegex.MatchString(firstname) && lastnameRegex.MatchString(lastname)
}

func CheckPasswordValidity(password string) bool {
	var (
		minSevenChars = false
		upperCase     = false
		lowerCase     = false
		number        = false
		special       = false
	)
	if len(password) >= 8 {
		minSevenChars = true
	}
	for _, char := range password {
		if unicode.IsUpper(char) {
			upperCase = true
		}
		if unicode.IsLower(char) {
			lowerCase = true
		}
		if unicode.IsNumber(char) {
			number = true
		}
		if unicode.IsPunct(char) || unicode.IsSymbol(char) {
			special = true
		}
	}
	return minSevenChars && upperCase && lowerCase && number && special
}
