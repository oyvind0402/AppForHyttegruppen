package data

type Application struct {
	ApplicationId  int          `json:"applicationId"`
	UserId         int          `json:"userId"`
	AccentureId    int          `json:"accentureId"`
	TripPurpose    string       `json:"tripPurpose"`
	Season         Season       `json:"season"`
	Periods        []Period     `json:"periods"`
	NumberOfCabins int          `json:"numberOfCabins"`
	Cabins         []CabinShort `json:"cabins"`
	Winner         bool         `json:"winner"`
}
