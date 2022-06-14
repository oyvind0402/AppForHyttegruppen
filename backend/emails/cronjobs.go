package emails

import (
	"bachelorprosjekt/backend/data"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

// Function to send an email to any winning application 2 days before the trip
func SendEmailNotification() {
	var htmlBody strings.Builder
	resp, err := http.Get("http://localhost:8080/api/application/winners/future")
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
			//server.SendEmail(applications[i].User.Email, htmlBody, "Husk turen om 2 dager!")
			htmlBody.Reset()
		}
	}
}

//Sends info to the admin in case a user hasnt sent in the feedback form 2 days after the trip
func SendFeedbackInfo() {
	var htmlBody strings.Builder
	resp, err := http.Get("http://localhost:8080/api/application/winners/past")
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

	resp2, err2 := http.Get("http://localhost:8080/api/admin_email/all")
	if err2 != nil {
		panic(err2.Error())
	}

	type Emails struct {
		Id    string `json:"emailId"`
		Email string `json:"email"`
	}

	body2, err := ioutil.ReadAll(resp2.Body)

	var emails []Emails

	json.Unmarshal(body2, &emails)

	if err != nil {
		panic(err.Error())
	}

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

				// for _, email := range emails {
				// 	server.SendEmail(email.Email, htmlBody, "Notifikasjon om for sen tilbakemelding")
				// }
				htmlBody.Reset()
			}
		}
	}
}

//Sends notification to a user about sending in the feedback form at the end of their trip
func SendFeedbackReminder() {
	var htmlBody strings.Builder
	resp, err := http.Get("http://localhost:8080/api/application/winners/current")
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

				//server.SendEmail(applications[i].User.Email, htmlBody, "Husk tilbakemeldingsskjema!")
				htmlBody.Reset()
			}
		}
	}
}
