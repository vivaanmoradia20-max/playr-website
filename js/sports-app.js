/* ============================================================
   PLAYR — SPORTS ENGINE
   Catalog API · Discover · Filters · Search · Onboarding ·
   Recommendations · Generators · Personalization
   Loaded AFTER sports-data*.js, BEFORE the inline app script.
   ============================================================ */
(function(){
"use strict";

/* ---------- 1. NORMALIZE THE CATALOG ---------- */
const CATS = window.SPORT_CATEGORIES;
const CAT_MAP = {}; CATS.forEach(c=>CAT_MAP[c.id]=c);

function hueShift(hex, amt){
  const n = parseInt(hex.slice(1),16);
  let r=(n>>16)+amt, g=((n>>8)&255)+amt, b=(n&255)+amt;
  r=Math.max(10,Math.min(245,r)); g=Math.max(10,Math.min(245,g)); b=Math.max(10,Math.min(245,b));
  return "#"+((r<<16)|(g<<8)|b).toString(16).padStart(6,"0");
}
function gradFor(cat, i){
  const a = CAT_MAP[cat].accent;
  return `linear-gradient(135deg, ${a}2E 0%, ${hueShift(a,-38)}55 48%, #0A0B0D 49%, #0A0B0D 100%)`;
}

const RAW = window.__PLAYR_RAW || [];
window.PLAYR_SPORTS = RAW.map((o,i)=>{
  const cat = CAT_MAP[o.cat] || CAT_MAP.other;
  const oly = typeof o.oly==="string" ? {ed:o.oly, season:o.oly==="MC26"?"winter":"summer", b:o.oly==="MC26"?"mc26":"core"} : (o.oly||null);
  const pop = o.pop!=null?o.pop:30;
  const fol = o.fol!=null?o.fol:Math.round(pop*pop*400/1000)*1000;
  const tags = o.tags||[];
  const s = {
    id:o.id, name:o.name, slug:o.id, category:cat.id, categoryName:cat.name,
    subcategory:o.sub||"", description:o.desc||"",
    image:gradFor(o.cat,i), icon:o.icon||"🏅",
    followers:fol, popularity:pop,
    isOlympic:!!oly, olympicEdition:oly?oly.ed:null, olympicNote:(oly&&oly.note)||o.note||"",
    disciplines:(o.disc||[]).map(d=>({name:d[0], events:(d[1]||"").split("|").filter(Boolean), eventCount:d[2]||null})),
    tags, alias:o.alias||[],
    rel:o.rel||[], tabsOverride:o.tabs||null, risk:o.risk||null,
    trend:!!o.trend, fresh:!!o.fresh, feat:!!o.feat, niche:!!o.niche,
    olyBadge:oly?oly.b:null, olySeason:oly?oly.season:null
  };
  s.attrs = {
    olympic: s.isOlympic && s.olyBadge!=="past",
    nonolympic: !s.isOlympic,
    summer: s.olySeason==="summer" || cat.id==="olympic-summer" || tags.includes("summer"),
    winter: s.olySeason==="winter" || cat.id==="olympic-winter" || tags.includes("snow")||tags.includes("ice"),
    team: tags.includes("team"), individual: !tags.includes("team"),
    indoor: tags.includes("indoor"), outdoor: tags.includes("outdoor"),
    water: tags.includes("water"), adventure: cat.id==="adventure"||tags.includes("adventure"),
    combat: cat.id==="combat"||tags.includes("combat"), mind: cat.id==="mind"||tags.includes("mind")
  };
  return s;
});
const BY_SLUG={}; window.PLAYR_SPORTS.forEach(s=>BY_SLUG[s.id]=s);
window.getSport = id => BY_SLUG[id]||null;

/* ---------- 2. SMALL HELPERS ---------- */
function fmtFol(n){ return n>=1e6 ? (n/1e6).toFixed(1).replace(/\.0$/,"")+"M" : n>=1e3 ? Math.round(n/1e3)+"K" : ""+n; }
window.PS_fmtFol = fmtFol;
function catOf(s){ return CAT_MAP[s.category]; }
window.PS_catOf = catOf;
function editionLabel(ed){
  return ed==="LA28"?"LA28":ed==="MC26"?"Milano Cortina 2026":ed==="PARIS2024"?"Paris 2024":ed==="TOKYO2020"?"Tokyo 2020":ed==="HISTORIC"?"Olympic 1900–1920":ed||"";
}
window.PS_editionLabel = editionLabel;
const RINGS = `<span class="oly-rings"><i style="background:#0081C8"></i><i style="background:#000"></i><i style="background:#EE334E"></i><i style="background:#00A651"></i><i style="background:#FCB131"></i></span>`;
function badgeHTML(s){
  let h="";
  if(s.olyBadge==="la28") h+=`<span class="badge b-la28" title="${s.olympicNote}">${RINGS}LA28</span>`;
  else if(s.olyBadge==="mc26") h+=`<span class="badge b-mc26" title="${s.olympicNote}">${RINGS}MILANO CORTINA 2026</span>`;
  else if(s.olyBadge==="past") h+=`<span class="badge b-past" title="${s.olympicNote}">${RINGS}${editionLabel(s.olympicEdition).toUpperCase()}</span>`;
  else if(s.olyBadge==="disc") h+=`<span class="badge b-oly" title="${s.olympicNote}">${RINGS}OLYMPIC DISCIPLINE</span>`;
  else if(s.isOlympic) h+=`<span class="badge b-oly" title="On the programme for ${editionLabel(s.olympicEdition)}">${RINGS}OLYMPIC SPORT</span>`;
  if(s.trend) h+=`<span class="badge b-trend">TRENDING</span>`;
  if(s.fresh) h+=`<span class="badge b-new">NEW</span>`;
  if(s.risk==="high") h+=`<span class="badge b-risk">COMMUNITY &amp; INFO</span>`;
  return h;
}
window.PS_badgeHTML = badgeHTML;

/* ---------- 3. FOLLOW STATE + PERSONALIZATION ---------- */
const LS_KEY="playr_my_sports_v1", LS_ONB="playr_onboarded_v1";
function loadFollows(){ try{ return JSON.parse(localStorage.getItem(LS_KEY))||[]; }catch(e){ return []; } }
function saveFollows(a){ try{ localStorage.setItem(LS_KEY, JSON.stringify(a)); }catch(e){} }
let FOLLOWS = loadFollows();
window.PS_follows = () => FOLLOWS.slice();
window.PS_isFollowing = id => FOLLOWS.includes(id);
window.toggleFollowSport = function(id, el){
  const s=getSport(id); if(!s) return;
  const i=FOLLOWS.indexOf(id);
  if(i>=0){ FOLLOWS.splice(i,1); showToast?.(`Unfollowed ${s.name}`); } else { FOLLOWS.push(id); showToast?.(`Following ${s.name} ⚡`); }
  saveFollows(FOLLOWS);
  if(el){ el.classList.toggle("following", FOLLOWS.includes(id)); el.textContent = FOLLOWS.includes(id)?"Following":"+ Follow"; }
  refreshPersonalized();
};

/* ---------- 4. SEARCH ---------- */
const hay = s => [s.name, s.subcategory, s.categoryName, ...s.alias, ...s.tags, ...s.disciplines.map(d=>d.name)].join(" ").toLowerCase();
window.PS_searchSports = function(q){
  const t=(q||"").trim().toLowerCase(); if(!t) return [];
  const score=s=>{
    if(s.alias.some(a=>a===t)) return 3.2;
    if(s.name.toLowerCase().startsWith(t)) return 3;
    if(s.alias.some(a=>a.startsWith(t))) return 2.7;
    if(s.name.toLowerCase().includes(t)) return 2.5;
    if(s.alias.some(a=>a.includes(t))) return 1.5;
    return 1;
  };
  return window.PLAYR_SPORTS.filter(s=>hay(s).includes(t)).sort((a,b)=>score(b)-score(a)||b.popularity-a.popularity);
};

/* ---------- 5. RECOMMENDATIONS ---------- */
function relatedSports(id, n){
  const s=getSport(id); if(!s) return [];
  let pool={};
  (s.rel||[]).forEach((r,i)=>{ if(BY_SLUG[r] && r!==id) pool[r]=100-i; });
  window.PLAYR_SPORTS.forEach(o=>{
    if(o.id===id||pool[o.id]) return;
    let sc=0;
    if(o.category===s.category) sc+=30;
    o.tags.forEach(t=>{ if(s.tags.includes(t)) sc+=12; });
    if(o.isOlympic===s.isOlympic) sc+=4;
    if(sc>0) pool[o.id]=(pool[o.id]||0)+sc;
  });
  return Object.entries(pool).sort((a,b)=>b[1]-a[1]).slice(0,n||8).map(e=>BY_SLUG[e[0]]);
}
window.PS_related = relatedSports;

/* ---------- 6. DETERMINISTIC CONTENT GENERATORS ---------- */
function seed(str){ let h=2166136261; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function rng(seedVal){ let a=seedVal; return function(){ a|=0; a=(a+0x6D2B79F5)|0; let t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; }; }
const FIRST=["Aarav","Vivaan","Rhea","Karan","Ananya","Priya","Rohan","Meera","Dev","Sana","Kabir","Ishaan","Tara","Neel","Farhan","Simran","Arjun","Diya","Zoya","Aditya","Naina","Vihaan","Aisha","Rehan","Mahek","Yash","Kiara","Omkar","Sara","Devansh","Mira","Kunal","Anjali","Ridhima","Samar"];
const LAST=["Mehta","Kapoor","Sharma","Iyer","Naik","Patel","Singh","Chopra","Menon","Bose","Reddy","Khan","Desai","Rao","Joshi","Bhat","Kulkarni","Verma","Nair","Sethi","Gill","Dutta","Malhotra","Pillai"];
const GLOBAL=["Ava Chen","Marco Silva","Lena Kowalski","Kofi Mensah","Yuki Tanaka","Sofia Rossi","Diego Torres","Ingrid Larsen","Tomas Novak","Chloe Dubois","Andre Botha","Min-ji Park"];
const ROLES={
  team:["Captain","Playmaker","Top Scorer","Head Coach","Rising Star"],
  combat:["Fighter","Coach","Cornerman","Analyst"],
  mind:["Titled Player","Coach","Streamer","Analyst"],
  motor:["Driver","Team Principal","Race Engineer","Creator"],
  water:["Athlete","Coach","Wave Hunter","Instructor"],
  adventure:["Expedition Lead","Guide","Storyteller","Photographer"],
  precision:["Pro","Coach","Analyst","Instructor"],
  default:["Athlete","Creator","Coach","Community Legend","Rising Talent"]
};
const CITIES=["Mumbai","Delhi NCR","Bengaluru","Pune","Kolkata","Chennai","Hyderabad","Jaipur","Goa","Lonavala"];
function roleFor(s){ const k=s.attrs.team?"team":s.attrs.combat?"combat":s.attrs.mind?"mind":(s.category==="motor")?"motor":s.attrs.water?"water":(s.category==="adventure")?"adventure":(s.category==="precision")?"precision":"default"; return ROLES[k]; }
function nameFor(r,s,i){ if(r()<0.22) return GLOBAL[Math.floor(r()*GLOBAL.length)]; return FIRST[Math.floor(r()*FIRST.length)]+" "+LAST[Math.floor(r()*LAST.length)]; }
window.PS_gen = {
  athletes(s,n){ const r=rng(seed(s.id+"ath")); const roles=roleFor(s); const out=[];
    for(let i=0;i<n;i++){ out.push({n:nameFor(r,s,i), role:roles[Math.floor(r()*roles.length)], followers:Math.round((2+r()*400)*1000)}); }
    return out; },
  legends(s){ return (window.SPORT_LEGENDS&&window.SPORT_LEGENDS[s.id])||null; },
  communities(s,n){ const r=rng(seed(s.id+"com")); const tpl=["__NATION__ India","__N__ Mumbai","__N__ Delhi NCR","__N__ Bengaluru","{c} __N__ Club","__N__ Nation","College __N__ League","__N__ Weekly Meetup","__N__ Academy","__N__ Underground"];
    const out=[]; for(let i=0;i<n;i++){ let t=tpl[Math.floor(r()*tpl.length)];
      const label=t.replace("__NATION__",s.name).replace(/__N__/g,s.name).replace("{c}",CITIES[Math.floor(r()*CITIES.length)]);
      out.push({n:label, members:fmtFol(Math.round(300+r()*87000)), t:["Weekly games + post-match chai ☕","Beginners welcome — gear sharing thread pinned","Organising the next city open — volunteers?","Watch party for the big final this weekend","Skill clinic every Saturday morning"][Math.floor(r()*5)]}); }
    return out; },
  events(s,n){ const r=rng(seed(s.id+"evt")); const tpl=["{c} __N__ Open","PLAYR __N__ League — Season 3","__N__ Beginners Clinic","__N__ Championship Watch Party","Inter-College __N__ Cup","__N__ Community Meetup"];
    const mon=["Sept 2026","Oct 2026","Nov 2026","Dec 2026","Jan 2027"]; const out=[];
    for(let i=0;i<n;i++){ out.push({n:tpl[Math.floor(r()*tpl.length)].replace("__N__",s.name).replace("{c}",CITIES[Math.floor(r()*CITIES.length)]), d:`${12+Math.floor(r()*16)} ${mon[Math.floor(r()*mon.length)]} · ${CITIES[Math.floor(r()*CITIES.length)]}`}); }
    return out; },
  latest(s,n){ const r=rng(seed(s.id+"lat")); const ath=this.athletes(s,3);
    const tpl=[["Community recap: the week in "+s.name,"Results, standout moments and the posts you loved from the "+s.name+" feed this week."],
      ["How I train: "+ath[0].n,"The "+ath[0].role.toLowerCase()+" breaks down a full week of "+s.name+" training with the community."],
      [s.name+" gear thread: what the community is buying","Real reviews from real players — the monthly mega-thread."],
      ["City spotlight: "+s.name+" in "+CITIES[Math.floor(r()*CITIES.length)],"Where to play, who to follow and the scene's untold stories."],
      ["Beginner's guide to "+s.name,"Everything new players asked this month, in one post."]];
    return tpl.slice(0,n); },
  stats(s){ const r=rng(seed(s.id+"sta")); return [
      {l:"Followers on PLAYR", v:fmtFol(s.followers)},
      {l:"Posts this week", v:fmtFol(Math.round((40+r()*9000)))},
      {l:"Active communities", v:""+(3+Math.floor(r()*120))},
      {l:"Live challenges", v:""+(1+Math.floor(r()*40))},
      {l:"Events this month", v:""+(1+Math.floor(r()*9))},
      {l:"Athletes & creators", v:fmtFol(Math.round((20+r()*8000)))} ]; },
  challenges(s){ const r=rng(seed(s.id+"chl")); return [
      {t:"30-Day "+s.name+" Streak", d:"Log any recreational "+s.name+" session three times a week for a month. Consistency beats intensity."},
      {t:s.name+" Skills Weekend", d:"Complete the community drill list with a friend and post both attempts. Tag @playr."},
      {t:"Learn "+s.name+" Basics", d:"New to "+s.name+"? Finish the starter checklist and earn the First Steps badge."}]; },
  posts(s,n){ const r=rng(seed(s.id+"pst")); const ath=this.athletes(s,3);
    const txt=["Session logged. The "+s.name+" community keeps me honest — next goal is already set 🔥","Nobody tells you how much of "+s.name+" is the people. Grateful for this crew 🙏","Tried the new community drill list today. Humbling. 10/10 would recommend 😅","Weekend plan: "+s.name+" with the crew. Rain won't stop anything ⛈","One year into "+s.name+" today. This app — and this community — changed my year."];
    const out=[]; for(let i=0;i<n;i++){ out.push({name:ath[i%ath.length].n, role:ath[i%ath.length].role, text:txt[Math.floor(r()*txt.length)], likes:Math.round(40+r()*4200), comments:Math.round(2+r()*180), time:["1h","3h","5h","8h","12h"][Math.floor(r()*5)]}); }
    return out; }
};

/* ---------- 7. SPORT CARD ---------- */
function cardHTML(s){
  const cat=catOf(s); const following=FOLLOWS.includes(s.id);
  return `<div class="sc2 card" data-sport="${s.id}" style="--accent:${cat.accent}">
    <div class="sc2-media" style="background:${s.image}">
      <span class="sc2-glyph">${s.icon}</span>
      ${badgeHTML(s)}
      <span class="sc2-cat">${cat.short}</span>
    </div>
    <div class="sc2-body">
      <h4 class="sc2-name">${s.name}</h4>
      <div class="sc2-sub">${s.subcategory||cat.name}</div>
      <div class="sc2-meta">
        <span class="mono-num">${fmtFol(s.followers)} followers</span>
        <span class="pop-meter" title="Popularity on PLAYR"><i style="width:${s.popularity}%"></i></span>
      </div>
      <div class="sc2-actions">
        <button class="follow-btn ${following?"following":""}" onclick="event.stopPropagation();toggleFollowSport('${s.id}',this)">${following?"Following":"+ Follow"}</button>
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openSport('${s.id}')">Explore</button>
      </div>
    </div>
  </div>`;
}
window.PS_card = cardHTML;

/* ---------- 8. DISCOVER VIEW ---------- */
const COLLECTIONS=[
  {id:"all",label:"ALL SPORTS"},
  {id:"foryou",label:"FOR YOU"},
  {id:"featured",label:"FEATURED"},
  {id:"trending",label:"TRENDING"},
  {id:"olympic",label:"OLYMPIC"},
  {id:"popular",label:"POPULAR"},
  {id:"niche",label:"NICHE"},
  {id:"new",label:"NEW"}
];
const ATTRS=[
  {id:"olympic",label:"Olympic"},{id:"nonolympic",label:"Non-Olympic"},{id:"summer",label:"Summer"},{id:"winter",label:"Winter"},
  {id:"team",label:"Team"},{id:"individual",label:"Individual"},{id:"indoor",label:"Indoor"},{id:"outdoor",label:"Outdoor"},
  {id:"water",label:"Water"},{id:"adventure",label:"Adventure"},{id:"combat",label:"Combat"},{id:"mind",label:"Mind Sport"}
];
const D_STATE={collection:"all", category:"all", attrs:new Set(), query:""};

function inCollection(s,cid){
  switch(cid){
    case "all": return true;
    case "foryou": return false;
    case "featured": return s.feat||s.popularity>=90;
    case "trending": return s.trend;
    case "olympic": return s.isOlympic;
    case "popular": return s.popularity>=70;
    case "niche": return s.niche||s.popularity<=20;
    case "new": return s.fresh;
    default: return true;
  }
}
function passAttrs(s){ for(const a of D_STATE.attrs){ if(!s.attrs[a]) return false; } return true; }

function miniCardHTML(s){
  const cat=catOf(s), following=FOLLOWS.includes(s.id);
  return `<button class="mini-sport" data-sport="${s.id}" style="--accent:${cat.accent}" onclick="openSport('${s.id}')">
    <span class="ms-ic">${s.icon}</span><span class="ms-n">${s.name}</span>${following?'<span class="ms-f">✓</span>':""}</button>`;
}
window.PS_miniCard = miniCardHTML;

function renderDiscover(){
  const root=document.getElementById("discoverRoot"); if(!root) return;
  const N=window.PLAYR_SPORTS.length, OC=window.PLAYR_SPORTS.filter(s=>s.isOlympic).length;
  const hasFollows=FOLLOWS.length>0;

  let html=`
  <div class="disc-hero">
    <div class="eyebrow">PLAYR Sports Database</div>
    <h1 class="section-title">DISCOVER YOUR SPORT.</h1>
    <p class="disc-sub">Every sport has a home on PLAYR — Olympic programme, adventure, combat, motorsport, mind sports and the heritage games nobody else covers.</p>
    <div class="disc-counters" id="discCounters">
      <div class="dcount"><b data-n="${N}">0</b><span>Sports</span></div>
      <div class="dcount"><b data-n="${CATS.length}">0</b><span>Categories</span></div>
      <div class="dcount"><b data-n="${OC}">0</b><span>Olympic Sports</span></div>
      <div class="dcount"><b data-n="${N}">0</b><span>Communities</span></div>
    </div>
    <div class="searchbar disc-search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input id="discSearch" placeholder="Search any sport…" value="${D_STATE.query.replace(/"/g,"&quot;")}" autocomplete="off">
      ${D_STATE.query?`<button class="sb-clear" onclick="PS_clearSearch()">Clear</button>`:""}
    </div>
    <p class="disc-hint">Try “cric”, “mount”, “bike” — or search athletes, communities and events too.</p>
    ${hasFollows?`<div class="foryou-rail"><div class="fy-head"><span class="eyebrow" style="margin:0">Because you follow ${FOLLOWS.length} sport${FOLLOWS.length>1?"s":""}</span><button class="btn btn-ghost btn-sm" onclick="PS_openOnboarding(false)">Edit</button></div><div class="fy-list">${(()=>{const picks=new Set(); FOLLOWS.forEach(f=>relatedSports(f,5).forEach(r=>picks.add(r.id))); [...picks].filter(id=>!FOLLOWS.includes(id)).slice(0,10).map(id=>miniCardHTML(BY_SLUG[id])).join("")||"<span class='fy-empty'>Follow more sports to sharpen recommendations.</span>"})()}</div></div>`:
    `<div class="foryou-rail fy-cta"><span>🎯 Make PLAYR yours — pick the sports you love and we'll tune your feed, challenges and events.</span><button class="btn btn-primary btn-sm" onclick="PS_openOnboarding(false)">Choose your sports</button></div>`}
  </div>

  <div class="chip-row disc-collections" id="discCollections">
    ${COLLECTIONS.filter(c=>c.id!=="foryou"||hasFollows).map(c=>`<button class="chip ${D_STATE.collection===c.id?"active":""}" data-coll="${c.id}" onclick="PS_setCollection('${c.id}')">${c.label}</button>`).join("")}
  </div>
  <div class="chip-row disc-cats" id="discCats">
    <button class="chip ${D_STATE.category==="all"?"active":""}" onclick="PS_setCategory('all')">All Categories</button>
    ${CATS.map(c=>`<button class="chip ${D_STATE.category===c.id?"active":""}" style="--accent:${c.accent}" onclick="PS_setCategory('${c.id}')">${c.icon} ${c.short} <em>${window.PLAYR_SPORTS.filter(s=>s.category===c.id).length}</em></button>`).join("")}
  </div>
  <div class="attr-row" id="discAttrs">
    <span class="attr-label">Filter:</span>
    ${ATTRS.map(a=>`<button class="attr-pill ${D_STATE.attrs.has(a.id)?"on":""}" onclick="PS_toggleAttr('${a.id}')">${a.label}</button>`).join("")}
    ${D_STATE.attrs.size?`<button class="attr-clear" onclick="PS_clearAttrs()">Reset</button>`:""}
  </div>`;

  if(D_STATE.query.trim()){
    const q=D_STATE.query.trim();
    const sports=window.PS_searchSports(q).slice(0,24);
    const ath=[], com=[], evt=[];
    window.PLAYR_SPORTS.slice(0,220).forEach(s=>{
      if(hay(s).includes(q.toLowerCase())) return; /* already a sport result */
      const A=window.PS_gen.athletes(s,8); A.forEach(a=>{ if(ath.length<6 && a.n.toLowerCase().includes(q.toLowerCase())) ath.push({a,s}); });
      const C=window.PS_gen.communities(s,4); C.forEach(c=>{ if(com.length<6 && c.n.toLowerCase().includes(q.toLowerCase())) com.push({c,s}); });
      const E=window.PS_gen.events(s,3); E.forEach(e=>{ if(evt.length<5 && e.n.toLowerCase().includes(q.toLowerCase())) evt.push({e,s}); });
    });
    html+=`<div class="srp-head"><h3>Results for “${q.replace(/</g,"&lt;")}”</h3></div>`;
    html+=section("Sports", sports.map(cardHTML).join(""), sports.length);
    html+=section("Athletes", ath.map(x=>`<button class="res-row" onclick="openSport('${x.s.id}')"><span class="rr-ic">${x.s.icon}</span><b>${x.a.n}</b><span class="rr-sub">${x.a.role} · ${x.s.name}</span></button>`).join(""), ath.length);
    html+=section("Communities", com.map(x=>`<button class="res-row" onclick="openSport('${x.c.n.includes(x.s.name)?x.s.id:x.s.id}')"><span class="rr-ic">${x.s.icon}</span><b>${x.c.n}</b><span class="rr-sub">${x.c.members} members · ${x.s.name}</span></button>`).join(""), com.length);
    html+=section("Events", evt.map(x=>`<button class="res-row" onclick="openSport('${x.s.id}')"><span class="rr-ic">${x.s.icon}</span><b>${x.e.n}</b><span class="rr-sub">${x.e.d}</span></button>`).join(""), evt.length);
    if(!sports.length && !ath.length && !com.length && !evt.length) html+=`<div class="empty-state card"><h4>No results for “${q.replace(/</g,"&lt;")}”</h4><p>Try a shorter search — “cric”, “mount”, “bike” — or browse by category.</p></div>`;
  }
  else if(D_STATE.collection!=="all" || D_STATE.category!=="all" || D_STATE.attrs.size){
    let list=window.PLAYR_SPORTS.filter(s=>inCollection(s,D_STATE.collection)&&passAttrs(s));
    if(D_STATE.category!=="all") list=list.filter(s=>s.category===D_STATE.category);
    list.sort((a,b)=>b.popularity-a.popularity);
    const label = D_STATE.collection==="all"?"": COLLECTIONS.find(c=>c.id===D_STATE.collection).label.toLowerCase()+" · ";
    html+=`<div class="srp-head"><h3>${list.length} ${label}sport${list.length!==1?"s":""}</h3></div>`;
    html+=list.length?`<div class="grid grid-4">${list.map(cardHTML).join("")}</div>`:`<div class="empty-state card"><h4>Nothing matches those filters</h4><p>Try removing a filter — or explore a category above.</p></div>`;
  }
  else {
    CATS.forEach(c=>{
      const list=window.PLAYR_SPORTS.filter(s=>s.category===c.id).sort((a,b)=>b.popularity-a.popularity);
      if(!list.length) return;
      html+=`<div class="cat-section" style="--accent:${c.accent}">
        <div class="cat-head">
          <div class="cat-ic">${c.icon}</div>
          <div><h3 class="cat-name">${c.name.toUpperCase()}</h3><p class="cat-blurb">${c.blurb}</p></div>
          <div class="cat-count mono-num">${list.length}</div>
        </div>
        <div class="grid grid-4">${list.map(cardHTML).join("")}</div>
      </div>`;
    });
  }
  root.innerHTML=html;
  const inp=document.getElementById("discSearch");
  if(inp){ let t; inp.addEventListener("input",()=>{ clearTimeout(t); t=setTimeout(()=>{ D_STATE.query=inp.value; renderDiscover(); const i2=document.getElementById("discSearch"); if(i2){i2.focus(); i2.setSelectionRange(i2.value.length,i2.value.length);} },140); }); }
  animateCounters();
}
function section(title,inner,count){
  if(!count) return `<div class="srp-group"><h4 class="srp-title">${title}</h4><p class="srp-none">No ${title.toLowerCase()} matched.</p></div>`;
  return `<div class="srp-group"><h4 class="srp-title">${title} <em>${count}</em></h4>${inner}</div>`;
}
window.PS_setCollection=id=>{ D_STATE.collection=id; renderDiscover(); };
window.PS_setCategory=id=>{ D_STATE.category=id; renderDiscover(); };
window.PS_toggleAttr=id=>{ D_STATE.attrs.has(id)?D_STATE.attrs.delete(id):D_STATE.attrs.add(id); renderDiscover(); };
window.PS_clearAttrs=()=>{ D_STATE.attrs.clear(); renderDiscover(); };
window.PS_clearSearch=()=>{ D_STATE.query=""; renderDiscover(); };

function animateCounters(){
  document.querySelectorAll("#discCounters b").forEach(el=>{
    const target=+el.dataset.n, t0=performance.now();
    const tick=t=>{ const p=Math.min(1,(t-t0)/800); el.textContent=Math.round(target*(0.2+0.8*p)*p+target*(1-p)*p)|0 || Math.round(target*p); if(p<1) requestAnimationFrame(tick); else el.textContent=target; };
    requestAnimationFrame(tick);
  });
}

/* ---------- 9. ONBOARDING — "Choose your sports" ---------- */
window.PS_openOnboarding = function(force){
  if(!force && localStorage.getItem(LS_ONB)==="1"){ return; }
  let picked=new Set(FOLLOWS);
  const quick=["cricket","running","football","mountaineering","basketball"];
  const quickSports=quick.map(id=>BY_SLUG[id]).filter(Boolean);
  const popular=window.PLAYR_SPORTS.slice().sort((a,b)=>b.popularity-a.popularity).slice(0,36);
  let q="";
  function gridHTML(list){
    return list.map(s=>`<button class="ob-sport ${picked.has(s.id)?"on":""}" data-sport="${s.id}" style="--accent:${catOf(s).accent}"><span>${s.icon}</span><b>${s.name}</b><i class="ob-check">✓</i></button>`).join("");
  }
  function shell(inner){
    const div=document.getElementById("onboardingModal"); if(div) div.remove();
    const el=document.createElement("div"); el.id="onboardingModal"; el.className="ob-overlay";
    el.innerHTML=`<div class="ob-modal card">
      <div class="ob-head"><div><div class="eyebrow">Welcome to PLAYR</div><h3>CHOOSE YOUR SPORTS.</h3><p>Pick as many as you like — this tunes your feed, challenges, communities and events. You can change it anytime.</p></div>
      <button class="ob-close" aria-label="Close">✕</button></div>
      <div class="ob-quick"><span class="ob-label">Popular picks:</span>${quickSports.map(s=>`<button class="chip ob-q ${picked.has(s.id)?"active":""}" data-sport="${s.id}">${s.icon} ${s.name}</button>`).join("")}</div>
      <input class="ob-search" placeholder="Search 200+ sports…" value="${q.replace(/"/g,"&quot;")}">
      <div class="ob-grid">${inner}</div>
      <div class="ob-foot"><span class="mono-num">${picked.size} selected</span>
        <div><button class="btn btn-ghost btn-sm ob-skip">Skip for now</button> <button class="btn btn-primary btn-sm ob-done">Continue →</button></div>
      </div></div>`;
    document.body.appendChild(el);
    el.querySelector(".ob-close").onclick=close;
    el.querySelector(".ob-skip").onclick=close;
    el.querySelector(".ob-done").onclick=done;
    const sIn=el.querySelector(".ob-search");
    sIn.oninput=()=>{ q=sIn.value; const l=q?window.PS_searchSports(q).slice(0,30):popular; el.querySelector(".ob-grid").innerHTML=gridHTML(l); bindGrid(); };
    function bindGrid(){ el.querySelectorAll(".ob-sport").forEach(b=>b.onclick=()=>{ const id=b.dataset.sport; picked.has(id)?picked.delete(id):picked.add(id); b.classList.toggle("on",picked.has(id)); el.querySelector(".ob-foot .mono-num").textContent=picked.size+" selected"; el.querySelectorAll(".ob-q").forEach(c=>c.classList.toggle("active",picked.has(c.dataset.sport))); }); }
    el.querySelectorAll(".ob-q").forEach(c=>c.onclick=()=>{ const id=c.dataset.sport; picked.has(id)?picked.delete(id):picked.add(id); c.classList.toggle("active",picked.has(id)); el.querySelector(".ob-grid").innerHTML=gridHTML(q?window.PS_searchSports(q).slice(0,30):popular); bindGrid(); el.querySelector(".ob-foot .mono-num").textContent=picked.size+" selected"; });
    bindGrid();
    function close(){ el.remove(); localStorage.setItem(LS_ONB,"1"); }
    function done(){
      FOLLOWS=[...picked]; saveFollows(FOLLOWS); localStorage.setItem(LS_ONB,"1");
      el.remove(); showToast?.(`Your PLAYR is tuned to ${FOLLOWS.length} sport${FOLLOWS.length===1?"":"s"} 🎯`);
      refreshPersonalized(); renderDiscover();
    }
  }
  shell(gridHTML(popular));
};
window.PS_openOnboardingForce = ()=>window.PS_openOnboarding(true);

/* ---------- 10. PERSONALIZATION HOOKS ---------- */
function refreshPersonalized(){
  /* Re-rank the home "For You" feed around followed sports */
  try{
    if(typeof FEED_SETS!=="undefined" && FEED_SETS.foryou){
      const names=FOLLOWS.map(id=>BY_SLUG[id]&&BY_SLUG[id].name).filter(Boolean);
      FEED_SETS.foryou.sort((a,b)=>(names.includes(b.sport)?1:0)-(names.includes(a.sport)?1:0));
      if(typeof renderHomeFeed==="function") renderHomeFeed();
    }
  }catch(e){}
  renderForYouRows();
  const discRoot=document.getElementById("discoverRoot");
  if(discRoot && document.getElementById("view-discover").classList.contains("active")) renderDiscover();
}
window.PS_refreshPersonalized=refreshPersonalized;

function renderForYouRows(){
  if(!FOLLOWS.length){ ["fyChallenges","fyCommunities","fyEvents"].forEach(id=>{ const el=document.getElementById(id); if(el) el.style.display="none"; }); return; }
  /* challenges */
  const fyC=document.getElementById("fyChallenges");
  if(fyC){ fyC.style.display="";
    const items=[]; FOLLOWS.forEach(f=>{ const s=BY_SLUG[f]; if(s && s.risk!=="high") window.PS_gen.challenges(s).slice(0,1).forEach(c=>items.push({c,s})); });
    fyC.innerHTML= items.length? `<div class="fy-row-head"><div class="eyebrow" style="margin:0">For you — based on your sports</div></div><div class="grid grid-4">`+
      items.slice(0,4).map(x=>`<div class="card" style="overflow:hidden;padding:18px;border-top:3px solid ${catOf(x.s).accent}">
        <div class="pill pill-muted" style="margin-bottom:10px;">${x.s.icon} ${x.s.name}</div>
        <div style="font-weight:800;font-size:14px;margin-bottom:8px;">${x.c.t}</div>
        <p style="color:var(--muted);font-size:12px;line-height:1.5;margin-bottom:12px;">${x.c.d}</p>
        <button class="btn btn-ghost btn-sm" style="width:100%;" onclick="openSport('${x.s.id}')">Open in ${x.s.name}</button></div>`).join("")+`</div>` : "";
  }
  /* communities */
  const fyM=document.getElementById("fyCommunities");
  if(fyM){ fyM.style.display="";
    const recs=[]; const seen=new Set();
    FOLLOWS.forEach(f=>relatedSports(f,4).forEach(r=>{ if(!seen.has(r.id)){seen.add(r.id);recs.push(r);} }));
    fyM.innerHTML=recs.length?`<div class="fy-row-head"><div class="eyebrow" style="margin:0">Recommended communities for you</div></div><div class="fy-list">`+recs.slice(0,10).map(miniCardHTML).join("")+`</div>`:"";
  }
  /* events */
  const fyE=document.getElementById("fyEvents");
  if(fyE){ fyE.style.display="";
    const evts=[]; FOLLOWS.forEach(f=>{ const s=BY_SLUG[f]; if(s) window.PS_gen.events(s,2).forEach(e=>evts.push({e,s})); });
    fyE.innerHTML=evts.length?`<div class="fy-row-head"><div class="eyebrow" style="margin:0">For you — events in your sports</div></div><div class="fy-list">`+evts.slice(0,8).map(x=>`<button class="mini-sport" style="--accent:${catOf(x.s).accent}" onclick="openSport('${x.s.id}')"><span class="ms-ic">📅</span><span class="ms-n">${x.e.n}</span></button>`).join("")+`</div>`:"";
  }
}

/* ---------- 11. INIT (called from the inline script, after DOM + app.js) ---------- */
window.initSportsSystem=function(){
  renderDiscover();
  renderForYouRows();
  const firstVisit = localStorage.getItem(LS_ONB)!=="1";
  if(firstVisit) setTimeout(()=>window.PS_openOnboarding(true), 1200);
};
})();
