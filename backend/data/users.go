package data

type User struct {
	Id          *string `json:"userId,omitempty"`
	Email       string  `json:"email"`
	Password    string  `json:"password"`
	FirstName   string  `json:"firstname"`
	LastName    string  `json:"lastname"`
	AdminAccess bool    `json:"adminAccess"`
}
