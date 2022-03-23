package data

// If feature is countable (ex: bedrooms)
type CountableFeatures struct {
	Bathrooms     int `json:"bathrooms" bson:"bathrooms"`
	Bedrooms      int `json:"bedrooms" bson:"bedrooms"`
	SleepingSlots int `json:"sleepingSlots" bson:"sleepingSlots"`
	Other         *map[string]int
}

type UncountableFeatures struct {
	Wifi     bool `bson:"wifi"`
	Features *map[string]bool
}

type Features struct {
	Countable   CountableFeatures   `json:"countableFeatures" bson:"countableFeatures"`
	Uncountable UncountableFeatures `json:"uncountableFeatures" bson:"uncountableFeatures"`
}
