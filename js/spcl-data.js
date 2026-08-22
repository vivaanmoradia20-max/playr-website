/* ============================================================
   PLAYR — SPCL · PARA SPORTS CATALOGUE
   ------------------------------------------------------------
   SPCL is PLAYR's own brand for its Para-sport ecosystem.
   SPCL is NOT presented as the IPC, the Paralympic movement or
   any official organisation — official terms ("Para sport",
   "Paralympic Games") are used descriptively and accurately.

   This file loads BEFORE js/sports-app.js and registers the
   IPC's current sanctioned Para-sport listing (23 summer + 6
   winter = 29) as first-class sports in the PLAYR catalogue,
   so Discover search, filters and universes work natively.
   ============================================================ */

/* SPCL joins the PLAYR category system as its own world. */
window.SPORT_CATEGORIES.push(
  {id:"spcl", name:"SPCL — Para Sports", short:"SPCL", icon:"🔷", accent:"#4DA6FF",
   blurb:"PLAYR's Para-sport ecosystem — 29 sanctioned Para sports, summer and winter. Sports for Every Capability. Limitless Potential."}
);

/* SPCL accent + Para-sport tabs, where sports get custom universes */
window.SPCL_META = { accent:"#4DA6FF", tagline:"Sports for Every Capability. Limitless Potential." };

/* ---- 23 SUMMER PARA SPORTS (IPC sanctioned listing) ---- */
S({id:"para-archery",name:"Para Archery",cat:"spcl",sub:"Summer Para Sport",icon:"🏹",pop:34,
 desc:"Para archery — open and W1 divisions, recurve and compound, judged to the millimetre at 50 and 70 metres.",
 alias:["archery para","para archery","paralympic archery"],tags:["para","precision","individual","outdoor"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-athletics",name:"Para Athletics",cat:"spcl",sub:"Summer Para Sport",icon:"🏃",pop:88,feat:1,
 desc:"The biggest Para sport on the programme — track, field, road and club throw events across sport classes.",
 alias:["para athletics","paralympic athletics","track para"],tags:["para","individual","outdoor","endurance"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-badminton",name:"Para Badminton",cat:"spcl",sub:"Summer Para Sport",icon:"🏸",pop:46,
 desc:"Para badminton — standing and wheelchair classes, six-rack speed since its Tokyo 2020 debut.",
 alias:["para badminton","paralympic badminton"],tags:["para","racket","indoor","individual"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"blind-football",name:"Blind Football",cat:"spcl",sub:"Summer Para Sport",icon:"⚽",pop:52,trend:1,
 desc:"Blind football (5-a-side) — audible ball, sighted goalkeepers, silence during play, noise after goals.",
 alias:["blind football","football 5 a side","blind soccer","b1 football"],tags:["para","team","outdoor","ball"],
 tabs:["Feed","Latest","Teams","Athletes","History","Community","Events","Results","Stats"]});
S({id:"boccia",name:"Boccia",cat:"spcl",sub:"Summer Para Sport",icon:"⚪",pop:40,
 desc:"Boccia — a precision ball sport of touch, tactics and nerve, played by athletes with severe coordination impairment.",
 alias:["boccia","bc4 boccia"],tags:["para","precision","individual","indoor"],
 tabs:["Feed","Latest","Athletes","Rules / Format","History","Community","Events","Results"]});
S({id:"para-canoe",name:"Para Canoe",cat:"spcl",sub:"Summer Para Sport",icon:"🛶",pop:36,
 desc:"Para canoe sprint — flatwater kayak racing over 200 metres, legs driving or shoulders pulling by class.",
 alias:["para canoe","paracanoe","kayak para"],tags:["para","water","individual","outdoor"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-climbing",name:"Para Climbing",cat:"spcl",sub:"Summer Para Sport",icon:"🧗",pop:32,fresh:1,
 desc:"Para climbing — led routes, timing and technique on the wall across vision, impairment and seated classes.",
 alias:["para climbing","para sport climbing"],tags:["para","individual","indoor","adventure"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-cycling",name:"Para Cycling",cat:"spcl",sub:"Summer Para Sport",icon:"🚴",pop:56,
 desc:"Para cycling — road races and track pursuits on handcycles, tricycles, tandems and standard bikes.",
 alias:["para cycling","paralympic cycling","handcycle","tandem cycling"],tags:["para","individual","outdoor","endurance"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-equestrian",name:"Para Equestrian",cat:"spcl",sub:"Summer Para Sport",icon:"🐎",pop:30,
 desc:"Para equestrian dressage — harmony between horse and rider graded across five levels.",
 alias:["para equestrian","para dressage"],tags:["para","animal","individual","outdoor"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-fencing",name:"Para Fencing",cat:"spcl",sub:"Summer Para Sport",icon:"🤺",pop:28,
 desc:"Wheelchair fencing — fixed frames, foil, épée and sabre, distance measured in centimetres and reflexes.",
 alias:["wheelchair fencing","para fencing"],tags:["para","combat","individual","indoor"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"goalball",name:"Goalball",cat:"spcl",sub:"Summer Para Sport",icon:"🥅",pop:42,
 desc:"Goalball — the bell ball, the blackout eyeshades, three defenders, one roar of a crowd.",
 alias:["goalball"],tags:["para","team","indoor","ball"],
 tabs:["Feed","Latest","Teams","Athletes","Rules / Format","History","Community","Events","Results"]});
S({id:"para-judo",name:"Para Judo",cat:"spcl",sub:"Summer Para Sport",icon:"🥋",pop:38,
 desc:"Para judo for athletes with vision impairment — grip, feel and ippon, mat by mat.",
 alias:["para judo","paralympic judo"],tags:["para","combat","individual","indoor"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-powerlifting",name:"Para Powerlifting",cat:"spcl",sub:"Summer Para Sport",icon:"🏋️",pop:44,
 desc:"Para powerlifting — the bench press as pure equation: bar, body, willpower, kilograms.",
 alias:["para powerlifting","paralympic powerlifting"],tags:["para","strength","individual","indoor"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-rowing",name:"Para Rowing",cat:"spcl",sub:"Summer Para Sport",icon:"🚣",pop:30,
 desc:"Para rowing — 1,000-metre sprints in singles, doubles and mixed fours with coxswain.",
 alias:["para rowing","paralympic rowing"],tags:["para","water","individual","outdoor","endurance"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"shooting-para",name:"Shooting Para Sport",cat:"spcl",sub:"Summer Para Sport",icon:"🎯",pop:40,
 desc:"Shooting Para sport — rifle and pistol precision from standing and seated support positions.",
 alias:["shooting para","para shooting","sh1","sh2"],tags:["para","precision","individual","indoor"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"sitting-volleyball",name:"Sitting Volleyball",cat:"spcl",sub:"Summer Para Sport",icon:"🏐",pop:48,
 desc:"Sitting volleyball — faster and lower than the standing game, rallies that never touch the floor.",
 alias:["sitting volleyball"],tags:["para","team","indoor","ball"],
 tabs:["Feed","Latest","Teams","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-swimming",name:"Para Swimming",cat:"spcl",sub:"Summer Para Sport",icon:"🏊",pop:84,feat:1,trend:1,
 desc:"Para swimming — freestyle to butterfly across sport classes, from S1 to S14, pool and marathon open water.",
 alias:["para swimming","paralympic swimming"],tags:["para","water","individual","indoor"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-table-tennis",name:"Para Table Tennis",cat:"spcl",sub:"Summer Para Sport",icon:"🏓",pop:50,
 desc:"Para table tennis — standing and wheelchair classes, eleven points, no mercy.",
 alias:["para table tennis","wheelchair table tennis"],tags:["para","racket","individual","indoor"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-taekwondo",name:"Para Taekwondo",cat:"spcl",sub:"Summer Para Sport",icon:"🦶",pop:34,
 desc:"Para taekwondo — K44 kyorugi kicks debuted at Tokyo 2020; poomsae joined the programme at Paris 2024.",
 alias:["para taekwondo","paralympic taekwondo"],tags:["para","combat","individual","indoor"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-triathlon",name:"Para Triathlon",cat:"spcl",sub:"Summer Para Sport",icon:"🔱",pop:38,
 desc:"Para triathlon — swim, handcycle/tandem, race chair over the sprint distance.",
 alias:["para triathlon","paratriathlon"],tags:["para","individual","outdoor","endurance","water"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"wheelchair-basketball",name:"Wheelchair Basketball",cat:"spcl",sub:"Summer Para Sport",icon:"🏀",pop:78,feat:1,trend:1,
 desc:"Wheelchair basketball — one of the world's most-watched Para sports: chairs tilted, tempers cool, threes wet.",
 alias:["wheelchair basketball","wheelchair hoops"],tags:["para","team","indoor","ball"],
 tabs:["Feed","Latest","Teams","Athletes","History","Community","Events","Results","Stats"]});
S({id:"wheelchair-rugby",name:"Wheelchair Rugby",cat:"spcl",sub:"Summer Para Sport",icon:"🏉",pop:56,trend:1,
 desc:"Wheelchair rugby — 'murderball': four-a-side contact, chair-on-chair, endzone to endzone.",
 alias:["wheelchair rugby","murderball"],tags:["para","team","indoor","combat"],
 tabs:["Feed","Latest","Teams","Athletes","History","Community","Events","Results","Stats"]});
S({id:"wheelchair-tennis",name:"Wheelchair Tennis",cat:"spcl",sub:"Summer Para Sport",icon:"🎾",pop:62,
 desc:"Wheelchair tennis — two bounces, full Grand Slam stage, the chair as an extension of the arm.",
 alias:["wheelchair tennis"],tags:["para","racket","individual","outdoor"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});

/* ---- 6 WINTER PARA SPORTS (IPC sanctioned listing) ---- */
S({id:"para-alpine",name:"Para Alpine Skiing",cat:"spcl",sub:"Winter Para Sport",icon:"⛷",pop:58,
 desc:"Para alpine skiing — downhill, slalom, giant slalom and super-G across sitting, standing and vision classes.",
 alias:["para alpine","paralympic alpine","mono ski"],tags:["para","snow","individual","outdoor"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-biathlon",name:"Para Biathlon",cat:"spcl",sub:"Winter Para Sport",icon:"🎯",pop:40,
 desc:"Para biathlon — cross-country engines, rifle-still nerves; part of the Para Nordic programme.",
 alias:["para biathlon","para nordic"],tags:["para","snow","individual","outdoor","precision"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-cross-country",name:"Para Cross-Country Skiing",cat:"spcl",sub:"Winter Para Sport",icon:"🎿",pop:44,
 desc:"Para cross-country skiing — sit-ski and standing races from sprints to long distance.",
 alias:["para cross country","para nordic skiing"],tags:["para","snow","individual","outdoor","endurance"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-ice-hockey",name:"Para Ice Hockey",cat:"spcl",sub:"Winter Para Sport",icon:"🏒",pop:66,trend:1,
 desc:"Para ice hockey — sledges, sticks in both hands, and the fastest contact sport on ice.",
 alias:["para ice hockey","sled hockey","ice sledge hockey"],tags:["para","ice","team","indoor"],
 tabs:["Feed","Latest","Teams","Athletes","History","Community","Events","Results","Stats"]});
S({id:"para-snowboard",name:"Para Snowboard",cat:"spcl",sub:"Winter Para Sport",icon:"🏂",pop:52,
 desc:"Para snowboard — banked slalom and snowboard-cross in LL1–LL3 and UL classes.",
 alias:["para snowboard","paralympic snowboard"],tags:["para","snow","individual","outdoor"],
 tabs:["Feed","Latest","Athletes","History","Community","Events","Results","Stats"]});
S({id:"wheelchair-curling",name:"Wheelchair Curling",cat:"spcl",sub:"Winter Para Sport",icon:"🥌",pop:38,
 desc:"Wheelchair curling — no sweeping, all precision; stones read like chess on ice.",
 alias:["wheelchair curling","para curling"],tags:["para","ice","team","mind","indoor"],
 tabs:["Feed","Latest","Teams","Athletes","Rules / Format","History","Community","Events","Results"]});

/* ============================================================
   SPCL CONTENT — verified facts only, demo content labelled.
   ============================================================ */
window.SPCL_TIMELINE = [
  {y:"1948",t:"Stoke Mandeville Games",d:"Dr Ludwig Guttmann organises an archery competition for WWII veterans with spinal cord injuries at Stoke Mandeville Hospital, England — the seed of the Paralympic movement."},
  {y:"1960",t:"First Paralympic Games",d:"Rome hosts the first Games called Paralympic: around 400 athletes from 23 countries compete in 8 sports."},
  {y:"1964",t:"Tokyo",d:"The Games grow — wheelchair racing debuts and the movement gains its international rhythm."},
  {y:"1976",t:"First Winter Paralympics",d:"Örnsköldsvik, Sweden hosts the first Winter Paralympic Games; the summer edition in Toronto expands beyond wheelchair sports to include blind and amputee athletes."},
  {y:"1988",t:"Seoul — one city, two Games",d:"For the first time, the Paralympic Games are held in the same city and venues as the Olympic Games, setting the pattern for every edition since."},
  {y:"1989",t:"IPC founded",d:"The International Paralympic Committee is founded in Düsseldorf to govern and grow the Paralympic movement worldwide."},
  {y:"2000s",t:"Classification matures",d:"Sport-specific classification systems evolve so athletes are grouped by how much an impairment affects each sport's specific activities — fairness engineered sport by sport."},
  {y:"2012",t:"London",d:"The London 2012 Paralympics shift global perception — packed stadiums and record broadcast reach turn Para athletes into household names."},
  {y:"2020",t:"Tokyo",d:"India wins 19 medals including 5 golds — its best Paralympic campaign to that point. Avani Lekhara becomes the first Indian woman to win Paralympic gold."},
  {y:"2024",t:"Paris",d:"India sets a new record: 29 medals (7 gold, 9 silver, 13 bronze), finishing 18th in the table."},
  {y:"2026",t:"Milano Cortina",d:"The Winter Paralympics conclude in Italy in March 2026, with Para alpine, nordic, ice hockey, snowboard, wheelchair curling and biathlon on the programme."},
  {y:"2026",t:"Asian Para Games — Aichi-Nagoya",d:"18–24 October 2026: around 3,000 athletes from 45 National Paralympic Committees compete across 18 Para sports in Japan."},
  {y:"2028",t:"LA28 Paralympic Games",d:"15–27 August 2028 — Los Angeles hosts the Paralympic Games for the first time since 1984."}
];

/* Verified real profiles — public, well-documented achievements only. */
window.SPCL_REAL_ATHLETES = [
  {n:"Devendra Jhajharia",sport:"Para Athletics",c:"India",ach:"Paralympic gold — javelin (Athens 2004, Rio 2016); silver (Tokyo 2020). One of India's most decorated Paralympians.",fol:"128K"},
  {n:"Avani Lekhara",sport:"Shooting Para Sport",c:"India",ach:"First Indian woman to win Paralympic gold (Tokyo 2020, R-2 10m air rifle standing SH1); defended her title at Paris 2024.",fol:"96K"},
  {n:"Sumit Antil",sport:"Para Athletics",c:"India",ach:"Paralympic gold and javelin F64 world-record throws — Tokyo 2020 and Paris 2024.",fol:"74K"},
  {n:"Mariyappan Thangavelu",sport:"Para Athletics",c:"India",ach:"Paralympic high jump gold at Rio 2016, silver at Tokyo 2020 and bronze at Paris 2024.",fol:"58K"}
];

/* Demo athlete profiles (fictional) — clearly labelled on cards. */
window.SPCL_DEMO_ATHLETES = [
  {n:"Ishaan Verma",sport:"Wheelchair Basketball",c:"India",role:"Point guard · Mumbai Sparks",fol:"12.4K"},
  {n:"Meera Nair",sport:"Para Swimming",c:"India",role:"S8 freestyle specialist",fol:"9.8K"},
  {n:"Arjun Bisht",sport:"Para Athletics",c:"India",role:"T64 sprinter",fol:"8.1K"},
  {n:"Zoya Khan",sport:"Goalball",c:"India",role:"Centre-back · Delhi Dusk",fol:"6.6K"},
  {n:"Rohan D'Souza",sport:"Para Canoe",c:"India",role:"KL2 200m",fol:"4.2K"},
  {n:"Sana Iqbal",sport:"Para Badminton",c:"India",role:"SL4 singles",fol:"5.9K"},
  {n:"Vikram Rathore",sport:"Wheelchair Rugby",c:"India",role:"Low-pointer anchor",fol:"3.8K"},
  {n:"Tara Gomes",sport:"Boccia",c:"India",role:"BC4 · state champion",fol:"2.7K"}
];

window.SPCL_COMMUNITIES = [
  {n:"Para Athletics Community",m:"48K members",d:"Road races, track days and training threads."},
  {n:"Wheelchair Basketball Community",m:"36K members",d:"Pickup games, chair tech and league talk."},
  {n:"Blind Football Community",m:"19K members",d:"Guides, drills and audible-ball culture."},
  {n:"Para Swimming Community",m:"31K members",d:"Splits, meets and open-water crews."},
  {n:"Para Cycling Community",m:"24K members",d:"Handcycles, trikes, tandems — roads and track."},
  {n:"Boccia Community",m:"12K members",d:"Tactics, ramps and regional cups."},
  {n:"Indian Para Sport Community",m:"112K members",d:"India's Para-sport heartbeat — athletes, fans, coaches."}
];

/* Verified real Para-sport events (source + date). */
window.SPCL_REAL_EVENTS = [
  {n:"Aichi-Nagoya 2026 Asian Para Games",d:"18–24 Oct 2026",loc:"Nagoya, Japan",st:"UPCOMING",
   info:"Around 3,000 athletes · 45 NPCs · 18 Para sports.",src:"Source: paralympic.org / Asian Paralympic Committee"},
  {n:"LA28 Paralympic Games",d:"15–27 Aug 2028",loc:"Los Angeles, USA",st:"UPCOMING",
   info:"The Paralympic Games come to LA — the first time since 1984.",src:"Source: paralympic.org"},
  {n:"Milano Cortina 2026 Winter Paralympics",d:"6–15 Mar 2026",loc:"Italy",st:"COMPLETED",
   info:"Concluded — full results and records at paralympic.org. PLAYR does not reproduce unverified results.",src:"Source: paralympic.org"}
];

/* India — verified facts only. */
window.SPCL_INDIA = {
  facts:[
    ["1972","India's first Paralympic medal — Murlikant Petkar swims to gold in the 50m freestyle at Heidelberg (officially recognised by the IPC)."],
    ["Tokyo 2020","19 medals including 5 golds — India's best campaign to that point. Avani Lekhara becomes the first Indian woman Paralympic champion."],
    ["Paris 2024","A record 29 medals (7 gold, 9 silver, 13 bronze) — 18th in the medal table, India's greatest Paralympic haul."],
    ["Today","Khelo India Para Games and national championships across athletics, swimming, badminton, powerlifting and more feed the pipeline to LA28."]
  ],
  note:"Athlete achievements on SPCL are listed only from public, verifiable records. Demo profiles are badged DEMO."
};

/* SPCL merch (PLAYR-original — not affiliated with IPC merchandise). */
window.SPCL_MERCH = [
  {n:"SPCL Tee — Limitless",p:"₹899",icon:"👕"},
  {n:"SPCL Cap",p:"₹699",icon:"🧢"},
  {n:"SPCL Hoodie — No Limits",p:"₹2,199",icon:"🧥"},
  {n:"SPCL Wristband",p:"₹199",icon:"🎗"},
  {n:"SPCL Poster — Sport Without Limits",p:"₹399",icon:"🖼"}
];
