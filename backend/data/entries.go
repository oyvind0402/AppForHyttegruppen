package data

type LotteryEntry struct {
	User           User   `json:"user"`
	AccentureId    int    `json:"accentureId"`
	TripPurpose    string `json:"tripPurpose"`
	Periods        Period `json:"periods"`
	NumberOfCabins int    `json:"numberOfCabins"`
	Cabins         Cabin  `json:"cabins"`
}
