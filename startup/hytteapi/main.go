package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"regexp"

	"bachelorprosjekt/backend/server"
)

func main() {
	//Create environment variables
	getArgs()

	//Start server
	server.Start()
}

// Get arguments from flags and process accordingly
func getArgs() {
	var path string
	var creds string

	flag.StringVar(&path, "path", "", "Specify the absolute path to the root folder")
	flag.StringVar(&creds, "creds", "", "Specify the absolute path to the credentials folder. Default is path/to/project/credentials")

	flag.Parse()

	// Check if path is passed; if not, retrieve from pwd
	path = getRoot(path)

	// Check if creds path is passed; if not, $path/credentials
	creds = getCreds(path, creds)

	os.Setenv("hytteroot", path)
	os.Setenv("hyttecreds", creds)
}

// Retrieve path to project root
func getRoot(path string) string {
	root := path
	// If -p argument not passed, fetch as pwd
	if root == "" {
		// Get working directory
		wd, err := os.Getwd()
		if err != nil {
			log.Fatal(err)
		}

		// Remove all content after "AppForHyttegruppen" (/ for Unix, \ for Windows)
		re := regexp.MustCompile(`(?m)^(.*AppForHyttegruppen[/\\]).*`)
		root = re.ReplaceAllString(wd, "${1}")
	}
	return root
}

// Retrieve path to credentials
func getCreds(rootPath string, credsPath string) string {
	if credsPath != "" {
		return credsPath
	}
	return fmt.Sprintf("%s/credentials", rootPath)
}
