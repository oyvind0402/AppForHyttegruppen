package utils

import (
	"bufio"
	"os"
)

func GetCreds(filepath string) (string, string) {
	// Read credentials from file
	f, err := os.Open(filepath)
	defer f.Close()
	Panicker(err, "Cannot read credentials")

	reader := bufio.NewReader(f)
	usernameByte, _, err := reader.ReadLine()
	username := string(usernameByte)
	Panicker(err, "Cannot read username")

	passwdBytes, _, err := reader.ReadLine()
	passwd := string(passwdBytes)
	Panicker(err, "Cannot read password")

	return username, passwd
}
