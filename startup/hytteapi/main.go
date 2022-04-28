package main

import (
	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/server"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/jasonlvhit/gocron"
)

// Function to send an email to any winning application 2 days before the trip
func sendEmailNotification() {
	resp, err := http.Get("http://localhost:8080/application/winners/future")
	if err != nil {
		panic(err.Error())
	}

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		panic(err.Error())
	}

	var applications []data.Application

	json.Unmarshal(body, &applications)

	loc, _ := time.LoadLocation("UTC")
	now := time.Now().In(loc)

	for i := range applications {
		diff := now.Sub(*applications[i].Period.Start)
		// If there is an application that has start date in 2 days
		if int(((diff.Hours()/24)*-1)+1) == 2 {
			// TODO Send email here with information to the user (applications[i].user.email) about the trip
		}
	}
}

func sendFeedbackInfo() {
	resp, err := http.Get("http://localhost:8080/application/winners/past")
	if err != nil {
		panic(err.Error())
	}

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		panic(err.Error())
	}

	var applications []data.Application

	json.Unmarshal(body, &applications)

	loc, _ := time.LoadLocation("UTC")
	now := time.Now().In(loc)

	for i := range applications {
		diff := now.Sub(*applications[i].Period.End)
		// If its 2 days after the trip and the user hasnt sent feedback
		if int((diff.Hours() / 24)) == 2 {
			if !applications[i].FeedbackSent {
				// TODO Send email to admin about feedback not sent for a specific application,
				// if its two days since the trip and they havent sent feedback
			}
		}
	}
}

func main() {

	// Get arguments (passed + processed)
	args := getArgs()

	// Start cron jobs

	// Every day check if new trips are coming up
	go func() {
		gocron.Every(1).Day().At("10:30").Do(sendEmailNotification)
		<-gocron.Start()
	}()

	// Every day check if feedback is not sent for past trips
	go func() {
		gocron.Every(1).Day().At("10:30").Do(sendFeedbackInfo)
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
