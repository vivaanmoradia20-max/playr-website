/* ============================================================
   PLAYR — SPORTS CATALOG · PART 1
   ------------------------------------------------------------
   The PLAYR sports database. Every sport is registered with S({...}).
   To add a new sport later, just add one more S({ ... }) line —
   the whole platform (Discover, Search, Sport Universe, filters,
   recommendations) picks it up automatically.

   Required fields (others get smart defaults):
     id    : unique kebab-case id        name : display name
     cat   : SPORT_CATEGORIES id         icon : emoji glyph
     desc  : one-line description        tags : attribute tags
   Optional fields:
     sub   : subcategory          pop : popularity 0-100
     fol   : follower count (demo platform count)
     oly   : "LA28" | "MC26" | {ed,season,b,note}  → Olympic programme info
     disc  : [[discipline, "event|event|event", eventCount?], ...]
     alias : extra search terms   rel : curated related sport ids
     tabs  : custom Sport Universe tabs
     risk  : "high" → community/info only (no challenge mechanics)
   ============================================================ */

window.SPORT_CATEGORIES = [
  {id:"olympic-summer", name:"Olympic Summer Sports",  short:"Summer Olympic", icon:"☀", accent:"#46E0FF", blurb:"The summer Olympic programme — Paris 2024 core sports continue to LA28."},
  {id:"olympic-winter", name:"Olympic Winter Sports",  short:"Winter Olympic", icon:"❄", accent:"#A9D9FF", blurb:"The Milano Cortina 2026 programme — 16 sports on snow and ice."},
  {id:"adventure",      name:"Adventure & Outdoor",    short:"Adventure",     icon:"⛰", accent:"#B98CFF", blurb:"Mountains, air, rivers and trails — community & expedition culture."},
  {id:"water",          name:"Water Sports",           short:"Water",         icon:"🌊", accent:"#2FD3C5", blurb:"Everything that happens on, in and under water."},
  {id:"combat",         name:"Combat Sports",          short:"Combat",        icon:"🥊", accent:"#FF6A4D", blurb:"Striking, grappling and martial arts disciplines."},
  {id:"motor",          name:"Motorsport",             short:"Motorsport",    icon:"🏁", accent:"#FFB13D", blurb:"From karting to Formula 1 — machines and riders at the limit."},
  {id:"action",         name:"Action / Urban Sports",  short:"Action",        icon:"🛹", accent:"#E0F808", blurb:"Street, park and freestyle culture."},
  {id:"endurance",      name:"Endurance & Fitness",    short:"Endurance",     icon:"🔥", accent:"#6BE8B8", blurb:"Running, strength and functional fitness communities."},
  {id:"mind",           name:"Mind Sports",            short:"Mind",          icon:"♟",  accent:"#FF8CD8", blurb:"Where the brain does the competing."},
  {id:"team",           name:"Team Sports",            short:"Team",          icon:"🤝", accent:"#7FA8FF", blurb:"Ball and invasion games played as a squad."},
  {id:"racket",         name:"Racket Sports",          short:"Racket",        icon:"🎾", accent:"#FFE066", blurb:"Rackets, paddles, walls and nets."},
  {id:"precision",      name:"Precision Sports",       short:"Precision",     icon:"🎯", accent:"#98F05A", blurb:"Aim, touch and repeatable accuracy."},
  {id:"traditional",    name:"Traditional / Cultural", short:"Traditional",   icon:"🌏", accent:"#FF9E7A", blurb:"Heritage games and martial cultures from every continent."},
  {id:"other",          name:"Other Sports",           short:"Other",         icon:"✳",  accent:"#A0A8B8", blurb:"Everything else PLAYR is home to."}
];

window.__PLAYR_RAW = [];
function S(o){ __PLAYR_RAW.push(o); }

/* ============================================================
   OLYMPIC SUMMER SPORTS
   Sport → Discipline → Events, using official Olympic structure.
   LA28 programme = Paris 2024 core + 5 additional sports.
   ============================================================ */

/* One official Olympic sport, five disciplines (World Aquatics). */
S({id:"aquatics",name:"Aquatics",cat:"olympic-summer",sub:"Water",icon:"🏊",pop:92,fol:5900000,oly:"LA28",feat:1,
 desc:"The Olympic sport of swimming in all its forms — pool racing, open water, diving, artistic swimming and water polo.",
 disc:[["Swimming","50m–1500m freestyle|Butterfly · backstroke · breaststroke|Individual medleys|Relays"],
       ["Marathon Open Water","10km marathon swim"],["Artistic Swimming","Duet|Team"],
       ["Diving","3m springboard|10m platform|Synchronised events"],["Water Polo","Men's tournament|Women's tournament"]],
 alias:["swimming","diving","water polo","artistic swimming","open water"],tags:["water","individual","team","outdoor","indoor"]});

S({id:"athletics",name:"Athletics",cat:"olympic-summer",sub:"Track & Field",icon:"🏃",pop:95,fol:6400000,oly:"LA28",feat:1,
 desc:"Track & field, road and race walking — the biggest sport at every Olympic Games since 1896.",
 disc:[["Track","100m to 10,000m|Hurdles & steeplechase|Relays"],["Field","Jumps|Throws"],
       ["Road","Marathon|Race walks"],["Combined Events","Decathlon|Heptathlon"]],
 alias:["track and field","track","field","marathon running"],tags:["individual","outdoor","endurance"]});

S({id:"basketball",name:"Basketball",cat:"olympic-summer",sub:"Court",icon:"🏀",pop:94,fol:6700000,oly:"LA28",feat:1,
 desc:"5-on-5 hoops and its fast Olympic offshoot 3x3 — one of the world's most played team sports.",
 disc:[["Basketball 5v5","Men's tournament|Women's tournament"],["3x3 Basketball","Men's tournament|Women's tournament",4]],
 alias:["hoops","3x3"],tags:["team","indoor","ball"]});

S({id:"boxing",name:"Boxing",cat:"olympic-summer",sub:"Combat",icon:"🥊",pop:78,fol:2700000,oly:"LA28",
 desc:"Olympic boxing across weight classes — confirmed on the LA28 programme under World Boxing.",
 disc:[["Men's Weight Classes","Flyweight to super heavyweight"],["Women's Weight Classes","Minimumweight to heavyweight"]],
 alias:["pugilism"],tags:["combat","individual","indoor"]});

S({id:"canoeing",name:"Canoeing",cat:"olympic-summer",sub:"Water",icon:"🛶",pop:46,oly:"LA28",
 desc:"Flatwater sprint racing and whitewater slalom — kayak and canoe disciplines across two very different stages.",
 disc:[["Sprint","K1 · K2 · K4|C1 · C2|200m – 1000m"],["Slalom","K1|C1|Kayak cross"]],
 alias:["kayak","canoe","sprint canoe","slalom"],tags:["water","individual","outdoor"]});

S({id:"cycling",name:"Cycling",cat:"olympic-summer",sub:"Road · Track · MTB · BMX",icon:"🚴",pop:88,fol:2900000,oly:"LA28",feat:1,
 desc:"Five Olympic cycling disciplines — road, track, mountain bike, BMX racing and BMX freestyle.",
 disc:[["Road Cycling","Road race|Individual time trial"],["Track Cycling","Sprint|Keirin|Team pursuit|Omnium|Madison"],
       ["Mountain Bike","Cross-country"],["BMX Racing","Supercross format"],["BMX Freestyle","Park"]],
 alias:["bike","road cycling","track cycling","mountain bike","bmx"],tags:["individual","outdoor","endurance","urban"]});

S({id:"equestrian",name:"Equestrian",cat:"olympic-summer",sub:"Animal",icon:"🐎",pop:44,oly:"LA28",
 desc:"Dressage, eventing and jumping — the only Olympic sport where athlete and mount compete as one.",
 disc:[["Dressage","Individual|Team"],["Eventing","Individual|Team"],["Jumping","Individual|Team"]],
 alias:["horse riding","dressage","show jumping","eventing"],tags:["animal","individual","outdoor"]});

S({id:"fencing",name:"Fencing",cat:"olympic-summer",sub:"Combat",icon:"🤺",pop:38,oly:"LA28",
 desc:"Foil, épée and sabre — one of just five sports to appear at every modern Olympic Games since 1896.",
 disc:[["Foil","Individual|Team"],["Épée","Individual|Team"],["Sabre","Individual|Team"]],
 alias:["foil","epee","sabre"],tags:["combat","individual","indoor"]});

S({id:"football",name:"Football",cat:"olympic-summer",sub:"Field",icon:"⚽",pop:99,fol:11600000,oly:"LA28",feat:1,trend:1,
 desc:"The world's game — 11-a-side Olympic football alongside the biggest club and international calendars in sport.",
 disc:[["Football","Men's tournament|Women's tournament"]],
 alias:["soccer","futbol","futebol"],tags:["team","outdoor","ball"]});

S({id:"golf",name:"Golf",cat:"olympic-summer",sub:"Precision",icon:"⛳",pop:70,fol:1900000,oly:"LA28",
 desc:"Stroke play at the Games — a sport reintroduced at Rio 2016 after a 112-year Olympic absence.",
 disc:[["Stroke Play","Men's tournament|Women's tournament|Mixed team (LA28)"]],
 alias:["pga"],tags:["precision","individual","outdoor"]});

S({id:"gymnastics",name:"Gymnastics",cat:"olympic-summer",sub:"Artistic · Rhythmic · Trampoline",icon:"🤸",pop:80,fol:1200000,oly:"LA28",
 desc:"Artistic, rhythmic and trampoline — grace and power judged to a tenth of a point.",
 disc:[["Artistic Gymnastics","All-around|Apparatus finals|Team"],["Rhythmic Gymnastics","Individual|Group"],["Trampoline","Men's|Women's"]],
 alias:["artistic gymnastics","rhythmic"],tags:["individual","indoor"]});

S({id:"handball",name:"Handball",cat:"olympic-summer",sub:"Court",icon:"🤾",pop:52,oly:"LA28",
 desc:"Seven-a-side indoor handball — relentless end-to-end action and one of Europe's favourite team sports.",
 disc:[["Handball","Men's tournament|Women's tournament"]],
 alias:["team handball","olympic handball"],tags:["team","indoor","ball"]});

S({id:"hockey",name:"Hockey",cat:"olympic-summer",sub:"Field",icon:"🏑",pop:66,fol:2100000,oly:"LA28",
 desc:"Field hockey on turf — India's most decorated Olympic sport with eight men's gold medals.",
 disc:[["Field Hockey","Men's tournament|Women's tournament"]],
 alias:["field hockey"],tags:["team","outdoor","ball"]});

S({id:"judo",name:"Judo",cat:"olympic-summer",sub:"Combat",icon:"🥋",pop:58,oly:"LA28",
 desc:"The gentle way — throws, pins and submissions born in Japan and on the Olympic programme since Tokyo 1964.",
 disc:[["Judo","Men's weight classes|Women's weight classes|Mixed team"]],
 alias:["kodokan"],tags:["combat","individual","indoor","traditional"]});

S({id:"modern-pentathlon",name:"Modern Pentathlon",cat:"olympic-summer",sub:"Multi",icon:"5️⃣",pop:24,oly:"LA28",
 desc:"Five events in one — fencing, swimming, riding, shooting and running, modelled on the 19th-century cavalry soldier.",
 disc:[["Modern Pentathlon","Men's final|Women's final"]],
 note:"On the LA28 programme, obstacle racing replaces riding in the modern pentathlon format.",
 alias:["pentathlon"],tags:["individual","outdoor","combat","precision"]});

S({id:"rugby-sevens",name:"Rugby Sevens",cat:"olympic-summer",sub:"Field",icon:"🏉",pop:62,oly:"LA28",
 desc:"Seven-a-side rugby — seven-minute halves, wild tries and an Olympic hit since Rio 2016.",
 disc:[["Rugby Sevens","Men's tournament|Women's tournament",2]],
 alias:["sevens","rugby 7s"],tags:["team","outdoor"]});

S({id:"sailing",name:"Sailing",cat:"olympic-summer",sub:"Water",icon:"⛵",pop:40,oly:"LA28",
 desc:"Olympic dinghy, skiff and windsurfing classes — racing wind and waves since Paris 1900.",
 disc:[["Sailing","Dinghy & skiff classes|iQFoil windsurfing|Formula Kite|Mixed double-handed",10]],
 alias:["yachting","windsurfing olympic","kite"],tags:["water","individual","outdoor"]});

S({id:"sport-climbing",name:"Sport Climbing",cat:"olympic-summer",sub:"Wall",icon:"🧗",pop:60,oly:"LA28",trend:1,
 desc:"Boulder, lead and speed climbing on the Olympic wall — a Games hit since Tokyo 2020.",
 disc:[["Boulder & Lead","Combined format"],["Speed Climbing","Head-to-head 1v1",4]],
 alias:["climbing olympic","bouldering olympic","lead climbing"],tags:["individual","indoor","adventure"]});

S({id:"surfing",name:"Surfing",cat:"olympic-summer",sub:"Water",icon:"🏄",pop:72,fol:980000,oly:"LA28",trend:1,
 desc:"Shortboard surfing in the Olympic lineup since Tokyo 2020 — reading the ocean is the sport.",
 disc:[["Shortboard","Men's|Women's",2]],
 alias:["surf","surfboard"],tags:["water","individual","outdoor","adventure"]});

S({id:"taekwondo",name:"Taekwondo",cat:"olympic-summer",sub:"Combat",icon:"🥋",pop:54,oly:"LA28",
 desc:"Korean art of kicking — Olympic since Sydney 2000, with head-height kicks scoring biggest.",
 disc:[["Taekwondo","Men's weight classes|Women's weight classes"]],
 alias:["tae kwon do"],tags:["combat","individual","indoor","traditional"]});

S({id:"triathlon",name:"Triathlon",cat:"olympic-summer",sub:"Endurance",icon:"🔱",pop:56,oly:"LA28",
 desc:"Swim, bike, run — the Olympic distance and the mixed-team relay, non-stop since Sydney 2000.",
 disc:[["Triathlon","Men's|Women's|Mixed relay"]],
 alias:["tri","ironman"],tags:["individual","outdoor","endurance","water"]});

S({id:"volleyball",name:"Volleyball",cat:"olympic-summer",sub:"Court & Sand",icon:"🏐",pop:82,fol:1600000,oly:"LA28",
 desc:"Indoor six-a-side and beach pairs — two Olympic disciplines, one flying game.",
 disc:[["Volleyball","Men's tournament|Women's tournament"],["Beach Volleyball","Men's pairs|Women's pairs"]],
 alias:["beach volleyball"],tags:["team","outdoor","indoor","ball"]});

S({id:"weightlifting",name:"Weightlifting",cat:"olympic-summer",sub:"Strength",icon:"🏋️",pop:64,oly:"LA28",
 desc:"Snatch and clean & jerk — the strongest athletes on the Olympic programme, re-included for LA28.",
 disc:[["Weightlifting","Men's weight classes|Women's weight classes"]],
 alias:["lifting","olympic lifting"],tags:["strength","individual","indoor"]});

S({id:"wrestling",name:"Wrestling",cat:"olympic-summer",sub:"Combat",icon:"🤼",pop:60,oly:"LA28",
 desc:"Freestyle and Greco-Roman — wrestling was the marquee event of the ancient Games and never left.",
 disc:[["Freestyle","Men's weight classes|Women's weight classes"],["Greco-Roman","Men's weight classes"]],
 alias:["freestyle wrestling","greco roman"],tags:["combat","individual","indoor","traditional"]});

/* ---- LA28 ADDITIONAL SPORTS (confirmed at the 141st IOC Session, Mumbai 2023) ---- */

S({id:"baseball-softball",name:"Baseball & Softball",cat:"olympic-summer",sub:"Bat & Ball",icon:"⚾",pop:76,
 oly:{ed:"LA28",b:"la28",season:"summer",note:"Returns to the Olympic programme at LA28 after Tokyo 2020."},
 desc:"One Olympic sport, two disciplines — baseball and softball come back for LA28 after last appearing at Tokyo 2020.",
 disc:[["Baseball","Men's tournament"],["Softball","Women's tournament"]],
 alias:["baseball","softball","mlb"],tags:["team","outdoor","ball"]});

S({id:"flag-football",name:"Flag Football",cat:"olympic-summer",sub:"Field",icon:"🏈",pop:48,fresh:1,trend:1,
 oly:{ed:"LA28",b:"la28",season:"summer",note:"Makes its Olympic debut at LA28."},
 desc:"The non-contact, flag-pulling version of American football — making its Olympic debut at LA28.",
 disc:[["Flag Football","Men's 5v5|Women's 5v5"]],
 alias:["nfl flag"],tags:["team","outdoor","ball"]});

S({id:"lacrosse",name:"Lacrosse",cat:"olympic-summer",sub:"Field",icon:"🥍",pop:42,fresh:1,
 oly:{ed:"LA28",b:"la28",season:"summer",note:"Returns at LA28 in the Sixes format, after last appearing in 1908."},
 desc:"The fastest game on two grass fields returns to the Olympics in its high-scoring Sixes format at LA28.",
 disc:[["Lacrosse Sixes","Men's|Women's"]],
 alias:["sixes"],tags:["team","outdoor","ball"]});

/* Cricket lives in Team Sports (see Part 2) — category "Team Sports", isOlympic: true, LA28 (T20). */

/* ============================================================
   OLYMPIC WINTER SPORTS — the full Milano Cortina 2026 programme
   (16 sports · 116 events · 6–22 Feb 2026)
   ============================================================ */

S({id:"alpine-skiing",name:"Alpine Skiing",cat:"olympic-winter",sub:"Snow",icon:"⛷",pop:68,oly:"MC26",feat:1,
 desc:"Downhill to slalom — the speed and technical races of the Winter Olympics.",
 disc:[["Speed","Downhill|Super-G"],["Technical","Slalom|Giant slalom"],["Team Combined","New MC2026 event",10]],
 alias:["downhill","slalom","ski racing"],tags:["snow","individual","outdoor"]});

S({id:"biathlon",name:"Biathlon",cat:"olympic-winter",sub:"Snow",icon:"🎿",pop:50,oly:"MC26",
 desc:"Cross-country skiing with rifle shooting — the Winter Olympics' ultimate stamina-and-nerve test.",
 disc:[["Biathlon","Individual|Sprint|Pursuit|Mass start|Relays",11]],
 alias:["biathalon"],tags:["snow","individual","outdoor","precision"]});

S({id:"bobsleigh",name:"Bobsleigh",cat:"olympic-winter",sub:"Ice",icon:"🛷",pop:44,oly:"MC26",
 desc:"Two and four-person sleds at 130+ km/h — including the women's monobob.",
 disc:[["Bobsleigh","Two-man|Four-man|Two-woman|Monobob",4]],
 alias:["bobsled","monobob"],tags:["ice","team","outdoor"]});

S({id:"cross-country-skiing",name:"Cross-Country Skiing",cat:"olympic-winter",sub:"Snow",icon:"🎿",pop:52,oly:"MC26",
 desc:"The endurance engine of the Winter Games — sprints to 50km distance races. At MC2026 the women's 50km matches the men's for the first time.",
 disc:[["Cross-Country","Sprint|Distance|Skiathlon|Relays",12]],
 alias:["xc skiing"],tags:["snow","individual","outdoor","endurance"]});

S({id:"curling",name:"Curling",cat:"olympic-winter",sub:"Ice",icon:"🥌",pop:56,oly:"MC26",
 desc:"Stones, sweepers and chess on ice — men's, women's and mixed doubles.",
 disc:[["Curling","Men's|Women's|Mixed doubles",3]],
 tags:["ice","team","mind","indoor"]});

S({id:"figure-skating",name:"Figure Skating",cat:"olympic-winter",sub:"Ice",icon:"⛸",pop:74,oly:"MC26",feat:1,
 desc:"Singles, pairs, ice dance and the team event — athleticism dressed as art since 1908.",
 disc:[["Figure Skating","Men's singles|Women's singles|Pairs|Ice dance|Team event",5]],
 alias:["ice skating"],tags:["ice","individual","indoor"]});

S({id:"freestyle-skiing",name:"Freestyle Skiing",cat:"olympic-winter",sub:"Snow",icon:"🌀",pop:58,oly:"MC26",trend:1,
 desc:"Moguls, aerials, halfpipe, slopestyle, big air and ski cross — the freestyle playground.",
 disc:[["Freestyle","Moguls & dual moguls|Aerials|Halfpipe|Slopestyle|Big air|Ski cross",13]],
 tags:["snow","individual","outdoor","urban"]});

S({id:"ice-hockey",name:"Ice Hockey",cat:"olympic-winter",sub:"Ice",icon:"🏒",pop:86,oly:"MC26",feat:1,trend:1,
 desc:"Six skaters and a goalie a side — the fastest team sport on ice, with NHL players back at Milano Cortina 2026.",
 disc:[["Ice Hockey","Men's tournament|Women's tournament",2]],
 alias:["hockey ice"],tags:["ice","team","indoor"]});

S({id:"luge",name:"Luge",cat:"olympic-winter",sub:"Ice",icon:"🛷",pop:36,oly:"MC26",
 desc:"Feet-first at 140 km/h — singles, doubles and the new women's doubles at MC2026.",
 disc:[["Luge","Men's singles|Women's singles|Doubles|Women's doubles (new)|Team relay",4]],
 tags:["ice","individual","outdoor"]});

S({id:"nordic-combined",name:"Nordic Combined",cat:"olympic-winter",sub:"Snow",icon:"🏔",pop:26,oly:"MC26",
 desc:"Ski jumping plus cross-country racing — the last men-only Olympic sport, unchanged for now.",
 disc:[["Nordic Combined","Individual Gundersen|Team events",3]],
 tags:["snow","individual","outdoor"]});

S({id:"short-track",name:"Short Track Speed Skating",cat:"olympic-winter",sub:"Ice",icon:"⚡",pop:54,oly:"MC26",
 desc:"Four to six skaters, tight corners, razor blades — chaos on ice since Calgary 1988.",
 disc:[["Short Track","500m to 1500m|Relays",9]],
 alias:["short track"],tags:["ice","individual","indoor"]});

S({id:"skeleton",name:"Skeleton",cat:"olympic-winter",sub:"Ice",icon:"💀",pop:34,oly:"MC26",
 desc:"Head-first down the ice track at 130+ km/h — plus a new mixed team event at MC2026.",
 disc:[["Skeleton","Men's|Women's|Mixed team (new)",3]],
 tags:["ice","individual","outdoor"]});

S({id:"ski-jumping",name:"Ski Jumping",cat:"olympic-winter",sub:"Snow",icon:"🦅",pop:46,oly:"MC26",
 desc:"Flight on skis — and at MC2026, a women's large hill event for the first time.",
 disc:[["Ski Jumping","Normal hill|Large hill (women's new)|Team events",4]],
 tags:["snow","individual","outdoor"]});

S({id:"snowboard",name:"Snowboard",cat:"olympic-winter",sub:"Snow",icon:"🏂",pop:78,oly:"MC26",feat:1,trend:1,
 desc:"Halfpipe, slopestyle, big air, snowboard cross and parallel giant slalom — snowboarding's Olympic home.",
 disc:[["Snowboard","Halfpipe|Slopestyle|Big air|Snowboard cross|Parallel giant slalom",11]],
 alias:["snowboarding"],tags:["snow","individual","outdoor","urban"]});

S({id:"speed-skating",name:"Speed Skating",cat:"olympic-winter",sub:"Ice",icon:"🏎",pop:48,oly:"MC26",
 desc:"Long track racing against the clock from 500m to 10,000m — pure aerodynamic speed.",
 disc:[["Speed Skating","500m to 10,000m|Team pursuit|Mass start",14]],
 tags:["ice","individual","indoor","endurance"]});

S({id:"ski-mountaineering",name:"Ski Mountaineering",cat:"olympic-winter",sub:"Snow",icon:"⛰",pop:30,fresh:1,trend:1,
 oly:{ed:"MC26",b:"mc26",season:"winter",note:"Makes its Olympic debut at Milano Cortina 2026."},
 desc:"Skin up on skis, down on skis — 'skimo' makes its Olympic debut at Milano Cortina 2026.",
 disc:[["Ski Mountaineering","Men's sprint|Women's sprint|Mixed relay",3]],
 alias:["skimo"],tags:["snow","individual","outdoor","adventure"],risk:"high"});
