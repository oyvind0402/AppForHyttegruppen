package server

import (
	//"bachelorprosjekt/backend/server"

	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	mail "github.com/xhit/go-simple-mail/v2"
)

//creates email body
var htmlBody strings.Builder

func (r repo) SendEmailToUser(ctx *gin.Context) {
	//create html body
	htmlBody.WriteString(`<html>
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   <title>Automatic email from go</title>
</head>
<body>
   <p>periods you applied for:</p>
	`)
	//FIXME error from inData => bad request: invalid character '-' in numeric literal.
	//TODO https://stackoverflow.com/questions/57015479/post-api-getting-invalid-character-in-numeric-literal

	type FormData struct {
		UserId  string        `json:"userId"`
		Periods []data.Period `json:"periods"`
	}
	var inData = new(FormData)
	err := ctx.BindJSON(inData)
	if err != nil {
		fmt.Println("from error inData: ")
		fmt.Println(err)
		return
	}

	htmlBody.WriteString(`</body></html>`)
	for _, period := range inData.Periods {
		htmlBody.WriteString(`<p>`)
		htmlBody.WriteString(fmt.Sprintf("%s", period.Name))
		htmlBody.WriteString(`</p>`)
	}

	var userEmail = new(string)

	row := r.sqlDb.QueryRow(`SELECT email FROM Users WHERE user_id = $1 LIMIT 1`, inData.UserId)
	err = row.Scan(
		&userEmail,
	)
	if err != nil {
		fmt.Println("from error in querry: ")
		fmt.Println(err)
		return
	}
	fmt.Println("From SendEmailToUser():  " + *userEmail)
	SendEmail(*userEmail)

}

// var periods = new(interface{})

//periods  := inData.periods

func connectToEmailService(userName string, passwd string) *mail.SMTPClient {

	server := mail.NewSMTPClient()
	server.Host = "smtp.gmail.com" //change the server according to which email service is used
	server.Port = 587              //change port depending on which email service is used
	server.Username = userName
	fmt.Println(userName)
	server.Password = passwd
	fmt.Println(passwd)
	server.Encryption = mail.EncryptionTLS

	smtpClient, err := server.Connect()
	if err != nil {
		utils.Panicker(err, "Could not connect to the email service")
	}

	return smtpClient
}

//create endpoint

func SendEmail(userEmail string) {
	//reads email credentials from a file e-creds
	username, passwd := utils.GetCreds("../../credentials/e-creds")

	smtpClient := connectToEmailService(username, passwd)

	//ceate email
	email := mail.NewMSG()
	email.SetFrom("From Hytteappen <hytteappen@gmail.com>")
	email.AddTo(userEmail)
	email.SetSubject("Kvitering for din søknad")

	email.SetBody(mail.TextHTML, htmlBody.String())

	//send email
	err := email.Send(smtpClient)
	if err != nil {
		fmt.Println("from SendEmail():")
		fmt.Println(err)

		utils.Panicker(err, "Could not send email")
	}
}
