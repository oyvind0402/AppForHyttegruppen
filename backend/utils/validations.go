package utils

import (
	"regexp"
	"strconv"
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

// Cabin validation
func CheckCabinValidation(name string, address string, latitude float64, longitude float64, directions string, longdesc string, shortdesc string, price int, cleaningprice int, bathrooms int, beds int, bedrooms int) bool {
	nameRegex := regexp.MustCompile(`^[a-zA-ZøæåØÆÅ. \\-]{2,20}$`)
	addressRegex := regexp.MustCompile(`^[0-9a-zA-ZøæåØÆÅ. \\-]{2,50}$`)
	latRegex := regexp.MustCompile(`^(([1-8]?[0-9])(\.[0-9]{1,6})?|90(\.0{1,6})?)$`)
	longRegex := regexp.MustCompile(`^((([1-9]?[0-9]|1[0-7][0-9])(\.[0-9]{1,6})?)|180(\.0{1,6})?)$`)
	dirRegex := regexp.MustCompile(`^[\S\s]{1,}$`)
	longDescRegex := regexp.MustCompile(`^[\S\s]{1,}$`)
	shortDescRegex := regexp.MustCompile(`^[\S\s]{1,}$`)
	priceRegex := regexp.MustCompile(`^(0|[1-9]{1}[0-9]{0,})$`)
	cleaningPriceRegex := regexp.MustCompile(`^(0|[1-9]{1}[0-9]{0,})$`)
	bathroomsRegex := regexp.MustCompile(`^(0|[1-9]{1}[0-9]{0,})$`)
	bedsRegex := regexp.MustCompile(`^(0|[1-9]{1}[0-9]{0,})$`)
	bedroomsRegex := regexp.MustCompile(`^(0|[1-9]{1}[0-9]{0,})$`)

	return nameRegex.MatchString(name) && addressRegex.MatchString(address) && latRegex.MatchString(strconv.FormatFloat(latitude, 'f', -1, 64)) && longRegex.MatchString(strconv.FormatFloat(longitude, 'f', -1, 64)) && dirRegex.MatchString(directions) && longDescRegex.MatchString(longdesc) && shortDescRegex.MatchString(shortdesc) && priceRegex.MatchString(strconv.Itoa(price)) && cleaningPriceRegex.MatchString(strconv.Itoa(cleaningprice)) && bathroomsRegex.MatchString(strconv.Itoa(bathrooms)) && bedsRegex.MatchString(strconv.Itoa(beds)) && bedroomsRegex.MatchString(strconv.Itoa(bedrooms))
}

func CheckFAQValidation(question string, answer string) bool {
	questionRegex := regexp.MustCompile(`^[\S\s]{1,}$`)
	answerRegex := regexp.MustCompile(`^[\S\s]{1,}$`)

	return questionRegex.MatchString(question) && answerRegex.MatchString(answer)
}

func CheckAdminEmailValidation(email string) bool {
	emailRegex := regexp.MustCompile(`^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$`)
	return emailRegex.MatchString(email)
}
