package data

type Cabin struct {
	Name             string   `bson:"name"`
	Active           bool     `bson:"active"`
	ShortDescription string   `bson:"shortDescription"`
	LongDescription  string   `bson:"longDescription"`
	Address          string   `bson:"address"`
	Directions       string   `bson:"directions"`
	Bedrooms         int      `bson:"bedrooms"`
	Bathrooms        int      `bson:"bathrooms"`
	SleepingSlots    int      `bson:"sleepingSlots"`
	Price            int      `bson:"price"`
	CleaningPrice    int      `bson:"cleaningPrice"`
	Features         Features `bson:"features"`
	Comments         string   `bson:"comments"`
}
