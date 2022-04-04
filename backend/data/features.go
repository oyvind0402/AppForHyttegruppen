package data

// If feature is countable (ex: bedrooms)
type Features struct {
	Bathrooms     int                    `json:"bad" bson:"bad"`
	Bedrooms      int                    `json:"soverom" bson:"soverom"`
	SleepingSlots int                    `json:"sengeplasser" bson:"sengeplasser"`
	Wifi          bool                   `json:"wifi" bson:"wifi"`
	Other         map[string]interface{} `json:"other,omitempty" bson:"other"`
}
