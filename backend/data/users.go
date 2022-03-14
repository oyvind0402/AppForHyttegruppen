package data

type User struct {
	Id          int    `json:"userId,omitempty"`
	Name        string `json:"username"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	AdminAccess bool   `json:"adminAccess"`
}
