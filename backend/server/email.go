package server

import (
	//"bachelorprosjekt/backend/server"
	"bachelorprosjekt/backend/utils"
	"fmt"

	//"net/smtp"

	mail "github.com/xhit/go-simple-mail/v2"
)

//creates email body
var htmlBody = `
<html>
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   <title>Automatic email from go</title>
</head>
<body>
   <p>If you are seeing this email you are a chosen one</p>
</body>
`

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
	username, passwd := utils.GetCreds("backend/e-creds")

	smtpClient := connectToEmailService(username, passwd)

	//ceate email
	email := mail.NewMSG()
	email.SetFrom("From Odeta <odetapenikaite@gmail.com>")
	email.AddTo(userEmail)
	email.SetSubject("testing sending email")

	email.SetBody(mail.TextHTML, htmlBody)

	//send email
	err := email.Send(smtpClient)
	if err != nil {
		utils.Panicker(err, "Could not send email")
	}
}
