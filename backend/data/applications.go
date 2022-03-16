package data

type Application struct {
	ApplicationId  int          `json:"applicationId"`
	UserId         int          `json:"userId"`
	AccentureId    int          `json:"accentureId"`
	TripPurpose    string       `json:"tripPurpose"`
	Period         Period       `json:"period"`
	NumberOfCabins int          `json:"numberOfCabins"`
	Cabins         []CabinShort `json:"cabins"`
	Winner         bool         `json:"winner"`
}

type WinnerApplication struct {
	ApplicationId int          `json:"applicationId"`
	CabinsWon     []CabinShort `json:"cabinsWon"`
	Winner        bool         `json:"winner"`
}
