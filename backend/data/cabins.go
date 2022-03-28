package data

type Cabin struct {
	Name             string     `json:"name" bson:"_id"` // cabinNames
	Active           bool       `json:"active" bson:"active"`
	ShortDescription string     `json:"shortDescription" bson:"shortDescription"`
	LongDescription  string     `json:"longDescription" bson:"longDescription"`
	Address          string     `json:"address" bson:"address"`
	Directions       string     `json:"directions" bson:"directions"`
	Price            int        `json:"price" bson:"price"`
	CleaningPrice    int        `json:"cleaningPrice" bson:"cleaningPrice"`
	Features         []Features `json:"features" bson:"features"`
	Comments         string     `json:"comments" bson:"comments"`
}

type CabinShort struct {
	Name   string `json:"cabinName"`
	Active bool   `json:"active,omitempty"`
}
