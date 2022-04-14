package data

type User struct {
	Id             *string `json:"userId,omitempty"`
	Email          string  `json:"email"`
	Password       string  `pg:"-"`
	HashedPassword string  `json:"-"`
	Token          string  `json:"token"`
	RefreshToken   string  `json:"refresh_token"`
	FirstName      string  `json:"firstname"`
	LastName       string  `json:"lastname"`
	AdminAccess    bool    `json:"adminAccess"`
}
