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
	"strings"
	"time"

	"github.com/jasonlvhit/gocron"
)

// Function to send an email to any winning application 2 days before the trip
func sendEmailNotification() {
	var htmlBody strings.Builder
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
			htmlBody.WriteString(`<html>
				<head>
					<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
					<title>Automatic email from go</title>
				</head>
				<body>
			`)
			htmlBody.WriteString(`<p>`)
			htmlBody.WriteString("Du har en tur om 2 dager!")
			htmlBody.WriteString(`</p>`)
			htmlBody.WriteString(`<p>Du ble tildelt `)
			for _, cabin := range applications[i].CabinsWon {
				htmlBody.WriteString(cabin.Name + " ")
			}
			htmlBody.WriteString("i perioden " + applications[i].Period.Name + " (" + applications[i].Period.Start.Format("2006-01-02") + " - " + applications[i].Period.End.Format("2006-01-02") + ")")
			htmlBody.WriteString(`<br />Husk å sjekk hytteportalen for å se informasjon om hva du må ta med osv!`)
			htmlBody.WriteString(`</p>`)
			htmlBody.WriteString(`</body></html>`)
			//TODO add user email instead of this email (application[i].User.Email)
			server.SendEmail("oyvind0402@gmail.com", htmlBody, "Husk turen om 2 dager!")
			htmlBody.Reset()
		}
	}
}

func sendFeedbackInfo() {
	var htmlBody strings.Builder
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
				htmlBody.WriteString(`<html>
					<head>
						<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
						<title>Automatic email from go</title>
					</head>
					<body>
				`)
				htmlBody.WriteString(`<p>`)
				htmlBody.WriteString("Etter turen til ")
				for i, cabin := range applications[i].CabinsWon {
					if i == len(applications[i].CabinsWon) {
						htmlBody.WriteString(cabin.Name)
					} else {
						htmlBody.WriteString(cabin.Name)
						htmlBody.WriteString(", ")
					}
				}
				htmlBody.WriteString(" i periode " + applications[i].Period.Name + " (" + applications[i].Period.Start.Format("2006-01-02") + " - " + applications[i].Period.End.Format("2006-01-02") + ")")
				htmlBody.WriteString(" har ikke " + applications[i].User.FirstName + " " + applications[i].User.LastName + " sendt inn tilbakemeldingsskjemaet enda!")
				htmlBody.WriteString(`</p>`)
				htmlBody.WriteString(`</body></html>`)
				//TODO add admin email instead of this email
				server.SendEmail("oyvind0402@gmail.com", htmlBody, "Notifikasjon om for sen tilbakemelding")
				htmlBody.Reset()
			}
		}
	}
}

func sendFeedbackReminder() {
	var htmlBody strings.Builder
	resp, err := http.Get("http://localhost:8080/application/winners/current")
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
		// If its at the end of the the trip and the user hasnt sent feedback
		if int((diff.Hours() / 24)) == 0 {
			if !applications[i].FeedbackSent {
				htmlBody.WriteString(`<html>
					<head>
						<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
						<title>Automatic email from go</title>
					</head>
					<body>
				`)
				htmlBody.WriteString(`<p>`)
				htmlBody.WriteString("Huske å sende inn tilbakemeldingsskjemaet etter turen er over!")
				htmlBody.WriteString(`<br />`)
				htmlBody.WriteString("Skjemaet finnes på 'mine sider -> handling kreves' på hytteportalen sine nettsider.")
				htmlBody.WriteString(`</p>`)
				htmlBody.WriteString(`</body></html>`)
				//TODO add user email instead of this email (applications[i].User.Email)
				server.SendEmail("oyvind0402@gmail.com", htmlBody, "Husk tilbakemeldingsskjema!")
				htmlBody.Reset()
			}
		}
	}
}

func main() {

	// Get arguments (passed + processed)
	getArgs()

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

	// Every day check if feedback is not sent for current trips, sending a reminder
	go func() {
		gocron.Every(1).Day().At("10:30").Do(sendFeedbackReminder)
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
