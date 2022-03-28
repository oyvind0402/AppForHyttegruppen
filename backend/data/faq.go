package data

import "go.mongodb.org/mongo-driver/bson/primitive"

type FAQId interface {
	primitive.ObjectID | *string
}

type FAQ[FAQId interface{}] struct {
	Id       *FAQId `json:"id,omitempty" bson:"_id,omitempty"`
	Question string `json:"question" bson:"question"`
	Answer   string `json:"answer" bson:"answer"`
}
