package data

type User struct {
	Id             *string `json:"userId,omitempty"`
	Email          string  `json:"email" binding:"required"`
	Password       string  `pg:"-"`
	HashedPassword string  `json:"-"`
	FirstName      string  `json:"firstname" binding:"required"`
	LastName       string  `json:"lastname" binding:"required"`
	AdminAccess    bool    `json:"adminAccess"`
}
