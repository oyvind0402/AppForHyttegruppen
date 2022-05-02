package server

import (
	//"bachelorprosjekt/backend/server"

	"bachelorprosjekt/backend/data"
	"bachelorprosjekt/backend/utils"
	"fmt"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	mail "github.com/xhit/go-simple-mail/v2"
)

//creates email body
var htmlBody strings.Builder

//enpoint to send email after application was sent and registered
func (r repo) AfterApplicationSent(ctx *gin.Context) {
	//create html body
	htmlBody.WriteString(`<html>
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   <title>Automatic email from go</title>
</head>
<body>
   <p>Perioder du har søkt:</p>
	`)

	type FormData struct {
		UserId  string        `json:"userId"`
		Periods []data.Period `json:"periods"`
	}

	//reads data sent from the client
	var inData = new(FormData)
	err := ctx.BindJSON(inData)
	if err != nil {
		fmt.Println("from error inData: ")
		fmt.Println(err)
		return
	}

	for _, period := range inData.Periods {
		htmlBody.WriteString(`<p>`)
		htmlBody.WriteString(fmt.Sprintf("%s", period.Name))
		htmlBody.WriteString(`</p>`)
	}

	htmlBody.WriteString(`<p>Du vil motta en epost dersom din søknad har blitt godkjent </p>`)
	htmlBody.WriteString(`</body></html>`)

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

//endpont to send email after application was approved
func AfterApplicationApproved(email string) {

	//create html body
	htmlBody.WriteString(`<html>
	<head>
   		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   		<title>Automatic email from go</title>
	</head>
	<body>
   		<p>Din(e) søknad(er) ble godkjent. Gjerne sjekk HyttePortalen for å få mer informasjon</p>
	</body>
	</html>
	`)

	fmt.Printf("printing from AfterApplicationApproved. Email: %s", email)
	SendEmail(email)

}

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

//Send email
func SendEmail(userEmail string) {
	path := os.Getenv("hyttecreds")
	if path == "" {
		panic("Environment variable for credentials path not set")
	}

	//reads email credentials from a file e-creds
	username, passwd := utils.GetCreds(fmt.Sprintf("%s/e-creds", path))

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
