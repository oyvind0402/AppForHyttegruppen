package server

import (
	//"bachelorprosjekt/backend/server"

	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	mail "github.com/xhit/go-simple-mail/v2"
)

//enpoint to send email after application was sent and registered
func (r repo) AfterApplicationSent(ctx *gin.Context) {
	var htmlBody strings.Builder
	//create html body
	htmlBody.WriteString(`<html>
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   <title>Automatic email from go</title>
</head>
<body>
   <p>Perioder du har søkt på:</p>
	`)

	type FormData struct {
		UserId  string        `json:"userId"`
		Periods []data.Period `json:"periods"`
	}

	//reads data sent from the client
	var inData = new(FormData)
	err := ctx.BindJSON(inData)
	if err != nil {
		fmt.Println(err)
		return
	}

	for _, period := range inData.Periods {
		htmlBody.WriteString(`<p>`)
		htmlBody.WriteString(period.Name)
		htmlBody.WriteString(`</p>`)
	}

	htmlBody.WriteString(`<p>Du vil motta en epost dersom din søknad har blitt godkjent.</p>`)
	htmlBody.WriteString(`</body></html>`)

	var userEmail = new(string)

	row := r.sqlDb.QueryRow(`SELECT email FROM Users WHERE user_id = $1 LIMIT 1`, inData.UserId)
	err = row.Scan(
		&userEmail,
	)

	if err != nil {
		fmt.Println(err)
		return
	}
	SendEmail(*userEmail, htmlBody, "Kvittering for søknaden din")
}

//endpoint to send email after application was approved
func (r repo) AfterApplicationApproved(ctx *gin.Context) {
	var htmlBody strings.Builder
	//create html body
	htmlBody.WriteString(`<html>
	<head>
   		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   		<title>Automatic email from go</title>
	</head>
	<body>
   		<p>Din søknad ble godkjent:</p>
	`)

	//gets the data from the frontend
	var applicationId = new(int)

	err := ctx.BindJSON(applicationId)
	if err != nil {
		fmt.Println(err)
		return
	}

	//get the application based on applicationId
	i := strconv.Itoa(*applicationId)
	resp, err := http.Get(`http://localhost:8080/api/application/` + i)
	if err != nil {
		fmt.Println(err)
		return
	}

	//getting the application from the response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		return
	}
	var application data.Application
	json.Unmarshal(body, &application)

	//writing the email
	htmlBody.WriteString(`<p>`)
	htmlBody.WriteString("Periode godkjent: " + application.Period.Name + " " + "(" + application.Period.Start.Format("2006-01-02") + " - " + application.Period.End.Format("2006-01-02") + ")")
	htmlBody.WriteString(`<br />`)
	htmlBody.WriteString("Hytte(r) tildelt: ")
	for i, cabin := range application.CabinsWon {
		if i == len(application.CabinsWon)-1 {
			htmlBody.WriteString(cabin.Name)
		} else {
			htmlBody.WriteString(cabin.Name)
			htmlBody.WriteString(", ")
		}
	}

	htmlBody.WriteString(`</p>`)
	htmlBody.WriteString(`</body></html>`)

	//sending the email
	SendEmail(application.User.Email, htmlBody, "Søknad godkjent!")
}

//endpoint to send email after feedback is sent
func (r repo) AfterFeedbackSent(ctx *gin.Context) {
	var htmlBody strings.Builder
	//create html body
	htmlBody.WriteString(`<html>
	<head>
   		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   		<title>Automatic email from go</title>
	</head>
	<body>
	`)

	type FormData struct {
		Period        data.Period       `json:"period"`
		Cabins        []data.CabinShort `json:"cabinsWon"`
		FeedbackTitle string            `json:"feedbackTitle"`
		Feedback      string            `json:"feedback"`
	}

	formData := new(FormData)
	err := ctx.BindJSON(formData)
	if err != nil {
		fmt.Println(err)
		return
	}

	htmlBody.WriteString(`<p>`)
	htmlBody.WriteString("Tilbakemelding for hytten ")
	for i, cabin := range formData.Cabins {
		if i == len(formData.Cabins)-1 {
			htmlBody.WriteString(cabin.Name)
		} else {
			htmlBody.WriteString(cabin.Name)
			htmlBody.WriteString(", ")
		}
	}
	htmlBody.WriteString(" i perioden " + formData.Period.Name + " (" + formData.Period.Start.Format("2006-01-02") + " - " + formData.Period.End.Format("2006-01-02") + ") mottatt!")
	htmlBody.WriteString(`</p>`)
	htmlBody.WriteString(`<p>`)
	htmlBody.WriteString(formData.FeedbackTitle)
	htmlBody.WriteString(`</p>`)
	htmlBody.WriteString(`<p>`)
	htmlBody.WriteString(formData.Feedback)
	htmlBody.WriteString(`</p>`)
	htmlBody.WriteString(`</body></html>`)

	resp, err := http.Get("http://localhost:8080/api/admin_email/all")
	if err != nil {
		panic(err.Error())
	}

	type Emails struct {
		Id    string `json:"emailId"`
		Email string `json:"email"`
	}

	body, err := ioutil.ReadAll(resp.Body)

	var emails []Emails

	json.Unmarshal(body, &emails)

	if err != nil {
		panic(err.Error())
	}

	for _, email := range emails {
		SendEmail(email.Email, htmlBody, "Tilbakemelding mottatt!")
	}
}

func (r repo) AfterTripCancelled(ctx *gin.Context) {
	var htmlBody strings.Builder
	//create html body
	htmlBody.WriteString(`<html>
	<head>
   		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   		<title>Automatic email from go</title>
	</head>
	<body>
	`)

	type FormData struct {
		Period data.Period       `json:"period"`
		Cabins []data.CabinShort `json:"cabinsWon"`
		User   data.User         `json:"user"`
	}

	formData := new(FormData)
	err := ctx.BindJSON(formData)
	if err != nil {
		fmt.Println(err)
		return
	}

	htmlBody.WriteString(`<p>`)
	htmlBody.WriteString("Den fremtidige turen / de fremtidige turene ved ")
	for i, cabin := range formData.Cabins {
		if i == len(formData.Cabins)-1 {
			htmlBody.WriteString(cabin.Name)
		} else {
			htmlBody.WriteString(cabin.Name)
			htmlBody.WriteString(", ")
		}
	}
	htmlBody.WriteString(" ble kansellert av " + formData.User.FirstName + " " + formData.User.LastName + " (" + formData.User.Email + ")")
	htmlBody.WriteString(`</p>`)
	htmlBody.WriteString(`<p>`)
	htmlBody.WriteString("Perioden " + formData.Period.Name + " (" + formData.Period.Start.Format("2006-01-02") + " - " + formData.Period.End.Format("2006-01-02") + ") er altså åpen for den / de hyttene igjen.")
	htmlBody.WriteString(`</body></html>`)

	resp, err := http.Get("http://localhost:8080/api/admin_email/all")
	if err != nil {
		panic(err.Error())
	}

	type Emails struct {
		Id    string `json:"emailId"`
		Email string `json:"email"`
	}

	body, err := ioutil.ReadAll(resp.Body)

	var emails []Emails

	json.Unmarshal(body, &emails)

	if err != nil {
		panic(err.Error())
	}

	for _, email := range emails {
		SendEmail(email.Email, htmlBody, "Tur kansellert!")
	}
}

func connectToEmailService(userName string, passwd string) *mail.SMTPClient {

	server := mail.NewSMTPClient()
	server.Host = "smtp.gmail.com" //change the server according to which email service is used
	server.Port = 587              //change port depending on which email service is used
	server.Username = userName
	server.Password = passwd
	server.Encryption = mail.EncryptionTLS

	smtpClient, err := server.Connect()
	if err != nil {
		utils.Panicker(err, "Could not connect to the email service")
	}

	return smtpClient
}

//Send email
func SendEmail(userEmail string, htmlBody strings.Builder, subject string) {
	path := os.Getenv("hyttecreds")
	if path == "" {
		panic("Environment variable for credentials path not set")
	}

	//reads email credentials from a file e-creds
	username, passwd := utils.GetCreds(fmt.Sprintf("%s/e-creds", path))

	smtpClient := connectToEmailService(username, passwd)

	//create email
	email := mail.NewMSG()
	email.SetFrom("From Hytteappen <hytteappen@gmail.com>")
	email.AddTo(userEmail)
	email.SetSubject(subject)

	email.SetBody(mail.TextHTML, htmlBody.String())

	//send email
	err := email.Send(smtpClient)
	if err != nil {
		utils.Panicker(err, "Could not send email")
	}
	htmlBody.Reset()
}
