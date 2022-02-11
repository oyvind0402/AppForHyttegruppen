package data

type User struct {
	Username    string
	Password    string
	AdminAccess bool
}

var Users []*User
