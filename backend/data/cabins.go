package data

type Cabin struct {
	Name             string   `json:"name"`
	Active           bool     `json:"active"`
	ShortDescription string   `json:"shortDescription"`
	LongDescription  string   `json:"longDescription"`
	Address          string   `json:"address"`
	Directions       string   `json:"directions"`
	Bedrooms         int      `json:"bedrooms"`
	Bathrooms        int      `json:"bathrooms"`
	SleepingSlots    int      `json:"sleepingSlots"`
	Price            int      `json:"price"`
	CleaningPrice    int      `json:"cleaningPrice"`
	Features         Features `json:"features"`
	Comments         string   `json:"comments"`
}
