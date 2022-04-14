package data

type User struct {
	Id             *string `json:"userId,omitempty"`
	Email          string  `json:"email" binding:"required"`
	Password       string  `pg:"-" binding:"required"`
	HashedPassword string  `json:"-"`
	Token          string  `json:"token"`
	RefreshToken   string  `json:"refresh_token"`
	FirstName      string  `json:"firstname" binding:"required"`
	LastName       string  `json:"lastname" binding:"required"`
	AdminAccess    bool    `json:"adminAccess"`
}
