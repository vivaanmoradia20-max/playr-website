/* ============================================================
   PLAYR — EVENTS DATABASE (India · Mumbai-first)
   ------------------------------------------------------------
   STRUCTURE (matches the PLAYR events schema — see
   docs/events-schema.md for the Supabase/SQL version):

   EV_VENUES   : real, well-known venues & areas (no invented
                 addresses; coordinates are approximate public
                 locations for the distance feature).
   EV_ORGANIZERS: organizer profiles (verified / demo).
   EV_EVENTS   : the event catalogue.

   DATA ACCURACY RULES BUILT IN:
   - verify:"verified"/"official"  → real event, carries `src`
     (source/organizer) + `updated` (last-updated date). Dates,
     venues and prices only included when confirmed.
   - verify:"demo"                → prototype sample event.
     Every demo event is badged DEMO on cards and pages.
   - Demo event dates are RELATIVE (d = days from today) so the
     prototype stays current; they are not real listings.
   ============================================================ */

window.EV_VENUES = {
  /* ---- Mumbai: South ---- */
  "wankhede":{n:"Wankhede Stadium",area:"Marine Drive",zone:"South Mumbai",city:"Mumbai",lat:18.939,lng:72.826,indoor:false},
  "azad-maidan":{n:"Azad Maidan",area:"Fort",zone:"South Mumbai",city:"Mumbai",lat:18.935,lng:72.831,indoor:false},
  "cooperage":{n:"Cooperage Football Ground (Mumbai Football Arena)",area:"Colaba / Fort",zone:"South Mumbai",city:"Mumbai",lat:18.926,lng:72.833,indoor:false},
  "brabourne":{n:"Brabourne Stadium",area:"Churchgate",zone:"South Mumbai",city:"Mumbai",lat:18.933,lng:72.825,indoor:false},
  "cross-maidan":{n:"Cross Maidan",area:"Mahalaxmi",zone:"South Mumbai",city:"Mumbai",lat:18.981,lng:72.819,indoor:false},
  "chowpatty":{n:"Girgaon Chowpatty",area:"Girgaon",zone:"South Mumbai",city:"Mumbai",lat:18.955,lng:72.815,indoor:false},
  "nehru-centre":{n:"Nehru Centre",area:"Worli",zone:"South Mumbai",city:"Mumbai",lat:19.003,lng:72.816,indoor:true},
  "nsci":{n:"NSCI Dome, Worli",area:"Worli",zone:"South Mumbai",city:"Mumbai",lat:19.004,lng:72.819,indoor:true},
  "racecourse":{n:"Mahalaxmi Racecourse",area:"Mahalaxmi",zone:"South Mumbai",city:"Mumbai",lat:18.982,lng:72.813,indoor:false},
  /* ---- Mumbai: Central / West ---- */
  "shivaji-park":{n:"Shivaji Park",area:"Dadar",zone:"Central Mumbai",city:"Mumbai",lat:19.018,lng:72.844,indoor:false},
  "mmrda":{n:"MMRDA Grounds, BKC",area:"BKC",zone:"Central Mumbai",city:"Mumbai",lat:19.066,lng:72.870,indoor:false},
  "mig":{n:"MIG Club",area:"Bandra East",zone:"Western Suburbs",city:"Mumbai",lat:19.063,lng:72.860,indoor:true},
  "khar-gym":{n:"Khar Gymkhana",area:"Khar",zone:"Western Suburbs",city:"Mumbai",lat:19.076,lng:72.838,indoor:true},
  "andheri-complex":{n:"Andheri Sports Complex",area:"Andheri West",zone:"Western Suburbs",city:"Mumbai",lat:19.114,lng:72.870,indoor:true},
  "juhu-beach":{n:"Juhu Beach",area:"Juhu",zone:"Western Suburbs",city:"Mumbai",lat:19.100,lng:72.827,indoor:false},
  "powai-lake":{n:"Powai Lake Promenade",area:"Powai",zone:"Central Mumbai",city:"Mumbai",lat:19.118,lng:72.906,indoor:false},
  "iit-bombay":{n:"IIT Bombay Campus",area:"Powai",zone:"Central Mumbai",city:"Mumbai",lat:19.133,lng:72.916,indoor:false},
  "aarey":{n:"Aarey Colony",area:"Aarey (Goregaon)",zone:"Western Suburbs",city:"Mumbai",lat:19.168,lng:72.866,indoor:false},
  "sgnp":{n:"Sanjay Gandhi National Park",area:"Borivali East",zone:"Western Suburbs",city:"Mumbai",lat:19.220,lng:72.915,indoor:false},
  "bpgc":{n:"Bombay Presidency Golf Club",area:"Chembur",zone:"Eastern Suburbs",city:"Mumbai",lat:19.058,lng:72.893,indoor:false},
  /* ---- Navi Mumbai & Thane ---- */
  "dy-patil":{n:"DY Patil Stadium",area:"Nerul",zone:"Navi Mumbai",city:"Navi Mumbai",lat:19.032,lng:73.020,indoor:false},
  "palm-beach":{n:"Palm Beach Road",area:"Vashi",zone:"Navi Mumbai",city:"Navi Mumbai",lat:19.059,lng:72.999,indoor:false},
  "kharghar-park":{n:"Central Park, Kharghar",area:"Kharghar",zone:"Navi Mumbai",city:"Navi Mumbai",lat:19.031,lng:73.073,indoor:false},
  "upvan":{n:"Upvan Lake",area:"Thane",zone:"Thane",city:"Thane",lat:19.222,lng:72.977,indoor:false},
  "yeoor":{n:"Yeoor Hills",area:"Thane",zone:"Thane",city:"Thane",lat:19.247,lng:72.957,indoor:false},
  /* ---- Maharashtra ---- */
  "balewadi":{n:"Shree Shiv Chhatrapati Sports Complex, Balewadi",area:"Balewadi",zone:"Maharashtra",city:"Pune",lat:18.559,lng:73.772,indoor:true},
  "khasbag":{n:"Khasbag Maidan",area:"Kolhapur",zone:"Maharashtra",city:"Kolhapur",lat:16.706,lng:74.233,indoor:false},
  "lonavala":{n:"Rajmachi Trailhead, Lonavala",area:"Lonavala",zone:"Maharashtra",city:"Lonavala",lat:18.755,lng:73.409,indoor:false},
  /* ---- India ---- */
  "jlnc-delhi":{n:"Jawaharlal Nehru Stadium",area:"Pragati Vihar",zone:"Delhi",city:"New Delhi",lat:28.580,lng:77.234,indoor:false},
  "modi-stadium":{n:"Narendra Modi Stadium",area:"Motera",zone:"Ahmedabad",city:"Ahmedabad",lat:23.094,lng:72.589,indoor:false},
  "kanteerava":{n:"Sree Kanteerava Stadium",area:"Sampangi Rama Nagar",zone:"Bengaluru",city:"Bengaluru",lat:12.974,lng:77.593,indoor:false},
  "salt-lake":{n:"Vivekananda Yuba Bharati Krirangan (Salt Lake)",area:"Salt Lake",zone:"Kolkata",city:"Kolkata",lat:22.688,lng:88.405,indoor:false},
  "gopichand":{n:"Pullela Gopichand Academy",area:"Gachibowli",zone:"Hyderabad",city:"Hyderabad",lat:17.445,lng:78.348,indoor:true},
  "sdat":{n:"SDAT Tennis Stadium",area:"Nungambakkam",zone:"Chennai",city:"Chennai",lat:13.066,lng:80.241,indoor:true},
  "kalinga":{n:"Kalinga Stadium",area:"Bhubaneswar",zone:"Odisha",city:"Bhubaneswar",lat:20.287,lng:85.821,indoor:false},
  "ekana":{n:"Ekana Cricket Stadium",area:"Gomti Nagar",zone:"Lucknow",city:"Lucknow",lat:26.847,lng:81.021,indoor:false},
  "tau-devi-lal":{n:"Tau Devi Lal Sports Complex",area:"Sector 38",zone:"Gurugram",city:"Gurugram",lat:28.423,lng:77.041,indoor:true},
  "fatorda":{n:"PJN Stadium, Fatorda",area:"Margao",zone:"Goa",city:"Goa",lat:15.297,lng:73.912,indoor:false},
  "calangute":{n:"Calangute Beach",area:"Calangute",zone:"Goa",city:"Goa",lat:15.541,lng:73.753,indoor:false},
  "sarusajai":{n:"Indira Gandhi Athletic Stadium",area:"Sarusajai",zone:"Guwahati",city:"Guwahati",lat:26.140,lng:91.730,indoor:false},
  "sms":{n:"Sawai Mansingh Stadium",area:"Malviya Nagar",zone:"Jaipur",city:"Jaipur",lat:26.853,lng:75.807,indoor:false},
  "bic":{n:"Buddh International Circuit",area:"Greater Noida",zone:"Uttar Pradesh",city:"Greater Noida",lat:28.345,lng:77.536,indoor:false},
  "sector42":{n:"Sector 42 Sports Complex",area:"Sector 42",zone:"Chandigarh",city:"Chandigarh",lat:30.733,lng:76.766,indoor:true}
};

window.EV_ORGANIZERS = {
  /* Real organizers of the real events (public information). */
  "procam":{n:"Procam International",type:"Event Company",v:"verified",d:"India's leading sports management company — organisers of the Tata Mumbai Marathon and a family of big-city races.",sports:["Running"],fol:"1.2M"},
  "mashal":{n:"Mashal Sports",type:"League",v:"verified",d:"Organisers of the Pro Kabaddi League, India's kabaddi powerhouse league under the AKFI umbrella.",sports:["Kabaddi"],fol:"4.6M"},
  "isl":{n:"Indian Super League",type:"League",v:"verified",d:"India's top-flight football league — 14 clubs across the country, Sept to April.",sports:["Football"],fol:"8.9M"},
  "aiff":{n:"AIFF",type:"Federation",v:"verified",d:"The All India Football Federation — national governing body for football in India.",sports:["Football"],fol:"2.1M"},
  "iaf-afwa":{n:"Indian Air Force (Western Zone)",type:"Federation",v:"verified",d:"Services organisers of the Indian Air Force Half Marathon series.",sports:["Running"],fol:"168K"},
  "indiarunning":{n:"India Running (event listing)",type:"Listing Platform",v:"organizer",d:"India running event discovery platform — listings carry registration windows and prices from the organizer.",sports:["Running"],fol:"210K"},
  "paralympic-org":{n:"paralympic.org (official listing)",type:"Listing Platform",v:"verified",d:"The International Paralympic Committee's official platform — source for Paralympic Games and Para-sport competition information.",sports:["Multi-sport"],fol:"3.4M"},
  /* Demo organizers for clearly-labelled demo events. */
  "playr-events":{n:"PLAYR Community Events",type:"Community Organizer",v:"community",demo:1,d:"PLAYR's own community events arm — demo events created for this prototype.",sports:["Multi-sport"],fol:"412K"},
  "bkc-padel":{n:"BKC Padel Collective",type:"Sports Club",v:"organizer",demo:1,d:"Padel club and ladder based around Bandra-Kurla Complex.",sports:["Padel"],fol:"9.4K"},
  "mumbai-runners":{n:"Mumbai Runners Collective",type:"Community Organizer",v:"organizer",demo:1,d:"A community of 60,000+ Mumbai runners. Weekly runs, training and city races.",sports:["Running"],fol:"64K"},
  "andheri-aa":{n:"Andheri Sports Academy",type:"Academy",v:"organizer",demo:1,d:"Coaching and tournaments across badminton, squash, swimming and combat sports.",sports:["Badminton","Squash","Swimming"],fol:"18K"},
  "khar-ltc":{n:"Khar Tennis Circle",type:"Sports Club",v:"organizer",demo:1,d:"Tennis and pickleball community around Khar and Santacruz.",sports:["Tennis","Pickleball"],fol:"7.2K"},
  "shivaji-park-trust":{n:"Shivaji Park Sports Circle",type:"Community Organizer",v:"organizer",demo:1,d:"The soul of Mumbai sport — cricket, hockey, running and table tennis from Dadar's iconic maidan.",sports:["Cricket","Hockey","Table Tennis"],fol:"51K"},
  "collegiate-sports-in":{n:"Collegiate Sports India",type:"League",v:"organizer",demo:1,d:"Inter-college leagues across basketball, football, chess and esports.",sports:["Basketball","Football","Chess","Esports"],fol:"230K"},
  "thane-adventure":{n:"Thane Adventure Collective",type:"Community Organizer",v:"organizer",demo:1,d:"Treks, trails and outdoor education around Yeoor, Sanjay Gandhi National Park and the Sahyadris.",sports:["Trekking","Mountaineering"],fol:"26K"},
  "cyclists-mumbai":{n:"Cyclists of Mumbai",type:"Community Organizer",v:"organizer",demo:1,d:"City rides, dawn pedals and route culture across Mumbai and Navi Mumbai.",sports:["Cycling"],fol:"38K"},
  "mind-sports-in":{n:"Mind Sports India",type:"Event Company",v:"organizer",demo:1,d:"Chess, carrom and speedcubing tournaments across Indian cities.",sports:["Chess","Carrom","Speedcubing"],fol:"88K"},
  "wrestling-maha":{n:"Maharashtra Kusti Parivar",type:"Community Organizer",v:"organizer",demo:1,d:"Keeping Maharashtra's wrestling tradition alive — talims, meets and state events.",sports:["Wrestling"],fol:"12K"},
  "golf-bpgc":{n:"BPGC Members' Committee",type:"Sports Club",v:"organizer",demo:1,d:"Amateur golf at Chembur's classic Bombay Presidency Golf Club.",sports:["Golf"],fol:"3.1K"},
  "speed-bengaluru":{n:"Bengaluru Speed Club",type:"Sports Club",v:"organizer",demo:1,d:"Track nights, 10Ks and motorsport culture in Bengaluru.",sports:["Running","Motorsport"],fol:"15K"},
  "aquatics-maha":{n:"Maharashtra Aquatics Community",type:"Community Organizer",v:"organizer",demo:1,d:"Open-water and pool swimming events, always with certified safety cover.",sports:["Swimming"],fol:"9.8K"},
  "grit-combat":{n:"GRIT Combat Sports",type:"Academy",v:"organizer",demo:1,d:"Sanctioned amateur boxing, judo and MMA events with certified officials and medical cover.",sports:["Boxing","Judo","MMA"],fol:"22K"}
};

/* Builder: EV({...}) pushes an event. Dates: rel:{d,h,len} = days-from-today, start hour, duration hours.
   Real events: fixed ISO date strings ("2026-10-04T06:00:00+05:30"). */
window.__EV_RAW=[]; function EV(o){ window.__EV_RAW.push(o); }

/* ============================================================
   VERIFIED REAL EVENTS
   Names, dates, venues, prices only where confirmed by the
   listed source. Schedules shown only when published.
   ============================================================ */

EV({id:"tmm-2027",name:"Tata Mumbai Marathon 2027",sport:"running",level:"INTERNATIONAL",venue:"azad-maidan",org:"procam",
 date:"2027-01-17T05:00:00+05:30",dateEnd:"2027-01-17T13:30:00+05:30",len:8,
 price:{min:499,max:5000,note:"₹499–₹5,000 by category (Indians)"},reg:"open",regISO:"2026-11-05",
 regUrl:"https://tatamumbaimarathon.procam.in",verify:"verified",fol:"184K",type:"race",
 cats:["Full Marathon 42.2K","Half Marathon 21.1K","10K","Dream Run 5.9K","Senior Citizens","Champions with Disability"],
 age:"Open (12+ / 15+ / 18+ by category)",gender:"Open",team:false,prize:"World Athletics Gold Label road race — elite & amateur prize structure",
 desc:"India's flagship marathon. The 2026 edition finished at Azad Maidan after the iconic CSMT start; the 2027 race is set for 17 January with registration open until 5 November 2026.",
 sched:[["05:00","Full Marathon & Half Marathon start waves (as published for 2026; 2027 timings TBC by organizer)"],["06:00","10K start"],["07:05","Champions with Disability start"],["08:15","Dream Run start"],["13:30","Awards & finish-line festival"]],
 src:"Organizer: Procam International · tatamumbaimarathon.procam.in",updated:"Aug 2026",tags:["marathon","mumbai","running","road race"]});

EV({id:"iaf-hm-2026",name:"Sekhon Indian Air Force Half Marathon Mumbai 2026",sport:"running",level:"CITY",venue:"racecourse",org:"iaf-afwa",
 date:"2026-10-04T05:30:00+05:30",len:4,price:{min:750,note:"₹750 onwards"},
 reg:"open",regUrl:"https://www.indiarunning.com/city/Mumbai",verify:"verified",fol:"22K",type:"race",
 cats:["Half Marathon","10K","5K"],age:"Open 18+ (HM) / 15+ (shorter)",gender:"Open",team:false,
 desc:"The Indian Air Force Half Marathon returns to Mumbai on 4 October 2026. Registrations are open — ₹750 onwards.",
 sched:null,src:"Listed on India Running (indiarunning.com) · Organizer: Indian Air Force",updated:"Aug 2026",tags:["running","mumbai","half marathon"]});

EV({id:"bnp-endurathon-2026",name:"BNP Endurathon 2026",sport:"running",level:"STATE",venue:"sgnp",org:"playr-events",
 date:"2026-10-04T06:00:00+05:30",len:5,price:{min:1750,note:"₹1,750 onwards"},
 reg:"open",regISO:"2026-09-07",regUrl:"https://racemart.in",verify:"verified",fol:"6.4K",type:"race",
 cats:["12.5K Trail","25K Trail"],age:"Open 18+",gender:"Open",team:false,
 desc:"Trail endurathon inside Sanjay Gandhi National Park, Borivali — 12.5K and 25K distances on 4 October 2026. Registration closes 7 September.",
 sched:null,src:"Listed on RaceMart · SGNP, Borivali",updated:"Aug 2026",tags:["running","trail","mumbai","borivali","national park"]});

EV({id:"kharghar-hm-2026",name:"Kharghar Half Marathon 2026",sport:"running",level:"CITY",venue:"kharghar-park",org:"mumbai-runners",
 date:"2026-10-24T05:45:00+05:30",dateEnd:"2026-10-25T11:00:00+05:30",len:5,price:{min:499,note:"₹499 onwards"},
 reg:"open",regUrl:"https://www.indiarunning.com/city/Mumbai",verify:"verified",fol:"9.1K",type:"race",
 cats:["Half Marathon","10K","5K","3K"],age:"Open",gender:"Open",team:false,
 desc:"Navi Mumbai's big race weekend at Central Park, Kharghar — 24–25 October 2026, with distances from 3K to the half marathon.",
 sched:null,src:"Listed on India Running (indiarunning.com)",updated:"Aug 2026",tags:["running","navi mumbai","kharghar","half marathon"]});

EV({id:"walkathon-juhu-2026",name:"Mumbai Ultra Walkathon 2.0",sport:"running",level:"COMMUNITY",venue:"juhu-beach",org:"playr-events",
 date:"2026-11-01T06:30:00+05:30",len:4,price:{min:999,note:"₹999 onwards"},
 reg:"open",regISO:"2026-10-25",regUrl:"https://racemart.in",verify:"verified",fol:"4.8K",type:"race",
 cats:["5K Walk","10K Walk","20K Walk"],age:"Open 12+",gender:"Open",team:false,
 desc:"A walkathon for everyone — 5K to 20K walking distances at Juhu on 1 November 2026. Registration closes 25 October.",
 sched:null,src:"Listed on RaceMart · Juhu, Mumbai",updated:"Aug 2026",tags:["walking","mumbai","juhu","walkathon","community"]});

EV({id:"bajaj-pune-marathon-2026",name:"Bajaj Pune Marathon 2026",sport:"running",level:"STATE",venue:"balewadi",org:"playr-events",
 date:"2026-12-13T05:30:00+05:30",len:7,price:{min:400,note:"₹400 onwards"},
 reg:"open",regISO:"2026-12-04",regUrl:"https://www.indiarunning.com",verify:"verified",fol:"31K",type:"race",
 cats:["Full Marathon","Half Marathon","10K","5K"],age:"Open 18+ (M/HM)",gender:"Open",team:false,
 desc:"Maharashtra's flagship Pune marathon returns on 13 December 2026 from the Balewadi sports complex — ₹400 onwards.",
 sched:null,src:"Listed on India Running (indiarunning.com)",updated:"Aug 2026",tags:["running","pune","maharashtra","marathon"]});

EV({id:"baramati-2026",name:"Baramati Power Marathon 2026",sport:"running",level:"STATE",org:"indiarunning",venue:null,loc:{city:"Baramati",area:"Baramati",zone:"Maharashtra"},
 date:"2026-11-28T06:00:00+05:30",dateEnd:"2026-11-29T12:00:00+05:30",len:6,price:{min:499,note:"₹499 onwards"},
 reg:"open",regISO:"2026-11-22",regUrl:"https://www.indiarunning.com",verify:"verified",fol:"5.5K",type:"race",
 cats:["Full Marathon","Half Marathon","10K","5K"],age:"Open",gender:"Open",team:false,
 desc:"Two-day running festival in Baramati (Pune district) on 28–29 November 2026 — ₹499 onwards.",
 sched:null,src:"Listed on India Running (indiarunning.com)",updated:"Aug 2026",tags:["running","maharashtra","baramati"]});

EV({id:"isl-2026-27",name:"Indian Super League 2026-27 Season",sport:"football",level:"NATIONAL",org:"isl",venue:null,loc:{city:"14 cities pan-India",area:"Multi-city",zone:"India"},
 date:"2026-09-01T19:30:00+05:30",dateEnd:"2027-04-11T22:00:00+05:30",len:999,
 price:{min:200,note:"Matchday tickets vary by club"},reg:null,regUrl:"https://www.indiansuperleague.com",verify:"official",fol:"2.4M",type:"league",
 cats:["League phase","Play-offs","Final"],age:"All ages",gender:"Men's league",team:true,
 desc:"India's top-flight football league is scheduled to run 1 September 2026 – 11 April 2027 per AIFF's tentative 2026-27 calendar — a full seven-month season with Mumbai City FC among the 14 clubs.",
 sched:null,src:"AIFF tentative 2026-27 calendar (reported Jun 2026). Dates subject to confirmation.",updated:"Aug 2026",tags:["football","isl","league","india","mumbai city fc"]});

EV({id:"santosh-trophy-2026",name:"Senior Men's National Football Championship (Santosh Trophy) 2026-27",sport:"football",level:"NATIONAL",org:"aiff",venue:null,loc:{city:"Venues TBC",area:"Multi-state",zone:"India"},
 date:"2026-11-19T15:00:00+05:30",dateEnd:"2027-01-17T21:00:00+05:30",len:999,
 price:null,reg:null,verify:"official",fol:"196K",type:"tournament",
 cats:["Group stage","Knockouts","Final"],age:"Senior state teams",gender:"Men",team:true,
 desc:"Indian football's historic national championship — state federations battle for the Santosh Trophy from 19 November 2026 to 17 January 2027 (AIFF tentative calendar; venues to be confirmed).",
 sched:null,src:"AIFF tentative 2026-27 calendar",updated:"Aug 2026",tags:["football","santosh trophy","national","india"]});

EV({id:"pkl-s13",name:"Pro Kabaddi League — Season 13",sport:"kabaddi",level:"NATIONAL",org:"mashal",venue:null,loc:{city:"Host cities TBA",area:"Multi-city",zone:"India"},
 date:"2026-12-15T20:00:00+05:30",dateEnd:"2027-02-28T22:00:00+05:30",len:999,
 price:{min:300,note:"Tickets TBA"},reg:null,regUrl:"https://www.prokabaddi.com",verify:"official",fol:"6.8M",type:"league",
 cats:["League phase","Play-offs","Final"],age:"All ages",gender:"Men's league",team:true,
 desc:"PKL Season 13 is expected from mid-December 2026 to February 2027, with the player auction reported for mid-October. The official fixture list is not announced yet — venues and dates will follow from Mashal Sports.",
 sched:null,src:"Mashal Sports / league reports (Jul 2026). Schedule not yet announced.",updated:"Aug 2026",tags:["kabaddi","pkl","league","india"]});

EV({id:"wesness-sundowner-2026",name:"Wesness Sundowner Mumbai 2026",sport:"running",level:"COMMUNITY",org:"indiarunning",venue:null,loc:{city:"Mumbai",area:"Mumbai",zone:"Central Mumbai"},
 date:"2026-09-04T17:30:00+05:30",len:3,price:{min:1599,note:"₹1,599 onwards"},
 reg:"open",regISO:"2026-08-30",regUrl:"https://www.indiarunning.com/city/Mumbai",verify:"verified",fol:"3.2K",type:"race",
 cats:["3K Sundowner"],age:"Open",gender:"Open",team:false,
 desc:"An evening 3K sundowner run through Mumbai on 4 September 2026. Registration closes 30 August.",
 sched:null,src:"Listed on India Running (indiarunning.com)",updated:"Aug 2026",tags:["running","mumbai","sundowner"]});

/* ============================================================
   DEMO EVENTS — MUMBAI (prototype samples, clearly badged DEMO)
   ============================================================ */

/* ---- Running ---- */
EV({id:"mumbai-half-demo",name:"Mumbai Half Marathon (Demo)",sport:"running",level:"CITY",venue:"mmrda",org:"mumbai-runners",
 rel:{d:8,h:5,len:7},price:{min:899,note:"₹899 onwards"},reg:"open",regDays:5,verify:"demo",fol:"48K",type:"race",
 cats:["5K","10K","21.1K"],age:"Open 15+ / 18+ for HM",gender:"Open",team:false,prize:"₹3L prize pool (demo)",
 desc:"The city's demo half marathon — flat BKC start, sea-link views, 18,000 runners. Prototype event for the PLAYR event experience.",
 sched:[["04:30","Bib & chip collection closes"],["05:00","Warm-up zone opens"],["05:40","Half Marathon wave start"],["06:00","10K start"],["06:20","5K start"],["09:00","Course cut-off (HM)"],["09:30","Awards ceremony"]],
 tags:["running","mumbai","bkc","half marathon"]});
EV({id:"md-sunrise-10k-demo",name:"Marine Drive Sunrise 10K (Demo)",sport:"running",level:"COMMUNITY",venue:"racecourse",org:"mumbai-runners",
 rel:{d:2,h:6,len:3},price:{min:499,note:"₹499"},reg:"open",regDays:1,verify:"demo",fol:"11K",type:"race",
 cats:["5K","10K"],age:"Open 12+",gender:"Open",team:false,
 desc:"Queen's Necklace at dawn — a demo community 10K along Marine Drive with a finish-line chai stop.",
 sched:[["05:30","Check-in & bib pickup"],["06:00","10K start"],["06:15","5K start"],["07:30","Breakpoint close"],["08:00","Awards & photos"]],
 tags:["running","mumbai","marine drive","10k"]});
EV({id:"aarey-charity-5k-demo",name:"Aarey Monsoon Charity 5K (Demo)",sport:"running",level:"COMMUNITY",venue:"aarey",org:"playr-events",
 rel:{d:5,h:7,len:3},price:null,reg:"open",regDays:3,verify:"demo",fol:"7.6K",type:"race",
 cats:["5K Charity Run","2K Family Walk"],age:"All ages",gender:"Open",team:false,prize:"All proceeds to city green-belt NGOs (demo)",
 desc:"A free demo charity run through Aarey's green corridors — bring old shoes to donate at the gate.",
 sched:[["06:15","Check-in"],["07:00","5K start"],["07:15","2K family walk"],["08:15","Donation drive & community breakfast"]],
 tags:["running","charity","aarey","free"]});
EV({id:"powai-night-demo",name:"Powai Lake Loop Night Run (Demo)",sport:"running",level:"CITY",venue:"powai-lake",org:"mumbai-runners",
 rel:{d:12,h:19,len:3},price:{min:599,note:"₹599"},reg:"open",regDays:8,verify:"demo",fol:"14K",type:"race",
 cats:["5K","10K"],age:"Open 15+",gender:"Open",team:false,
 desc:"Reflectors on, city lights out — a demo 10K under the Hiranandani skyline.",
 sched:[["18:00","Bib collection"],["18:45","Safety briefing (mandatory)"],["19:15","10K start"],["19:30","5K start"],["21:00","Awards"]],
 tags:["running","mumbai","powai","night"]});
EV({id:"shivaji-time-trials-demo",name:"Shivaji Park Time Trials (Demo)",sport:"athletics",level:"CLUB",venue:"shivaji-park",org:"shivaji-park-trust",
 rel:{d:4,h:6,len:3},price:null,reg:"open",regDays:2,verify:"demo",fol:"3.4K",type:"race",
 cats:["400m","800m","1 mile"],age:"Open + 40+ masters",gender:"Open",team:false,
 desc:"Weekly demo track trials on the outer lane of Dadar's most famous maidan — pacers, stopwatch culture, chai after.",
 sched:[["05:45","Reporting"],["06:00","400m heats"],["06:30","800m"],["07:00","1 mile"],["07:45","Masters 800m"],["08:00","Results"]],
 tags:["athletics","running","mumbai","dadar","free"]});
EV({id:"borivali-junior-3k-demo",name:"Borivali Junior 3K (Demo)",sport:"running",level:"SCHOOL",venue:"sgnp",org:"playr-events",
 rel:{d:15,h:7,len:2},price:null,reg:"open",regDays:10,verify:"demo",fol:"5.2K",type:"race",
 cats:["U-12 1.5K","U-14 3K","U-17 3K"],age:"School age groups",gender:"Open",team:false,
 desc:"A demo schools' run at the SGNP gate loop — every finisher gets a certificate and a tree sapling.",
 sched:[["06:30","School check-in"],["07:00","U-12 1.5K"],["07:20","U-14 3K"],["07:45","U-17 3K"],["08:30","Awards"]],
 tags:["running","school","junior","borivali","free"]});
EV({id:"mumbai-ultra-relay-demo",name:"Mumbai Ultra Relay 100K (Demo)",sport:"running",level:"CITY",venue:"racecourse",org:"mumbai-runners",
 rel:{d:30,h:5,len:12},price:{min:1200,note:"₹1,200 per team of 5"},reg:"open",regDays:20,verify:"demo",fol:"8.8K",type:"race",
 cats:["100K Relay (5 × 20K)"],age:"Open 18+",gender:"Open / Women's / Mixed",team:true,
 desc:"Teams of five, 20K each, sea-face start and finish — a demo ultra relay built for club rivalry.",
 sched:[["04:00","Team check-in"],["05:00","Leg 1 off"],["11:00","Leg exchanges 2–4"],["16:00","Final legs & finish"],["17:30","Awards & club points"]],
 tags:["running","relay","ultra","mumbai","team"]});

/* ---- Racket ---- */
EV({id:"bkc-padel-open-demo",name:"BKC Padel Saturday Open (Demo)",sport:"padel",level:"CITY",venue:"mmrda",org:"bkc-padel",
 rel:{d:3,h:17,len:5},price:{min:1200,note:"₹1,200 per pair"},reg:"open",regDays:1,verify:"demo",fol:"6.1K",type:"tournament",
 cats:["Men's Doubles","Women's Doubles","Mixed Doubles"],age:"Open 16+",gender:"Open",team:true,prize:"Winners get season club passes (demo)",
 desc:"Evening padel under lights at BKC — demo knockout draws, guaranteeing every pair at least three matches.",
 sched:[["16:30","Check-in & warm-up"],["17:00","Round-robin begins"],["19:00","Quarter-finals"],["20:00","Semi-finals"],["21:00","Finals"],["21:45","Prizes"]],
 tags:["padel","racket","mumbai","bkc"]});
EV({id:"khar-tennis-ladder-demo",name:"Khar Gymkhana Tennis Ladder (Demo)",sport:"tennis",level:"CLUB",venue:"khar-gym",org:"khar-ltc",
 rel:{d:6,h:8,len:8},price:{min:600,note:"₹600 members / ₹900 guests"},reg:"open",regDays:4,verify:"demo",fol:"2.9K",type:"tournament",
 cats:["Open Singles","45+ Doubles"],age:"Open & veterans",gender:"Open",team:false,
 desc:"A demo club ladder weekend at Khar Gymkhana — fast4 sets, one-day completion, lunch included.",
 sched:[["08:00","Round 1"],["10:00","Round 2"],["12:30","Lunch break"],["13:30","Quarter-finals"],["15:30","Semi-finals"],["17:30","Final"]],
 tags:["tennis","racket","mumbai","khar","club"]});
EV({id:"andheri-pickleball-demo",name:"Andheri Pickleball Beginners Cup (Demo)",sport:"pickleball",level:"COMMUNITY",venue:"andheri-complex",org:"khar-ltc",
 rel:{d:9,h:9,len:6},price:{min:500,note:"₹500"},reg:"open",regDays:6,verify:"demo",fol:"4.4K",type:"tournament",
 cats:["Beginner Doubles","Improver Singles"],age:"16+ and 40+ brackets",gender:"Open",team:false,
 desc:"Never played a tournament? This demo cup is for you — paddles provided, coaching clinic before first serve.",
 sched:[["08:30","Rules & skills clinic"],["09:30","Pool matches"],["12:00","Knockouts"],["15:00","Finals"],["15:45","Community mixer"]],
 tags:["pickleball","racket","mumbai","andheri","beginners"]});
EV({id:"nsci-squash-night-demo",name:"NSCI Squash Club Night (Demo)",sport:"squash",level:"CLUB",venue:"nsci",org:"andheri-aa",
 rel:{d:5,h:19,len:4},price:{min:800,note:"₹800"},reg:"closed",regDays:-1,verify:"demo",fol:"2.2K",type:"tournament",
 cats:["Open","B Division"],age:"Open",gender:"Open",team:false,
 desc:"Glass-court demo night at NSCI Worli — registration for this one filled in 40 minutes.",
 sched:[["18:30","Round of 16"],["19:45","Quarter-finals"],["21:00","Semi-finals"],["22:00","Final"]],
 tags:["squash","racket","mumbai","worli","club"]});
EV({id:"asbad-badminton-demo",name:"Andheri Badminton Ranking Tournament (Demo)",sport:"badminton",level:"STATE",venue:"andheri-complex",org:"andheri-aa",
 rel:{d:11,h:9,len:9},price:{min:900,note:"₹900 singles / ₹1,400 doubles pair"},reg:"open",regDays:7,verify:"demo",fol:"9.7K",type:"tournament",
 cats:["Men's Singles","Women's Singles","Men's Doubles","Women's Doubles","Mixed Doubles","U-17"],age:"Open & junior",gender:"Open",team:false,
 desc:"A demo state-ranking badminton draw with certified umpires — three courts, two days, one champions' board.",
 sched:[["Day 1 09:00","Pool & early knockouts"],["Day 1 17:00","Quarter-finals"],["Day 2 09:00","Semi-finals"],["Day 2 14:00","Finals"],["Day 2 16:00","Ranking points ceremony"]],
 tags:["badminton","racket","mumbai","andheri","state"]});
EV({id:"shivaji-tt-demo",name:"Shivaji Park Table Tennis Classic (Demo)",sport:"table-tennis",level:"CITY",venue:"shivaji-park",org:"shivaji-park-trust",
 rel:{d:14,h:10,len:7},price:{min:400,note:"₹400"},reg:"open",regDays:9,verify:"demo",fol:"3.8K",type:"tournament",
 cats:["Open Singles","U-19","40+ Veterans"],age:"Open & veterans",gender:"Open",team:false,
 desc:"Eight tables, dadar ke dewaane — a demo city TT classic on the maidan's east edge hall.",
 sched:[["09:30","Group stage"],["12:30","Round of 16"],["14:30","Quarter-finals"],["16:00","Semi-finals"],["17:30","Final"]],
 tags:["table tennis","racket","mumbai","dadar"]});

/* ---- Team sports ---- */
EV({id:"monsoon-sixes-demo",name:"Monsoon Cricket Sixes (Demo)",sport:"cricket",level:"CITY",venue:"shivaji-park",org:"shivaji-park-trust",
 rel:{d:7,h:8,len:10},price:{min:2800,note:"₹2,800 per team of 8"},reg:"open",regDays:4,verify:"demo",fol:"21K",type:"tournament",
 cats:["Open (24 teams)","Corporate (16 teams)","Women's (8 teams)"],age:"Open 16+",gender:"Open & Women's",team:true,prize:"₹1L prize pool (demo)",
 desc:"Six overs, eight players, one legendary maidan — the demo monsoon sixes that Shivaji Park was built for.",
 sched:[["07:30","Team check-in & toss"],["08:00","Group matches"],["12:00","Lunch & plate semi-finals"],["14:00","Quarter-finals"],["16:00","Semi-finals"],["17:30","Finals"],["18:30","Awards & maidan chai"]],
 tags:["cricket","mumbai","dadar","sixes","team"]});
EV({id:"corporate-football-7s-demo",name:"Mumbai Corporate Football 7s (Demo)",sport:"football",level:"CITY",venue:"cooperage",org:"collegiate-sports-in",
 rel:{d:10,h:9,len:9},price:{min:4500,note:"₹4,500 per squad"},reg:"open",regDays:6,verify:"demo",fol:"13K",type:"tournament",
 cats:["Corporate Open","Women's Corporate"],age:"Open 18+",gender:"Open & Women's",team:true,
 desc:"Office bragging rights at the Cooperage turf — demo 7-a-side corporate cup with referees and medics.",
 sched:[["08:30","Squad check-in"],["09:00","Group stage"],["12:30","Quarter-finals"],["14:30","Semi-finals"],["16:30","Final"],["17:30","Trophy & best-player awards"]],
 tags:["football","mumbai","corporate","cooperage"]});
EV({id:"inter-college-basket-demo",name:"Mumbai Inter-College Basketball Championship (Demo)",sport:"basketball",level:"COLLEGE",venue:"nsci",org:"collegiate-sports-in",
 rel:{d:16,h:9,len:9},price:null,reg:"open",regDays:9,verify:"demo",fol:"34K",type:"tournament",
 cats:["Men's (32 colleges)","Women's (24 colleges)"],age:"College (enrolled students)",gender:"Open & Women's",team:true,
 desc:"The demo city collegiate championship — 56 colleges, one dome, campus rivalries renewed.",
 sched:[["Day 1–2","Group stage"],["Day 3","Pre-quarter & quarter-finals"],["Day 4 16:00","Semi-finals"],["Day 5 17:00","Final"],["Post-final","All-city five"]],
 tags:["basketball","college","mumbai","worli","free"]});
EV({id:"azad-gully-cup-demo",name:"Azad Maidan Gully Cricket Cup (Demo)",sport:"cricket",level:"COMMUNITY",venue:"azad-maidan",org:"playr-events",
 rel:{d:13,h:7,len:9},price:null,reg:"open",regDays:8,verify:"demo",fol:"17K",type:"tournament",
 cats:["Open (gully rules, tape-ball)"],age:"Open 14+",gender:"Open",team:true,
 desc:"Free tape-ball demo cup at Azad Maidan — gully rules, rubber ball, legendary catches.",
 sched:[["06:45","Team check-in"],["07:15","Group matches"],["11:30","Quarter-finals"],["14:00","Semi-finals"],["16:00","Final"]],
 tags:["cricket","gully","mumbai","fort","free","community"]});
EV({id:"school-hockey-demo",name:"Mumbai Schools Hockey Cup (Demo)",sport:"hockey",level:"SCHOOL",venue:"shivaji-park",org:"shivaji-park-trust",
 rel:{d:18,h:8,len:8},price:null,reg:"open",regDays:12,verify:"demo",fol:"6.6K",type:"tournament",
 cats:["U-14","U-17"],age:"School age groups",gender:"Boys & Girls divisions",team:true,
 desc:"Demo schools hockey on the maidan that raised Olympians — sticks and gum provided for teams that need them.",
 sched:[["07:30","Schools check-in"],["08:00","U-14 group games"],["10:30","U-17 group games"],["14:00","Semi-finals"],["16:00","Finals"]],
 tags:["hockey","school","mumbai","dadar","free"]});
EV({id:"cross-maidan-volley-demo",name:"Cross Maidan Volleyball Sundays (Demo)",sport:"volleyball",level:"COMMUNITY",venue:"cross-maidan",org:"playr-events",
 rel:{d:2,h:16,len:4},price:null,reg:"open",regDays:0,verify:"demo",fol:"4.1K",type:"meetup",
 cats:["Open pickup","Women's pool"],age:"All ages",gender:"Open",team:true,
 desc:"Sunday demo volleyball at Cross Maidan — nets up at 4 PM, everyone plays, nobody sits out.",
 sched:[["16:00","Nets up & warm-up"],["16:30","Pickup rotations"],["18:00","Captain's match"],["19:30","Nets down & photos"]],
 tags:["volleyball","community","mumbai","free","sunday"]});
EV({id:"vashi-fives-demo",name:"Vashi Football Fives (Demo)",sport:"football",level:"COMMUNITY",venue:"palm-beach",org:"collegiate-sports-in",
 rel:{d:8,h:18,len:4},price:{min:1500,note:"₹1,500 per team of 6"},reg:"open",regDays:5,verify:"demo",fol:"5.7K",type:"tournament",
 cats:["Open Fives","Women's Fives"],age:"Open 16+",gender:"Open & Women's",team:true,
 desc:"Floodlit five-a-side demo cup off Palm Beach Road — small goals, big mouthguards.",
 sched:[["17:30","Check-in"],["18:00","Group games"],["19:30","Knockouts"],["21:00","Final"],["21:30","Prizes"]],

 tags:["football","navi mumbai","vashi","fives"]});

EV({id:"mig-boxcricket-demo",name:"MIG Box Cricket Invitational (Demo)",sport:"cricket",level:"CLUB",venue:"mig",org:"playr-events",
 rel:{d:15,h:9,len:8},price:{min:2400,note:"₹2,400 per team of 6"},reg:"open",regDays:9,verify:"demo",fol:"5.9K",type:"tournament",
 cats:["Box cricket (24 teams)","Women's box cricket"],age:"Open 16+",gender:"Open & Women's",team:true,prize:"Club season passes (demo)",
 desc:"Demo box-cricket invitational inside the MIG grounds — net cricket, turf rules, Bandra's Sunday soundtrack.",
 sched:[["08:30","Team check-in"],["09:00","Group stage"],["12:30","Quarter-finals"],["15:00","Semi-finals"],["17:00","Final"],["18:00","Awards"]],
 tags:["cricket","bandra","box cricket","club"]});

/* ---- Mind sports ---- */
EV({id:"mumbai-rapid-chess-demo",name:"Mumbai Rapid Chess Open (Demo)",sport:"chess",level:"CITY",venue:"nehru-centre",org:"mind-sports-in",
 rel:{d:6,h:10,len:7},price:{min:500,note:"₹500 (₹250 juniors)"},reg:"open",regDays:3,verify:"demo",fol:"12K",type:"tournament",
 cats:["Open Rapid (15+10)","Junior U-14","Veterans 50+"],age:"Open & juniors",gender:"Open",team:false,prize:"₹1L prize fund (demo)",
 desc:"A demo nine-round rapid open at Nehru Centre — arbiter-run, FIDE-rated pairing software, analysis corner after every round.",
 sched:[["09:30","Reporting & board allotment"],["10:00","Rounds 1–3"],["13:00","Lunch"],["14:00","Rounds 4–6"],["17:00","Rounds 7–9"],["19:30","Prizes & blitz side-event"]],
 tags:["chess","mind","mumbai","worli","rapid"]});
EV({id:"mumbai-carrom-demo",name:"Mumbai Carrom Community League (Demo)",sport:"carrom",level:"COMMUNITY",venue:"shivaji-park",org:"mind-sports-in",
 rel:{d:17,h:17,len:4},price:null,reg:"open",regDays:12,verify:"demo",fol:"2.6K",type:"tournament",
 cats:["Singles","Doubles"],age:"All ages",gender:"Open",team:false,
 desc:"Demo carrom league night — powder provided, sledging complimentary, winner takes the board home for a week.",
 sched:[["17:00","Board allotment"],["17:30","Group matches"],["19:00","Knockouts"],["20:30","Final & prize"]],
 tags:["carrom","mind","mumbai","dadar","free","community"]});
EV({id:"powai-cubing-demo",name:"Powai Speedcubing Meet (Demo)",sport:"speedcubing",level:"COMMUNITY",venue:"powai-lake",org:"mind-sports-in",
 rel:{d:20,h:11,len:4},price:null,reg:"open",regDays:15,verify:"demo",fol:"1.9K",type:"meetup",
 cats:["3×3","2×2","Pyraminx","One-handed"],age:"All ages",gender:"Open",team:false,
 desc:"Demo cubing meetup by the lake — stackmats, scramblers and a beginners' corner for first-timers.",
 sched:[["11:00","Check-in & warm-up solves"],["11:30","Preliminary averages"],["13:30","Finals (top 8)"],["15:00","Casual relay & close"]],
 tags:["speedcubing","mind","mumbai","powai","free"]});
EV({id:"iit-chess-league-demo",name:"Inter-College Chess League Finals (Demo)",sport:"chess",level:"COLLEGE",venue:"iit-bombay",org:"collegiate-sports-in",
 rel:{d:21,h:9,len:8},price:null,reg:"open",regDays:14,verify:"demo",fol:"8.3K",type:"tournament",
 cats:["Team Rapid (4 boards)","Blitz side event"],age:"College students",gender:"Open",team:true,
 desc:"Demo college chess finals at IIT Bombay — four boards per tie, blitz playoffs if tied.",
 sched:[["09:00","Team check-in"],["09:30","Quarter-final ties"],["12:30","Semi-final ties"],["15:30","Final tie"],["17:30","Blitz open & awards"]],
 tags:["chess","college","powai","team","free"]});

/* ---- Combat (sanctioned, legit events only) ---- */
EV({id:"mumbai-amateur-boxing-demo",name:"Mumbai Amateur Boxing Cup (Demo)",sport:"boxing",level:"STATE",venue:"andheri-complex",org:"grit-combat",
 rel:{d:16,h:15,len:6},price:{min:700,note:"₹700 spectators free entry"},reg:"open",regDays:10,verify:"demo",fol:"9.2K",type:"tournament",
 cats:["Men's 51–75kg","Women's 50–66kg","Youth U-19"],age:"18+ (U-19 with guardian consent)",gender:"Open & Women's",team:false,
 desc:"A demo sanctioned amateur boxing card — certified referees, ringside physicians, headguards on, no exceptions.",
 sched:[["14:30","Weigh-in & medicals"],["15:30","Preliminary bouts"],["17:30","Semi-finals"],["19:30","Finals"],["20:30","Awards"]],
 note:"Combat events on PLAYR are sanctioned competitions only — no unsanctioned sparring or challenge mechanics.",
 tags:["boxing","combat","mumbai","andheri","sanctioned"]});
EV({id:"collegiate-judo-demo",name:"Collegiate Judo Open (Demo)",sport:"judo",level:"COLLEGE",venue:"andheri-complex",org:"grit-combat",
 rel:{d:22,h:9,len:7},price:null,reg:"open",regDays:16,verify:"demo",fol:"4.9K",type:"tournament",
 cats:["−60kg to +100kg","Women's −48kg to +78kg"],age:"College",gender:"Open & Women's",team:false,
 desc:"Demo collegiate judo open — IJF rules, matte calls, senseis officiating.",
 sched:[["08:30","Weigh-in"],["09:30","Pools"],["13:00","Quarter-finals"],["15:00","Semi-finals"],["16:30","Finals"]],
 tags:["judo","combat","college","mumbai","free"]});

/* ---- Cycling ---- */
EV({id:"aarey-dawn-ride-demo",name:"Aarey Dawn Ride (Demo)",sport:"cycling",level:"COMMUNITY",venue:"aarey",org:"cyclists-mumbai",
 rel:{d:1,h:6,len:2},price:null,reg:"open",regDays:0,verify:"demo",fol:"15K",type:"ride",
 cats:["25K social","40K brisk"],age:"All ages (helmets mandatory)",gender:"Open",team:false,
 desc:"Free demo dawn ride through Aarey — no-drop pace, two regroups, filter coffee at the end.",
 sched:[["05:45","Roll call & helmet check"],["06:00","Wheels roll"],["06:45","Regroup point"],["07:30","Filter coffee stop"]],
 tags:["cycling","mumbai","aarey","free","ride"]});
EV({id:"bkc-city-ride-demo",name:"BKC–Nariman Point City Ride (Demo)",sport:"cycling",level:"COMMUNITY",venue:"mmrda",org:"cyclists-mumbai",
 rel:{d:9,h:6,len:3},price:null,reg:"open",regDays:6,verify:"demo",fol:"11K",type:"ride",
 cats:["45K city loop"],age:"16+",gender:"Open",team:false,
 desc:"A demo car-free-feel city ride at dawn — BKC to Nariman Point and back with a rolling escort.",
 sched:[["05:30","Assembly & briefing"],["06:00","Ride out"],["07:30","Nariman turnaround chai"],["08:30","Finish at BKC"]],
 tags:["cycling","mumbai","bkc","free","ride"]});
EV({id:"navi-cycling-demo",name:"Navi Mumbai Cycling Challenge (Demo)",sport:"cycling",level:"CITY",venue:"palm-beach",org:"cyclists-mumbai",
 rel:{d:19,h:6,len:4},price:{min:600,note:"₹600"},reg:"open",regDays:13,verify:"demo",fol:"7.8K",type:"race",
 cats:["25K ITT","50K Road Race"],age:"Open 16+",gender:"Open & Women's",team:false,
 desc:"A demo time-trial and road race on the Palm Beach straight — the fastest tarmac in the metro.",
 sched:[["05:30","Check-in & numbering"],["06:00","25K ITT starts (1-min gaps)"],["07:00","50K road race"],["09:30","Podium & breakfast"]],
 tags:["cycling","navi mumbai","race","vashi"]});

/* ---- Aquatics & multi-sport ---- */
EV({id:"nsci-swim-demo",name:"NSCI Club Swim Meet (Demo)",sport:"aquatics",sportLabel:"Swimming",level:"CLUB",venue:"nsci",org:"aquatics-maha",
 rel:{d:17,h:7,len:5},price:{min:500,note:"₹500"},reg:"open",regDays:11,verify:"demo",fol:"5.4K",type:"race",
 cats:["50m/100m/200m Free","100m Breast","4×50 Medley Relay"],age:"U-12 / U-14 / Open / Masters",gender:"Open & Women's",team:true,
 desc:"A demo indoor club meet — electronic timing, heats and finals in the same session.",
 sched:[["06:45","Report & warm-up"],["07:30","Heats"],["09:30","Finals"],["11:00","Relays"],["11:30","Results board"]],
 tags:["swimming","aquatics","mumbai","worli","club"]});
EV({id:"chowpatty-ows-demo",name:"Chowpatty Open Water Series (Demo)",sport:"aquatics",sportLabel:"Open Water Swimming",level:"STATE",venue:"chowpatty",org:"aquatics-maha",
 rel:{d:25,h:6,len:4},price:{min:900,note:"₹900"},reg:"open",regDays:18,verify:"demo",fol:"6.9K",type:"race",
 cats:["1K sea swim","3K sea swim"],age:"Open 16+ (min. qualifying time required)",gender:"Open & Women's",team:false,
 note:"Open-water events are shown with safety cover details only — kayaks, lifeguards and medical boat are mandatory and listed by organizers.",
 desc:"A demo sea swim with full safety cover — wetsuits optional, glow caps provided, tide-window start.",
 sched:[["05:30","Check-in & briefing (mandatory)"],["06:15","3K wave"],["06:30","1K wave"],["08:00","Results & beach breakfast"]],
 tags:["swimming","open water","mumbai","chowpatty"]});
EV({id:"mumbai-tri-demo",name:"Mumbai Sprint Triathlon (Demo)",sport:"triathlon",level:"CITY",venue:"chowpatty",org:"playr-events",
 rel:{d:26,h:6,len:5},price:{min:1800,note:"₹1,800 individual / ₹2,800 relay"},reg:"open",regDays:19,verify:"demo",fol:"8.1K",type:"race",
 cats:["Sprint (750m/20K/5K)","Super-sprint","Relay teams of 3"],age:"Open 17+",gender:"Open & Women's",team:true,
 desc:"Demo sprint tri — sea swim at Chowpatty, closed-loop ride, promenade run, finish-line idli paradise.",
 sched:[["05:00","Transition opens & rack check"],["05:45","Course briefing"],["06:15","Sprint wave"],["06:40","Super-sprint wave"],["09:30","Awards"]],
 tags:["triathlon","multi-sport","mumbai","chowpatty"]});
EV({id:"bkc-duathlon-demo",name:"BKC Duathlon (Demo)",sport:"duathlon",level:"COMMUNITY",venue:"mmrda",org:"playr-events",
 rel:{d:33,h:6,len:3},price:{min:1100,note:"₹1,100"},reg:"open",regDays:24,verify:"demo",fol:"4.2K",type:"race",
 cats:["5K run / 20K ride / 2.5K run"],age:"Open 16+",gender:"Open",team:false,
 desc:"No swim, all grit — a demo run-ride-run around the BKC blocks at sunrise.",
 sched:[["05:30","Rack & check-in"],["06:00","Run 1"],["06:40","Ride"],["07:40","Run 2"],["08:30","Breakfast & podium"]],
 tags:["duathlon","multi-sport","mumbai","bkc"]});

/* ---- Outdoor (info & guided events only) ---- */
EV({id:"sgnp-nature-trek-demo",name:"SGNP Kanheri Nature Trail (Demo)",sport:"trekking",level:"COMMUNITY",venue:"sgnp",org:"thane-adventure",
 rel:{d:4,h:6,len:5},price:{min:250,note:"₹250 (park entry extra)"},reg:"open",regDays:2,verify:"demo",fol:"13K",type:"trek",
 cats:["6K guided trail"],age:"10+ with guardian",gender:"Open",team:false,
 note:"Guided, permitted trail with forest-department entry. PLAYR lists organised treks only — no solo route challenges.",
 desc:"A demo guided nature trail to the Kanheri caves plateau — naturalist-led, butterfly season special.",
 sched:[["06:00","Gate entry & permits"],["06:30","Trail briefing"],["07:00","Walk begins"],["09:30","Kanheri plateau break"],["10:30","Return loop"]],
 tags:["trekking","outdoor","mumbai","borivali","sgnp"]});
EV({id:"yeoor-trek-demo",name:"Yeoor Hills Sunrise Trek (Demo)",sport:"trekking",level:"COMMUNITY",venue:"yeoor",org:"thane-adventure",
 rel:{d:6,h:5,len:5},price:{min:300,note:"₹300"},reg:"open",regDays:3,verify:"demo",fol:"9.4K",type:"trek",
 cats:["7K sunrise loop"],age:"12+",gender:"Open",team:false,
 desc:"Demo Thane sunrise trek through Yeoor's forest steps — guided group, breakfast at the top point.",
 sched:[["05:15","Assembly at base"],["05:30","Ascent"],["07:00","Sunrise point break"],["08:00","Descent"],["09:00","Breakfast & disperse"]],
 tags:["trekking","outdoor","thane","sunrise"]});
EV({id:"andheri-climbing-demo",name:"Andheri Climbing Wall Meetup (Demo)",sport:"rock-climbing",level:"COMMUNITY",venue:"andheri-complex",org:"playr-events",
 rel:{d:12,h:17,len:3},price:{min:350,note:"₹350 (gear included)"},reg:"open",regDays:8,verify:"demo",fol:"3.6K",type:"meetup",
 cats:["Top-rope open","Bouldering ladder"],age:"12+",gender:"Open",team:false,
 desc:"Demo indoor climbing meetup — harnesses, chalk and beta included. Certified belayers on every rope.",
 sched:[["17:00","Gear & safety briefing"],["17:30","Bouldering ladder"],["18:30","Top-rope sessions"],["19:45","Route send-off & close"]],
 tags:["climbing","indoor","mumbai","andheri"]});

/* ---- Golf / shooting / gymnastics (city spread) ---- */
EV({id:"bpgc-golf-demo",name:"BPGW Amateur Medal Play (Demo)",sport:"golf",level:"CLUB",venue:"bpgc",org:"golf-bpgc",
 rel:{d:10,h:6,len:5},price:{min:1500,note:"₹1,500 (members ₹900)"},reg:"open",regDays:6,verify:"demo",fol:"1.8K",type:"tournament",
 cats:["Gross","Nett (handicap)"],age:"Open",gender:"Open",team:false,
 desc:"Demo medal round at Chembur's tree-lined classic — nearest-to-pin at the 7th, no gimmes.",
 sched:[["05:45","Tee allocations"],["06:00","Shotgun start"],["10:30","Cards in"],["11:00","Breakfast & prizes"]],
 tags:["golf","mumbai","chembur","club"]});
EV({id:"mumbai-gymnastics-demo",name:"Mumbai Artistic Gymnastics Meet (Demo)",sport:"gymnastics",level:"STATE",venue:"andheri-complex",org:"playr-events",
 rel:{d:23,h:9,len:7},price:null,reg:"open",regDays:16,verify:"demo",fol:"3.3K",type:"tournament",
 cats:["Level 3–6 apparatus","Open floor"],age:"U-10 to U-18",gender:"Boys & Girls",team:false,
 desc:"Demo state gymnastics meet — vault, bars, beam and floor with certified judging panels.",
 sched:[["08:30","Athlete check-in"],["09:00","Vault & bars rotations"],["12:00","Beam & floor rotations"],["15:30","All-around results"],["16:00","Medals"]],
 tags:["gymnastics","mumbai","andheri","junior","free"]});

/* ============================================================
   DEMO EVENTS — MAHARASHTRA
   ============================================================ */
EV({id:"pune-badminton-demo",name:"Pune Badminton Ranking Classic (Demo)",sport:"badminton",level:"STATE",venue:"balewadi",org:"andheri-aa",
 rel:{d:11,h:9,len:9},price:{min:800,note:"₹800"},reg:"open",regDays:7,verify:"demo",fol:"12K",type:"tournament",
 cats:["All doubles draws + U-17"],age:"Open & junior",gender:"Open",team:false,
 desc:"Demo state-ranking badminton at Balewadi's halls — the draw Pune trains all year for.",
 sched:[["Day 1","Pools & R32"],["Day 2","Quarter-finals onwards"],["16:00","Finals & ranking points"]],
 tags:["badminton","pune","maharashtra","state"]});
EV({id:"rajmachi-trek-demo",name:"Rajmachi Fort Trek (Demo)",sport:"trekking",level:"COMMUNITY",venue:"lonavala",org:"thane-adventure",
 rel:{d:8,h:6,len:7},price:{min:400,note:"₹400 incl. breakfast"},reg:"open",regDays:5,verify:"demo",fol:"18K",type:"trek",
 cats:["14K moderate trek"],age:"14+",gender:"Open",team:false,
 desc:"Demo monsoon trek to Rajmachi from Lonavala — waterfalls, fort walls and a village breakfast.",
 sched:[["06:00","Lonavala base assembly"],["06:30","Ascent begins"],["09:30","Fort exploration"],["11:30","Village breakfast"],["13:00","Descent"]],
 tags:["trekking","lonavala","maharashtra","monsoon"]});
EV({id:"kolhapur-kusti-demo",name:"Kolhapur Kusti Mahotsav (Demo)",sport:"wrestling",level:"STATE",venue:"khasbag",org:"wrestling-maha",
 rel:{d:20,h:16,len:5},price:null,reg:"open",regDays:13,verify:"demo",fol:"27K",type:"tournament",
 cats:["Sand-pit dangal (traditional)","Mat wrestling"],age:"Open & junior",gender:"Men's (mat: Open & Women's)",team:false,
 desc:"A demo kusti mahotsav at Khasbag's historic maidan — talim wrestlers, sand pits, and Maharashtra's oldest sporting crowd.",
 sched:[["16:00","Talim procession"],["16:30","Weigh-in & draw"],["17:30","Sand-pit bouts"],["19:30","Mat finals"],["20:30","Halgi & honours"]],
 tags:["wrestling","kusti","kolhapur","maharashtra","traditional","free"]});
EV({id:"nashik-cycling-demo",name:"Nashik Vineyard Cycling Classic (Demo)",sport:"cycling",level:"CITY",venue:null,loc:{city:"Nashik",area:"Nashik",zone:"Maharashtra"},org:"cyclists-mumbai",
 rel:{d:23,h:6,len:5},price:{min:900,note:"₹900"},reg:"open",regDays:16,verify:"demo",fol:"4.7K",type:"ride",
 cats:["60K vineyard loop","100K challenge"],age:"Open 16+",gender:"Open",team:false,
 desc:"Demo gran fondo through Nashik's wine country — rolling hills, grape stalls at the feed zones.",
 sched:[["05:30","Flag-off"],["08:30","Vineyard checkpoint"],["10:30","100K split"],["12:00","Finish festival"]],
 tags:["cycling","nashik","maharashtra","fondo"]});
EV({id:"balewadi-shooting-demo",name:"Maharashtra Shooting State Trials (Demo)",sport:"shooting",level:"STATE",venue:"balewadi",org:"playr-events",
 rel:{d:14,h:9,len:7},price:null,reg:"open",regDays:9,verify:"demo",fol:"2.4K",type:"tournament",
 cats:["10m Air Rifle","10m Air Pistol","25m Sport Pistol"],age:"Junior & senior",gender:"Open & Women's",team:false,
 desc:"Demo state selection trials on Balewadi's electronic targets — ISSF rules, finals on the big screen.",
 sched:[["08:30","Equipment control"],["09:15","Qualification relays"],["13:30","Finals"],["15:30","Trial results"]],
 tags:["shooting","precision","pune","maharashtra","free"]});

/* ============================================================
   DEMO EVENTS — INDIA-WIDE
   ============================================================ */
EV({id:"delhi-ncr-tri-demo",name:"Delhi NCR Triathlon (Demo)",sport:"triathlon",level:"NATIONAL",venue:"jlnc-delhi",org:"playr-events",
 rel:{d:28,h:6,len:5},price:{min:2200,note:"₹2,200"},reg:"open",regDays:20,verify:"demo",fol:"14K",type:"race",
 cats:["Olympic distance","Sprint","Relay"],age:"Open 17+",gender:"Open & Women's",team:true,
 desc:"Demo NCR tri around the JLN stadium precinct — pool swim, closed ride, stadium-lap finish.",
 sched:[["05:30","Transition check"],["06:15","Olympic wave"],["09:30","Sprint wave"],["11:30","Podium"]],
 tags:["triathlon","delhi","india","multi-sport"]});
EV({id:"kanteerava-10k-demo",name:"Bengaluru Night 10K (Demo)",sport:"running",level:"CITY",venue:"kanteerava",org:"speed-bengaluru",
 rel:{d:9,h:18,len:3},price:{min:799,note:"₹799"},reg:"open",regDays:5,verify:"demo",fol:"19K",type:"race",
 cats:["10K","5K"],age:"Open 15+",gender:"Open",team:false,
 desc:"Demo neon-lit 10K starting under the Kanteerava floodlights — Bengaluru's coolest evening start.",
 sched:[["17:30","Bib pickup"],["18:30","10K start"],["18:45","5K start"],["20:00","Awards & music"]],
 tags:["running","bengaluru","night","10k"]});
EV({id:"gopichand-badminton-demo",name:"National Badminton Camp Showcase (Demo)",sport:"badminton",level:"NATIONAL",venue:"gopichand",org:"playr-events",
 rel:{d:12,h:10,len:6},price:null,reg:"open",regDays:8,verify:"demo",fol:"32K",type:"meetup",
 cats:["Open sparring showcase","Junior clinics"],age:"All",gender:"Open",team:false,
 desc:"Demo open day at India's most famous badminton academy — watch national-camp sessions, join clinics.",
 sched:[["10:00","Doors & academy walk"],["11:00","Camp sparring showcase"],["13:00","Junior clinic"],["15:00","Q&A with coaches"]],
 tags:["badminton","hyderabad","india","academy","free"]});
EV({id:"sdat-squash-demo",name:"Chennai Squash Circuit (Demo)",sport:"squash",level:"NATIONAL",venue:"sdat",org:"playr-events",
 rel:{d:15,h:9,len:8},price:{min:1000,note:"₹1,000"},reg:"open",regDays:10,verify:"demo",fol:"6.2K",type:"tournament",
 cats:["PSA-style open draw","Masters 40+"],age:"Open",gender:"Open",team:false,
 desc:"Demo national-circuit squash at Nungambakkam's glass court — best-of-five, Chennai heat included.",
 sched:[["09:00","Round of 32"],["13:00","Round of 16"],["17:00","Quarter-finals"],["Day 2","Semis & final"]],
 tags:["squash","chennai","india","national"]});
EV({id:"saltlake-fives-demo",name:"Kolkata Football Fives Cup (Demo)",sport:"football",level:"CITY",venue:"salt-lake",org:"collegiate-sports-in",
 rel:{d:6,h:15,len:6},price:{min:1800,note:"₹1,800 per squad"},reg:"open",regDays:3,verify:"demo",fol:"16K",type:"tournament",
 cats:["Open","Women's","Corporate"],age:"Open 16+",gender:"Open & Women's",team:true,
 desc:"Demo five-a-side cup in the Salt Lake shadow — Kolkata's passing culture, five-a-side rules.",
 sched:[["15:00","Groups"],["17:30","Knockouts"],["19:30","Finals"],["20:30","Awards"]],
 tags:["football","kolkata","fives"]});
EV({id:"modi-cricket-demo",name:"Ahmedabad Corporate T20 Cup (Demo)",sport:"cricket",level:"CITY",venue:"modi-stadium",org:"playr-events",
 rel:{d:18,h:9,len:10},price:{min:6500,note:"₹6,500 per team"},reg:"open",regDays:12,verify:"demo",fol:"28K",type:"tournament",
 cats:["Corporate T20 (32 teams)"],age:"Open 18+",gender:"Open",team:true,prize:"₹2L prize pool (demo)",
 desc:"Demo corporate T20 at the world's largest cricket stadium — practice wickets, match officials, replay screen.",
 sched:[["08:30","Toss & group games"],["12:30","Quarter-finals"],["15:30","Semi-finals"],["18:00","Final under lights"]],
 tags:["cricket","ahmedabad","corporate","t20"]});
EV({id:"kalinga-hockey-demo",name:"Bhubaneswar Hockey Community Cup (Demo)",sport:"hockey",level:"COMMUNITY",venue:"kalinga",org:"playr-events",
 rel:{d:11,h:16,len:4},price:null,reg:"open",regDays:7,verify:"demo",fol:"21K",type:"tournament",
 cats:["Open 7-a-side","Schools"],age:"Open & U-15",gender:"Open & Girls",team:true,
 desc:"Demo community hockey at India's hockey heartland — Odisha's turf, everyone's game.",
 sched:[["16:00","Groups"],["18:00","Knockouts"],["19:30","Finals"],["20:00","Community awards"]],
 tags:["hockey","bhubaneswar","odisha","free","community"]});
EV({id:"tau-pickleball-demo",name:"Gurugram Pickleball Corporate League (Demo)",sport:"pickleball",level:"CITY",venue:"tau-devi-lal",org:"khar-ltc",
 rel:{d:13,h:9,len:8},price:{min:1400,note:"₹1,400 per pair"},reg:"open",regDays:9,verify:"demo",fol:"7.3K",type:"league",
 cats:["Corporate doubles ladders"],age:"Open",gender:"Mixed",team:true,
 desc:"Demo corporate pickleball ladder mornings at Tau Devi Lal — six weeks, one champions' paddle.",
 sched:[["09:00","Ladder round 1"],["11:30","Ladder round 2"],["Week 6","Grand final & brunch"]],
 tags:["pickleball","gurugram","corporate","racket"]});
EV({id:"goa-beach-volley-demo",name:"Goa Beach Volleyball Open (Demo)",sport:"volleyball",level:"COMMUNITY",venue:"calangute",org:"playr-events",
 rel:{d:21,h:16,len:5},price:null,reg:"open",regDays:14,verify:"demo",fol:"8.9K",type:"tournament",
 cats:["2s open","4s social"],age:"Open",gender:"Open & Women's",team:true,
 desc:"Demo sunset beach volleyball at Calangute — barefoot rules, spike cam, shack credits for winners.",
 sched:[["16:00","Pool games"],["18:00","Knockouts"],["19:30","Final under the lights"],["20:15","Shack podium"]],
 tags:["volleyball","goa","beach","free","community"]});
EV({id:"chennai-chess-demo",name:"Chennai Rapid Grand Prix (Demo)",sport:"chess",level:"NATIONAL",venue:null,loc:{city:"Chennai",area:"Chennai",zone:"Tamil Nadu"},org:"mind-sports-in",
 rel:{d:17,h:10,len:7},price:{min:600,note:"₹600"},reg:"open",regDays:11,verify:"demo",fol:"22K",type:"tournament",
 cats:["Open Rapid","Women's Rapid","Junior"],age:"Open",gender:"Open & Women's",team:false,prize:"₹2L fund (demo)",
 desc:"Demo grand-prix rapid in India's chess capital — the city of the prodigies keeps the clocks honest.",
 sched:[["09:30","Rounds 1–4"],["13:30","Rounds 5–7"],["16:30","Rounds 8–9"],["18:30","Podium & blindfold simuls"]],
 tags:["chess","chennai","india","mind","national"]});
EV({id:"kolkata-carrom-demo",name:"Kolkata Carrom Adda Championship (Demo)",sport:"carrom",level:"COMMUNITY",venue:null,loc:{city:"Kolkata",area:"Kolkata",zone:"West Bengal"},org:"mind-sports-in",
 rel:{d:24,h:16,len:4},price:null,reg:"open",regDays:17,verify:"demo",fol:"3.1K",type:"tournament",
 cats:["Singles & doubles"],age:"All ages",gender:"Open",team:false,
 desc:"Demo para-adda carrom championship — every club sends its sharpest striker.",
 sched:[["16:00","Board draws"],["16:30","Groups"],["18:30","Knockouts"],["20:00","Final & adda"]],
 tags:["carrom","kolkata","free","community","mind"]});
EV({id:"bic-trackday-demo",name:"BIC Amateur Track Day (Demo)",sport:"motorsport",level:"NATIONAL",venue:"bic",org:"speed-bengaluru",
 rel:{d:19,h:8,len:8},price:{min:8500,note:"₹8,500 incl. briefing & lunch"},reg:"open",regDays:12,verify:"demo",fol:"26K",type:"meetup",
 cats:["Track sessions by bike/car group","Novice orientation"],age:"18+ with valid racing licence for fast groups",gender:"Open",team:false,
 note:"Motorsport events on PLAYR are circuit-organised sessions only — no street racing content or challenges, ever.",
 desc:"Demo amateur track day at Buddh International Circuit — flag briefings, sessions by group, lap timing included.",
 sched:[["08:00","Scrutineering & briefing"],["09:00","Session A (novice)"],["11:00","Sessions B–C"],["13:00","Lunch & garages"],["15:00","Open sessions"],["17:30","Debrief"]],
 tags:["motorsport","bic","greater noida","track day"]});
EV({id:"bengaluru-esports-demo",name:"PLAYR Collegiate Esports LAN — Bengaluru (Demo)",sport:"esports",level:"COLLEGE",venue:"kanteerava",org:"collegiate-sports-in",
 rel:{d:14,h:10,len:10},price:null,reg:"open",regDays:8,verify:"demo",fol:"41K",type:"tournament",
 cats:["5v5 tactical shooter","2v2 fighting games","Solo battle royale"],age:"College students",gender:"Open & Women's",team:true,prize:"₹3L scholarship pool (demo)",
 desc:"Demo collegiate LAN finals — 64 college qualifiers converge for one loud weekend in Bengaluru.",
 sched:[["Day 1 10:00","Group stages"],["Day 1 18:00","Quarter-finals"],["Day 2 12:00","Semi-finals"],["Day 2 17:00","Grand finals"],["Day 2 19:30","Awards & scouting corner"]],
 tags:["esports","college","bengaluru","lan","free"]});
EV({id:"guwahati-adventure-demo",name:"Guwahati Adventure Sports Fest (Demo)",sport:"mountaineering",level:"STATE",venue:"sarusajai",org:"thane-adventure",
 rel:{d:26,h:8,len:9},price:null,reg:"open",regDays:18,verify:"demo",fol:"9.6K",type:"festival",
 cats:["Artificial wall comp","Zip-line demos","Orienteering"],age:"All ages",gender:"Open",team:false,
 desc:"Demo adventure festival in the northeast — wall comps, gear stalls and mountain-film screenings.",
 sched:[["08:00","Wall competition"],["11:00","Orienteering flag-off"],["15:00","Adventure film pavilion"],["18:00","Festival close"]],
 tags:["adventure","guwahati","festival","free"]});
EV({id:"jaipur-athletics-demo",name:"Jaipur Athletics Classic (Demo)",sport:"athletics",level:"STATE",venue:"sms",org:"playr-events",
 rel:{d:29,h:16,len:5},price:null,reg:"open",regDays:20,verify:"demo",fol:"7.7K",type:"race",
 cats:["100m/200m/400m","1500m","Long jump","Shot put"],age:"U-16 / U-20 / Open",gender:"Open & Women's",team:false,
 desc:"Demo evening athletics meet under SMS stadium lights — pink city track classics.",
 sched:[["16:00","Check-in"],["16:30","Sprints heats"],["17:30","1500m"],["18:30","Jumps & throws"],["19:30","Finals"],["20:15","Medals"]],
 tags:["athletics","jaipur","track and field","free"]});
EV({id:"sector42-squash-demo",name:"Chandigarh Junior Squash Open (Demo)",sport:"squash",level:"STATE",venue:"sector42",org:"playr-events",
 rel:{d:31,h:9,len:7},price:{min:600,note:"₹600"},reg:"open",regDays:22,verify:"demo",fol:"2.8K",type:"tournament",
 cats:["U-13 / U-15 / U-17"],age:"Juniors",gender:"Open & Girls",team:false,
 desc:"Demo junior squash open in Chandigarh's glass-backed courts — the nursery of Indian squash.",
 sched:[["09:00","Pools"],["12:00","Knockouts"],["15:30","Finals"],["16:30","Coaching clinic"]],
 tags:["squash","chandigarh","junior"]});
EV({id:"ekana-sixes-demo",name:"Lucknow University Cricket Sixes (Demo)",sport:"cricket",level:"COLLEGE",venue:"ekana",org:"collegiate-sports-in",
 rel:{d:34,h:9,len:9},price:null,reg:"open",regDays:25,verify:"demo",fol:"18K",type:"tournament",
 cats:["University sixes (48 teams)"],age:"University students",gender:"Open & Women's",team:true,
 desc:"Demo university sixes at Ekana's practice arena — camp vs camp, nawabi style.",
 sched:[["09:00","Group stage"],["13:00","Quarter-finals"],["15:30","Semi-finals"],["17:30","Final"]],
 tags:["cricket","lucknow","college","free"]});
EV({id:"fatorda-football-demo",name:"Goa Football Invitation Cup (Demo)",sport:"football",level:"STATE",venue:"fatorda",org:"collegiate-sports-in",
 rel:{d:37,h:17,len:4},price:null,reg:"open",regDays:28,verify:"demo",fol:"15K",type:"tournament",
 cats:["Village clubs (16 teams)"],age:"Open",gender:"Open",team:true,
 desc:"Demo village-club cup at Fatorda — Goa's fi nest Sunday football culture under lights.",
 sched:[["17:00","Quarter-finals"],["18:30","Semi-finals"],["20:00","Final"],["21:00","Trophy & brass band"]],
 tags:["football","goa","village"]});
EV({id:"school-games-athletics-demo",name:"National School Games Athletics — Pune Leg (Demo)",sport:"athletics",level:"SCHOOL",venue:"balewadi",org:"playr-events",
 rel:{d:25,h:8,len:9},price:null,reg:"open",regDays:18,verify:"demo",fol:"23K",type:"race",
 cats:["Track & field by school age groups"],age:"U-14 / U-17 / U-19",gender:"Boys & Girls",team:false,
 desc:"Demo school-games athletics at Balewadi — where district champions become national names.",
 sched:[["Day 1","Heats"],["Day 2 09:00","Track finals"],["Day 2 15:00","Field finals"],["Day 3 10:00","Medals & closing"]],
 tags:["athletics","school","pune","national","free"]});
EV({id:"taekwondo-nationals-demo",name:"National Taekwondo Invitationals (Demo)",sport:"taekwondo",level:"NATIONAL",venue:"jlnc-delhi",org:"grit-combat",
 rel:{d:40,h:9,len:8},price:null,reg:"open",regDays:30,verify:"demo",fol:"11K",type:"tournament",
 cats:["Poomsae","Kyorugi by weight"],age:"Cadet / Junior / Senior",gender:"Open & Women's",team:false,
 desc:"Demo national taekwondo invitationals — poomsae precision in the morning, kyorugi fireworks after lunch.",
 sched:[["09:00","Poomsae rounds"],["13:00","Kyorugi mats open"],["17:00","Finals"],["19:00","Dan ceremony"]],
 tags:["taekwondo","combat","delhi","national","free"]});

/* ---- Completed demo events (results flow) ---- */
EV({id:"monsoon-tri-past",name:"Monsoon Super-Sprint Tri (Demo)",sport:"triathlon",level:"COMMUNITY",venue:"chowpatty",org:"playr-events",
 rel:{d:-6,h:6,len:3},price:{min:999,note:"₹999"},reg:"closed",verify:"demo",fol:"6.1K",type:"race",
 cats:["400m/10K/2.5K"],age:"Open 16+",gender:"Open",team:false,
 desc:"Last month's demo super-sprint — the results tab is live, photos are up, the chai was excellent.",
 results:{w:[["Overall","Rhea Kapoor — 54:12"],["Women's","Ananya Iyer — 57:40"],["Relay","Wave Riders — 52:08"]],h:"Photo gallery: 240 shots from transition and the promenade finish.",photos:240},
 tags:["triathlon","mumbai","completed"]});
EV({id:"khar-ladder-past",name:"Khar Tennis Ladder — August Edition (Demo)",sport:"tennis",level:"CLUB",venue:"khar-gym",org:"khar-ltc",
 rel:{d:-13,h:8,len:8},price:{min:600,note:"₹600"},reg:"closed",verify:"demo",fol:"2.1K",type:"tournament",
 cats:["Open Singles"],age:"Open",gender:"Open",team:false,
 desc:"August's demo ladder, wrapped — the September edition is now open for entry.",
 results:{w:[["Champion","Farhan Ali"],["Runner-up","Neel Shah"]],h:"Final: 6–4, 3–6, [10–7]. Full draw sheet in the community tab.",photos:96},
 tags:["tennis","khar","completed"]});
EV({id:"ncr-box-cup-past",name:"NCR Boxing Quarterlies (Demo)",sport:"boxing",level:"STATE",venue:null,loc:{city:"New Delhi",area:"New Delhi",zone:"Delhi"},org:"grit-combat",
 rel:{d:-20,h:15,len:6},price:null,reg:"closed",verify:"demo",fol:"7.4K",type:"tournament",
 cats:["Amateur weight classes"],age:"18+",gender:"Open",team:false,
 desc:"Last month's demo sanctioned card in the capital — 28 bouts, zero stoppages, one hospital-corner masterclass.",
 results:{w:[["Best bout","Rathore vs D'Souza (67kg)"],["Best boxer","Vikram Rathore"]],h:"Highlights reel and scorecards archived for the community.",photos:118},
 tags:["boxing","delhi","completed"]});

/* ============================================================
   SPCL — PARA-SPORT EVENTS
   Real events carry sources; demo events are badged DEMO.
   ============================================================ */
EV({id:"asian-para-games-2026",name:"Aichi-Nagoya 2026 Asian Para Games",sport:"para-athletics",sportLabel:"Multi-sport · 18 Para sports",level:"INTERNATIONAL",venue:null,loc:{city:"Nagoya",area:"Aichi",zone:"Japan"},
 org:"paralympic-org",
 date:"2026-10-18T19:00:00+09:00",dateEnd:"2026-10-24T21:00:00+09:00",len:999,para:1,
 price:null,reg:null,verify:"verified",fol:"96K",type:"tournament",
 cats:["18 Para sports","Around 3,000 athletes","45 National Paralympic Committees"],age:"All ages",gender:"Open",team:true,
 desc:"Asia's premier Para-sport event: 18–24 October 2026 in Nagoya, Japan — around 3,000 athletes from 45 NPCs across 18 Para sports.",
 sched:null,src:"Source: paralympic.org / Asian Paralympic Committee",updated:"Aug 2026",tags:["para","spcl","asian para games","paralympic"]});

EV({id:"la28-paralympics",name:"LA28 Paralympic Games",sport:"para-athletics",sportLabel:"Multi-sport · Paralympic Games",level:"WORLD",venue:null,loc:{city:"Los Angeles",area:"California",zone:"USA"},
 org:"paralympic-org",
 date:"2028-08-15T00:00:00+05:30",dateEnd:"2028-08-27T23:59:00+05:30",len:999,para:1,
 price:null,reg:null,regUrl:"https://www.paralympic.org",verify:"verified",fol:"1.1M",type:"tournament",
 cats:["22+ Para sports on the programme"],age:"All ages",gender:"Open",team:true,
 desc:"The Paralympic Games come to Los Angeles — 15–27 August 2028, the city's first Paralympic Games since 1984.",
 sched:null,src:"Source: paralympic.org",updated:"Aug 2026",tags:["para","spcl","paralympics","la28"]});

EV({id:"nsci-para-athletics-demo",name:"NSCI Para Athletics Meet (Demo)",sport:"para-athletics",level:"STATE",venue:"nsci",org:"playr-events",
 rel:{d:9,h:8,len:8},para:1,price:null,reg:"open",regDays:5,verify:"demo",fol:"6.8K",type:"race",
 cats:["Track 100m–1500m","Club throw","Long jump","Javelin — sport classes per entry"],age:"Open sport classes",gender:"Open",team:false,
 desc:"A demo state-level Para athletics meet — electronic timing, classifiers on site, open entries through PLAYR communities.",
 sched:[["08:00","Check-in & classification review window"],["09:00","Track events begin"],["12:00","Field events"],["16:00","Medals & community meet"]],
 tags:["para","spcl","athletics","mumbai","worli","free"]});

EV({id:"mumbai-wb-league-demo",name:"Mumbai Wheelchair Basketball League — Finals (Demo)",sport:"wheelchair-basketball",level:"CITY",venue:"nsci",org:"playr-events",
 rel:{d:13,h:16,len:5},para:1,price:null,reg:"open",regDays:8,verify:"demo",fol:"11.2K",type:"tournament",
 cats:["Open division (6 teams)","Women's exhibition match"],age:"Open",gender:"Open & Women's",team:true,
 desc:"Demo finals night for the city's wheelchair basketball community — full-court, full-noise.",
 sched:[["16:00","Doors & warm-ups"],["17:00","Semifinal 1"],["18:15","Semifinal 2"],["19:30","Final"],["20:45","Awards"]],
 tags:["para","spcl","wheelchair basketball","mumbai","worli","free"]});

EV({id:"boccia-mumbai-cup-demo",name:"Boccia Mumbai Cup (Demo)",sport:"boccia",level:"COMMUNITY",venue:"nehru-centre",org:"playr-events",
 rel:{d:18,h:10,len:7},para:1,price:null,reg:"open",regDays:12,verify:"demo",fol:"3.4K",type:"tournament",
 cats:["BC1–BC4 divisions","Pairs"],age:"Open sport classes",gender:"Open",team:true,
 desc:"A demo community boccia cup — ramps, precision and the tightest margins in the hall.",
 sched:[["10:00","Check-in & ramp checks"],["11:00","Group stage"],["14:30","Knockouts"],["17:00","Finals"],["18:00","Community awards"]],
 tags:["para","spcl","boccia","mumbai","worli","free"]});

EV({id:"blind-football-delhi-demo",name:"Delhi Blind Football Invitational (Demo)",sport:"blind-football",level:"CITY",venue:"jlnc-delhi",org:"playr-events",
 rel:{d:24,h:15,len:6},para:1,price:null,reg:"open",regDays:16,verify:"demo",fol:"5.1K",type:"tournament",
 cats:["4-team invitational","Guides & sighted GKs per rules"],age:"Open",gender:"Open",team:true,
 desc:"A demo blind football invitational — audible ball, silent stands during play, deafening after goals.",
 sched:[["15:00","Team check-in & eyeshade checks"],["16:00","Round robin"],["18:30","Final"],["19:30","Awards"]],
 tags:["para","spcl","blind football","delhi","free"]});
