/* ============================================================
   PLAYR — OLYMPIC DATA (verified programme facts)
   ------------------------------------------------------------
   Sources: IOC / LA28 / Milano Cortina 2026 published
   programmes. Labels tie every Olympic badge to the relevant
   Games edition — nothing is marked "Olympic" generically.
   ============================================================ */

window.OLYMPIC_EDITIONS = {
  LA28:{
    label:"LA28", city:"Los Angeles, USA", dates:"14–30 July 2028", sports:36, events:null,
    tagline:"The Games return to Los Angeles for a third time.",
    notes:["Five additional sports confirmed at the 141st IOC Session in Mumbai (2023): Baseball/Softball, Cricket (T20), Flag Football, Lacrosse (Sixes) and Squash.",
           "Flag Football and Squash make their Olympic debut. Cricket returns after Paris 1900, lacrosse after London 1908, baseball/softball after Tokyo 2020.",
           "Modern Pentathlon and Weightlifting were re-included; boxing was confirmed at the 144th IOC Session in March 2025 under World Boxing.",
           "Six new mixed-gender team events debut, including mixed team golf and mixed doubles in artistic swimming."],
    newSports:["baseball-softball","cricket","flag-football","lacrosse","squash"]
  },
  MC26:{
    label:"MILANO CORTINA 2026", city:"Milano Cortina, Italy", dates:"6–22 February 2026", sports:16, events:116,
    tagline:"16 sports across Milan, Cortina, Bormio, Livigno and Val di Fiemme.",
    notes:["Ski mountaineering makes its Olympic debut with three events: men's sprint, women's sprint and mixed relay.",
           "New events include women's doubles luge, women's large hill ski jumping, mixed team skeleton, dual moguls and team combined in alpine skiing.",
           "NHL players return to the men's ice hockey tournament.",
           "The women's 50km cross-country race matches the men's distance for the first time."],
    newSports:["ski-mountaineering"]
  },
  PARIS2024:{label:"PARIS 2024", city:"Paris, France", dates:"26 July – 11 Aug 2024", sports:32, events:329,
    tagline:"The first Games with full gender parity in athlete quotas.",
    notes:["Breaking made its Olympic debut.","Sport climbing, skateboarding and surfing appeared for a second time."]},
  TOKYO2020:{label:"TOKYO 2020", city:"Tokyo, Japan", dates:"23 July – 8 Aug 2021", sports:33, events:339,
    tagline:"Held in 2021, kept the 2020 name.",
    notes:["Karate and skateboarding debuted; baseball/softball returned."]}
};

/* Timeline of the Games (verifiable milestones). */
window.OLYMPIC_TIMELINE = [
  {y:"776 BC", t:"Ancient Olympics", d:"First recorded ancient Games at Olympia, Greece — one race, one olive wreath."},
  {y:"1896", t:"The modern Games", d:"Pierre de Coubertin's revival opens in Athens with 241 athletes and 9 sports."},
  {y:"1924", t:"First Winter Games", d:"Chamonix, France hosts the sports snow and ice were waiting for."},
  {y:"1936", t:"Berlin", d:"Jesse Owens wins four golds in front of the Nazi regime — sport answers ideology."},
  {y:"1960", t:"Rome", d:"Abebe Bikila wins the marathon barefoot; Cassius Clay boxes his way to gold."},
  {y:"1984", t:"Los Angeles", d:"The Games LA28 will echo — Carl Lewis wins four golds, the model turns sustainable."},
  {y:"2008", t:"Beijing", d:"Michael Phelps wins eight golds at a single Games — still the record."},
  {y:"2012", t:"London", d:"First Games with women's boxing; every delegation includes women for the first time in 2012-24 era."},
  {y:"2016", t:"Rio", d:"Golf returns after 112 years; rugby sevens debuts; a refugee team marches for the first time."},
  {y:"2021", t:"Tokyo 2020", d:"Held a year late behind closed doors — karate and skateboarding debut."},
  {y:"2024", t:"Paris", d:"Breaking debuts; the first Games with an equal number of men's and women's quota places."},
  {y:"2026", t:"Milano Cortina", d:"Ski mountaineering joins the winter programme; the most spread-out Winter Games yet."},
  {y:"2028", t:"Los Angeles", d:"Cricket, flag football, lacrosse, squash and baseball/softball join the party."},
  {y:"2030", t:"French Alps", d:"The Winter Games head to the French Alps."},
  {y:"2032", t:"Brisbane", d:"Australia hosts its third Games, and the first of a new hosting era."}
];

/* Iconic, verifiable records & milestones — labelled WR (world) / OR (Olympic). */
window.OLYMPIC_RECORDS = [
  {sport:"Athletics", mark:"9.58 s", who:"Usain Bolt", what:"100m world record", where:"Berlin 2009"},
  {sport:"Athletics", mark:"19.19 s", who:"Usain Bolt", what:"200m world record", where:"Berlin 2009"},
  {sport:"Athletics", mark:"43.03 s", who:"Wayde van Niekerk", what:"400m world record", where:"Rio 2016"},
  {sport:"Athletics", mark:"2:00:35", who:"Kelvin Kiptum", what:"Marathon world record", where:"Chicago 2023"},
  {sport:"Athletics", mark:"8.95 m", who:"Mike Powell", what:"Long jump world record", where:"Tokyo 1991"},
  {sport:"Athletics", mark:"2.45 m", who:"Javier Sotomayor", what:"High jump world record", where:"Salamanca 1993"},
  {sport:"Swimming", mark:"46.80 s", who:"Pan Zhenle", what:"100m freestyle world record", where:"Paris 2024"},
  {sport:"Swimming", mark:"23 golds", who:"Michael Phelps", what:"Most Olympic golds in history", where:"2004–2016"},
  {sport:"Pole Vault", mark:"6.26 m", who:"Armand Duplantis", what:"Olympic record, Paris final", where:"Paris 2024"},
  {sport:"Weightlifting", mark:"492 kg", who:"Lasha Talakhadze", what:"Super-heavyweight total (WR)", where:"Tbilisi 2021"},
  {sport:"Winter Games", mark:"15 medals", who:"Marit Bjørgen", what:"Most Winter Olympic medals", where:"2002–2018"},
  {sport:"Winter Games", mark:"13 medals", who:"Ole Einar Bjørndalen", what:"Most biathlon Olympic medals", where:"1994–2014"},
  {sport:"Olympics", mark:"8 golds", who:"Michael Phelps", what:"Most golds at a single Games", where:"Beijing 2008"}
];

/* PLAYR demo community content for the Olympic Hub (clearly demo counts). */
window.OLYMPIC_HUB_COMMUNITIES = [
  {n:"LA28 Countdown Club", d:"Daily news, trials talk and watch parties on the road to Los Angeles.", members:"128K"},
  {n:"Milano Cortina Winter Crew", d:"Snow, ice and slidediscipline fans reliving Italy 2026.", members:"64K"},
  {n:"Olympic History Buffs", d:"From Olympia 776 BC to Brisbane 2032 — every story, every Games.", members:"212K"},
  {n:"Track & Field Nerds", d:"Splits, segments and stats for every athletics final.", members:"95K"},
  {n:"Olympic Collectors", d:"Torch pins, mascots and memorabilia from every edition.", members:"18K"}
];

window.OLYMPIC_HUB_EVENTS = [
  {n:"LA28 Ticket Draw Watch Party", d:"Community stream · Los Angeles", date:"This month"},
  {n:"Winter Rewind: MC2026 Marathon", d:"Rewatch all 116 events together", date:"Weekly"},
  {n:"Olympic Trivia Night", d:"PLAYR Live quiz · Mind Sports arena", date:"Every Friday"},
  {n:"Meet the LA28 Hopefuls", d:"AMA series with rising athletes", date:"Monthly"},
  {n:"5K Olympic Solidarity Run", d:"Community run, all cities", date:"Next Sunday"}
];
