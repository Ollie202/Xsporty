const gameMarkets = [
  game("brazil-spain", "Brazil", "Spain", "br", "es", "BRA", "ESP", "22 May · 20:00", "ID:23099", "football"),
  game("argentina-france", "Argentina", "France", "ar", "fr", "ARG", "FRA", "22 May · Live 65'", "ID:41678", "football"),
  game("england-germany", "England", "Germany", "gb-eng", "de", "ENG", "GER", "27 May · 17:45", "ID:30631", "football"),
  game("mexico-usa", "Mexico", "USA", "mx", "us", "MEX", "USA", "23 May · 18:00", "ID:51208", "football"),
  game("canada-japan", "Canada", "Japan", "ca", "jp", "CAN", "JPN", "29 May · 16:00", "ID:42014", "football"),
  game("morocco-portugal", "Morocco", "Portugal", "ma", "pt", "MAR", "POR", "29 May · 20:00", "ID:42015", "football"),
  game("netherlands-croatia", "Netherlands", "Croatia", "nl", "hr", "NED", "CRO", "30 May · 15:00", "ID:42016", "football"),
  game("uruguay-belgium", "Uruguay", "Belgium", "uy", "be", "URU", "BEL", "30 May · 18:00", "ID:42017", "football"),
  game("senegal-tunisia", "Senegal", "Tunisia", "sn", "tn", "SEN", "TUN", "30 May · 21:00", "ID:42018", "football"),
  game("switzerland-austria", "Switzerland", "Austria", "ch", "at", "SUI", "AUT", "31 May · 14:00", "ID:42019", "football"),
  game("norway-korea", "Norway", "South Korea", "no", "kr", "NOR", "KOR", "31 May · 17:00", "ID:42020", "football"),
  game("colombia-ecuador", "Colombia", "Ecuador", "co", "ec", "COL", "ECU", "31 May · 20:00", "ID:42021", "football"),
  game("australia-iran", "Australia", "Iran", "au", "ir", "AUS", "IRN", "1 Jun · 15:00", "ID:42022", "football"),
  game("ghana-egypt", "Ghana", "Egypt", "gh", "eg", "GHA", "EGY", "1 Jun · 18:00", "ID:42023", "football"),
  game("usa-canada", "USA", "Canada", "us", "ca", "USA", "CAN", "1 Jun · 21:00", "ID:42024", "football"),
  game("france-morocco", "France", "Morocco", "fr", "ma", "FRA", "MAR", "2 Jun · 16:00", "ID:42025", "football"),
  game("spain-portugal", "Spain", "Portugal", "es", "pt", "ESP", "POR", "2 Jun · 19:00", "ID:42026", "football"),
  game("brazil-argentina", "Brazil", "Argentina", "br", "ar", "BRA", "ARG", "3 Jun · 20:00", "ID:42027", "football"),
  game("germany-netherlands", "Germany", "Netherlands", "de", "nl", "GER", "NED", "4 Jun · 18:00", "ID:42028", "football"),
  game("england-usa", "England", "USA", "gb-eng", "us", "ENG", "USA", "4 Jun · 21:00", "ID:42029", "football"),
  game("tennis-sinner-alcaraz", "Jannik Sinner", "Carlos Alcaraz", "it", "es", "SIN", "ALC", "Roland Garros · SF · 6 Jun", "ID:61001", "tennis"),
  game("tennis-djokovic-zverev", "Novak Djokovic", "Alexander Zverev", "rs", "de", "DJO", "ZVE", "Roland Garros · QF · 4 Jun", "ID:61002", "tennis"),
  game("tennis-swiatek-gauff", "Iga Swiatek", "Coco Gauff", "pl", "us", "SWI", "GAU", "Roland Garros · W SF · 6 Jun", "ID:61003", "tennis"),
  game("tennis-raducanu-sabalenka", "Emma Raducanu", "Aryna Sabalenka", "gb", "by", "RAD", "SAB", "Roland Garros · W QF · 4 Jun", "ID:61004", "tennis"),
  game("tennis-medvedev-rune", "Daniil Medvedev", "Holger Rune", "ru", "dk", "MED", "RUN", "Roland Garros · R4 · 2 Jun", "ID:61005", "tennis"),
  game("tennis-swiatek-keys", "Iga Swiatek", "Madison Keys", "pl", "us", "SWI", "KEY", "Roland Garros · W R4 · 2 Jun", "ID:61006", "tennis"),
  game("esports-t1-navi", "T1", "NAVI", "kr", "ua", "T1", "NVI", "VCT Masters · Group A · 25 May", "ID:62001", "esports"),
  game("esports-faze-g2", "FaZe Clan", "G2 Esports", "us", "de", "FZC", "G2E", "ESL Pro League S22 · QF · 26 May", "ID:62002", "esports"),
  game("esports-liquid-fnatic", "Team Liquid", "Fnatic", "us", "gb", "TL", "FNC", "ESL Pro League S22 · QF · 27 May", "ID:62003", "esports"),
  game("esports-cloud9-vitality", "Cloud9", "Team Vitality", "us", "fr", "C9", "VIT", "ESL Pro League S22 · R16 · 24 May", "ID:62004", "esports"),
  game("esports-heroic-ence", "Heroic", "ENCE", "dk", "fi", "HRC", "ENC", "ESL Pro League S22 · R16 · 24 May", "ID:62005", "esports"),
  game("esports-nip-astralis", "NIP", "Astralis", "se", "dk", "NIP", "AST", "ESL Pro League S22 · R16 · 25 May", "ID:62006", "esports"),
  game("usa-serbia-hoops", "USA", "Serbia", "us", "rs", "USA", "SRB", "22 May · 21:30", "ID:51001", "basketball"),
  game("canada-france-hoops", "Canada", "France", "ca", "fr", "CAN", "FRA", "23 May · 19:00", "ID:51002", "basketball"),
  game("spain-australia-hoops", "Spain", "Australia", "es", "au", "ESP", "AUS", "29 May · 17:30", "ID:51003", "basketball"),
  game("germany-greece-hoops", "Germany", "Greece", "de", "gr", "GER", "GRE", "29 May · 20:30", "ID:51004", "basketball"),
  game("japan-brazil-hoops", "Japan", "Brazil", "jp", "br", "JPN", "BRA", "30 May · 16:00", "ID:51005", "basketball"),
  game("slovenia-italy-hoops", "Slovenia", "Italy", "si", "it", "SLO", "ITA", "30 May · 18:30", "ID:51006", "basketball"),
  game("cricket-england-scotland", "England Women", "Scotland Women", "gb-eng", "gb-sct", "ENG", "SCO", "12 Jun · T20 World Cup", "ID:52001", "cricket"),
  game("cricket-india-pakistan", "India Women", "Pakistan Women", "in", "pk", "IND", "PAK", "14 Jun · T20 World Cup", "ID:52002", "cricket"),
  game("cricket-australia-south-africa", "Australia Women", "South Africa Women", "au", "za", "AUS", "RSA", "13 Jun · T20 World Cup", "ID:52003", "cricket"),
  game("cricket-west-indies-new-zealand", "West Indies Women", "New Zealand Women", "bb", "nz", "WI", "NZ", "13 Jun · T20 World Cup", "ID:52004", "cricket"),
  game("cricket-new-zealand-sri-lanka", "New Zealand Women", "Sri Lanka Women", "nz", "lk", "NZ", "SRI", "16 Jun · T20 World Cup", "ID:52005", "cricket"),
  game("cricket-england-ireland", "England Women", "Ireland Women", "gb-eng", "ie", "ENG", "IRE", "16 Jun · T20 World Cup", "ID:52006", "cricket"),
  game("f1-canada-norris-verstappen", "Lando Norris", "Max Verstappen", "gb", "nl", "NOR", "VER", "Canadian GP · 24 May", "ID:53001", "formula-1"),
  game("f1-monaco-leclerc-piastri", "Charles Leclerc", "Oscar Piastri", "mc", "au", "LEC", "PIA", "Monaco GP · 7 Jun", "ID:53002", "formula-1"),
  game("f1-spain-hamilton-russell", "Lewis Hamilton", "George Russell", "gb", "gb", "HAM", "RUS", "Spanish GP · 14 Jun", "ID:53003", "formula-1"),
  game("f1-austria-norris-piastri", "Lando Norris", "Oscar Piastri", "gb", "au", "NOR", "PIA", "Austrian GP · 28 Jun", "ID:53004", "formula-1"),
  game("f1-silverstone-hamilton-verstappen", "Lewis Hamilton", "Max Verstappen", "gb", "nl", "HAM", "VER", "British GP · 5 Jul", "ID:53005", "formula-1"),
  game("f1-belgium-leclerc-russell", "Charles Leclerc", "George Russell", "mc", "gb", "LEC", "RUS", "Belgian GP · 19 Jul", "ID:53006", "formula-1"),
  game("ufc-makhachev-volkanovski", "Islam Makhachev", "Alexander Volkanovski", "ru", "au", "ISL", "VOL", "UFC 323 · 10 May 2026 · Lightweight Title", "ID:54001", "ufc", "ufc-men"),
  game("ufc-pereira-prochazka", "Alex Pereira", "Jiri Prochazka", "br", "cz", "PER", "JIR", "UFC 321 · 7 Mar 2026 · Light Heavyweight Title", "ID:54002", "ufc", "ufc-men"),
  game("ufc-pennington-pena", "Raquel Pennington", "Julianna Pena", "us", "us", "PEN", "PEA", "UFC 322 · 14 Feb 2026 · W Bantamweight Title", "ID:54003", "ufc", "ufc-women"),
  game("ufc-shevchenko-grasso", "Valentina Shevchenko", "Alexa Grasso", "kg", "mx", "VAL", "GRA", "UFC 320 · 17 Jan 2026 · W Flyweight Title", "ID:54004", "ufc", "ufc-women"),
];

const sportLabels = {
  football: { title: "Football", icon: "⚽" },
  basketball: { title: "Basketball", icon: "🏀" },
  cricket: { title: "Cricket", icon: "🏏" },
  tennis: { title: "Tennis", icon: "🎾" },
  "formula-1": { title: "Formula 1", icon: "🏎" },
  ufc: { title: "UFC", icon: "🥊" },
  esports: { title: "Esports", icon: "🎮" },
};

const marketVisuals = {
  "ufc-makhachev-volkanovski": {
    homeImage: "https://commons.wikimedia.org/wiki/Special:FilePath/Islam_Makhachev_2022_UFC_belt_%28cropped%29.png?width=720",
    awayImage: "https://commons.wikimedia.org/wiki/Special:FilePath/Alexander_Volkanovski_at_UFC_232.jpg?width=720",
  },
  "ufc-pereira-prochazka": {
    homeImage: "https://commons.wikimedia.org/wiki/Special:FilePath/Alex_Pereira_UFC_300.png?width=720",
    awayImage: "https://commons.wikimedia.org/wiki/Special:FilePath/JiriProchazka2022.png?width=720",
  },
  "ufc-shevchenko-grasso": {
    homeImage: "https://commons.wikimedia.org/wiki/Special:FilePath/Valentina_Shevchenko.jpg?width=720",
    awayImage: "https://commons.wikimedia.org/wiki/Special:FilePath/Alexa_Grasso.jpg?width=720",
  },
  "f1-canada-norris-verstappen": { eventImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2024_British_Grand_Prix%2C_Verstappen_%283%29.jpg/1920px-2024_British_Grand_Prix%2C_Verstappen_%283%29.jpg" },
  "f1-monaco-leclerc-piastri": { eventImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2024_British_Grand_Prix%2C_Verstappen_%283%29.jpg/1920px-2024_British_Grand_Prix%2C_Verstappen_%283%29.jpg" },
  "f1-spain-hamilton-russell": { eventImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2024_British_Grand_Prix%2C_Verstappen_%283%29.jpg/1920px-2024_British_Grand_Prix%2C_Verstappen_%283%29.jpg" },
  "f1-austria-norris-piastri": { eventImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2024_British_Grand_Prix%2C_Verstappen_%283%29.jpg/1920px-2024_British_Grand_Prix%2C_Verstappen_%283%29.jpg" },
  "f1-silverstone-hamilton-verstappen": { eventImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2024_British_Grand_Prix%2C_Verstappen_%283%29.jpg/1920px-2024_British_Grand_Prix%2C_Verstappen_%283%29.jpg" },
  "f1-belgium-leclerc-russell": { eventImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2024_British_Grand_Prix%2C_Verstappen_%283%29.jpg/1920px-2024_British_Grand_Prix%2C_Verstappen_%283%29.jpg" },
};

const playerPropMarkets = [
  playerProp("Cristiano Ronaldo", "Portugal", "https://commons.wikimedia.org/wiki/Special:FilePath/Cristiano_Ronaldo_2018.jpg?width=420", "Ronaldo to score a hat-trick", "Goals", 12, 88),
  playerProp("Lionel Messi", "Argentina", "https://commons.wikimedia.org/wiki/Special:FilePath/Lionel_Messi_20180626.jpg?width=420", "Messi to get a yellow card", "Cards", 14, 86),
  playerProp("Neymar Jr", "Brazil", "https://commons.wikimedia.org/wiki/Special:FilePath/Neymar_2018.jpg?width=420", "Neymar to start 3 games in a row", "Minutes", 49, 51),
  playerProp("Kylian Mbappe", "France", "https://commons.wikimedia.org/wiki/Special:FilePath/Kylian_Mbapp%C3%A9_2019.jpg?width=420", "Mbappe to score in both halves", "Goals", 10, 90),
  playerProp("Vinicius Jr", "Brazil", "https://commons.wikimedia.org/wiki/Special:FilePath/Vinicius_Junior_2021.jpg?width=420", "Vinicius Jr to score or assist", "Goals", 52, 48),
  playerProp("Raphinha", "Brazil", "https://commons.wikimedia.org/wiki/Special:FilePath/Raphinha_2022.jpg?width=420", "Raphinha to assist", "Chances", 31, 69),
  playerProp("Rafael Leao", "Portugal", "https://commons.wikimedia.org/wiki/Special:FilePath/Rafael_Le%C3%A3o_2019.jpg?width=420", "Rafael Leao 3+ successful dribbles", "Skill", 51, 49),
  playerProp("Ousmane Dembele", "France", "https://commons.wikimedia.org/wiki/Special:FilePath/Ousmane_Demb%C3%A9l%C3%A9_2018.jpg?width=420", "Dembele to score or assist", "Goals", 48, 52),
  playerProp("Lautaro Martinez", "Argentina", "https://commons.wikimedia.org/wiki/Special:FilePath/Lautaro_Martinez_2018.jpg?width=420", "Lautaro to score first", "Goals", 22, 78),
  playerProp("Goncalo Ramos", "Portugal", "https://commons.wikimedia.org/wiki/Special:FilePath/Gon%C3%A7alo_Ramos_2022.jpg?width=420", "Goncalo Ramos to score a header", "Goals", 16, 84),
  playerProp("Antoine Griezmann", "France", "https://commons.wikimedia.org/wiki/Special:FilePath/Antoine_Griezmann_2018.jpg?width=420", "Griezmann to create 3+ chances", "Chances", 45, 55),
  playerProp("Rodrygo", "Brazil", "https://commons.wikimedia.org/wiki/Special:FilePath/Rodrygo_2021.jpg?width=420", "Rodrygo to score off the bench", "Combo", 18, 82),
  playerProp("Julian Alvarez", "Argentina", "https://commons.wikimedia.org/wiki/Special:FilePath/Julian_Alvarez_2022.jpg?width=420", "Julian Alvarez to score", "Goals", 38, 62),
  playerProp("Joao Felix", "Portugal", "https://commons.wikimedia.org/wiki/Special:FilePath/Jo%C3%A3o_F%C3%A9lix_2019.jpg?width=420", "Joao Felix to score or assist", "Goals", 37, 63),
  playerProp("Marcus Thuram", "France", "https://commons.wikimedia.org/wiki/Special:FilePath/Marcus_Thuram_2022.jpg?width=420", "Marcus Thuram to win 4+ aerial duels", "Duels", 43, 57),
  playerProp("Endrick", "Brazil", "https://commons.wikimedia.org/wiki/Special:FilePath/Endrick_Palmeiras_2022.jpg?width=420", "Endrick to score", "Goals", 26, 74),
  playerProp("Paulo Dybala", "Argentina", "https://commons.wikimedia.org/wiki/Special:FilePath/Paulo_Dybala_2017.jpg?width=420", "Dybala to score from outside the box", "Goals", 11, 89),
  playerProp("Diogo Jota", "Portugal", "https://commons.wikimedia.org/wiki/Special:FilePath/Diogo_Jota_2018.jpg?width=420", "Diogo Jota 2+ shots on target", "Shots", 41, 59),
  playerProp("Kingsley Coman", "France", "https://commons.wikimedia.org/wiki/Special:FilePath/Kingsley_Coman_2019.jpg?width=420", "Coman to complete 3+ dribbles", "Skill", 46, 54),
  playerProp("Gabriel Martinelli", "Brazil", "https://commons.wikimedia.org/wiki/Special:FilePath/Gabriel_Martinelli_2020.jpg?width=420", "Martinelli to score or assist", "Goals", 34, 66),
  playerProp("Angel Di Maria", "Argentina", "https://commons.wikimedia.org/wiki/Special:FilePath/%C3%81ngel_Di_Mar%C3%ADa_2018.jpg?width=420", "Di Maria to assist", "Chances", 32, 68),
  playerProp("Bernardo Silva", "Portugal", "https://commons.wikimedia.org/wiki/Special:FilePath/Bernardo_Silva_2018.jpg?width=420", "Bernardo Silva 4+ key passes", "Chances", 36, 64),
  playerProp("Eduardo Camavinga", "France", "https://commons.wikimedia.org/wiki/Special:FilePath/Eduardo_Camavinga_2022.jpg?width=420", "Camavinga to receive a yellow card", "Cards", 19, 81),
  playerProp("Casemiro", "Brazil", "https://commons.wikimedia.org/wiki/Special:FilePath/Casemiro_2018.jpg?width=420", "Casemiro to win 3+ tackles", "Defense", 58, 42),
  playerProp("Enzo Fernandez", "Argentina", "https://commons.wikimedia.org/wiki/Special:FilePath/Enzo_Fernandez_2022.jpg?width=420", "Enzo Fernandez 60+ passes", "Passing", 63, 37),
  playerProp("Vitinha", "Portugal", "https://commons.wikimedia.org/wiki/Special:FilePath/Vitinha_2022.jpg?width=420", "Vitinha 70+ pass accuracy market", "Passing", 68, 32),
  playerProp("Aurelien Tchouameni", "France", "https://commons.wikimedia.org/wiki/Special:FilePath/Aur%C3%A9lien_Tchouam%C3%A9ni_2022.jpg?width=420", "Tchouameni to commit 2+ fouls", "Fouls", 42, 58),
  playerProp("Lucas Paqueta", "Brazil", "https://commons.wikimedia.org/wiki/Special:FilePath/Lucas_Paquet%C3%A1_2018.jpg?width=420", "Paqueta to create 2+ chances", "Chances", 49, 51),
  playerProp("Alexis Mac Allister", "Argentina", "https://commons.wikimedia.org/wiki/Special:FilePath/Alexis_Mac_Allister_2022.jpg?width=420", "Mac Allister to score from midfield", "Goals", 9, 91),
  playerProp("Ruben Dias", "Portugal", "https://commons.wikimedia.org/wiki/Special:FilePath/R%C3%BAben_Dias_2018.jpg?width=420", "Ruben Dias to make 5+ clearances", "Defense", 56, 44),
  playerProp("William Saliba", "France", "https://commons.wikimedia.org/wiki/Special:FilePath/William_Saliba_2022.jpg?width=420", "Saliba to win 4+ duels", "Duels", 53, 47),
  playerProp("Marquinhos", "Brazil", "https://commons.wikimedia.org/wiki/Special:FilePath/Marquinhos_2018.jpg?width=420", "Marquinhos to score a header", "Goals", 8, 92),
  playerProp("Cristian Romero", "Argentina", "https://commons.wikimedia.org/wiki/Special:FilePath/Cristian_Romero_2022.jpg?width=420", "Romero to receive a yellow card", "Cards", 35, 65),
  playerProp("Pepe", "Portugal", "https://commons.wikimedia.org/wiki/Special:FilePath/Pepe_2018.jpg?width=420", "Pepe to make 6+ clearances", "Defense", 50, 50),
  playerProp("Theo Hernandez", "France", "https://commons.wikimedia.org/wiki/Special:FilePath/Theo_Hernandez_2022.jpg?width=420", "Theo Hernandez to assist", "Chances", 22, 78),
  playerProp("Alisson Becker", "Brazil", "https://commons.wikimedia.org/wiki/Special:FilePath/Alisson_Becker_2018.jpg?width=420", "Alisson to keep a clean sheet", "Keeper", 47, 53),
  playerProp("Emiliano Martinez", "Argentina", "https://commons.wikimedia.org/wiki/Special:FilePath/Emiliano_Mart%C3%ADnez_2022.jpg?width=420", "Emiliano Martinez 3+ saves", "Keeper", 44, 56),
  playerProp("Diogo Costa", "Portugal", "https://commons.wikimedia.org/wiki/Special:FilePath/Diogo_Costa_2022.jpg?width=420", "Diogo Costa to save a penalty", "Keeper", 7, 93),
  playerProp("Mike Maignan", "France", "https://commons.wikimedia.org/wiki/Special:FilePath/Mike_Maignan_2019.jpg?width=420", "Maignan to keep a clean sheet", "Keeper", 43, 57),
  playerProp("Eder Militao", "Brazil", "https://commons.wikimedia.org/wiki/Special:FilePath/%C3%89der_Milit%C3%A3o_2018.jpg?width=420", "Militao to win 3+ aerial duels", "Duels", 52, 48),
  playerProp("Nicolas Otamendi", "Argentina", "https://commons.wikimedia.org/wiki/Special:FilePath/Nicol%C3%A1s_Otamendi_2018.jpg?width=420", "Otamendi to be booked", "Cards", 28, 72),
  playerProp("Nuno Mendes", "Portugal", "https://commons.wikimedia.org/wiki/Special:FilePath/Nuno_Mendes_2022.jpg?width=420", "Nuno Mendes 5+ crosses", "Chances", 38, 62),
  playerProp("Jules Kounde", "France", "https://commons.wikimedia.org/wiki/Special:FilePath/Jules_Kound%C3%A9_2022.jpg?width=420", "Kounde to make 3+ tackles", "Defense", 46, 54),
  playerProp("Bruno Guimaraes", "Brazil", "https://commons.wikimedia.org/wiki/Special:FilePath/Bruno_Guimaraes_2022.jpg?width=420", "Bruno Guimaraes to be booked", "Cards", 24, 76),
  playerProp("Rodrigo De Paul", "Argentina", "https://commons.wikimedia.org/wiki/Special:FilePath/Rodrigo_De_Paul_2018.jpg?width=420", "De Paul 2+ fouls committed", "Fouls", 55, 45),
  playerProp("Pedro Neto", "Portugal", "https://commons.wikimedia.org/wiki/Special:FilePath/Pedro_Neto_2019.jpg?width=420", "Pedro Neto to assist", "Chances", 20, 80),
  playerProp("Adrien Rabiot", "France", "https://commons.wikimedia.org/wiki/Special:FilePath/Adrien_Rabiot_2018.jpg?width=420", "Rabiot to play 70+ minutes", "Minutes", 60, 40),
  playerProp("Richarlison", "Brazil", "https://commons.wikimedia.org/wiki/Special:FilePath/Richarlison_2018.jpg?width=420", "Richarlison to score off the bench", "Goals", 17, 83),
  playerProp("Giovanni Lo Celso", "Argentina", "https://commons.wikimedia.org/wiki/Special:FilePath/Giovani_Lo_Celso_2018.jpg?width=420", "Lo Celso to create 2+ chances", "Chances", 40, 60),
  playerProp("Joao Neves", "Portugal", "https://commons.wikimedia.org/wiki/Special:FilePath/Jo%C3%A3o_Neves_2023.jpg?width=420", "Joao Neves to start", "Minutes", 34, 66),
];

const leagueMarkets = {
  "premier-league": {
    title: "Premier League",
    clubs: [
      club("Arsenal", "Chelsea", "https://commons.wikimedia.org/wiki/Special:FilePath/Arsenal_FC.svg?width=120", "https://commons.wikimedia.org/wiki/Special:FilePath/Chelsea_FC.svg?width=120", "ARS", "CHE"),
      club("Liverpool", "Manchester City", "https://commons.wikimedia.org/wiki/Special:FilePath/Liverpool_FC.svg?width=120", "https://commons.wikimedia.org/wiki/Special:FilePath/Manchester_City_FC_badge.svg?width=120", "LIV", "MCI"),
      club("Tottenham Hotspur", "Manchester United", "https://commons.wikimedia.org/wiki/Special:FilePath/Tottenham_Hotspur.svg?width=120", "https://commons.wikimedia.org/wiki/Special:FilePath/Manchester_United_FC_crest.svg?width=120", "TOT", "MUN"),
      club("Newcastle United", "Aston Villa", "https://commons.wikimedia.org/wiki/Special:FilePath/Newcastle_United_Logo.svg?width=120", "https://commons.wikimedia.org/wiki/Special:FilePath/Aston_Villa_FC_new_crest.svg?width=120", "NEW", "AVL"),
    ],
  },
  "la-liga": {
    title: "La Liga",
    clubs: [
      club("Real Madrid", "Barcelona", "https://commons.wikimedia.org/wiki/Special:FilePath/Real_Madrid_CF.svg?width=120", "https://commons.wikimedia.org/wiki/Special:FilePath/FC_Barcelona_%28crest%29.svg?width=120", "RMA", "BAR"),
      club("Atletico Madrid", "Sevilla", "https://commons.wikimedia.org/wiki/Special:FilePath/Atletico_Madrid_2017_logo.svg?width=120", "https://commons.wikimedia.org/wiki/Special:FilePath/Sevilla_FC_logo.svg?width=120", "ATM", "SEV"),
      club("Real Betis", "Villarreal", "https://commons.wikimedia.org/wiki/Special:FilePath/Real_betis_logo.svg?width=120", "https://commons.wikimedia.org/wiki/Special:FilePath/Villarreal_CF_logo.svg?width=120", "BET", "VIL"),
      club("Athletic Club", "Real Sociedad", "https://commons.wikimedia.org/wiki/Special:FilePath/Athletic_Club_Bilbao_logo.svg?width=120", "https://commons.wikimedia.org/wiki/Special:FilePath/Real_Sociedad_logo.svg?width=120", "ATH", "RSO"),
    ],
  },
  "serie-a": {
    title: "Serie A",
    clubs: [
      club("Inter Milan", "AC Milan", "https://commons.wikimedia.org/wiki/Special:FilePath/FC_Internazionale_Milano_2021.svg?width=120", "https://commons.wikimedia.org/wiki/Special:FilePath/Logo_of_AC_Milan.svg?width=120", "INT", "MIL"),
      club("Juventus", "Napoli", "https://commons.wikimedia.org/wiki/Special:FilePath/Juventus_FC_2017_logo.svg?width=120", "https://commons.wikimedia.org/wiki/Special:FilePath/SSC_Napoli.svg?width=120", "JUV", "NAP"),
      club("Roma", "Lazio", "https://commons.wikimedia.org/wiki/Special:FilePath/AS_Roma_logo_%282017%29.svg?width=120", "https://commons.wikimedia.org/wiki/Special:FilePath/S.S._Lazio_badge.svg?width=120", "ROM", "LAZ"),
      club("Atalanta", "Fiorentina", "https://commons.wikimedia.org/wiki/Special:FilePath/Atalanta_BC_logo.svg?width=120", "https://commons.wikimedia.org/wiki/Special:FilePath/ACF_Fiorentina_2.svg?width=120", "ATA", "FIO"),
    ],
  },
};

const liveFeaturedMarkets = [
  featuredMarket("Argentina", "France", "ar", "fr", "ARG", "FRA", "22 MAY · LIVE 65'", "football"),
  featuredMarket("Islam Makhachev", "Alexander Volkanovski", "ru", "au", "ISL", "VOL", "21 OCT 2023 · UFC 294", "ufc"),
  featuredMarket("Brazil", "Spain", "br", "es", "BRA", "ESP", "22 MAY · LIVE 31'", "football"),
  featuredMarket("USA", "Serbia", "us", "rs", "USA", "SRB", "22 MAY · LIVE Q3", "basketball"),
  featuredMarket("England Women", "Scotland Women", "gb-eng", "gb-sct", "ENG", "SCO", "12 JUN · T20 WORLD CUP", "cricket"),
  featuredMarket("Lando Norris", "Max Verstappen", "gb", "nl", "NOR", "VER", "24 MAY · CANADIAN GP", "formula-1"),
];

const PROFILE_IMAGE_KEY = "x-cup-profile-image";
const WALLET_ADDRESS = "0x7A9C7423C3d8F68E4A48B276693F96F0B32B21F8";
const state = { connected: false, side: "YES", price: 47, sport: "football", tickets: [] };
const gamesGrid = document.querySelector("#games-grid");
const featuredGames = document.querySelector("#featured-games");
const heroBanner = document.querySelector(".hero-banner");
const featuredStrip = document.querySelector(".featured-strip");
const playerMarketList = document.querySelector("#player-market-list");
const leagueSelector = document.querySelector("#league-selector");
const leagueMarketList = document.querySelector("#league-market-list");
const playerFilter = document.querySelector("#player-filter");
const playerSearch = document.querySelector("#player-search");
const matchPage = document.querySelector("#match-page");
const detailTitle = document.querySelector("#detail-title");
const detailMeta = document.querySelector("#detail-meta");
const detailId = document.querySelector("#detail-id");
const detailHomeFlag = document.querySelector("#detail-home-flag");
const detailAwayFlag = document.querySelector("#detail-away-flag");
const detailHomeCode = document.querySelector("#detail-home-code");
const detailAwayCode = document.querySelector("#detail-away-code");
const detailInsight = document.querySelector("#detail-insight");
const detailTabs = document.querySelector("#detail-tabs");
const detailOptions = document.querySelector("#detail-options");
const historyPage = document.querySelector("#history-page");
const historyColumns = document.querySelector("#history-columns");
const historyWinCount = document.querySelector("#history-win-count");
const historyLossCount = document.querySelector("#history-loss-count");
const historyNetPnl = document.querySelector("#history-net-pnl");
const ticketTitle = document.querySelector(".trade-view h2");
const amountInput = document.querySelector(".trade-slip input");
const quoteValues = document.querySelectorAll(".quote-grid strong");
const sideButtons = document.querySelectorAll(".side-toggle button");
const ticketStack = document.querySelector("#ticket-stack");
const pnlModal = document.querySelector("#pnl-modal");
const toast = createToast();
const confirmTradeButton = document.querySelector("[data-action='confirm-trade']");

renderGameTiles();
wireNavigation();
wireTopSportNav();
wireBoardTabs();
wireDashboardTools();
wireFooterLinks();
wireProfileMenu();
wireOutsideClose();
wireSlipTabs();
wireSideToggle();
wireConnectButtons();
wireConfirmTrade();
wirePnlModal();
updateQuote();
initializeProfileImage();
renderTickets();

function game(id, home, away, homeFlag, awayFlag, homeCode, awayCode, time, marketId, sport = "football", group = "world-cup") {
  return {
    id,
    sport,
    group,
    home,
    away,
    homeFlag,
    awayFlag,
    homeCode,
    awayCode,
    time,
    marketId,
    liquidity: `$${Math.floor(75 + Math.random() * 160)}.${Math.floor(Math.random() * 9)}k liquidity`,
    options: buildGameOptions(home, away, sport),
  };
}

function playerProp(name, country, image, title, label, yes, no) {
  return { name, country, image, title, label, yes, no };
}

function club(home, away, homeLogo, awayLogo, homeCode, awayCode) {
  return { home, away, homeLogo, awayLogo, homeCode, awayCode };
}

function featuredMarket(home, away, homeFlag, awayFlag, homeCode, awayCode, time, sport) {
  return { home, away, homeFlag, awayFlag, homeCode, awayCode, time, sport };
}

function buildGameOptions(home, away, sport) {
  if (sport === "basketball") return buildBasketballOptions(home, away);
  if (sport === "cricket") return buildCricketOptions(home, away);
  if (sport === "tennis") return buildTennisOptions(home, away);
  if (sport === "formula-1") return buildFormulaOneOptions(home, away);
  if (sport === "ufc") return buildUfcOptions(home, away);
  if (sport === "esports") return buildEsportsOptions(home, away);

  const keyHomePlayer = home === "Argentina" ? "Messi" : home === "France" ? "Mbappé" : home === "Portugal" ? "Ronaldo" : `${home} striker`;
  const keyAwayPlayer = away === "Argentina" ? "Messi" : away === "France" ? "Mbappé" : away === "Portugal" ? "Ronaldo" : `${away} winger`;
  return [
    [`${home} to win`, "Main", 45, 55],
    [`${away} to win`, "Main", 37, 63],
    [`${home} vs ${away} to end in a draw`, "Main", 29, 71],
    [`${home} vs ${away} over 2.5 goals`, "Goals", 54, 46],
    [`${home} vs ${away} under 2.5 goals`, "Goals", 42, 58],
    [`${home} to score first`, "Goals", 52, 48],
    [`1st half draw`, "Half", 38, 62],
    [`${home} to lead at half time`, "Half", 34, 66],
    [`Over 3.5 total cards`, "Bookings", 61, 39],
    [`${away} to get the next yellow card`, "Bookings", 44, 56],
    [`9+ total corners`, "Corners", 55, 45],
    [`${home} 5+ corners`, "Corners", 47, 53],
    [`Both teams to score and over 2.5`, "Combo", 33, 67],
    [`Penalty awarded in the match`, "Combo", 21, 79],
    [`${keyHomePlayer} to score or assist`, "Players", 44, 56],
    [`${keyAwayPlayer} to receive a yellow card`, "Players", 19, 81],
    [`${home} goalkeeper 3+ saves`, "Players", 36, 64],
    [`${home} to win 11+ free kicks`, "Teams", 51, 49],
    [`${away} to have 5+ shots on target`, "Teams", 43, 57],
    [`Goal before 20:00`, "Minutes", 33, 67],
  ];
}

function buildBasketballOptions(home, away) {
  return [
    [`${home} moneyline`, "Main", 54, 46],
    [`${away} moneyline`, "Main", 42, 58],
    [`${home} -5.5 spread`, "Main", 47, 53],
    [`Total points over 169.5`, "Points", 51, 49],
    [`Total points under 169.5`, "Points", 49, 51],
    [`${home} to win first quarter`, "Quarters", 52, 48],
    [`${away} to score 25+ in Q1`, "Quarters", 36, 64],
    [`Over 18.5 made threes`, "Team Stats", 45, 55],
    [`${home} 42+ rebounds`, "Team Stats", 44, 56],
    [`${away} 20+ assists`, "Team Stats", 57, 43],
    [`Star guard 25+ points`, "Players", 48, 52],
    [`Center 10+ rebounds`, "Players", 55, 45],
    [`Player to record double-double`, "Players", 39, 61],
    [`Game goes to overtime`, "Combo", 12, 88],
  ];
}

function buildCricketOptions(home, away) {
  return [
    [`${home} to win`, "Main", 52, 48],
    [`${away} to win`, "Main", 48, 52],
    [`${home} to win the toss`, "Toss", 50, 50],
    [`${home} powerplay over 42.5 runs`, "Runs", 54, 46],
    [`${away} innings over 149.5 runs`, "Runs", 49, 51],
    [`Match total over 12.5 sixes`, "Boundaries", 43, 57],
    [`${home} to score the first boundary`, "Boundaries", 51, 49],
    [`${away} first wicket before 4.5 overs`, "Wickets", 37, 63],
    [`A player scores 50+ runs`, "Players", 58, 42],
    [`Bowler takes 3+ wickets`, "Players", 39, 61],
    [`Highest partnership over 64.5 runs`, "Combo", 47, 53],
    [`Match decided in the final over`, "Combo", 26, 74],
  ];
}

function buildTennisOptions(home, away) {
  return [
    [`${home} to win the match`, "Winner", 52, 48],
    [`${away} to win the match`, "Winner", 48, 52],
    [`Match decided in straight sets`, "Sets", 44, 56],
    [`Match goes to 3+ sets`, "Sets", 56, 44],
    [`${home} wins first set`, "Sets", 54, 46],
    [`${away} wins first set`, "Sets", 46, 54],
    [`Total games over 22.5`, "Games", 51, 49],
    [`Total games under 22.5`, "Games", 49, 51],
    [`${home} holds serve 80%+ of games`, "Serve", 47, 53],
    [`A tiebreak is played`, "Games", 38, 62],
    [`${home} wins in 2 sets`, "Combo", 39, 61],
    [`${away} comeback after losing first set`, "Combo", 22, 78],
  ];
}

function buildEsportsOptions(home, away) {
  return [
    [`${home} to win the series`, "Winner", 55, 45],
    [`${away} to win the series`, "Winner", 45, 55],
    [`${home} wins map 1`, "Maps", 53, 47],
    [`${away} wins map 1`, "Maps", 47, 53],
    [`Series goes to map 3`, "Maps", 49, 51],
    [`${home} wins 2-0`, "Series", 34, 66],
    [`${away} wins 2-0`, "Series", 28, 72],
    [`${home} wins 2-1`, "Series", 21, 79],
    [`${home} total rounds over 25.5`, "Rounds", 52, 48],
    [`${away} opens pistol round`, "Rounds", 50, 50],
    [`${home} first blood on map 1`, "First", 36, 64],
    [`Overtime played on any map`, "Combo", 31, 69],
  ];
}

function buildFormulaOneOptions(home, away) {
  return [
    [`${home} to win the Grand Prix`, "Winner", 41, 59],
  ];
}

function buildUfcOptions(home, away) {
  return [
    [`${home} to win`, "Main", 53, 47],
    [`${away} to win`, "Main", 47, 53],
    [`Fight goes the distance`, "Rounds", 42, 58],
    [`Fight ends before round 3`, "Rounds", 46, 54],
    [`${home} wins by KO or TKO`, "Method", 31, 69],
    [`${away} wins by submission`, "Method", 22, 78],
    [`Either fighter scores a knockdown`, "Striking", 44, 56],
    [`${home} lands 60+ significant strikes`, "Striking", 51, 49],
    [`${away} records 2+ takedowns`, "Grappling", 36, 64],
    [`Performance bonus for this bout`, "Combo", 18, 82],
  ];
}

function quickChoices(match) {
  if (match.sport === "basketball") {
    return [
      { label: match.homeCode, price: "2.10", title: `${match.home} to win` },
      { label: "O/U", price: "3.30", title: "Total points over 169.5" },
      { label: match.awayCode, price: "2.65", title: `${match.away} to win` },
    ];
  }
  if (match.sport === "cricket") {
    return [
      { label: match.homeCode, price: "2.10", title: `${match.home} to win` },
      { label: "Sixes", price: "3.30", title: "Match total over 12.5 sixes" },
      { label: match.awayCode, price: "2.65", title: `${match.away} to win` },
    ];
  }
  if (match.sport === "tennis") {
    return [
      { label: match.homeCode, price: "2.10", title: `${match.home} to win the match` },
      { label: "Sets", price: "3.30", title: "Match goes to 3+ sets" },
      { label: match.awayCode, price: "2.65", title: `${match.away} to win the match` },
    ];
  }
  if (match.sport === "formula-1") {
    return [
      { label: match.homeCode, price: "2.10", title: `${match.home} finishes ahead of ${match.away}` },
      { label: "Podium", price: "3.30", title: `${match.home} reaches the podium` },
      { label: match.awayCode, price: "2.65", title: `${match.away} finishes ahead of ${match.home}` },
    ];
  }
  if (match.sport === "ufc") {
    return [
      { label: match.homeCode, price: "2.10", title: `${match.home} to win` },
      { label: "Distance", price: "3.30", title: "Fight goes the distance" },
      { label: match.awayCode, price: "2.65", title: `${match.away} to win` },
    ];
  }
  if (match.sport === "esports") {
    return [
      { label: match.homeCode, price: "2.10", title: `${match.home} to win the series` },
      { label: "Map 3", price: "3.30", title: "Series goes to map 3" },
      { label: match.awayCode, price: "2.65", title: `${match.away} to win the series` },
    ];
  }
  return [
    { label: match.homeCode, price: "2.10", title: `${match.home} to win` },
    { label: "Draw", price: "3.30", title: `${match.home} vs ${match.away} to end in a draw` },
    { label: match.awayCode, price: "2.65", title: `${match.away} to win` },
  ];
}

function renderGameTiles() {
  gamesGrid.innerHTML = "";
  featuredGames.innerHTML = "";
  playerMarketList.innerHTML = "";
  leagueMarketList.innerHTML = "";
  playerMarketList.hidden = true;
  leagueMarketList.hidden = true;
  leagueSelector.hidden = true;
  playerFilter.hidden = true;
  if (playerSearch) playerSearch.value = "";
  gamesGrid.hidden = false;
  gamesGrid.dataset.sport = state.sport;
  const activeMarkets = gameMarkets.filter(match => match.sport === state.sport);
  const sport = sportLabels[state.sport];
  const footballTabs = document.querySelectorAll(
    "#games-board [data-category='world-cup'], #games-board [data-category='leagues'], #games-board [data-category='players']"
  );
  const ufcTabs = document.querySelectorAll(
    "#games-board [data-category='ufc-men'], #games-board [data-category='ufc-women']"
  );
  footballTabs.forEach(tab => {
    tab.hidden = state.sport !== "football";
  });
  ufcTabs.forEach(tab => {
    tab.hidden = state.sport !== "ufc";
  });
  if (state.sport !== "football" && [...footballTabs].some(tab => tab.classList.contains("is-active"))) {
    const allTab = document.querySelector("#games-board [data-category='all']");
    setActive(document.querySelectorAll("#games-board .market-tabs button"), allTab);
  }
  if (state.sport !== "ufc" && [...ufcTabs].some(tab => tab.classList.contains("is-active"))) {
    const allTab = document.querySelector("#games-board [data-category='all']");
    setActive(document.querySelectorAll("#games-board .market-tabs button"), allTab);
  }
  document.querySelector("#games-board .section-head h2").textContent = `${sport.icon} ${sport.title}`;
  activeMarkets.forEach(match => {
    const categories = ["all"];
    if (match.time.toLowerCase().includes("live")) categories.push("live");
    if (state.sport === "football") categories.push("world-cup");
    if (state.sport === "ufc") categories.push(match.group);
    const card = document.createElement("article");
    card.className = "match-row game-tile";
    card.dataset.matchId = match.id;
    card.dataset.marketCategory = categories.join(" ");
    card.dataset.search = `${match.home} ${match.away} ${match.homeCode} ${match.awayCode}`.toLowerCase();
    const visual = marketVisuals[match.id] || {};

    if (match.sport === "ufc") {
      const choices = quickChoices(match);
      card.className += " ufc-title-card";
      if (visual.eventArt) card.style.setProperty("--fight-art", `url("${visual.eventArt}")`);
      card.innerHTML = `
        <span class="fight-event-line">${match.time}</span>
        <div class="ufc-title-stage" aria-label="${match.home} versus ${match.away}">
          <article class="fighter-card is-home">
            ${visual.homeImage ? `<img class="fighter-image" src="${visual.homeImage}" alt="${match.home}" onerror="this.hidden=true" />` : ""}
            <div class="fighter-card-copy">
              <strong>${match.home}</strong>
              <button type="button">${choices[0].label}<span>${choices[0].price}</span></button>
            </div>
          </article>
          <b class="fight-vs">VS</b>
          <article class="fighter-card is-away">
            ${visual.awayImage ? `<img class="fighter-image" src="${visual.awayImage}" alt="${match.away}" onerror="this.hidden=true" />` : ""}
            <div class="fighter-card-copy">
              <strong>${match.away}</strong>
              <button type="button">${choices[2].label}<span>${choices[2].price}</span></button>
            </div>
          </article>
        </div>
        <button class="fight-distance-pick" type="button">${choices[1].label}<span>${choices[1].price}</span></button>
      `;
      card.querySelector(".fighter-card.is-home button").addEventListener("click", event => {
        event.stopPropagation();
        selectMarket(choices[0].title, event.currentTarget);
      });
      card.querySelector(".fighter-card.is-away button").addEventListener("click", event => {
        event.stopPropagation();
        selectMarket(choices[2].title, event.currentTarget);
      });
      card.querySelector(".fight-distance-pick").addEventListener("click", event => {
        event.stopPropagation();
        selectMarket(choices[1].title, event.currentTarget);
      });
      card.addEventListener("click", () => openMatchPage(match.id));
      gamesGrid.appendChild(card);
      return;
    }

    if (match.sport === "formula-1") {
      const [eventName, eventDate] = match.time.split(" · ");
      card.className += " formula-event-card";
      card.innerHTML = `
        <img class="formula-event-art" src="${visual.eventImage}" alt="${eventName} Formula 1 race car" />
        <div class="formula-event-copy">
          <span>${eventName} · ${eventDate}</span>
          <strong>${eventName}</strong>
          <p>Driver winner market: ${match.home}</p>
          <small>${match.home} vs ${match.away} headline picks</small>
          <button type="button">Open race market</button>
        </div>
      `;
      card.querySelector("button").addEventListener("click", event => {
        event.stopPropagation();
        openMatchPage(match.id);
      });
      card.addEventListener("click", () => openMatchPage(match.id));
      gamesGrid.appendChild(card);
      return;
    }

    if (match.sport === "esports") {
      const choices = quickChoices(match);
      card.innerHTML = `
        <div class="match-teams">
          <span class="match-meta-line">${sport.icon} ${match.time} · ${sport.title.toUpperCase()}</span>
          <div class="matchup-sides esports-matchup" aria-label="${match.home} versus ${match.away}">
            <strong>${esportsLogoHtml(match.homeCode)} ${match.home}</strong>
            <b>VS</b>
            <strong>${match.away} ${esportsLogoHtml(match.awayCode)}</strong>
          </div>
        </div>
        <div class="quick-odds">
          ${choices.map(choice => `<button type="button">${choice.label}<span>${choice.price}</span></button>`).join("")}
        </div>
      `;
      card.querySelectorAll(".quick-odds button").forEach((button, index) => {
        button.addEventListener("click", event => {
          event.stopPropagation();
          selectMarket(choices[index].title, button);
        });
      });
      card.addEventListener("click", () => openMatchPage(match.id));
      gamesGrid.appendChild(card);
      return;
    }

    const choices = quickChoices(match);
    card.innerHTML = `
      <div class="match-teams">
        <span class="match-meta-line">${sport.icon} ${match.time} · ${sport.title.toUpperCase()}</span>
        <div class="matchup-sides" aria-label="${match.home} versus ${match.away}">
          <strong><img src="${flagUrl(match.homeFlag)}" alt="${match.home} flag" /> ${match.home}</strong>
          <b>VS</b>
          <strong><img src="${flagUrl(match.awayFlag)}" alt="${match.away} flag" /> ${match.away}</strong>
        </div>
      </div>
      <div class="quick-odds">
        ${choices.map(choice => `<button type="button">${choice.label}<span>${choice.price}</span></button>`).join("")}
      </div>
    `;
    card.querySelectorAll(".quick-odds button").forEach((button, index) => {
      button.addEventListener("click", event => {
        event.stopPropagation();
        selectMarket(choices[index].title, button);
      });
    });
    card.addEventListener("click", () => openMatchPage(match.id));
    gamesGrid.appendChild(card);

  });
  renderFeaturedMarkets("popular");
  renderPlayerPropMarkets();
  renderLeagueMarkets("premier-league");
}

function renderFeaturedMarkets(mode) {
  featuredGames.innerHTML = "";
  const activeMarkets = mode === "live"
    ? liveFeaturedMarkets
    : gameMarkets.filter(match => match.sport === state.sport).slice(0, 6);

  activeMarkets.forEach(match => {
    const sport = sportLabels[match.sport] || sportLabels.football;
    const featuredChoices = quickChoices(match);
    const featured = document.createElement("article");
    featured.className = "featured-card";
    if (featuredChoices.length === 3) featured.classList.add("featured-card--three-way");
    featured.dataset.search = `${match.home} ${match.away} ${match.homeCode} ${match.awayCode}`.toLowerCase();
    featured.innerHTML = `
      <span class="sport-icon">${sport.icon}</span>
      <span class="feature-time">${match.time.toUpperCase()}</span>
      <div class="featured-flags">
        <img src="${flagUrl(match.homeFlag)}" alt="${match.home} flag" />
        <strong>VS</strong>
        <img src="${flagUrl(match.awayFlag)}" alt="${match.away} flag" />
      </div>
      <div class="featured-names"><span>${match.home}</span><span>${match.away}</span></div>
      <div class="featured-odds">
        ${featuredChoices.map(choice => `<button type="button">${choice.label}<b>${choice.price}</b></button>`).join("")}
      </div>
    `;
    featured.querySelectorAll(".featured-odds button").forEach((button, index) => {
      button.addEventListener("click", event => {
        event.stopPropagation();
        selectMarket(featuredChoices[index].title, button);
      });
    });
    if (match.id) featured.addEventListener("click", () => openMatchPage(match.id));
    featuredGames.appendChild(featured);
  });
}

function flagUrl(code) {
  return `https://flagcdn.com/w160/${code}.png`;
}

function esportsLogoHtml(code) {
  const url = `https://placehold.co/36x36/0f172a/25d8e8?text=${encodeURIComponent(code)}&font=roboto`;
  return `<img class="esports-team-logo" src="${url}" alt="${code} logo" />`;
}

const INSIGHT_CFG = {
  football:   { midLabel: "Table Position", formLabel: "form",     recentLabel: "Last 5 Matches", allowDraw: true,  scoreGen: (s, i) => `${(s + i * 2) % 4}–${(s + i * 3) % 3}`,                          opponents: ["ARS","BAR","JUV","PSG","BYN","AJA","POR","ATM","ROM","INT"] },
  basketball: { midLabel: "Conference",     formLabel: "win %",    recentLabel: "Last 5 Games",   allowDraw: false, scoreGen: (s, i) => `${95 + (s + i * 7) % 25}–${78 + (s + i * 5) % 20}`,            opponents: ["LAL","GSW","BOS","MIA","PHX","MIL","NYK","CHI","DEN","DAL"] },
  cricket:    { midLabel: "ICC Ranking",    formLabel: "form",     recentLabel: "Last 5 Games",   allowDraw: false, scoreGen: (s, i) => `${162 + (s + i * 9) % 78}/${5 + (s + i * 3) % 5}`,              opponents: ["IND","PAK","AUS","ENG","SA","NZ","WI","SL","BAN","AFG"] },
  tennis:     { midLabel: "ATP Ranking",    formLabel: "win %",    recentLabel: "Last 5 Matches", allowDraw: false, scoreGen: (s, i) => `${1 + (s + i * 2) % 2}–${(s + i * 3) % 2}`,                    opponents: ["DJO","ALC","MED","SIN","RUU","FRI","HUB","ZVE","RUB","BER"] },
  esports:    { midLabel: "World Ranking",  formLabel: "win rate", recentLabel: "Last 5 Series",  allowDraw: false, scoreGen: (s, i) => `2–${(s + i) % 2}`,                                             opponents: ["NV","SEN","G2","FNC","EG","T1","C9","NIP","NRG","100T"] },
};

function renderMatchInsight(match) {
  if (match.sport === "formula-1") {
    const visual = marketVisuals[match.id] || {};
    const [eventName, eventDate] = match.time.split(" · ");
    detailInsight.innerHTML = `
      <article class="formula-detail-insight">
        <img src="${visual.eventImage}" alt="${eventName} Formula 1 race car" />
        <div>
          <span>Formula 1 event</span>
          <h3>${eventName}</h3>
          <p>${eventDate} · One proposed winner market for this race.</p>
          <strong>${match.home} to win the Grand Prix</strong>
        </div>
      </article>
    `;
    return;
  }

  const cfg = INSIGHT_CFG[match.sport] || INSIGHT_CFG.football;
  const seed = match.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const homeForm = 42 + (seed % 36);
  const awayForm = 35 + ((seed * 7) % 42);
  const homeRank = 1 + (seed % 18);
  const awayRank = 1 + ((seed * 3) % 18);
  const homeRecent = recentResults(seed, cfg);
  const awayRecent = recentResults(seed + 9, cfg);

  detailInsight.innerHTML = `
    <div class="insight-topline">
      <span>${match.home} edge</span>
      <strong>Live matchup pulse</strong>
      <span>${match.away} edge</span>
    </div>
    <div class="insight-grid">
      <article class="form-card">
        <div class="form-ring is-home" style="--form:${homeForm}%"><strong>${homeForm}%</strong><span>${cfg.formLabel}</span></div>
        <h3>${match.home}</h3>
        <p>Rank ${homeRank} · ${homeRecent.filter(item => item.result === "W").length} wins in last 5</p>
      </article>
      <article class="rank-card">
        <span>${cfg.midLabel}</span>
        <div class="rank-bars">
          <div><b>${homeRank}</b><small>${match.homeCode}</small></div>
          <div><b>${awayRank}</b><small>${match.awayCode}</small></div>
        </div>
      </article>
      <article class="form-card">
        <div class="form-ring is-away" style="--form:${awayForm}%"><strong>${awayForm}%</strong><span>${cfg.formLabel}</span></div>
        <h3>${match.away}</h3>
        <p>Rank ${awayRank} · ${awayRecent.filter(item => item.result === "W").length} wins in last 5</p>
      </article>
    </div>
    <details class="recent-board">
      <summary>${cfg.recentLabel}</summary>
      <div class="recent-columns">
        <article class="recent-team-card">
          <h4>${match.home}</h4>
          ${homeRecent.map(item => resultRow(item, cfg)).join("")}
        </article>
        <article class="recent-team-card">
          <h4>${match.away}</h4>
          ${awayRecent.map(item => resultRow(item, cfg)).join("")}
        </article>
      </div>
    </details>
  `;
}

function recentResults(seed, cfg) {
  const results = cfg.allowDraw ? ["W", "D", "L", "W", "D"] : ["W", "L", "W", "W", "L"];
  return Array.from({ length: 5 }, (_, index) => ({
    result: results[(seed + index) % results.length],
    opponent: cfg.opponents[(seed + index) % cfg.opponents.length],
    score: cfg.scoreGen(seed, index),
    venue: index % 2 === 0 ? "H" : "A",
  }));
}

function resultRow(item, cfg = INSIGHT_CFG.football) {
  const venue = item.venue === "H" ? "Home" : "Away";
  const resultText = item.result === "W" ? "Win" : item.result === "D" ? "Draw" : "Loss";
  return `
    <div class="recent-row">
      <span class="result-pill result-${item.result.toLowerCase()}">${item.result}</span>
      <div>
        <strong>${resultText} ${item.score}</strong>
        <small>${venue} vs ${item.opponent}</small>
      </div>
    </div>
  `;
}

function renderPlayerPropMarkets() {
  playerPropMarkets.forEach(player => {
    const card = document.createElement("article");
    card.className = "player-prop-card";
    card.dataset.search = `${player.name} ${player.country} ${player.title} ${player.label}`.toLowerCase();
    card.dataset.player = player.name.toLowerCase().replaceAll(" ", "-");
    card.innerHTML = `
      <div class="player-prop-image" data-initials="${getInitials(player.name)}" data-fallback-name="${player.name}">
        <img src="${player.image}" alt="${player.name}" />
      </div>
      <div class="player-prop-copy">
        <span>${player.country} · ${player.label}</span>
        <h3>${player.title}</h3>
        <small>${player.name}</small>
      </div>
      <div class="player-prop-prices">
        <button class="price up" type="button">Yes ${player.yes}¢</button>
        <button class="price down" type="button">No ${player.no}¢</button>
      </div>
    `;
    const imageWrap = card.querySelector(".player-prop-image");
    const image = card.querySelector("img");
    image.addEventListener("load", () => imageWrap.classList.remove("image-failed"));
    image.addEventListener("error", () => {
      imageWrap.classList.add("image-failed");
      image.hidden = true;
    });
    card.querySelectorAll(".price").forEach(button => button.addEventListener("click", () => selectMarket(player.title, button)));
    playerMarketList.appendChild(card);
  });
}

function renderLeagueMarkets(leagueKey) {
  const league = leagueMarkets[leagueKey] || leagueMarkets["premier-league"];
  leagueMarketList.innerHTML = "";
  league.clubs.forEach((match, index) => {
    const yes = 38 + ((index * 7) % 24);
    const no = 100 - yes;
    const card = document.createElement("article");
    card.className = "league-match-card";
    card.innerHTML = `
      <span class="match-meta-line">${league.title.toUpperCase()} · ${index === 0 ? "Featured" : "Upcoming"}</span>
      <div class="league-clubs">
        <div><img src="${match.homeLogo}" alt="${match.home} logo" /><strong>${match.home}</strong></div>
        <b>VS</b>
        <div><img src="${match.awayLogo}" alt="${match.away} logo" /><strong>${match.away}</strong></div>
      </div>
      <div class="quick-odds">
        <button type="button">${match.homeCode}<span>${(2.05 + index * 0.12).toFixed(2)}</span></button>
        <button type="button">Draw<span>${(3.1 + index * 0.08).toFixed(2)}</span></button>
        <button type="button">${match.awayCode}<span>${(2.45 + index * 0.11).toFixed(2)}</span></button>
      </div>
      <div class="league-market-prices">
        <button class="price up" type="button">Yes ${yes}¢</button>
        <button class="price down" type="button">No ${no}¢</button>
      </div>
    `;
    card.querySelectorAll(".quick-odds button").forEach((button, buttonIndex) => {
      const title = buttonIndex === 0 ? `${match.home} to win` : buttonIndex === 1 ? `${match.home} vs ${match.away} to end in a draw` : `${match.away} to win`;
      button.addEventListener("click", event => {
        event.stopPropagation();
        selectMarket(title, button);
      });
    });
    card.querySelectorAll(".price").forEach(button => {
      button.addEventListener("click", () => selectMarket(`${match.home} vs ${match.away}`, button));
    });
    leagueMarketList.appendChild(card);
  });
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();
}

function openMatchPage(matchId) {
  const match = gameMarkets.find(item => item.id === matchId);
  if (!match) return;
  document.body.classList.remove("is-history-page");
  document.querySelectorAll(".home-section").forEach(section => (section.hidden = true));
  historyPage.hidden = true;
  matchPage.hidden = false;
  detailTitle.textContent = match.sport === "formula-1"
    ? `${match.time.split(" · ")[0]} winner market`
    : `${match.home} vs ${match.away}`;
  detailMeta.textContent = `${match.time} · Prediction markets available`;
  detailId.textContent = match.marketId;
  detailHomeFlag.hidden = match.sport === "formula-1";
  detailAwayFlag.hidden = match.sport === "formula-1";
  if (match.sport !== "formula-1") {
    detailHomeFlag.src = flagUrl(match.homeFlag);
    detailHomeFlag.alt = `${match.home} flag`;
    detailAwayFlag.src = flagUrl(match.awayFlag);
    detailAwayFlag.alt = `${match.away} flag`;
  } else {
    detailHomeFlag.removeAttribute("src");
    detailAwayFlag.removeAttribute("src");
    detailHomeFlag.alt = "";
    detailAwayFlag.alt = "";
  }
  detailHomeCode.textContent = match.homeCode;
  detailAwayCode.textContent = match.awayCode;
  renderMatchInsight(match);
  renderDetailTabs(match);
  renderDetailOptions(match, "All");
  showToast(`${match.home} vs ${match.away} opened`);
}

function showHome() {
  document.body.classList.remove("is-history-page");
  matchPage.hidden = true;
  historyPage.hidden = true;
  document.querySelectorAll(".home-section").forEach(section => (section.hidden = false));
  syncSportHero();
  showToast("Back to game tiles");
}

function syncSportHero() {
  const useCompactLanding = state.sport === "formula-1" || state.sport === "ufc" || state.sport === "esports";
  if (heroBanner) heroBanner.hidden = useCompactLanding;
  if (featuredStrip) featuredStrip.hidden = useCompactLanding;
}

function openHistoryPage() {
  document.body.classList.add("is-history-page");
  matchPage.hidden = true;
  document.querySelectorAll(".home-section").forEach(section => (section.hidden = true));
  renderHistoryPage();
  historyPage.hidden = false;
  historyPage.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("History opened");
}

function renderDetailTabs(match) {
  const groups = ["All", ...new Set(match.options.map(option => option[1]))];
  detailTabs.innerHTML = "";
  groups.forEach((group, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = group;
    button.classList.toggle("is-active", index === 0);
    button.addEventListener("click", () => {
      setActive(detailTabs.querySelectorAll("button"), button);
      renderDetailOptions(match, group);
    });
    detailTabs.appendChild(button);
  });
}

function renderDetailOptions(match, group) {
  detailOptions.innerHTML = "";
  match.options
    .filter(option => group === "All" || option[1] === group)
    .forEach(([title, label, yes, no]) => detailOptions.appendChild(optionRow(title, label, yes, no)));
}

function optionRow(title, label, yes, no) {
  const row = document.createElement("article");
  row.className = "option-row";
  row.innerHTML = `
    <div><strong>${title}</strong><span>${label}</span></div>
    <button class="price up" type="button">Yes ${yes}¢</button>
    <button class="price down" type="button">No ${no}¢</button>
  `;
  row.querySelectorAll(".price").forEach(button => button.addEventListener("click", () => selectMarket(title, button)));
  return row;
}

function wireNavigation() {
  document.querySelectorAll("[data-action='home']").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      showHome();
      document.querySelector("#games-board")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.querySelectorAll("[data-action='back-home']").forEach(button => {
    button.addEventListener("click", showHome);
  });
  document.querySelectorAll("[data-action='open-tickets']").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      showPositions();
      document.querySelector(".right-rail")?.classList.add("is-open");
    });
  });
  document.querySelectorAll("[data-hero-market]").forEach(button => {
    button.addEventListener("click", () => openMatchPage(button.dataset.heroMarket));
  });
}

function wireTopSportNav() {
  document.querySelectorAll(".top-sport-nav button").forEach(button => {
    button.addEventListener("click", () => {
      state.sport = button.dataset.sport;
      setActive(document.querySelectorAll(".top-sport-nav button"), button);
      setActive(document.querySelectorAll("#games-board .market-tabs button"), document.querySelector("#games-board [data-category='all']"));
      document.querySelector(".search-box input").value = "";
      showHome();
      renderGameTiles();
      showToast(`${sportLabels[state.sport].title} markets loaded`);
    });
  });
}

function wireBoardTabs() {
  document.querySelectorAll(".market-board").forEach(board => {
    const tabs = board.querySelectorAll(".market-tabs button");
    tabs.forEach(button => {
      button.addEventListener("click", () => {
        setActive(tabs, button);
        const category = button.dataset.category;
        if (category === "players") {
          gamesGrid.hidden = true;
          leagueSelector.hidden = true;
          leagueMarketList.hidden = true;
          playerMarketList.hidden = false;
          playerFilter.hidden = false;
          applyPlayerSearch();
          return;
        }
        if (category === "leagues") {
          gamesGrid.hidden = true;
          playerMarketList.hidden = true;
          playerFilter.hidden = true;
          leagueSelector.hidden = false;
          leagueMarketList.hidden = false;
          renderLeagueMarkets(document.querySelector(".league-panel.is-active")?.dataset.league || "premier-league");
          return;
        }
        gamesGrid.hidden = false;
        playerMarketList.hidden = true;
        playerFilter.hidden = true;
        leagueSelector.hidden = true;
        leagueMarketList.hidden = true;
        if (playerSearch) playerSearch.value = "";
        filterMatchRows(category);
      });
    });
  });

  document.querySelectorAll(".league-panel").forEach(button => {
    button.addEventListener("click", () => {
      setActive(document.querySelectorAll(".league-panel"), button);
      renderLeagueMarkets(button.dataset.league);
    });
  });
}

function wireDashboardTools() {
  const searchInput = document.querySelector(".search-box input");
  const featuredScroller = document.querySelector("#featured-games");
  const carouselButtons = document.querySelectorAll(".compact-section-head > div:last-child button");
  const featuredModeButtons = document.querySelectorAll("[data-featured-mode]");

  searchInput?.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    document.querySelectorAll("[data-search]").forEach(item => {
      item.hidden = query.length > 0 && !item.dataset.search.includes(query);
    });
  });

  playerSearch?.addEventListener("input", () => {
    applyPlayerSearch();
  });

  carouselButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const direction = index === 0 ? -1 : 1;
      featuredScroller?.scrollBy({ left: direction * 360, behavior: "smooth" });
    });
  });

  featuredModeButtons.forEach(button => {
    button.addEventListener("click", () => {
      setActive(featuredModeButtons, button);
      renderFeaturedMarkets(button.dataset.featuredMode);
    });
  });
}

function filterMatchRows(category) {
  document.querySelectorAll("#games-grid [data-market-category]").forEach(item => {
    const categories = item.dataset.marketCategory?.split(" ") || [];
    item.hidden = Boolean(category) && !categories.includes(category);
  });
}

function applyPlayerSearch() {
  const query = playerSearch?.value.trim().toLowerCase() || "";
  document.querySelectorAll("#player-market-list .player-prop-card").forEach(card => {
    card.hidden = query.length > 0 && !card.dataset.search.includes(query);
  });
}

function wireProfileMenu() {
  const profileButton = document.querySelector("[data-action='profile']");
  const dropdown = document.querySelector(".profile-dropdown");
  const imageInput = document.querySelector("[data-profile-image-input]");
  const copyWalletButton = document.querySelector("[data-action='copy-wallet']");

  profileButton?.addEventListener("click", event => {
    event.stopPropagation();
    dropdown.hidden = !dropdown.hidden;
  });

  imageInput?.addEventListener("change", event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      localStorage.setItem(PROFILE_IMAGE_KEY, reader.result);
      applyProfileImage(reader.result);
      showToast("Profile picture updated");
    });
    reader.readAsDataURL(file);
  });

  document.querySelectorAll("[data-profile-view]").forEach(button => {
    button.addEventListener("click", event => {
      event.stopPropagation();
      dropdown.hidden = true;
      if (button.dataset.profileView === "history") {
        openHistoryPage();
        return;
      }
      if (button.dataset.profileView === "support") {
        document.querySelector(".footer-socials")?.scrollIntoView({ behavior: "smooth", block: "center" });
        showToast("Scrolled to support socials");
        return;
      }
      if (button.dataset.profileView === "logout") {
        logOutWallet();
      }
    });
  });

  copyWalletButton?.addEventListener("click", async event => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(WALLET_ADDRESS);
      showToast("Wallet address copied");
    } catch {
      showToast("Copy unavailable in this browser");
    }
  });
}

function initializeProfileImage() {
  const savedProfileImage = localStorage.getItem(PROFILE_IMAGE_KEY);
  if (savedProfileImage) applyProfileImage(savedProfileImage);
}

function applyProfileImage(imageUrl) {
  document.querySelectorAll("[data-profile-avatar]").forEach(avatar => {
    avatar.replaceChildren();
    avatar.style.backgroundImage = `url("${imageUrl}")`;
  });
}

function wireOutsideClose() {
  document.addEventListener("click", event => {
    const profileDropdown = document.querySelector(".profile-dropdown");
    if (!event.target.closest(".profile-menu")) profileDropdown.hidden = true;

    const clickedTradeSlip = event.target.closest(".trade-slip");
    const clickedMarketPrice = event.target.closest(".price");
    const clickedProfileMenu = event.target.closest(".profile-menu");
    if (!clickedTradeSlip && !clickedMarketPrice && !clickedProfileMenu) {
      showTrade();
    }
  });
}

function logOutWallet() {
  state.connected = false;
  state.pendingTicket = null;
  document.querySelectorAll(".balance-pill").forEach(balance => (balance.hidden = true));
  document.querySelectorAll(".profile-menu").forEach(profile => {
    profile.hidden = true;
    profile.querySelector(".profile-dropdown")?.setAttribute("hidden", "");
  });
  document.querySelectorAll(".profile-wallet").forEach(wallet => (wallet.hidden = true));
  document.querySelectorAll("[data-action='connect']").forEach(connectButton => {
    connectButton.disabled = false;
    connectButton.textContent = "Connect Wallet";
    connectButton.hidden = false;
  });
  showTrade();
  showToast("Wallet logged out");
}

function wireFooterLinks() {
  document.querySelectorAll("[data-footer-action]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const action = link.dataset.footerAction;
      if (action === "markets") {
        document.querySelector(".top-sport-nav")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (action === "how") {
        document.querySelector(".hero-banner, .match-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
        showToast("Pick a match · choose a market · select YES or NO · confirm with wallet");
        return;
      }
      if (action === "wallet") {
        document.querySelector(".footer-socials")?.scrollIntoView({ behavior: "smooth", block: "center" });
        showToast("Connect an X Layer compatible wallet to trade");
        return;
      }
      if (action === "faq") {
        showToast("Markets settle on-chain · X Layer EVM compatible · no KYC required");
        return;
      }
      if (action === "terms") {
        showToast("Markets settle from official event data and on-chain contract rules");
        return;
      }
      if (action === "privacy") {
        showToast("Wallet addresses and trading activity are handled transparently on-chain");
        return;
      }
    });
  });
}

function wireSlipTabs() {
  document.querySelectorAll(".slip-tabs button").forEach(button => {
    button.addEventListener("click", () => {
      setActive(document.querySelectorAll(".slip-tabs button"), button);
      button.classList.contains("positions-tab") ? showPositions() : showTrade();
    });
  });
}

function wireSideToggle() {
  sideButtons.forEach(button => {
    button.addEventListener("click", () => {
      state.side = button.textContent.trim();
      if (state.pendingTicket) state.pendingTicket.side = state.side;
      setActive(sideButtons, button);
      showToast(`${state.side} side selected`);
    });
  });
}

function wireConnectButtons() {
  document.querySelectorAll("[data-action='connect']").forEach(button => {
    button.addEventListener("click", () => {
      if (state.connected) {
        showToast("Wallet already connected");
        return;
      }
      setConnectButtons("Connecting...", true);
      window.setTimeout(() => {
        state.connected = true;
        document.querySelectorAll(".balance-pill").forEach(balance => (balance.hidden = false));
        document.querySelectorAll(".profile-menu").forEach(profile => (profile.hidden = false));
        document.querySelectorAll(".profile-wallet").forEach(wallet => (wallet.hidden = false));
        document.querySelectorAll("[data-action='connect']").forEach(connectButton => {
          connectButton.textContent = connectButton.closest(".trade-slip") ? "Wallet Connected" : "Connect Wallet";
          connectButton.hidden = Boolean(connectButton.closest(".wallet-panel"));
        });
        setConnectButtons(null, false);
        showToast("Wallet connected. You can confirm positions now.");
      }, 520);
    });
  });
}

amountInput?.addEventListener("input", updateQuote);

function selectMarket(title, button) {
  const price = getPrice(button.textContent);
  if (!title || !price) return;
  const side = button.classList.contains("down") ? "NO" : "YES";
  state.price = price;
  state.side = side;
  state.pendingTicket = { title, side, price };
  document.querySelectorAll(".option-row, .player-prop-card").forEach(row => row.classList.remove("is-selected"));
  button.closest(".option-row, .player-prop-card")?.classList.add("is-selected");
  ticketTitle.textContent = title;
  quoteValues[0].textContent = `${price}¢`;
  setSideButton(state.side);
  updateQuote();
  showTrade();
  showToast("Ticket loaded in Trade. Confirm when ready.");
}

function setConnectButtons(label, disabled) {
  document.querySelectorAll("[data-action='connect']").forEach(connectButton => {
    if (label) connectButton.textContent = label;
    connectButton.disabled = disabled;
  });
}

function wireConfirmTrade() {
  confirmTradeButton?.addEventListener("click", () => {
    const pending = state.pendingTicket;
    if (!pending || !pending.title || !pending.price) {
      showToast("Choose a market price first");
      return;
    }
    const amount = getTradeAmount();
    addTicket({ ...pending, amount });
    state.pendingTicket = null;
    showPositions();
    updateQuote();
    showToast("Ticket confirmed and moved to My Positions");
  });
}

function showTrade() {
  setActive(document.querySelectorAll(".slip-tabs button"), document.querySelector(".slip-tabs button"));
  document.querySelector(".trade-view")?.classList.add("is-active");
  document.querySelector(".positions-view")?.classList.remove("is-active");
}

function showPositions() {
  const tabs = document.querySelectorAll(".slip-tabs button");
  setActive(tabs, tabs[1]);
  document.querySelector(".trade-view")?.classList.remove("is-active");
  document.querySelector(".positions-view")?.classList.add("is-active");
}

function setSideButton(side) {
  sideButtons.forEach(button => button.classList.toggle("is-active", button.textContent.trim() === side));
}

function setActive(items, activeItem) {
  items.forEach(item => item.classList.toggle("is-active", item === activeItem));
}

function getPrice(text) {
  const centMatch = text.match(/(\d+)¢/);
  if (centMatch) return Number(centMatch[1]);
  const decimalMatch = text.match(/(\d+\.\d+)/);
  return decimalMatch ? Math.max(1, Math.min(99, Math.round(100 / Number(decimalMatch[1])))) : null;
}

function updateQuote() {
  const amount = getTradeAmount();
  const shares = state.price > 0 ? amount / (state.price / 100) : 0;
  quoteValues[1].textContent = shares.toFixed(1);
  quoteValues[2].textContent = `$${shares.toFixed(2)}`;
}

function getTradeAmount() {
  return Number(amountInput?.value.replace(/[^\d.]/g, "")) || 0;
}

function addTicket({ title, side, price, amount }) {
  const existing = state.tickets.find(ticket => ticket.title === title && ticket.side === side);
  if (existing) {
    existing.price = price;
    existing.amount += amount;
    existing.updatedAt = new Date();
  } else {
    state.tickets.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title,
      side,
      price,
      amount,
      updatedAt: new Date(),
    });
  }
  renderTickets();
  updateTicketBadges();
}

function renderTickets() {
  if (!ticketStack) return;
  const activeTickets = getOpenTickets();

  if (activeTickets.length === 0) {
    ticketStack.innerHTML = `
      <div class="ticket-empty">
        <strong>No positions yet</strong>
      <span>Pick any YES or NO price to create a position.</span>
      </div>
    `;
    updateTicketBadges();
    return;
  }

  ticketStack.innerHTML = `
    <div class="position-tabs" aria-label="My positions">
      ${activeTickets.map((ticket, index) => ticketRow(ticket, index)).join("")}
    </div>
  `;
  ticketStack.querySelectorAll("[data-pnl-ticket]").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.pnlTicket);
      const ticket = activeTickets[index];
      openPnlCard({ ...ticket, pnl: getTicketPnl(ticket, index), index });
    });
  });
  updateTicketBadges();
}

function renderHistoryPage() {
  if (!historyColumns) return;
  const settled = getHistoryRows();
  const wins = settled.filter(item => item.pnl >= 0);
  const losses = settled.filter(item => item.pnl < 0);
  const net = settled.reduce((sum, item) => sum + item.pnl, 0);

  historyWinCount.textContent = wins.length;
  historyLossCount.textContent = losses.length;
  historyNetPnl.textContent = `${formatSigned(net)} USDT`;
  historyNetPnl.className = net >= 0 ? "is-profit" : "is-loss";
  historyColumns.innerHTML = `
    <article class="history-list">
      <h3>Wins</h3>
      ${wins.map(item => historyRow(item, settled.indexOf(item))).join("") || `<div class="ticket-empty"><strong>No wins yet</strong><span>Settled winning positions will show here.</span></div>`}
    </article>
    <article class="history-list">
      <h3>Losses</h3>
      ${losses.map(item => historyRow(item, settled.indexOf(item))).join("") || `<div class="ticket-empty"><strong>No losses yet</strong><span>Settled losing positions will show here.</span></div>`}
    </article>
  `;
  historyColumns.querySelectorAll("[data-history-pnl]").forEach(button => {
    button.addEventListener("click", () => {
      const ticket = settled[Number(button.dataset.historyPnl)];
      openPnlCard(ticket);
    });
  });
}

function getHistoryRows() {
  const rows = state.tickets.map((ticket, index) => ({
    ...ticket,
    pnl: estimatePnl(ticket, index),
    status: index % 2 === 0 ? "Settled win" : "Settled loss",
  }));

  if (rows.length > 0) return rows;

  return [
    { title: "Brazil to beat Spain", side: "YES", price: 47, amount: 100, pnl: 18, status: "Settled win" },
    { title: "Argentina vs France over 2.5 goals", side: "NO", price: 42, amount: 75, pnl: -6, status: "Settled loss" },
    { title: "USA moneyline", side: "YES", price: 54, amount: 120, pnl: 21.6, status: "Settled win" },
  ];
}

function historyRow(item, index) {
  return `
    <button class="ticket-card history-row" type="button" data-history-pnl="${index}">
      <div>
        <span class="ticket-side ${item.side.toLowerCase()}">${item.side}</span>
        <strong>${item.title}</strong>
        <small>${item.status} · ${item.price}¢ entry · ${item.amount.toFixed(0)} USDT</small>
      </div>
      <b class="${item.pnl >= 0 ? "is-profit" : "is-loss"}">${formatSigned(item.pnl)} USDT</b>
    </button>
  `;
}

function ticketRow(ticket, index) {
  const pnl = getTicketPnl(ticket, index);
  return `
    <button class="ticket-card" type="button" data-pnl-ticket="${index}">
      <div>
        <span class="ticket-side ${ticket.side.toLowerCase()}">${ticket.side}</span>
        <strong>${ticket.title}</strong>
        <small>${ticket.price}¢ entry · ${ticket.amount.toFixed(0)} USDT</small>
      </div>
      <b class="${pnl >= 0 ? "is-profit" : "is-loss"}">${formatSigned(pnl)}</b>
    </button>
  `;
}

function getOpenTickets() {
  return state.tickets;
}

function getTicketPnl(ticket, index) {
  return typeof ticket.pnl === "number" ? ticket.pnl : estimatePnl(ticket, index);
}

function updateTicketBadges() {
  const count = getOpenTickets().length;
  document.querySelectorAll("[data-ticket-count]").forEach(badge => {
    badge.textContent = count;
    badge.hidden = count === 0;
  });
  document.querySelectorAll(".floating-ticket-button[data-action='open-tickets']").forEach(button => {
    button.hidden = count === 0;
  });
}

function wirePnlModal() {
  document.querySelectorAll("[data-action='close-pnl']").forEach(button => {
    button.addEventListener("click", closePnlCard);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !pnlModal.hidden) closePnlCard();
  });
}

function openPnlCard(ticket) {
  if (!ticket || !pnlModal) return;
  const pnl = ticket.pnl ?? 0;
  const currentPrice = estimateCurrentPrice(ticket.price, pnl, ticket.amount, ticket.side);
  const shares = ticket.price > 0 ? ticket.amount / (ticket.price / 100) : 0;
  const payout = shares;
  document.querySelector("#share-pnl-status").textContent = pnl >= 0 ? "Winning position" : "Position down";
  document.querySelector("#share-pnl-title").textContent = ticket.title;
  document.querySelector("#share-pnl-amount").textContent = `${formatSigned(pnl)} USDT`;
  document.querySelector("#share-pnl-amount").className = `share-pnl-card__amount ${pnl >= 0 ? "is-profit" : "is-loss"}`;
  document.querySelector("#share-pnl-side").textContent = ticket.side;
  document.querySelector("#share-pnl-entry").textContent = `${ticket.price}¢`;
  document.querySelector("#share-pnl-stake").textContent = `${ticket.amount.toFixed(0)} USDT`;
  document.querySelector("#share-pnl-current").textContent = `${currentPrice}¢`;
  document.querySelector("#share-pnl-bar").style.width = `${Math.max(10, Math.min(100, currentPrice))}%`;
  const direction = pnl >= 0 ? "up" : "down";
  document.querySelector("#share-pnl-summary").innerHTML = `
    <strong>${ticket.side} moved ${direction} ${Math.abs(currentPrice - ticket.price)}¢.</strong>
    <span>${shares.toFixed(1)} shares · ${payout.toFixed(2)} USDT max payout.</span>
  `;
  pnlModal.hidden = false;
  document.body.classList.add("has-pnl-modal");
}

function closePnlCard() {
  pnlModal.hidden = true;
  document.body.classList.remove("has-pnl-modal");
}

function estimateCurrentPrice(entryPrice, pnl, amount, side) {
  if (!amount) return entryPrice;
  const movement = Math.round((Math.abs(pnl) / amount) * 100);
  const currentPrice = side === "YES" ? entryPrice + Math.sign(pnl) * movement : entryPrice - Math.sign(pnl) * movement;
  return Math.max(1, Math.min(99, currentPrice));
}

function getPnlTitleChips(title) {
  if (title.includes(" vs ")) {
    const [home, rest] = title.split(" vs ");
    return [home.trim(), rest.split(" to ")[0].trim()];
  }
  if (title.includes(" to ")) {
    const [team] = title.split(" to ");
    return [team.trim(), "World Cup"];
  }
  return ["World Cup", "Market"];
}

function estimatePnl(ticket, index) {
  const movement = index % 2 === 0 ? 0.18 : -0.08;
  const sideBoost = ticket.side === "YES" ? movement : -movement;
  return ticket.amount * sideBoost;
}

function formatSigned(value) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

function createToast() {
  const element = document.createElement("div");
  element.className = "toast";
  element.setAttribute("role", "status");
  document.body.appendChild(element);
  return element;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

window.XCupMarkets = { openMatchPage, showHome };
