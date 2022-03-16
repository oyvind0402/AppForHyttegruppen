package data

type Application struct {
	ApplicationId  int          `json:"applicationId,omitempty"`
	UserId         int          `json:"userId"`
	AccentureId    int          `json:"accentureId"`
	TripPurpose    string       `json:"tripPurpose"`
	Period         Period       `json:"period"`
	NumberOfCabins int          `json:"numberOfCabins"`
	Cabins         []CabinShort `json:"cabins"`
	CabinsWon      []CabinShort `json:"cabinsWon,omitempty"`
	Winner         bool         `json:"winner"`
}
