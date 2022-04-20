package main

import (
	"log"
	"os"
	"regexp"
	"strings"

	"bachelorprosjekt/backend/server"
)

func main() {
	setRoot()
	print(os.Getenv("hytteroot"))
	server.Start()
}

func setRoot() {
	// Get working directory
	wd, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	// Remove all content after "AppForHyttegruppen" (/ for Unix, \ for Windows)
	re := regexp.MustCompile(`(?m)^(.*AppForHyttegruppen[/\\]).*`)
	root := re.ReplaceAllString(wd, "${1}")
	root = strings.TrimSuffix(root, "/")
	root = strings.TrimSuffix(root, "\\")

	os.Setenv("hytteroot", root)
}
