package main

import (
	"bachelorprosjekt/backend/server"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"

	"github.com/jasonlvhit/gocron"
)

func task() {
	_, err := http.Get("http://localhost:8080/application/all")
	if err != nil {
		log.Fatalln(err)
	}
}

func main() {

	// Get arguments (passed + processed)
	args := getArgs()

	//Start cron job
	go func() {
		gocron.Every(1).Minute().Do(task)
		<-gocron.Start()
	}()

	//Start server
	server.Start(args)
}

// Get arguments from flags and process accordingly
func getArgs() server.Args {
	var path string
	var creds string

	flag.StringVar(&path, "path", "", "Specify the absolute path to the root folder")
	flag.StringVar(&creds, "creds", "", "Specify the absolute path to the credentials folder. Default is path/to/project/credentials")

	flag.Parse()

	// Check if path is passed; if not, retrieve from pwd
	path = getRoot(path)

	// Check if creds path is passed; if not, $path/credentials
	creds = getCreds(path, creds)

	return server.Args{RootPath: path, CredsPath: creds}
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
