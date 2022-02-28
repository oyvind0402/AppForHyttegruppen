package data

type User struct {
	Username    string `json:"username"`
	Password    string `json:"password"`
	AdminAccess bool   `json:"adminAccess"`
}
