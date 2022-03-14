package data

type Cabin struct {
	Name             string   `bson:"_id"`
	Active           bool     `bson:"active"`
	ShortDescription string   `bson:"shortDescription"`
	LongDescription  string   `bson:"longDescription"`
	Address          string   `bson:"address"`
	Directions       string   `bson:"directions"`
	Price            int      `bson:"price"`
	CleaningPrice    int      `bson:"cleaningPrice"`
	Features         Features `bson:"features"`
	Comments         string   `bson:"comments"`
}

type CabinShort struct {
	Name   string `json:"cabin_name"`
	Active bool   `json:"active,omitempty"`
}
