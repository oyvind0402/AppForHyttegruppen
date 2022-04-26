package data

type Application struct {
	ApplicationId   int          `json:"applicationId,omitempty"`
	User            User         `json:"user"`
	AnsattnummerWBS string       `json:"ansattnummerWBS"`
	AccentureId     string       `json:"accentureId"`
	TripPurpose     string       `json:"tripPurpose"`
	Period          Period       `json:"period"`
	NumberOfCabins  int          `json:"numberOfCabins"`
	CabinAssignment string       `json:"cabinAssignment"`
	Cabins          []CabinShort `json:"cabins"`
	Kommentar       string       `json:"kommentar"`
	CabinsWon       []CabinShort `json:"cabinsWon,omitempty"`
	Winner          bool         `json:"winner"`
	FeedbackSent    bool         `json:"feedback"`
}
