package server

import (
	//"bachelorprosjekt/backend/server"

	"bachelorprosjekt/backend/utils"
	"fmt"
	"strings"

	//"net/smtp"

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
		UserId  string            `json:"userId" form:"userId"`
		Periods map[string]string `json: "periods" form:"periods"`
	}
	var inData = new(FormData)
	err := ctx.Bind(inData)
	fmt.Println(inData.UserId)
	fmt.Print("From SendEmailToUser() perdiods type from struct:")
	fmt.Printf("t1: %T\n", inData.Periods)
	fmt.Print("print inData.periods: ")
	fmt.Println(inData.Periods)
	if err != nil {
		fmt.Println("from error inData: ")
		fmt.Println(err)
		return
	}

	for i := 0; i < len(inData.Periods); i++ {
		fmt.Println("period in forloop:")
		fmt.Println(inData.Periods[i]) //TODO map instead of array
		fmt.Print("From SendEmailToUser() for loop type of p:")
		fmt.Printf("t1: %T\n", inData.Periods[i])
	}

	/* for _, p := range inData.periods {
		//htmlBody.WriteString(`<p> %s`, p)
		fmt.Print("From SendEmailToUser() for loop type of p:")
		fmt.Printf("t1: %T\n", p)
	} */
	// week1 := inData.periods[0]
	/* type inPeriods struct {
		period []data.Period
	}

	htmlBody.WriteString(`</body></html>`)
	id := ctx.Request.FormValue("userId")
	//periods := ctx.Request.FormValue("periods")//returns string
	var periods = new(inPeriods)
	err := ctx.BindJSON(periods) //returns string
	if err != nil {
		fmt.Println(err)
	}
	fmt.Print("From SendEmailToUser() perdiod type:")
	fmt.Printf("t1: %T\n", *periods)
	fmt.Println(periods) */
	// for i := 0; i < len(periods.period); i++ {
	// 	fmt.Println(periods.period[i])
	// }
	/* for _, element := range periods {
		htmlBody.WriteString(`<p>`)
		htmlBody.WriteString(fmt.Sprintf("%c", element))
		htmlBody.WriteString(`</p>`)
		//fmt.Print("From for loop in SendEmailToUser()")
		//fmt.Printf("t1: %T\n", element)
		//fmt.Println(element)
	}*/
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
	username, passwd := utils.GetCreds("backend/e-creds")

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
