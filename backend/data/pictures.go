package data

type Picture struct {
	Filename string `json:"filename" bson:"filename"`
	AltText  string `json:"altText,omitempty" bson:"altText,omitempty"`
}

type Pictures struct {
	Main  Picture   `json:"mainPicture,omitempty" bson:"mainPicture,omitempty"`
	Other []Picture `json:"otherPictures" bson:"otherPictures"`
}
