package data

type Application struct {
	ApplicationId   int          `json:"applicationId,omitempty"`
	User            User         `json:"user"`
	AccentureId     string       `json:"accentureId"`
	TripPurpose     string       `json:"tripPurpose"`
	Period          Period       `json:"period"`
	NumberOfCabins  int          `json:"numberOfCabins"`
	CabinAssignment string       `json:"cabinAssignment"`
	Cabins          []CabinShort `json:"cabins"`
	CabinsWon       []CabinShort `json:"cabinsWon,omitempty"`
	Winner          bool         `json:"winner"`
}
