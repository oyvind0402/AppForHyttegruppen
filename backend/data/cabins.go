package data

type Cabin struct {
	Name             string                 `json:"name" bson:"_id"` // cabinNames
	Active           bool                   `json:"active" bson:"active"`
	ShortDescription string                 `json:"shortDescription" bson:"shortDescription"`
	LongDescription  string                 `json:"longDescription" bson:"longDescription"`
	Pictures         Pictures               `json:"pictures" bson:"pictures"`
	Address          string                 `json:"address" bson:"address"`
	Coordinates      Coordinates            `json:"coordinates" bson:"coordinates"`
	Directions       string                 `json:"directions" bson:"directions"`
	Price            int                    `json:"price" bson:"price"`
	CleaningPrice    int                    `json:"cleaningPrice" bson:"cleaningPrice"`
	Features         Features               `json:"features" bson:"features"`
	Other            map[string]interface{} `json:"other" bson:"other"`
}

type CabinShort struct {
	Name   string `json:"cabinName" bson:"_id"`
	Active bool   `json:"active,omitempty" bson:"active"`
}

type Coordinates struct {
	Latitude  float64 `json:"latitude" bson:"latitude"`
	Longitude float64 `json:"longitude" bson:"longitude"`
}
