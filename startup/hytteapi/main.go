package main

import (
	"bachelorprosjekt/backend/emails"
	"bachelorprosjekt/backend/server"
	"flag"
	"fmt"
	"log"
	"os"
	"regexp"

	"github.com/jasonlvhit/gocron"
)

func main() {

	// Get arguments (passed + processed)
	getArgs()

	// Start cron jobs

	// Every day check if new trips are coming up
	go func() {
		gocron.Every(1).Day().At("10:30").Do(emails.SendEmailNotification)
		<-gocron.Start()
	}()

	// Every day check if feedback is not sent for past trips
	go func() {
		gocron.Every(1).Day().At("10:30").Do(emails.SendFeedbackInfo)
		<-gocron.Start()
	}()

	// Every day check if feedback is not sent for current trips, sending a reminder
	go func() {
		gocron.Every(1).Day().At("10:30").Do(emails.SendFeedbackReminder)
		<-gocron.Start()
	}()

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
