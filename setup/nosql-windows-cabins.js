//run mongosh nosql-windows-cabins.js from the setup and you are good to go :)

db = connect("mongodb://localhost/hyttegruppen");
db.dropDatabase();

db = connect("mongodb://localhost/hyttegruppen");
db.cabins.insertMany([
  {
    _id: "Utsikten",
    active: true,
    shortDescription: "shortDescription",
    longDescription:
      "Utsikten er Accentures nyeste hytte, og den er bygget/modernisert 2004/2005. Hytta har høy standard, og består av stort kjøkken, stue, 5 soverom (2 med dobbeltseng og 3 med køyesenger/twinsenger) = 10 sengeplasser totalt, 2 bad, badstue og veranda. Hytta består av en opprinnelig gammel tømmerhytte (som utgjør stue og kjøkken) og en helt ny del hvor gang, soverom, bad osv. ligger. Hytta ligger i 10 minutters gangavstand til sentrum (ca. like langt fra sentrum som Fanitullhytta), på høyre side av hovedveien når du kommer til Hemsedal østfra. Bilvei helt fram. Hytta har ikke trådløst nett, men det er god 4G-dekning.",
    address: "Tunvegen 11",
    coordinates: [60.86467, 8.563759],
    directions:
      "Når du kommer til Hemsedal får du Saga Apartments (den gamle Coop-butikken) på høyre hand. Ta av til høyre rett før, inn Trøimvegen. Følg Trøimvegen ca. 200 meter oppover bakken og noen svinger Ta til høyre inn Tunvegen og følg den ca. 100 m. Kjør inn på tunet til gården (gult hus og rød låve – det er her hytteeier bor!) Ta av til venstre med én gang (mellom en liten brun hytte som du får på venstre hånd og et stabbur som du får på høyre hånd). Følg veien ca. 300 m, og du er framme ved hytta. Veien går bare til hytta og stopper der. Hytta er den eneste bygningen etter at du har kjørt gjennom tunet, og hytta er brun med hvite vinduskarmer. Kjør opp på baksiden av hytta, der er det godt med parkeringsplasser og der er hyttas hovedinngang. Adressen er Tunvegen 11.",
    price: 1200,
    cleaningPrice: 1200,
    features: [
      {
        countableFeatures: [
          { bathrooms: 2 },
          { bedrooms: 5 },
          { sleepingSlots: 10 },
        ],
      },
      { uncountableFeatures: [{ wifi: false }] },
    ],
    comments: "comments",
    bringYourself: [
      "Sovepose eller sengetøy",
      "Håndklær",
      "Stearinlys",
      "Tørkehåndkle/oppvaskklut",
      "Toalettpapir",
      "Tørkerull",
    ],
    garbageCollector:
      "Det er kildesortering ved Hemsedal Skisenter. Sving av fra hovedveien mot bakken, ta første vei til høyre etter å ha kjørt over broen i retning Skarsnuten. Containere straks etter krysset. Her har også Røde Kors Hjelpekorps egen container for panteflasker.",
  },

  {
    _id: "Fanitullen",
    active: true,
    shortDescription: "shortDescription",
    longDescription:
      "Fanitullhytta ligger sentrumsnært i Hemsedal og er bygget i 1997. Hytta har god standard og består av stue, spisestua med kjøkken, 4 soverom (2 med dobbeltseng, 2 med køyeseng), 8 sengeplasser totalt, 2 bad, badstue og bod. Det er trådløst nett på hytta, info om pålogging finner du i gangen.",
    address: "Torsetvegen 494",
    coordinates: [60.858358, 8.562537],
    directions:
      "Kjør til Hemsedal sentrum og ta av til venstre etter at du har passert Hemsedal Cafe’ og Fanitullen Hotell (venstre hånd). Kjør over broen (du har Apoteket på høyre side i det du skal passere broen) og følg Fanitullvegen ca. 800 meter sørøst ned mot Gol. Hytta ligger på vestre side; det er 3 hytter som ligger ca. 15 meter fra hverandre vi har den som ligger nærmest Gol (den siste du kommer til). Hytta er gulbrun. Det står Accenture på vindu ved døren. Adresse: Torsetvegen 494",
    price: 1200,
    cleaningPrice: 1200,
    features: [
      {
        countableFeatures: [
          { bathrooms: 2 },
          { bedrooms: 4 },
          { sleepingSlots: 8 },
        ],
      },
      { uncountableFeatures: [{ wifi: true }] },
    ],
    comments: "comments",
    bringYourself: [
      "Sovepose eller sengetøy",
      "Håndklær",
      "Stearinlys",
      "Tørkehåndkle/oppvaskklut",
      "Toalettpapir",
      "Tørkerull",
    ],
    garbageCollector:
      "Det er kildesortering ved Hemsedal Skisenter. Sving av fra hovedveien mot bakken, ta første vei til høyre etter å ha kjørt over broen i retning Skarsnuten. Containere straks etter krysset. Her har også Røde Kors Hjelpekorps egen container for panteflasker.",
  },

  {
    _id: "Knausen",
    active: true,
    shortDescription: "shortDescription",
    longDescription:
      "Hytta har god standard, bygget i 1991; 4 soverom: 2 m/dobbeltsenger, 1 m/køyer med bred underkøye, 1 m/ køyeseng. Fjærmadrasser, dyner og puter. Stort åpent allrom med stue m/natursteinspeis, TV/parabol, langbord med plass til 10, kjøkken i furu m/komfyr, mikro, kjøl/frys, oppvaskmaskin, kaffetrakter mm. Utstyrt til 10 personer. 1 bad m dusj, badstu, og WC. 1 WC-rom. Entré. God skapplass på alle rommene. Innvendig bodrom. Veranda med utgang fra stua. Alle rom er oppvarmet med gulvvarme. Keramiske fliser på alle rom, eks. soverom. Innvendig panel, og med villmarkspanel i allrommet. Hytta er oppgradert med ny salong og spisestue. Hytta har nå trådløst nett (fiber) og lader til El-bil.",
    address: "Grøndalsvegen 764",
    coordinates: [60.931958, 8.410119],
    directions:
      "Kjør gjennom Hemsedal sentrum. Fortsett ca. 5 km etter Riksvei 52 til du kommer til Tuv; her tar du av til høyre ved skilt “til Grøndalen”. Etter ca. 6 km innover dalen kommer du til stort opplyst skilt med “Solheisen», ”Solsiden Hyttegrend” og ”Solstua”. Fortsett videre innover Grøndalen. Golfbanen passeres på venstre side av veien, og etter ca. 1,5 km, der gatelysene på høyre side av veien skifter over til venstre side, er det ca. 100 meter til hytta.  Du passerer den siste gården på høyre side av veien, med 2 røde låver og et stort 2-etasjers hvitt hus (Arild Grøndalen sin gård). Her er det ca. 100 meter til avkjøring på høyre side. Sving av veien opp til høyre ved den siste gatelysstolpen. Hytta er helt på toppen av bakken, ca. 100 meter opp, (det er bilvei helt frem). Adresse: Grøndalsvegen 764. På vinterstid anbefaler vi «kjetting på boks» evt. spesiell avfetting for å ta vekk alt saltet på dekkene, før dere kjører opp bakken.",
    price: 1200,
    cleaningPrice: 1200,
    features: [
      {
        countableFeatures: [
          { bathrooms: 1 },
          { bedrooms: 4 },
          { sleepingSlots: 8 },
        ],
      },
      { uncountableFeatures: [{ wifi: true }] },
    ],
    comments: "comments",
    bringYourself: [
      "Sovepose eller sengetøy",
      "Håndklær",
      "Stearinlys",
      "Tørkehåndkle/oppvaskklut",
      "Toalettpapir",
      "Tørkerull",
    ],
    garbageCollector:
      "Søppelcontainer finnes på høyre siden av veien ca. 1 km etter at du har passert “Solheisen” på vei til Tuv. Det er kildesortering ved Hemsedal Skisenter. Sving av fra hovedveien mot bakken; ta første vei til høyre etter å ha kjørt over broen i retning Skarsnuten. Containere rett før bomveien. Her har også Røde Kors Hjelpekorps egen container for panteflasker.",
  },

  {
    _id: "Store Grøndalen",
    active: true,
    shortDescription: "shortDescription",
    longDescription:
      "«Randen» ligger fint i Grøndalen i Hemsedal. Hytta ble modernisert i 2008 og har god standard. Hytta består av stue, spisestua med kjøkkenR, 4 soverom (2 med dobbeltseng, 1 med køyeseng og 1 med familiekøye) - 8 sengeplasser totalt, 2 bad, badstue og veranda. Hytta har nå trådløst nett (fiber) og lader til El-bil.",
    address: "Grøndalsvegen 762",
    coordinates: [60.931994, 8.411819],
    directions:
      "Kjør gjennom Hemsedal sentrum. Fortsett ca. 5 km etter Riksvei 52 til du kommer til Tuv; her tar du av til høyre ved skilt “til Grøndalen”. Etter ca. 6 km innover dalen kommer du til stort opplyst skilt med “Solheisen”, ”Solsiden Hyttegrend” og ”Solstua”. Fortsett videre innover Grøndalen. Golfbanen passeres på venstre side av veien, og etter ca. 1,5 km der gatelysene på høyre side av veien skifter over til venstre side, er det ca. 100 meter til hytta. Du passerer den siste gården på høyre side av veien, med 2 røde låver og et stort 2-etasjers hvitt hus (Arild Grøndalen sin gård). Her er det ca. 100 meter til avkjøring på høyre side. Sving av veien opp til høyre ved den siste gatelysstolpen. Hytta er den første hytta på høyre side, ca. 40 meter opp bakken, (det er bilvei helt frem og mulig å snu bilen foran hytta). Adresse: Grøndalsvegen 762",
    price: 1200,
    cleaningPrice: 1200,
    features: [
      {
        countableFeatures: [
          { bathrooms: 2 },
          { bedrooms: 4 },
          { sleepingSlots: 8 },
        ],
      },
      { uncountableFeatures: [{ wifi: true }] },
    ],
    comments: "comments",
    bringYourself: [
      "Sovepose eller sengetøy",
      "Håndklær",
      "Stearinlys",
      "Tørkehåndkle/oppvaskklut",
      "Toalettpapir",
      "Tørkerull",
    ],
    garbageCollector:
      "Søppelcontainer finnes på høyre siden av veien ca. 1 km etter at du har passert “Solheisen” på vei til Tuv. Det er kildesortering ved Hemsedal Skisenter. Sving av fra hovedveien mot bakken; ta første vei til høyre etter å ha kjørt over broen i retning Skarsnuten. Containere rett før bomveien. Her har også Røde Kors Hjelpekorps egen container for panteflasker.",
  },
]);
