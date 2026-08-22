/* ============================================================
   PLAYR — SPORTS CATALOG · PART 2
   Non-Olympic-programme categories: Water, Adventure, Combat,
   Motorsport, Action/Urban, Endurance, Mind, Team, Racket,
   Precision, Traditional, Other.  (Olympic programme = Part 1 +
   cricket in Team Sports, racket/precision/action Olympic sports.)
   ============================================================ */

/* ============================ WATER SPORTS ============================ */

S({id:"rowing",name:"Rowing",cat:"water",sub:"Water",icon:"🚣",pop:50,oly:"LA28",
 desc:"Sweep and sculling boats, from the single scull to the eight — and coastal beach sprints join at LA28.",
 disc:[["Sweep","Eight|Four|Pair"],["Sculling","Single|Double|Quad"],["Coastal / Beach Sprint","New LA28 event"]],
 alias:["crew","sculling"],tags:["water","team","individual","outdoor","endurance"]});

S({id:"water-skiing",name:"Water Skiing",cat:"water",sub:"Towed",icon:"🚤",pop:34,
 desc:"Slalom, trick and jump skiing behind the boat — born on Lake Pepin, Minnesota in 1922.",
 alias:["slalom skiing"],tags:["water","individual","outdoor","motor"]});

S({id:"wakeboarding",name:"Wakeboarding",cat:"water",sub:"Towed",icon:"🌊",pop:42,trend:1,
 desc:"Boat and cable wake riding — airs, spins and rails on a single board.",
 alias:["wake","cable park"],tags:["water","individual","outdoor","urban"]});

S({id:"dragon-boat",name:"Dragon Boat",cat:"water",sub:"Water",icon:"🐉",pop:32,
 desc:"20 paddlers, one drummer, one steersman — a 2,000-year-old Chinese festival tradition turned international sport.",
 alias:["dragonboat"],tags:["water","team","outdoor","traditional"]});

S({id:"canoe-polo",name:"Canoe Polo",cat:"water",sub:"Water",icon:"🛶",pop:20,
 desc:"Five-a-side kayak basketball with goals suspended above the water.",
 alias:["kayak polo"],tags:["water","team","outdoor","ball"]});

S({id:"surf-lifesaving",name:"Surf Lifesaving",cat:"water",sub:"Water",icon:"🛟",pop:26,
 desc:"Ironman races, board paddles and sprints — the sport built from saving lives on Australia's beaches.",
 alias:["lifesaving","ironman surf"],tags:["water","individual","outdoor","endurance"]});

S({id:"bodyboarding",name:"Bodyboarding",cat:"water",sub:"Wave",icon:"🤙",pop:28,
 desc:"Prone wave riding on a foam bodyboard — barrels, spins and rolls in shorebreak most boards can't touch.",
 alias:["boogie boarding","sponging"],tags:["water","individual","outdoor"]});

S({id:"kitesurfing",name:"Kitesurfing",cat:"water",sub:"Wind",icon:"🪁",pop:48,trend:1,
 desc:"Kite power plus a twin-tip board — big airs, freestyle and course racing. Kite events also feature inside Olympic sailing.",
 alias:["kiteboarding"],tags:["water","individual","outdoor"]});

S({id:"windsurfing",name:"Windsurfing",cat:"water",sub:"Wind",icon:"💨",pop:40,
 desc:"Sail in your hands, board under your feet — wave, slalom and freestyle disciplines. iQFoil is the Olympic class.",
 alias:["boardsailing"],tags:["water","individual","outdoor"]});

S({id:"sup",name:"Stand-Up Paddleboarding",cat:"water",sub:"Water",icon:"🏄",pop:44,
 desc:"Paddling standing up — racing, touring, downwinders and SUP surfing for everyone from lakes to ocean swells.",
 alias:["sup","paddle board"],tags:["water","individual","outdoor"]});

S({id:"freediving",name:"Freediving",cat:"water",sub:"Underwater",icon:"🤿",pop:30,risk:"high",
 desc:"Depth, distance and time on a single breath — the quietest extreme sport on Earth.",
 alias:["free diving","apnea"],tags:["water","individual","outdoor","adventure"]});

S({id:"finswimming",name:"Finswimming",cat:"water",sub:"Underwater",icon:"🦶",pop:16,
 desc:"Speed swimming with a monofin and bifins — underwater racing's pure speed discipline.",
 tags:["water","individual","indoor"]});

S({id:"underwater-hockey",name:"Underwater Hockey",cat:"water",sub:"Underwater",icon:"🏒",pop:14,niche:1,
 desc:"Octopush — six a side pushing a puck along the bottom of a swimming pool with tiny sticks.",
 alias:["octopush"],tags:["water","team","indoor"]});

/* ======================= ADVENTURE & OUTDOOR ======================== */
/* High-risk sports are community & information only on PLAYR — no challenge mechanics. */

S({id:"mountaineering",name:"Mountaineering",cat:"adventure",sub:"Mountain",icon:"🏔",pop:62,fol:2400000,feat:1,risk:"high",
 desc:"Summits, expeditions and alpine culture — from 6,000m trekking peaks to the 8,000m crown.",
 rel:["rock-climbing","ski-mountaineering","trekking","trail-running","hiking"],
 tabs:["Summits","Expeditions","History","Athletes","Events","Community"],
 alias:["alpinism","climbing mountains"],tags:["outdoor","adventure","individual"]});

S({id:"rock-climbing",name:"Rock Climbing",cat:"adventure",sub:"Vertical",icon:"🧗",pop:64,trend:1,
 desc:"Ropes, routes and real rock — sport climbing, trad and multipitch outdoors (the Olympic version is Sport Climbing).",
 rel:["bouldering","sport-climbing","mountaineering"],
 alias:["climbing","trad climbing"],tags:["outdoor","adventure","individual"]});

S({id:"bouldering",name:"Bouldering",cat:"adventure",sub:"Vertical",icon:"🪨",pop:52,trend:1,
 desc:"Short, powerful problems, no ropes — crash pads and chalk indoors and out.",
 rel:["rock-climbing","sport-climbing"],
 tags:["outdoor","indoor","adventure","individual"]});

S({id:"hiking",name:"Hiking",cat:"adventure",sub:"Trail",icon:"🥾",pop:70,
 desc:"Day walks and long trails — the world's most accessible outdoor sport.",
 rel:["trekking","trail-running","mountaineering"],
 tags:["outdoor","adventure","individual"]});

S({id:"trekking",name:"Trekking",cat:"adventure",sub:"Trail",icon:"🎒",pop:56,
 desc:"Multi-day journeys on foot — Himalayan circuits, Camino de Santiago and everything between.",
 rel:["hiking","mountaineering","trail-running"],
 tags:["outdoor","adventure","individual"]});

S({id:"trail-running",name:"Trail Running",cat:"adventure",sub:"Trail",icon:"⛰",pop:58,trend:1,
 desc:"Running off-road — mountain ultras, sky races and forest singletrack.",
 rel:["ultra-running","running","mountaineering","hiking"],
 alias:["trail","mountain running"],tags:["outdoor","adventure","individual","endurance"]});

S({id:"ultra-running",name:"Ultra Running",cat:"adventure",sub:"Trail",icon:"♾",pop:44,
 desc:"Anything beyond the marathon — 50K, 100K, 100 milers and self-supported stage races.",
 rel:["trail-running","marathon","running"],
 alias:["ultramarathon","ultra"],tags:["outdoor","adventure","individual","endurance"]});

S({id:"adventure-racing",name:"Adventure Racing",cat:"adventure",sub:"Multi",icon:"🧭",pop:22,
 desc:"Days-long unsupported races mixing trekking, paddling, mountain biking and navigation.",
 alias:["expedition racing"],tags:["outdoor","adventure","team","endurance"]});

S({id:"paragliding",name:"Paragliding",cat:"adventure",sub:"Air",icon:"🪂",pop:38,risk:"high",
 desc:"Foot-launched free flight — thermals, cross-country distances and acrobatics under a wing.",
 tags:["air","adventure","individual","outdoor"]});

S({id:"hang-gliding",name:"Hang Gliding",cat:"adventure",sub:"Air",icon:"🦅",pop:20,risk:"high",
 desc:"Rigid-wing soaring — the closest humans get to soaring like a bird off ridgelines.",
 tags:["air","adventure","individual","outdoor"]});

S({id:"skydiving",name:"Skydiving",cat:"adventure",sub:"Air",icon:"🛫",pop:46,risk:"high",
 desc:"Freefall formation, freestyle and wingsuit flying — terminal velocity sport.",
 alias:[" parachuting"],tags:["air","adventure","individual"]});

S({id:"base-jumping",name:"BASE Jumping",cat:"adventure",sub:"Air",icon:"🏙",pop:18,niche:1,risk:"high",
 desc:"Fixed-object jumps — buildings, antennas, spans and earth. PLAYR covers it as community and storytelling only.",
 tags:["air","adventure","individual"]});

S({id:"canyoning",name:"Canyoning",cat:"adventure",sub:"Water",icon:"🏞",pop:24,risk:"high",
 desc:"Descending slot canyons on foot, rope and swims — canyoneering in the Americas.",
 alias:["canyoneering"],tags:["outdoor","adventure","water","individual"]});

S({id:"caving",name:"Caving",cat:"adventure",sub:"Underground",icon:"🕳",pop:20,risk:"high",
 desc:"Exploring wild cave systems — vertical drops, squeezes and sumps. Informational community only.",
 alias:["spelunking","potholing"],tags:["outdoor","adventure","individual"]});

S({id:"orienteering",name:"Orienteering",cat:"adventure",sub:"Navigation",icon:"🗺",pop:30,
 desc:"Map-and-compass racing through unknown terrain — on foot, skis or bike.",
 alias:["o-Running"],tags:["outdoor","adventure","individual","mind","endurance"]});

S({id:"rafting",name:"Rafting",cat:"adventure",sub:"Water",icon:"🌊",pop:34,risk:"high",
 desc:"Whitewater raft teams reading big water — from grade III day runs to multi-day expeditions.",
 alias:["white water rafting"],tags:["water","adventure","team","outdoor"]});

S({id:"via-ferrata",name:"Via Ferrata",cat:"adventure",sub:"Vertical",icon:"⛓",pop:18,risk:"high",
 desc:"Protected iron routes up mountain faces — cabled ladders between hiking and climbing.",
 tags:["outdoor","adventure","individual"]});

S({id:"coasteering",name:"Coasteering",cat:"adventure",sub:"Coast",icon:"🌤",pop:12,niche:1,
 desc:"Swim, scramble and cliff-jump along a rocky coastline — invented in Pembrokeshire, Wales.",
 tags:["water","adventure","individual","outdoor"]});

S({id:"slackline",name:"Slacklining",cat:"adventure",sub:"Balance",icon:"🪢",pop:26,
 desc:"Walking and tricking on flat webbing — from park lines to highlines across canyons.",
 alias:["highline"],tags:["outdoor","adventure","individual","urban"]});

S({id:"gliding",name:"Gliding",cat:"adventure",sub:"Air",icon:"🛩",pop:16,niche:1,
 desc:"Sailplanes riding thermals cross-country with no engine — silent aviation sport.",
 alias:["sailplane"],tags:["air","adventure","individual"]});

/* ========================== COMBAT SPORTS =========================== */

S({id:"karate",name:"Karate",cat:"combat",sub:"Striking",icon:"🥋",pop:60,
 oly:{ed:"TOKYO2020",b:"past",season:"summer",note:"On the Tokyo 2020 programme — not currently on the Olympic programme."},
 desc:"Kata and kumite from Okinawa — karate reached the Olympics at Tokyo 2020.",
 tags:["combat","individual","indoor","traditional"]});

S({id:"jiu-jitsu",name:"Jiu-Jitsu",cat:"combat",sub:"Grappling",icon:"🥋",pop:44,
 desc:"Traditional Japanese jujutsu and the modern JJIF format — ne-waza, fighting and duo.",
 alias:["jujutsu","jjif"],tags:["combat","individual","indoor","traditional"]});

S({id:"bjj",name:"Brazilian Jiu-Jitsu",cat:"combat",sub:"Grappling",icon:"🥋",pop:66,trend:1,
 desc:"The ground game — guards, passes and submissions refined by the Gracie family and now a global phenomenon.",
 alias:["brazilian jiu jitsu","gracie"],tags:["combat","individual","indoor"]});

S({id:"muay-thai",name:"Muay Thai",cat:"combat",sub:"Striking",icon:"🥊",pop:58,
 desc:"The art of eight limbs — fists, elbows, knees and shins from Thailand's rings.",
 alias:["thai boxing"],tags:["combat","individual","indoor","traditional"]});

S({id:"kickboxing",name:"Kickboxing",cat:"combat",sub:"Striking",icon:"🦵",pop:56,
 desc:"Full contact, K-1 rules and point fighting — punches and kicks under one banner.",
 tags:["combat","individual","indoor"]});

S({id:"mma",name:"MMA",cat:"combat",sub:"Mixed",icon:"🥊",pop:88,feat:1,trend:1,
 desc:"Mixed martial arts — striking and grappling combined in the fastest-growing combat sport on Earth.",
 alias:["mixed martial arts","ufc"],tags:["combat","individual","indoor"]});

S({id:"sambo",name:"Sambo",cat:"combat",sub:"Grappling",icon:"🤼",pop:28,
 desc:"Russia's jacket wrestling — sport sambo and combat sambo, born in the 1920s Red Army.",
 tags:["combat","individual","indoor"]});

S({id:"sumo",name:"Sumo",cat:"combat",sub:"Grappling",icon:"🏯",pop:48,
 desc:"Japan's national sport — 2,000 years of ritual, salt and Yokozuna.",
 tags:["combat","individual","indoor","traditional"]});

S({id:"kendo",name:"Kendo",cat:"combat",sub:"Weapon",icon:"⚔",pop:26,
 desc:"The way of the sword — bamboo shinai, armour and strikes scored with intent.",
 tags:["combat","individual","indoor","traditional"]});

S({id:"wushu",name:"Wushu",cat:"combat",sub:"Chinese Martial Arts",icon:"🐉",pop:36,
 desc:"Taolu forms and sanda kickboxing — Chinese martial arts as a modern competitive sport.",
 alias:["sanda","kung fu sport"],tags:["combat","individual","indoor","traditional"]});

S({id:"capoeira",name:"Capoeira",cat:"combat",sub:"Martial Art",icon:"🎶",pop:38,
 desc:"Fight hidden in dance — berimbau, ginga and roda, created by enslaved Africans in Brazil.",
 tags:["combat","individual","traditional"]});

S({id:"aikido",name:"Aikido",cat:"combat",sub:"Martial Art",icon:"🌀",pop:30,
 desc:"The way of harmonious spirit — blending with an attack rather than meeting it.",
 tags:["combat","individual","indoor","traditional"]});

S({id:"krav-maga",name:"Krav Maga",cat:"combat",sub:"Self-Defence",icon:"🛡",pop:34,
 desc:"Real-world self-defence developed for the Israeli defence forces — practical, not sporting.",
 tags:["combat","individual"]});

S({id:"hapkido",name:"Hapkido",cat:"combat",sub:"Martial Art",icon:"🥷",pop:18,niche:1,
 desc:"Korean art of coordinated energy — joints, throws and strikes together.",
 tags:["combat","individual","traditional"]});

S({id:"lethwei",name:"Lethwei",cat:"combat",sub:"Striking",icon:"🥊",pop:16,niche:1,
 desc:"Burmese bare-knuckle boxing — headbutts allowed, the art of nine limbs.",
 tags:["combat","individual","traditional"]});

S({id:"savate",name:"Savate",cat:"combat",sub:"Striking",icon:"🦶",pop:14,niche:1,
 desc:"French boxe — fencing footwork with boots on, born on the docks of Marseille and Paris.",
 alias:["french boxing"],tags:["combat","individual","indoor"]});

/* =========================== MOTORSPORT ============================= */

S({id:"formula-1",name:"Formula 1",cat:"motor",sub:"Open-Wheel",icon:"🏎",pop:92,fol:5800000,feat:1,trend:1,
 desc:"The pinnacle of motorsport — 24 races, 20 drivers, 1,000+ hp hybrid cars.",
 rel:["formula-2","formula-e","endurance-racing","motogp"],
 alias:["f1","grand prix"],tags:["motor","individual","outdoor"]});

S({id:"formula-2",name:"Formula 2",cat:"motor",sub:"Open-Wheel",icon:"🏎",pop:44,
 desc:"F1's official feeder series — one car for everyone, raw talent decides.",
 alias:["f2"],tags:["motor","individual","outdoor"]});

S({id:"formula-e",name:"Formula E",cat:"motor",sub:"Electric",icon:"🔌",pop:48,fresh:1,
 desc:"All-electric street racing — Gen3 Evo cars through the middle of world cities.",
 alias:["fe","electric racing"],tags:["motor","individual","outdoor"]});

S({id:"rally",name:"Rally",cat:"motor",sub:"Stage",icon:"🚙",pop:60,
 desc:"WRC and beyond — gravel, snow and tarmac stages against the clock with a co-driver reading pace notes.",
 alias:["wrc","rallying"],tags:["motor","team","outdoor"]});

S({id:"karting",name:"Karting",cat:"motor",sub:"Entry",icon:"🏁",pop:42,
 desc:"Where every champion starts — sprint and endurance kart racing from age six up.",
 alias:["go kart"],tags:["motor","individual","outdoor"]});

S({id:"motogp",name:"MotoGP",cat:"motor",sub:"Motorcycle",icon:"🏍",pop:78,trend:1,
 desc:"The premier class of motorcycle grand prix racing — 360+ km/h prototypes.",
 alias:["motorcycle racing","moto gp"],tags:["motor","individual","outdoor"]});

S({id:"superbike",name:"Superbike",cat:"motor",sub:"Motorcycle",icon:"🏍",pop:40,
 desc:"Production-based superbike racing — WSBK and national championships.",
 alias:["wsbk","world superbike"],tags:["motor","individual","outdoor"]});

S({id:"motocross",name:"Motocross",cat:"motor",sub:"Off-Road",icon:"🏍",pop:52,
 desc:"Twelve riders, one gate drop — whoops, berms and 30-foot jumps on dirt.",
 alias:["mx","dirt bike"],tags:["motor","individual","outdoor"]});

S({id:"supercross",name:"Supercross",cat:"motor",sub:"Off-Road",icon:"🏟",pop:38,
 desc:"Motocross moved into stadiums — tighter tracks, bigger whoops, Friday night lights.",
 alias:["sx"],tags:["motor","individual","indoor"]});

S({id:"enduro",name:"Enduro",cat:"motor",sub:"Off-Road",icon:"🌲",pop:26,
 desc:"Long-distance off-road motorcycle racing against the clock through forests and mountains.",
 alias:["hard enduro"],tags:["motor","individual","outdoor","adventure"]});

S({id:"nascar",name:"NASCAR",cat:"motor",sub:"Stock Car",icon:"🏁",pop:66,
 desc:"American stock cars — Daytona 500, pack racing and 200 mph on banked ovals.",
 tags:["motor","individual","outdoor"]});

S({id:"drag-racing",name:"Drag Racing",cat:"motor",sub:"Accelerating",icon:"🚀",pop:34,
 desc:"Zero to 530 km/h in under four seconds — quarter-mile sprints, nitroFunny Cars and Top Fuel.",
 alias:["drag race","top fuel"],tags:["motor","individual","outdoor"]});

S({id:"drifting",name:"Drifting",cat:"motor",sub:"Style",icon:"💨",pop:44,trend:1,
 desc:"Sideways is the point — judged angle, style and smoke in tandem battles.",
 alias:["drift"],tags:["motor","individual","outdoor","urban"]});

S({id:"rallycross",name:"Rallycross",cat:"motor",sub:"Mixed",icon:"🔀",pop:24,
 desc:"Rally cars, four laps, a joker lap and six-wide starts — the shortest, loudest form of rally.",
 tags:["motor","individual","outdoor"]});

S({id:"hill-climb",name:"Hill Climb",cat:"motor",sub:"Time Attack",icon:"⛰",pop:16,niche:1,
 desc:"One car, one hill, one attempt — sprint racing from Pikes Peak to Shelsley Walsh.",
 alias:["pikes peak"],tags:["motor","individual","outdoor"]});

S({id:"gt-racing",name:"GT Racing",cat:"motor",sub:"Sports Car",icon:"🏎",pop:38,
 desc:"GT3 and GT4 machinery — pro-am lineups at Spa, Bathurst and beyond.",
 alias:["gt3"],tags:["motor","team","outdoor"]});

S({id:"touring-car",name:"Touring Car",cat:"motor",sub:"Sports Car",icon:"🚗",pop:26,
 desc:"Bumper-to-bumper saloon car racing — BTCC, DTM and V8 Supercars door to door.",
 alias:["btcc","supercars v8"],tags:["motor","individual","outdoor"]});

S({id:"endurance-racing",name:"Endurance Racing",cat:"motor",sub:"Sports Car",icon:"🔁",pop:46,
 desc:"24 Hours of Le Mans, Daytona and Spa — man and machine against the clock for a full day.",
 alias:["le mans","wec","24 hours"],tags:["motor","team","outdoor","endurance"]});

S({id:"speedway",name:"Speedway",cat:"motor",sub:"Dirt Oval",icon:"🥇",pop:22,
 desc:"500cc bikes, no brakes, broadsiding through four bends — the most spectacular 60 seconds in motorsport.",
 tags:["motor","individual","outdoor"]});

S({id:"powerboating",name:"Powerboating",cat:"motor",sub:"Water",icon:"🚤",pop:18,niche:1,
 desc:"Formula 1 powerboats and offshore racing — motorsport at sea.",
 alias:["f1 powerboat"],tags:["motor","water","individual","outdoor"]});

/* ======================= ACTION / URBAN SPORTS ====================== */

S({id:"skateboarding",name:"Skateboarding",cat:"action",sub:"Street & Park",icon:"🛹",pop:90,oly:"LA28",feat:1,trend:1,
 desc:"Street and park — Olympic since Tokyo 2020 and the beating heart of urban sport culture.",
 disc:[["Street","Men's|Women's"],["Park","Men's|Women's"]],
 alias:["skate","skating street"],tags:["urban","individual","outdoor"]});

S({id:"bmx",name:"BMX",cat:"action",sub:"Bike",icon:"🚲",pop:70,
 oly:{ed:"LA28",b:"disc",season:"summer",note:"Olympic as disciplines of Cycling — BMX Racing and BMX Freestyle."},
 desc:"BMX racing and freestyle park — Olympic as disciplines of cycling, with street roots.",
 disc:[["BMX Racing","Supercross"],["BMX Freestyle","Park"]],
 alias:["bmx racing","bmx freestyle","bike"],tags:["urban","individual","outdoor"]});

S({id:"scootering",name:"Scootering",cat:"action",sub:"Street & Park",icon:"🛴",pop:38,trend:1,
 desc:"Kick scooters grown up — park, street and dirt jumps with the youngest pro scene in action sports.",
 alias:["scooter","kick scooter"],tags:["urban","individual","outdoor"]});

S({id:"freestyle-football",name:"Freestyle Football",cat:"action",sub:"Ball",icon:"⚽",pop:40,
 desc:"Lower, around the world and air moves — the art of the ball without a pitch.",
 alias:["freestyle soccer","secrets"],tags:["urban","individual"]});

S({id:"street-basketball",name:"Street Basketball",cat:"action",sub:"Court",icon:"🏀",pop:48,
 desc:"Blacktop, chain nets and half-court 3s — pickup culture worldwide.",
 alias:["streetball"],tags:["urban","team","outdoor","ball"]});

S({id:"breaking",name:"Breaking",cat:"action",sub:"Dance",icon:"💃",pop:56,
 oly:{ed:"PARIS2024",b:"past",season:"summer",note:"Debuted at Paris 2024 — not on the LA28 programme."},
 desc:"B-boying and B-girling — toprock, footwork, power moves and freezes. Broke into the Olympics at Paris 2024.",
 alias:["breakdance","b-boying"],tags:["urban","individual"]});

S({id:"parkour",name:"Parkour",cat:"action",sub:"Freerunning",icon:"🏙",pop:44,
 desc:"Getting from A to B through anything — the discipline of movement born in the Paris suburbs of Lisses.",
 alias:["freerunning","art du deplacement"],tags:["urban","individual","outdoor"]});

S({id:"roller-sports",name:"Roller Sports",cat:"action",sub:"Wheels",icon:"🛼",pop:34,
 desc:"Artistic and speed roller skating, inline and derby — world games level wheel culture.",
 alias:["roller skating","inline skating","roller derby"],tags:["urban","individual","indoor","outdoor"]});

S({id:"aggressive-inline",name:"Aggressive Inline",cat:"action",sub:"Wheels",icon:"⛓",pop:22,
 desc:"Grinds, soul slides and vert airs on inline skates — the X Games classic.",
 alias:["inline","blading"],tags:["urban","individual","outdoor"]});

S({id:"wcmx",name:"WCMX",cat:"action",sub:"Adaptive",icon:"♿",pop:20,fresh:1,
 desc:"Wheelchair motocross — backflips and grinds in a chair, one of action sport's fastest-growing scenes.",
 alias:["wheelchair motocross"],tags:["urban","individual"]});

/* ====================== ENDURANCE & FITNESS ========================= */

S({id:"running",name:"Running",cat:"endurance",sub:"Road & Track",icon:"🏃",pop:94,fol:5400000,feat:1,
 desc:"From first 5K to track sessions — the world's simplest sport and its biggest community.",
 rel:["trail-running","marathon","athletics","cycling","triathlon"],
 tabs:["Training","Races","Challenges","Athletes","Events","Stats"],
 alias:["jogging","road running"],tags:["individual","outdoor","endurance"]});

S({id:"marathon",name:"Marathon",cat:"endurance",sub:"Road",icon:"🎽",pop:72,trend:1,
 desc:"42.195 km — from Pheidippides' legend to big-city races with 50,000 starters.",
 rel:["running","ultra-running","athletics"],
 alias:["42k","marathon running"],tags:["individual","outdoor","endurance"]});

S({id:"duathlon",name:"Duathlon",cat:"endurance",sub:"Multi",icon:"🔁",pop:20,
 desc:"Run–bike–run without the swim — multisport for the water-shy.",
 tags:["individual","outdoor","endurance"]});

S({id:"crossfit",name:"CrossFit",cat:"endurance",sub:"Functional",icon:"💪",pop:76,trend:1,
 desc:"Constantly varied functional fitness — WODs, boxes and the CrossFit Games.",
 alias:["wod"],tags:["strength","individual","indoor"]});

S({id:"hyrox",name:"Hyrox",cat:"endurance",sub:"Hybrid",icon:"🔥",pop:48,fresh:1,trend:1,
 desc:"8km of running interrupted by 8 workout stations — the fastest-growing fitness race on Earth.",
 tags:["strength","individual","indoor","endurance"]});

S({id:"obstacle-racing",name:"Obstacle Course Racing",cat:"endurance",sub:"Hybrid",icon:"🚧",pop:36,
 desc:"Mud, walls, rigs and barbed wire — OCR from sprint distances to 24-hour World Championships.",
 alias:["ocr","spartan race","tough mudder"],tags:["individual","outdoor","endurance","adventure"]});

S({id:"calisthenics",name:"Calisthenics",cat:"endurance",sub:"Bodyweight",icon:"🤸",pop:48,
 desc:"Bars, streets and bodyweight mastery — muscle ups, planches and battle rap-style battles.",
 alias:["street workout"],tags:["strength","individual","outdoor","urban"]});

S({id:"powerlifting",name:"Powerlifting",cat:"endurance",sub:"Strength",icon:"🏋️",pop:50,
 desc:"Squat, bench, deadlift — the three lifts and the total, raw or equipped.",
 tags:["strength","individual","indoor"]});

S({id:"bodybuilding",name:"Bodybuilding",cat:"endurance",sub:"Physique",icon:"🗿",pop:64,
 desc:"Size, symmetry and conditioning — from local shows to Mr. Olympia.",
 alias:["classic physique"],tags:["strength","individual","indoor"]});

S({id:"strongman",name:"Strongman",cat:"endurance",sub:"Strength",icon:"🐻",pop:40,
 desc:"Logs, yokes, stones and atlas stones — World's Strongest Human events and gym crew culture.",
 alias:["strongwoman"],tags:["strength","individual"]});

S({id:"indoor-rowing",name:"Indoor Rowing",cat:"endurance",sub:"Machine",icon:"🚣",pop:24,
 desc:"The Erg — 2K tests, half-marathons and global online leagues without leaving the shed.",
 alias:["erg","rowing machine"],tags:["individual","indoor","endurance"]});

S({id:"race-walking",name:"Race Walking",cat:"endurance",sub:"Road",icon:"🚶",pop:14,niche:1,
 desc:"One foot on the ground at all times — an Olympic athletics discipline since 1908 and a community of its own.",
 alias:["walking race"],tags:["individual","outdoor","endurance"]});

/* =========================== MIND SPORTS ============================ */

S({id:"chess",name:"Chess",cat:"mind",sub:"Board",icon:"♟",pop:90,fol:3000000,feat:1,
 desc:"The royal game — born in India as chaturanga, now streamed to millions. FIDE-recognised and in every school club.",
 alias:["chaturanga","fide"],tags:["mind","individual","indoor"]});

S({id:"go",name:"Go",cat:"mind",sub:"Board",icon:"⚫",pop:30,
 desc:"Baduk, weiqi, igo — 4,000 years of territory and influence on a 19×19 board.",
 alias:["baduk","weiqi"],tags:["mind","individual","indoor","traditional"]});

S({id:"bridge",name:"Bridge",cat:"mind",sub:"Card",icon:"🃏",pop:24,
 desc:"Contract bridge — the world's deepest card game and a recognised mind sport.",
 alias:["contract bridge"],tags:["mind","team","indoor"]});

S({id:"checkers",name:"Checkers",cat:"mind",sub:"Board",icon:"🔴",pop:26,
 desc:"Draughts — 8×8 and international 10×10 boards, solved on the standard board in 2007.",
 alias:["draughts"],tags:["mind","individual","indoor"]});

S({id:"esports",name:"Esports",cat:"mind",sub:"Competitive Gaming",icon:"🎮",pop:96,fol:9100000,feat:1,trend:1,
 desc:"Organised competitive gaming — MOBAs, shooters, fighting games and sports titles filling stadiums.",
 alias:["gaming","competitive gaming","lol","valorant"],tags:["mind","team","individual","indoor","tech"]});

S({id:"speedcubing",name:"Speedcubing",cat:"mind",sub:"Puzzle",icon:"🧩",pop:32,
 desc:"Solving the Rubik's Cube against the clock — the world record is under 3 seconds.",
 alias:["rubik","cubing","wca"],tags:["mind","individual","indoor","tech"]});

S({id:"carrom",name:"Carrom",cat:"mind",sub:"Board",icon:"🔘",pop:50,
 desc:"The finger-flick board game of every Indian home — from family boards to national championships and world cups.",
 alias:["carrom board"],tags:["mind","individual","indoor","traditional"]});

S({id:"shogi",name:"Shogi",cat:"mind",sub:"Board",icon:"🎴",pop:18,niche:1,
 desc:"Japanese chess — captured pieces return to the board under your banner.",
 alias:["japanese chess"],tags:["mind","individual","indoor","traditional"]});

S({id:"xiangqi",name:"Xiangqi",cat:"mind",sub:"Board",icon:"🀄",pop:26,
 desc:"Chinese chess — the river, the cannon and the general's palace.",
 alias:["chinese chess"],tags:["mind","individual","indoor","traditional"]});

S({id:"othello",name:"Othello",cat:"mind",sub:"Board",icon:"🟢",pop:14,niche:1,
 desc:"Reversi's modern form — flip discs, control corners, one minute to think.",
 alias:["reversi"],tags:["mind","individual","indoor"]});

S({id:"memory-sports",name:"Memory Sports",cat:"mind",sub:"Cognitive",icon:"🧠",pop:12,niche:1,fresh:1,
 desc:"Memorising decks, digits and binary in minutes — trained, ranked and shockingly learnable.",
 alias:["memorization","mnemonics"],tags:["mind","individual","indoor"]});

/* =========================== TEAM SPORTS ============================ */

S({id:"cricket",name:"Cricket",cat:"team",sub:"Bat & Ball",icon:"🏏",pop:96,fol:8200000,oly:{ed:"LA28",b:"la28",season:"summer",note:"T20 cricket returns to the Olympics at LA28, after Paris 1900."},feat:1,trend:1,
 desc:"Tests, ODIs and T20s — from Wankhede nights to village greens, and T20 returns to the Olympics at LA28.",
 rel:["baseball-softball","tennis","football","kabaddi"],
 tabs:["Matches","Players","Records","History","Teams","Events","Community"],
 disc:[["T20","Men's tournament|Women's tournament — the Olympic format at LA28"],["International Formats","Test cricket|ODI|T20I"],["Franchise T20","Leagues around the world"]],
 alias:["t20","odi","test cricket","ipl"],tags:["team","outdoor","ball","traditional"]});

S({id:"kabaddi",name:"Kabaddi",cat:"team",sub:"Contact",icon:"🙏",pop:64,trend:1,
 desc:"Raid, hold, revive — India's ancient pursuit and the PKL's prime-time phenomenon, played under Sanjeevani, Gaminee, Amar and Circle variants.",
 alias:["pro kabaddi","pkl"],tags:["team","indoor","combat","traditional"]});

S({id:"kho-kho",name:"Kho Kho",cat:"team",sub:"Chase",icon:"🏃",pop:34,
 desc:"Chasers, pillars and a flying dive — the chase game born on Maharashtra's mud yards.",
 alias:["kho"],tags:["team","outdoor","traditional"]});

S({id:"american-football",name:"American Football",cat:"team",sub:"Field",icon:"🏈",pop:84,feat:1,
 desc:"The NFL's 100-yard chess match — and flag football takes the sport to LA28.",
 alias:["nfl","gridiron"],tags:["team","outdoor","ball"]});

S({id:"aussie-rules",name:"Australian Rules Football",cat:"team",sub:"Field",icon:"🦘",pop:46,
 desc:"AFL — 18 a side, oval ball, oval ground and the highest-scoring football code on Earth.",
 alias:["afl","aussie rules","footy"],tags:["team","outdoor","ball"]});

S({id:"gaelic-football",name:"Gaelic Football",cat:"team",sub:"Field",icon:"🍀",pop:30,
 desc:"15 a side, solo and fist the ball — Ireland's amateur GAA games played in front of 80,000.",
 alias:["gaa"],tags:["team","outdoor","ball","traditional"]});

S({id:"futsal",name:"Futsal",cat:"team",sub:"Court",icon:"⚽",pop:50,
 desc:"Five-a-side football on a hard court — the tight, fast skills factory behind the world's best feet.",
 tags:["team","indoor","ball"]});

S({id:"netball",name:"Netball",cat:"team",sub:"Court",icon:"🏐",pop:42,
 desc:"Seven positions, no dribbling, zones — played by 20 million, mostly women, across the Commonwealth and beyond.",
 tags:["team","indoor","ball"]});

S({id:"rugby-league",name:"Rugby League",cat:"team",sub:"Field",icon:"🏉",pop:36,
 desc:"13 a side, six tackles — the 1895 split that created rugby's faster, flatter code.",
 alias:["nrl","super league"],tags:["team","outdoor"]});

S({id:"rugby-union",name:"Rugby Union",cat:"team",sub:"Field",icon:"🏉",pop:66,
 desc:"15 a side and the World Cup — scrums, lineouts and the oval-ball brotherhood since 1871.",
 alias:["rugby","six nations"],tags:["team","outdoor"]});

S({id:"ultimate",name:"Ultimate Frisbee",cat:"team",sub:"Field",icon:"🥏",pop:36,
 desc:"Flying disc, seven a side and self-refereed — the spirit of the game is a rule.",
 alias:["ultimate frisbee","disc"],tags:["team","outdoor"]});

S({id:"dodgeball",name:"Dodgeball",cat:"team",sub:"Court",icon:"💣",pop:30,
 desc:"Six balls, five dodgers — if you can dodge a wrench you can dodge a ball.",
 tags:["team","indoor","ball"]});

S({id:"korfball",name:"Korfball",cat:"team",sub:"Court",icon:"🥅",pop:12,niche:1,
 desc:"Dutch mixed-sex ball sport — basketball's cousin with a korf and no running with the ball.",
 tags:["team","indoor","ball"]});

S({id:"quadball",name:"Quadball",cat:"team",sub:"Hybrid",icon:"🧹",pop:18,niche:1,fresh:1,
 desc:"The competitive sport once known as quidditch — full contact, brooms between legs, four flying balls.",
 alias:["quidditch"],tags:["team","outdoor","ball"]});

/* =========================== RACKET SPORTS ========================== */

S({id:"badminton",name:"Badminton",cat:"racket",sub:"Racket",icon:"🏸",pop:80,fol:2200000,oly:"LA28",
 desc:"The fastest racket sport on Earth — smashes over 400 km/h, Olympic since Barcelona 1992.",
 disc:[["Badminton","Singles|Doubles|Mixed doubles"]],
 alias:["shuttle"],tags:["racket","individual","indoor"]});

S({id:"tennis",name:"Tennis",cat:"racket",sub:"Racket",icon:"🎾",pop:93,fol:4100000,oly:"LA28",feat:1,
 desc:"Four Slams, one Olympic gold — singles, doubles and mixed on every surface.",
 disc:[["Tennis","Men's singles & doubles|Women's singles & doubles|Mixed doubles",5]],
 tags:["racket","individual","outdoor"]});

S({id:"table-tennis",name:"Table Tennis",cat:"racket",sub:"Racket",icon:"🏓",pop:74,fol:1400000,oly:"LA28",
 desc:"Ping pong at 100+ km/h — Olympic since Seoul 1988 and played in every garage on Earth.",
 disc:[["Table Tennis","Singles|Team|Mixed doubles"]],
 alias:["ping pong","tt"],tags:["racket","individual","indoor"]});

S({id:"squash",name:"Squash",cat:"racket",sub:"Racket",icon:"🟨",pop:52,fresh:1,
 oly:{ed:"LA28",b:"la28",season:"summer",note:"Squash makes its Olympic debut at LA28."},
 desc:"Tin, corners and CPR — finally Olympic at LA28 after more than a century of waiting.",
 disc:[["Singles","Men's|Women's"],["Doubles","Men's|Women's"]],
 alias:["squash racquets"],tags:["racket","individual","indoor"]});

S({id:"padel",name:"Padel",cat:"racket",sub:"Paddle",icon:"🧱",pop:58,fresh:1,trend:1,
 desc:"Doubles in a glass cage — walls are legal, rallies are eternal, growth is vertical everywhere.",
 tags:["racket","team","outdoor","indoor"]});

S({id:"pickleball",name:"Pickleball",cat:"racket",sub:"Paddle",icon:"🥒",pop:62,fresh:1,trend:1,
 desc:"Paddle, plastic ball, kitchen line — America's fastest-growing sport has gone global.",
 tags:["racket","team","outdoor","indoor"]});

S({id:"racquetball",name:"Racquetball",cat:"racket",sub:"Racket",icon:"🔵",pop:22,
 desc:"The other wall sport — bigger ball, longer rallies, ceiling in play.",
 tags:["racket","individual","indoor"]});

S({id:"beach-tennis",name:"Beach Tennis",cat:"racket",sub:"Racket",icon:"🏖",pop:20,
 desc:"Tennis volleys on sand, no bounces — Brazil and Italy's favourite summer net.",
 tags:["racket","team","outdoor"]});

S({id:"soft-tennis",name:"Soft Tennis",cat:"racket",sub:"Racket",icon:"🎈",pop:14,niche:1,
 desc:"The softer-ball tennis variant — Asian Games medal sport with deep Japanese roots.",
 tags:["racket","individual","outdoor"]});

S({id:"real-tennis",name:"Real Tennis",cat:"racket",sub:"Racket",icon:"👑",pop:8,niche:1,
 desc:"The royal game — the original tennis, played in ~50 courts worldwide including Henry VIII's.",
 alias:["court tennis","jeu de paume"],tags:["racket","individual","indoor","traditional"]});

/* ========================= PRECISION SPORTS ========================= */

S({id:"archery",name:"Archery",cat:"precision",sub:"Aim",icon:"🏹",pop:56,oly:"LA28",
 desc:"Recurve at 70m and compound joining at LA28 — 10,000 years of aiming distilled.",
 disc:[["Archery","Individual|Team|Mixed team|Compound (LA28)"]],
 tags:["precision","individual","outdoor","traditional"]});

S({id:"shooting",name:"Shooting",cat:"precision",sub:"Aim",icon:"🎯",pop:50,oly:"LA28",
 desc:"Rifle, pistol and shotgun — one of the founding sports of the modern Games in 1896.",
 disc:[["Rifle","10m air rifle|50m 3 positions"],["Pistol","10m air pistol|25m rapid fire"],["Shotgun","Trap|Skeet"]],
 tags:["precision","individual","indoor","outdoor"]});

S({id:"darts",name:"Darts",cat:"precision",sub:"Aim",icon:"🎈",pop:60,trend:1,
 desc:"180! From pub boards to Alexandra Palace world finals — tungsten at triple 20.",
 tags:["precision","individual","indoor"]});

S({id:"billiards",name:"Billiards",cat:"precision",sub:"Cue",icon:"🎱",pop:40,
 desc:"Carom billiards — three cushions and a straight rail, the continental cue tradition.",
 alias:["carom","carambole"],tags:["precision","individual","indoor"]});

S({id:"snooker",name:"Snooker",cat:"precision",sub:"Cue",icon:"🟢",pop:52,
 desc:"22 balls, six pockets and a 147 — the Crucible's long green drama, born in India in 1875.",
 tags:["precision","individual","indoor"]});

S({id:"pool",name:"Pool",cat:"precision",sub:"Cue",icon:"🔵",pop:56,
 desc:"Eight-ball, nine-ball and straight pool — the cue game the whole world plays.",
 alias:["8 ball","9 ball","pocket billiards"],tags:["precision","individual","indoor"]});

S({id:"bowling",name:"Bowling",cat:"precision",sub:"Lane",icon:"🎳",pop:54,
 desc:"Ten-pin — 300 perfect games and league nights from Nebraska to Nagoya.",
 alias:["ten pin","tenpin"],tags:["precision","individual","indoor"]});

S({id:"lawn-bowls",name:"Lawn Bowls",cat:"precision",sub:"Bowl",icon:"🥣",pop:22,
 desc:"Bias, draw and the jack — the greens game of the Commonwealth, Commonwealth Games medal sport.",
 alias:["bowls"],tags:["precision","individual","outdoor","traditional"]});

S({id:"petanque",name:"Pétanque",cat:"precision",sub:"Bowl",icon:"🟡",pop:24,
 desc:"Boules in the south of France — pointing, shooting and pastis arguments.",
 alias:["boules","petanque"],tags:["precision","individual","outdoor","traditional"]});

S({id:"bocce",name:"Bocce",cat:"precision",sub:"Bowl",icon:"🥎",pop:20,
 desc:"Italy's ball-throwing close cousin of pétanque — volo and raffa on any flat ground.",
 alias:["boccia"],tags:["precision","individual","outdoor","traditional"]});

S({id:"croquet",name:"Croquet",cat:"precision",sub:"Lawn",icon:"🔨",pop:10,niche:1,
 desc:"Hoops, mallets and tactics — an Olympic sport at Paris 1900, a garden classic ever since.",
 tags:["precision","individual","outdoor","traditional"]});

S({id:"axe-throwing",name:"Axe Throwing",cat:"precision",sub:"Aim",icon:"🪓",pop:26,fresh:1,
 desc:"Hatchets at bullseyes — the backwoods target sport now in urban venues worldwide.",
 alias:["hatchet throwing"],tags:["precision","individual","indoor"]});

/* ==================== TRADITIONAL / CULTURAL ======================== */

S({id:"mallakhamb",name:"Mallakhamb",cat:"traditional",sub:"India",icon:"🎋",pop:24,
 desc:"Gymnastics on a vertical wooden pole or hanging rope — Maharashtra's 12th-century art, India's state sport pride.",
 alias:["mallar khamb","pole yoga"],tags:["traditional","individual","indoor"]});

S({id:"sepak-takraw",name:"Sepak Takraw",cat:"traditional",sub:"Southeast Asia",icon:"🦶",pop:30,
 desc:"Kick volleyball — bicycle-kick spikes over a five-foot net, Southeast Asia's spectacular heritage game.",
 alias:["takraw","sepak"],tags:["traditional","team","outdoor"]});

S({id:"kyudo",name:"Kyudo",cat:"traditional",sub:"Japan",icon:"⛩",pop:14,niche:1,
 desc:"Japanese archery — the way of the bow, where the shot matters less than the spirit of the shot.",
 alias:["japanese archery"],tags:["traditional","individual","precision","outdoor"]});

S({id:"traditional-archery",name:"Traditional Archery",cat:"traditional",sub:"Global",icon:"🌍",pop:18,
 desc:"Horseback, flight and instinctive archery — from Mongolian naadam to Bhutan's national sport and Korean gungdo.",
 alias:["horseback archery","mounted archery","gungdo","bhutan archery"],tags:["traditional","individual","precision","outdoor"]});

S({id:"hurling",name:"Hurling",cat:"traditional",sub:"Ireland",icon:"🌿",pop:22,
 desc:"3,000 years of ash and sliotar — the fastest field sport on grass, played under the GAA since 1884.",
 tags:["traditional","team","outdoor"]});

S({id:"camogie",name:"Camogie",cat:"traditional",sub:"Ireland",icon:"🌸",pop:14,niche:1,
 desc:"The women's ancient game — hurling's sister sport with 100,000+ players in Ireland alone.",
 tags:["traditional","team","outdoor"]});

S({id:"pesapallo",name:"Pesäpallo",cat:"traditional",sub:"Finland",icon:"🧤",pop:10,niche:1,
 desc:"Finnish baseball — vertical pitches, running lanes and a game moved by Lauri Pihkala in the 1910s.",
 alias:["finnish baseball","pesis"],tags:["traditional","team","outdoor","ball"]});

S({id:"rounders",name:"Rounders",cat:"traditional",sub:"UK & Ireland",icon:"⭕",pop:10,niche:1,
 desc:"Bat-and-stool game codified in 1884 — rounders is baseball's Gaelic cousin and a school classic.",
 tags:["traditional","team","outdoor","ball"]});

S({id:"gatka",name:"Gatka",cat:"traditional",sub:"Punjab",icon:"🗡",pop:14,niche:1,
 desc:"Sikh martial art of sticks and swords — a battle-dance tradition now competed worldwide.",
 tags:["traditional","combat","individual"]});

S({id:"silambam",name:"Silambam",cat:"traditional",sub:"Tamil Nadu",icon:"🌾",pop:12,niche:1,
 desc:"Tamil staff fighting — bamboo, footwork and 5,000 references back to the Sangam era.",
 tags:["traditional","combat","individual"]});

S({id:"kalarippayattu",name:"Kalarippayattu",cat:"traditional",sub:"Kerala",icon:"🪷",pop:16,niche:1,
 desc:"From Kerala's kalari training halls — one of the world's oldest living martial systems.",
 alias:["kalari"],tags:["traditional","combat","individual"]});

S({id:"mongolian-wrestling",name:"Mongolian Wrestling",cat:"traditional",sub:"Mongolia",icon:"🦅",pop:12,niche:1,
 desc:"Bökh at Naadam — jackets, eagle dances and a tradition unbroken since Genghis Khan's army.",
 alias:["bokh","bukh"],tags:["traditional","combat","individual","outdoor"]});

S({id:"oil-wrestling",name:"Oil Wrestling",cat:"traditional",sub:"Türkiye",icon:"🛢",pop:10,niche:1,
 desc:"Kırkpınar since 1346 — pehlivans oiled in olive oil, grappling for the golden belt.",
 alias:["kirkpinar","yagli gures","turkish oil wrestling"],tags:["traditional","combat","individual","outdoor"]});

S({id:"calcio-storico",name:"Calcio Storico",cat:"traditional",sub:"Italy",icon:"🏛",pop:10,niche:1,
 desc:"Florence's historic football since 1530 — 27 a side, punches legal, sand and lilies in Piazza Santa Croce.",
 alias:["calcio fiorentino","historic football"],tags:["traditional","team","outdoor","combat"]});

/* =========================== OTHER SPORTS =========================== */

S({id:"polo",name:"Polo",cat:"other",sub:"Equestrian",icon:"🐴",pop:24,
 desc:"Four a side on horseback — the sport of kings, from Persia 2,500 years ago to Argentina today.",
 tags:["animal","team","outdoor","traditional"]});

S({id:"horse-racing",name:"Horse Racing",cat:"other",sub:"Equestrian",icon:"🏇",pop:66,trend:1,
 desc:"Flat, jump and harness racing — thoroughbreds, derbies and the Sport of Kings' data era.",
 alias:["flat racing","derby","horse race"],tags:["animal","outdoor"]});

S({id:"rodeo",name:"Rodeo",cat:"other",sub:"Equestrian",icon:"🤠",pop:30,
 desc:"Broncs, bulls and barrels — the working-ranch skills of the American West turned competitive.",
 tags:["animal","individual","outdoor"]});

S({id:"cheerleading",name:"Cheerleading",cat:"other",sub:"Performance",icon:"📣",pop:44,trend:1,
 desc:"Stunts, tumbling and pyramids — from sidelines to its own world championships.",
 tags:["team","indoor"]});

S({id:"dancesport",name:"DanceSport",cat:"other",sub:"Performance",icon:"🕺",pop:38,
 desc:"Ballroom and Latin competitive dancing — standard, latin, smooth and ten-dance.",
 alias:["ballroom dancing"],tags:["individual","team","indoor"]});

S({id:"drone-racing",name:"Drone Racing",cat:"other",sub:"Tech",icon:"🛸",pop:26,fresh:1,
 desc:"FPV quadcopters at 180 km/h through neon gates — motorsport for the digital age.",
 alias:["fpv","fpv racing"],tags:["tech","individual","indoor","outdoor","motor"]});

S({id:"aerobatics",name:"Aerobatics",cat:"other",sub:"Air",icon:"✈",pop:12,niche:1,
 desc:"Competition aerobatics — loops, rolls and spins judged in an aerial box since 1934.",
 alias:["air shows sport"],tags:["air","individual","outdoor","adventure"]});

S({id:"tug-of-war",name:"Tug of War",cat:"other",sub:"Strength",icon:"🪢",pop:18,
 desc:"Eight pullers, one rope — an official Olympic sport from 1900 to 1920, alive in club worlds today.",
 oly:{ed:"HISTORIC",b:"past",season:"summer",note:"Olympic sport 1900–1920."},
 tags:["strength","team","outdoor","traditional"]});

S({id:"angling",name:"Competitive Angling",cat:"other",sub:"Water",icon:"🎣",pop:34,
 desc:"Match fishing, fly casting and carp cups — the world's biggest participation pastime as a sport.",
 alias:["fishing","match fishing"],tags:["water","individual","outdoor"]});

S({id:"bandy",name:"Bandy",cat:"other",sub:"Ice",icon:"🟠",pop:10,niche:1,
 desc:"Football on ice with a small orange ball and 11 a side — the winter team sport of Russia and Scandinavia.",
 alias:["russian hockey","bandy hockey"],tags:["ice","team","outdoor"]});

S({id:"bossaball",name:"Bossaball",cat:"other",sub:"Hybrid",icon:"🎪",pop:8,niche:1,fresh:1,
 desc:"Volleyball, football, gymnastics and capoeira on a pitch with trampolines — invented in Spain, huge in Brazil.",
 tags:["team","ball","outdoor"]});

S({id:"fistball",name:"Fistball",cat:"other",sub:"Field",icon:"✊",pop:8,niche:1,
 desc:"Five a side, fist over ribbon net — volleyball's Germanic ancestor with 5,000+ club teams worldwide.",
 tags:["team","outdoor","ball"]});

/* ============================================================
   CURATED HISTORY — real, verifiable milestones per sport.
   Everything else gets an honest community-driven "write the
   history" state (no invented facts).
   ============================================================ */
window.SPORT_HISTORY = {
  cricket:[
    {y:"1877",e:"First Test match",d:"Australia beat England at the MCG — international sport's oldest rivalry begins."},
    {y:"1983",e:"India wins the World Cup",d:"Kapil Dev lifts the Prudential World Cup at Lord's, changing Indian cricket forever."},
    {y:"2007",e:"First T20 World Cup title",d:"India beat Pakistan in a thrilling final in Johannesburg."},
    {y:"2011",e:"India wins the ODI World Cup at home",d:"MS Dhoni's six seals the title in Mumbai after a 28-year wait."}],
  mountaineering:[
    {y:"1786",e:"Birth of alpinism",d:"Michel-Gabriel Paccard and Jacques Balmat make the first ascent of Mont Blanc."},
    {y:"1953",e:"Everest climbed",d:"Edmund Hillary and Tenzing Norgay make the first confirmed ascent of the world's highest peak."},
    {y:"1978",e:"Everest without supplemental oxygen",d:"Reinhold Messner and Peter Habeler complete the first oxygen-free ascent."},
    {y:"1984",e:"Bachendri Pal summits Everest",d:"She becomes the first Indian woman to reach the top of the world."}],
  running:[
    {y:"1954",e:"The four-minute mile",d:"Roger Bannister becomes the first person to run a mile in under four minutes."},
    {y:"1960",e:"Barefoot marathon gold",d:"Abebe Bikila wins Olympic marathon gold running barefoot through Rome."},
    {y:"2019",e:"Sub two-hour marathon",d:"Eliud Kipchoge runs a marathon distance in 1:59:40 in an unofficial event."}],
  athletics:[
    {y:"776 BC",e:"The ancient stadion",d:"Coroebus of Elis wins the only event at the first recorded ancient Olympic Games."},
    {y:"1896",e:"Athletics anchors the modern Games",d:"Track and field headlines the first modern Olympics in Athens."},
    {y:"2009",e:"Bolt's Berlin doubles",d:"Usain Bolt sets the 100m (9.58) and 200m (19.19) world records that still stand."}],
  aquatics:[
    {y:"1896",e:"Swimming at the first modern Games",d:"Alfréd Hajós wins two golds in the open sea off Piraeus."},
    {y:"1972",e:"Spitz's seven golds",d:"Mark Spitz wins seven swimming golds at Munich."},
    {y:"2008",e:"Phelps' eight golds",d:"Michael Phelps wins eight gold medals at a single Games in Beijing."}],
  football:[
    {y:"1863",e:"The Laws of the Game",d:"The Football Association codifies the rules in London."},
    {y:"1930",e:"First World Cup",d:"Uruguay lift the inaugural FIFA World Cup on home soil."},
    {y:"2024",e:"The modern era",d:"Football's Olympic, club and international calendars span every continent."}],
  basketball:[
    {y:"1891",e:"Invented in Springfield",d:"Dr. James Naismith nails up peach baskets and writes 13 rules."},
    {y:"1936",e:"Olympic debut",d:"Basketball joins the Games outdoors, in the rain, in Berlin."},
    {y:"1992",e:"The Dream Team",d:"The USA's NBA stars take Barcelona by storm and globalise the game."}],
  tennis:[
    {y:"1877",e:"First Wimbledon",d:"The All England Club holds the first championships."},
    {y:"1896",e:"Olympic from the start",d:"Tennis appears at the first modern Games (and returns full-time from 1988)."},
    {y:"1968",e:"The Open Era",d:"Professionals are admitted into the Grand Slams."}],
  "formula-1":[
    {y:"1950",e:"First world championship race",d:"Giuseppe Farina wins at Silverstone in the first F1 championship grand prix."},
    {y:"1976",e:"The Hunt–Lauda season",d:"One of sport's great title fights, decided at a rain-soaked Fuji."},
    {y:"2021",e:"Title decided on the last lap",d:"Verstappen passes Hamilton at Abu Dhabi for a first championship."}],
  chess:[
    {y:"6th c.",e:"Born in India",d:"Chaturanga emerges in northern India — chess's earliest ancestor."},
    {y:"1886",e:"First world championship",d:"Wilhelm Steinitz beats Johannes Zukertort to become the first official world champion."},
    {y:"1997",e:"Man vs machine",d:"Deep Blue defeats Garry Kasparov; AlphaGo's Go moment follows for board games in 2016."}],
  badminton:[
    {y:"1873",e:"Badminton House",d:"The game takes its name from the Duke of Beaufort's estate in Gloucestershire."},
    {y:"1992",e:"Olympic debut",d:"Badminton medals first awarded at Barcelona 1992."}],
  "table-tennis":[
    {y:"1926",e:"ITTF founded",d:"The world governing body is established in Berlin."},
    {y:"1988",e:"Olympic debut",d:"Table tennis joins the Games at Seoul."}],
  squash:[{y:"1830s",e:"Invented at Harrow School",d:"Pupils discover a punctured racquet ball 'squashes' on impact — a sport is born."},
          {y:"2023",e:"Olympic at last",d:"Squash is confirmed for LA28 after several near misses."}],
  judo:[{y:"1882",e:"Kano's Kodokan",d:"Jigoro Kano founds judo at the Kodokan in Tokyo."},
        {y:"1964",e:"Olympic in Japan",d:"Judo joins the programme at the Tokyo Games."}],
  sumo:[{y:"712",e:"First written records",d:"Sumo's mythical origins are recorded in Japan's earliest chronicles."},
        {y:"1909",e:"Kokugikan opens",d:"Sumo moves into its first permanent national arena in Tokyo."}],
  karate:[{y:"1900s",e:"From Okinawa to Japan",d:"Gichin Funakoshi brings karate from Okinawa to mainland Japan."},
          {y:"2021",e:"Olympic in Tokyo",d:"Karate features at the Tokyo 2020 Games held in 2021."}],
  boxing:[{y:"688 BC",e:"Ancient Olympic sport",d:"Boxing (pygmachia) joins the ancient Games."},
          {y:"1867",e:"Queensberry Rules",d:"Gloves, rounds and the ten-count define modern boxing."}],
  wrestling:[{y:"708 BC",e:"Ancient Olympic sport",d:"Wrestling joins the ancient Games."},
             {y:"1896",e:"Modern Olympic sport",d:"Wrestling features at the first modern Games."}],
  cycling:[{y:"1903",e:"First Tour de France",d:"Maurice Garin wins the inaugural Tour."},
           {y:"1969",e:"Merckx's first Tour",d:"Eddy Merckx begins the most dominant career cycling has seen."}],
  gymnastics:[{y:"1896",e:"Olympic founding sport",d:"Gymnastics appears at the first modern Games."},
              {y:"1976",e:"Comăneci's perfect 10",d:"Nadia Comăneci scores the first perfect 10 in Olympic gymnastics."}],
  "ice-hockey":[{y:"1875",e:"First organised game",d:"The first recorded indoor game is played at McGill University, Montreal."},
                {y:"1920",e:"Olympic debut",d:"Ice hockey joins the Games at Antwerp."}],
  "figure-skating":[{y:"1908",e:"First winter Olympic sport",d:"Figure skating competes at the London 1908 Summer Games, before winter Games existed."},
                    {y:"1976",e:"The triple axel era begins",d:"Jumps keep evolving toward today's quads."}],
  curling:[{y:"1511",e:"First recorded stone",d:"A curling stone dated 1511 is found in Scotland."},
           {y:"1998",e:"Full Olympic sport",d:"Curling joins the winter programme at Nagano."}],
  golf:[{y:"1754",e:"The R&A at St Andrews",d:"The Royal and Ancient Golf Club codifies the rules."},
        {y:"1860",e:"First Open Championship",d:"Willie Park Sr. wins at Prestwick."},
        {y:"2016",e:"Back in the Games",d:"Golf returns after 112 years at Rio 2016."}],
  "american-football":[{y:"1869",e:"First college game",d:"Rutgers beats Princeton 6–4 in the first intercollegiate football game."},
                       {y:"1920",e:"The NFL is founded",d:"American professional football organises at a Canton car dealership."},
                       {y:"1967",e:"First Super Bowl",d:"The Green Bay Packers win the first AFL–NFL championship game."}],
  "rugby-union":[{y:"1823",e:"The Webb Ellis legend",d:"Rugby school folklore credits William Webb Ellis with picking up the ball."},
                 {y:"1871",e:"The RFU forms",d:"The Rugby Football Union codifies the game."},
                 {y:"1987",e:"First World Cup",d:"New Zealand win the inaugural Rugby World Cup."}],
  kabaddi:[{y:"1938",e:"National exposure",d:"Kabaddi features at the Indian Olympic Games demonstration."},
           {y:"2014",e:"PKL era",d:"The Pro Kabaddi League turns a village game into prime-time television."}],
  "kho-kho":[{y:"1914",e:"First organised rules",d:"The first rules of Kho Kho are drafted in Pune, Maharashtra."},
             {y:"1987",e:"National championship era",d:"Kho Kho spreads through schools and nationals across India."}],
  mallakhamb:[{y:"12th c.",e:"Classical roots",d:"Mallakhamb appears in classical Indian texts as training for wrestlers."},
              {y:"2011",e:"On the world stage",d:"Mallakhamb demos reach global audiences as India reclaims the art."}],
  "sepak-takraw":[{y:"15th c.",e:"Malacca's royal courts",d:"Takraw games appear in the Malay chronicles."},
                  {y:"1965",e:"Regional sport",d:"Sepak takraw debuts at the Southeast Asian Peninsular Games."}],
  mma:[{y:"1993",e:"The modern era",d:"UFC 1 in Denver asks which martial art wins — the answer becomes MMA."},
       {y:"2000s",e:"The unified rules",d:"Athletic commissions unify rules and the sport goes mainstream."}],
  bjj:[{y:"1920s",e:"The Gracie era",d:"Mitsuyo Maeda's students in Brazil develop what becomes BJJ."},
       {y:"1990s",e:"Global spread",d:"The Gracie family takes BJJ to the world."}],
  "muay-thai":[{y:"16th c.",e:"Warrior art",d:"Siamese soldiers train in muay boran, the ancestor of muay thai."},
               {y:"2021",e:"IOC recognition",d:"Muay thai receives full IOC recognition."}],
  swimming:[{y:"1837",e:"First organised races",d:"Competitive swimming races are held in London."},
            {y:"1924",e:"Johnny Weissmuller",d:"The Tarzan-to-be dominates Paris."}],
  esports:[{y:"1972",e:"First tournament",d:"Stanford students compete at the Intergalactic Spacewar! Olympics."},
           {y:"2000s",e:"Pro leagues",d:"Korea's StarCraft leagues invent modern esports."},
           {y:"2023",e:"Olympic Esports Games",d:"The IOC commits to Olympic Esports Games."}],
  surfing:[{y:"1778",e:"First European accounts",d:"Cook's expedition records surfing in Hawaii."},
           {y:"2020",e:"Olympic debut",d:"Surfing joins the Games at Tsurigasaki, Japan."}],
  skateboarding:[{y:"1950s",e:"Sidewalk surfing",d:"California surfers bolt wheels to planks for flat days."},
                 {y:"2020",e:"Olympic debut",d:"Skateboarding joins the Games at Tokyo."}],
  breaking:[{y:"1970s",e:"Born in the Bronx",d:"Breaking rises from New York block parties."},
            {y:"2024",e:"Olympic debut",d:"Breaking features at Paris 2024."}],
  parkour:[{y:"1980s",e:"Lisses, France",d:"The Belle family and friends develop l'art du déplacement."},
           {y:"2010s",e:"Global discipline",d:"Parkour becomes a recognised sport discipline in several countries."}],
  "water-skiing":[{y:"1922",e:"Ralph Samuelson",d:"Samuelon skis on Lake Pepin, Minnesota — water skiing is born."}],
  polo:[{y:"600 BC",e:"Persian origins",d:"Polo emerges as cavalry training in ancient Persia."},
        {y:"1876",e:"Modern rules",d:"The modern game is codified and spreads through the British Empire."}],
  "horse-racing":[{y:"1780",e:"The Derby",d:"The 12th Earl of Derby founds the Epsom Derby."}],
  "tug-of-war":[{y:"1900",e:"Olympic sport",d:"Tug of war joins the Olympic programme — it stays until 1920."}],
  snooker:[{y:"1875",e:"Born in India",d:"British Army officers in Jabalpur invent snooker."},
           {y:"1927",e:"First World Championship",d:"Joe Davis wins the first world title."}],
  darts:[{y:"1900s",e:"From pub to stage",d:"Darts moves from pubs to organised leagues."},
         {y:"1994",e:"The PDC era",d:"Televised professional darts explodes."}],
  marathon:[{y:"490 BC",e:"The legend of Pheidippides",d:"The runner of Marathon enters Greek legend."},
            {y:"1896",e:"The modern marathon",d:"The race concludes the first modern Olympics in Athens."},
            {y:"1908",e:"The 42.195 km distance",d:"The London Olympics fixes today's distance — royal family included."}],
  "dragon-boat":[{y:"~300 BC",e:"Qu Yuan festival",d:"Dragon boat racing is tied to the Duanwu festival's 2,000-plus-year history."}],
  "sport-climbing":[{y:"1980s",e:"Sport climbing era",d:"Bolts and indoor walls take climbing from the Alps to the masses."},
                    {y:"2020",e:"Olympic debut",d:"Sport climbing joins the Games at Tokyo."}],
  "trail-running":[{y:"2003",e:"Skyrunning goes global",d:"Mountain running circuits unite into a world series era."}],
  paragliding:[{y:"1978",e:"First foot-launch flights",d:"Pilots at Mieussy, France launch the modern paraglider."}],
  skydiving:[{y:"1797",e:"Garnerin's parachute",d:"André-Jacques Garnerin makes the first parachute descent."},
             {y:"1951",e:"First world championships",d:"Competitive skydiving begins."}],
  "ski-jumping":[{y:"1868",e:"Sondre Norheim",d:"The father of modern skiing pioneers jumping technique."},
                 {y:"1924",e:"First winter Games",d:"Ski jumping is there at Chamonix 1924."}],
  "alpine-skiing":[{y:"1936",e:"Olympic debut",d:"Alpine combined joins the Garmisch-Partenkirchen Games."}],
  biathlon:[{y:"18th c.",e:"Military patrol",d:"Scandinian soldiers ski-and-shoot contests evolve into biathlon."},
            {y:"1960",e:"Olympic debut",d:"Individual biathlon joins the Squaw Valley Games."}],
  snowboard:[{y:"1965",e:"The Snurfer",d:"Sherman Poppen ties two skis together for his daughters."},
             {y:"1998",e:"Olympic debut",d:"Snowboarding joins the Nagano Games."}],
  "speed-skating":[{y:"1889",e:"First world championships",d:"The world's first skating world championships are held in Amsterdam."},
                   {y:"1924",e:"Founding winter sport",d:"Speed skating is there at Chamonix 1924."}],
  netball:[{y:"1895",e:"Codified",d:"Netball's first rules are written after Clara Baer misreads basketball diagrams."}],
  lacrosse:[{y:"1100s",e:"The Creator's game",d:"Indigenous North Americans play baggataway long before Europe arrived."},
            {y:"1904",e:"Olympic medal sport",d:"Lacrosse features at the St. Louis and London Games."},
            {y:"2028",e:"Sixes at LA28",d:"Lacrosse returns to the Games in the Sixes format."}],
  volleyball:[{y:"1895",e:"Invented in Holyoke",d:"William G. Morgan creates mintonette — soon volleyball."},
              {y:"1964",e:"Olympic debut",d:"Volleyball joins the Tokyo Games."}],
  hockey:[{y:"1928",e:"India's golden run",d:"India win the first of eight Olympic men's hockey golds in Amsterdam."}],
  handball:[{y:"1917",e:"Modern rules",d:"Field handball's modern rules are written in Germany."},
            {y:"1972",e:"Indoor era",d:"Indoor handball joins the Munich Games."}],
  weightlifting:[{y:"1891",e:"First world championships",d:"Weightlifting holds the first world championships in any sport."},
                 {y:"1896",e:"Founding Olympic sport",d:"Weightlifting is at the first modern Games."}],
  archery:[{y:"1900",e:"Early Olympic sport",d:"Archery appears at Paris 1900."},
           {y:"1972",e:"Modern return",d:"Archery returns permanently to the Games at Munich."}],
  shooting:[{y:"1896",e:"Founding Olympic sport",d:"Shooting is on the programme of the first modern Games."}],
  go:[{y:"~2000 BC",e:"Legendary origin",d:"Chinese legend credits Emperor Yao with inventing go for his son."},
      {y:"2016",e:"AlphaGo",d:"AI defeats Lee Sedol 4–1, a landmark for games and machine learning."}],
  bridge:[{y:"1925",e:"Contract bridge",d:"Harold Vanderbilt modernises the auction into today's game."}],
  "aussie-rules":[{y:"1858",e:"First recorded match",d:"Melbourne rules football is played between Scotch College and Melbourne Grammar."},
                  {y:"1896",e:"VFL founded",d:"The Victorian league becomes the AFL's foundation."}],
  "gaelic-football":[{y:"1884",e:"The GAA",d:"The Gaelic Athletic Association is founded in Thurles."}],
  "speedcubing":[{y:"1982",e:"First world championship",d:"Budapest hosts the first Rubik's Cube world championship."},
                 {y:"2023",e:"Sub-4 seconds",d:"Max Park sets a 3.13-second world record."}],
  windsurfing:[{y:"1967",e:"Windsurfing patented",d:"Newman Darby's sailboard ideas lead to the modern windsurfer."}],
  kitesurfing:[{y:"1999",e:"Modern kites",d:"The Legaignoux brothers' bow kite makes kitesurfing safe and global."}],
  powerlifting:[{y:"1972",e:"IPF founded",d:"The International Powerlifting Federation formalises the three lifts."}],
  bodybuilding:[{y:"1965",e:"First Mr. Olympia",d:"Larry Scott wins the inaugural Olympia in New York."}],
  crossfit:[{y:"2000",e:"CrossFit founded",d:"Greg Glassman opens the first affiliate in Santa Cruz."},
            {y:"2007",e:"First CrossFit Games",d:"The sport of fitness begins."}],
  strongman:[{y:"1977",e:"World's Strongest Man",d:"The first WSM contest is held."}],
  "formula-e":[{y:"2014",e:"First race",d:"Formula E's first championship race runs through Beijing."}],
  motogp:[{y:"1949",e:"First world championship",d:"Grand Prix motorcycle racing's world championship begins."},
          {y:"2002",e:"MotoGP era",d:"The premier class becomes MotoGP."}],
  nascar:[{y:"1948",e:"NASCAR founded",d:"Bill France Sr. organises stock car racing at Daytona Beach."},
          {y:"1959",e:"Daytona International Speedway",d:"NASCAR's cathedral opens with the first Daytona 500."}],
  "endurance-racing":[{y:"1923",e:"First 24 Hours of Le Mans",d:"The greatest endurance race runs for the first time."},
                      {y:"1966",e:"Ford v Ferrari",d:"Ford GT40s finish 1-2-3 at Le Mans."}],
  "baseball-softball":[{y:"1845",e:"The Knickerbocker rules",d:"Alexander Cartwright's club codifies baseball's rules in New York."},
                       {y:"1996",e:"Softball's Olympic debut",d:"Softball joins the Atlanta Games."},
                       {y:"2028",e:"Back at LA28",d:"Baseball & softball return after Tokyo 2020."}],
  "ski-mountaineering":[{y:"2026",e:"Olympic debut",d:"Skimo's sprint and mixed relay events debut at Milano Cortina."}],
  calisthenics:[{y:"2010s",e:"World bars era",d:"Street workout world cups take calisthenics global."}],
  pickleball:[{y:"1965",e:"Invented on Bainbridge Island",d:"Three dads invent a game for their kids — named after a 'pickle boat'."}],
  padel:[{y:"1969",e:"Enclosed in Acapulco",d:"Enrique Corcuera builds the first walled padel court."}],
  "horse-racing2":null, "":null
};
delete window.SPORT_HISTORY[""]; delete window.SPORT_HISTORY["horse-racing2"];

/* Curated "all-time greats" (factual, public figures) for major sports. */
window.SPORT_LEGENDS = {
  athletics:["Usain Bolt","Carl Lewis","Paavo Nurmi","Allyson Felix","Elaine Thompson-Herah"],
  aquatics:["Michael Phelps","Mark Spitz","Katie Ledecky","Ian Thorpe","Adam Peaty"],
  football:["Pelé","Diego Maradona","Lionel Messi","Cristiano Ronaldo","Marta"],
  cricket:["Sachin Tendulkar","Don Bradman","Virat Kohli","Muttiah Muralitharan","Ellyse Perry"],
  basketball:["Michael Jordan","LeBron James","Kareem Abdul-Jabbar","Diana Taurasi","Magic Johnson"],
  tennis:["Roger Federer","Rafael Nadal","Novak Djokovic","Serena Williams","Margaret Court"],
  "formula-1":["Lewis Hamilton","Michael Schumacher","Ayrton Senna","Juan Manuel Fangio","Max Verstappen"],
  motogp:["Valentino Rossi","Giacomo Agostini","Marc Márquez","Casey Stoner","Jorge Lorenzo"],
  chess:["Garry Kasparov","Magnus Carlsen","Anatoly Karpov","Viswanathan Anand","Bobby Fischer"],
  gymnastics:["Nadia Comăneci","Simone Biles","Larisa Latynina","Kōhei Uchimura","Olga Korbut"],
  boxing:["Muhammad Ali","Sugar Ray Robinson","Mary Kom","Joe Louis","Floyd Mayweather Jr."],
  wrestling:["Aleksandr Karelin","Dan Gable","Yogeshwar Dutt","Sushil Kumar","Jordan Burroughs"],
  "ice-hockey":["Wayne Gretzky","Mario Lemieux","Sidney Crosby","Hayley Wickenheiser","Alex Ovechkin"],
  "figure-skating":["Sonja Henie","Yuzuru Hanyu","Kim Yuna","Dick Button","Evgenia Medvedeva"],
  cycling:["Eddy Merckx","Fausto Coppi","Miguel Induráin","Marianne Vos","Tadej Pogačar"],
  skiing:null,
  "alpine-skiing":["Ingemar Stenmark","Mikaela Shiffrin","Marcel Hirscher","Lindsey Vonn","Hermann Maier"],
  biathlon:["Ole Einar Bjørndalen","Martin Fourcade","Magdalena Neuner","Johannes Thingnes Bø","Darya Domracheva"],
  "cross-country-skiing":["Marit Bjørgen","Bjørn Dæhlie","Petter Northug","Therese Johaug","Ivar Formo"],
  swimming:null,
  snooker:["Ronnie O'Sullivan","Stephen Hendry","Steve Davis","Mark Selby","Joe Davis"],
  darts:["Phil Taylor","Michael van Gerwen","Eric Bristow","Gerwyn Price","Luke Littler"],
  mma:["Anderson Silva","Jon Jones","Khabib Nurmagomedov","Amanda Nunes","Georges St-Pierre"],
  golf:["Tiger Woods","Jack Nicklaus","Ben Hogan","Annika Sörenstam","Bobby Jones"],
  volleyball:null,
  badminton:["Lin Dan","Lee Chong Wei","PV Sindhu","Taufik Hidayat","Carolina Marín"],
  "table-tennis":["Ma Long","Deng Yaping","Zhang Jike","Ma Lin","Ichiro Ogimura"],
  "snowboard":["Shaun White","Chloe Kim","Ayumu Hirano","Anna Gasser","Jamie Anderson"],
  mountaineering:["Edmund Hillary","Tenzing Norgay","Reinhold Messner","Bachendri Pal","Arunima Sinha"],
  judo:["Teddy Riner","Ilias Iliadis","Ryoko Tani","Willem Ruska","Kayla Harrison"],
  esports:["Faker","s1mple","N0tail","Ian Porter","KuroKy"],
  sumo:["Taihō","Hakuhō","Chiyonofuji","Akebono","Asashōryū"]
};
delete window.SPORT_LEGENDS.swimming; delete window.SPORT_LEGENDS.volleyball; delete window.SPORT_LEGENDS.skiing;
