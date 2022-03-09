package data

// If feature is countable (ex: bedrooms)
type CountableFeatures struct {
	Bathrooms     int `bson:"bathrooms"`
	Bedrooms      int `bson:"bedrooms"`
	SleepingSlots int `bson:"sleepingSlots"`
	Other         map[string]int
}

type UncountableFeatures struct {
	Wifi     bool `bson:"wifi"`
	Features map[string]bool
}

type Features struct {
	Countable   CountableFeatures   `bson:"countableFeatures"`
	Uncountable UncountableFeatures `bson:"uncountableFeatures"`
}
