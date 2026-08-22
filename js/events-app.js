/* ============================================================
   PLAYR — EVENTS ENGINE · PART 1
   Discovery page · cards · filters · search · sorting
   (Detail pages, calendar, registration, My Events,
    organizers, home & notifications live in Part 2.)
   ============================================================ */
window.PLAYR_EV = (function(){
"use strict";
const RAW = window.__EV_RAW || [];
const CATS = window.SPORT_CATEGORIES, CATMAP = {}; CATS.forEach(c=>CATMAP[c.id]=c);
const BY_SPORT = {}; (window.PLAYR_SPORTS||[]).forEach(s=>BY_SPORT[s.id]=s);

/* ---------- user location (Mumbai default; geolocation optional) ---------- */
const USER = {label:"Mumbai", area:"South Mumbai", lat:19.033, lng:72.850, precise:false};
if(navigator.geolocation){
  try{ navigator.geolocation.getCurrentPosition(p=>{
    USER.lat=p.coords.latitude; USER.lng=p.coords.longitude; USER.precise=true;
    USER.label = nearCity(USER.lat,USER.lng);
    refreshIfVisible();
  }, ()=>{}, {timeout:4000}); }catch(e){}
}
function nearCity(la,lo){
  let best="Near you",bd=1e9;
  Object.values(window.EV_VENUES).forEach(v=>{ const d=hav(la,lo,v.lat,v.lng); if(d<bd){bd=d;best=v.city;} });
  return bd<120?best:"Near you";
}

/* ---------- resolution ---------- */
function hav(a1,o1,a2,o2){ const R=6371,dA=(a2-a1)*Math.PI/180,dO=(o2-o1)*Math.PI/180;
  const x=Math.sin(dA/2)**2+Math.cos(a1*Math.PI/180)*Math.cos(a2*Math.PI/180)*Math.sin(dO/2)**2;
  return Math.round(R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))*10)/10; }

function resolve(o,i){
  const v = o.venue ? window.EV_VENUES[o.venue] : null;
  const now = new Date();
  const start = o.date ? new Date(o.date) : (function(){ const d=new Date(); d.setDate(d.getDate()+o.rel.d); d.setHours(o.rel.h,0,0,0); return d; })();
  const len = o.len||3;
  const end = o.dateEnd ? new Date(o.dateEnd) : new Date(start.getTime()+len*3600e3);
  const status = o.results ? "COMPLETED" : (now>=start&&now<=end ? "LIVE" : (now>end ? "COMPLETED" : "UPCOMING"));
  const regDeadline = o.regISO ? new Date(o.regISO) : (o.regDays!=null&&o.rel ? (function(){const d=new Date(); d.setDate(d.getDate()+o.regDays); return d;})() : null);
  let regStatus = o.reg||null;
  if(regStatus==="open" && regDeadline && now>regDeadline) regStatus="closed";
  const city = v?v.city:(o.loc?o.loc.city:"India");
  const sport = BY_SPORT[o.sport] || CATMAP["motor"] && o.sport==="motorsport" && {name:"Motorsport",icon:"🏁",category:"motor"} || {name:(o.sportLabel||o.sport),icon:"🏅",category:"team"};
  const sportName = o.sportLabel || sport.name;
  const sportIcon = sport.icon||"🏅";
  const cat = CATMAP[sport.category]||CATMAP.other;
  return Object.assign({},o,{
    idx:i, start, end, status, regStatus, regDeadline, city,
    area:v?v.area:(o.loc?o.loc.area:city), zone:v?v.zone:(o.loc?o.loc.zone:"India"),
    venueName:v?v.n:(o.venueNote||"See organizer listing"),
    venueReal:!!v, lat:v?v.lat:null, lng:v?v.lng:null,
    dist: v ? hav(USER.lat,USER.lng,v.lat,v.lng) : null,
    sportName, sportIcon, accent:cat.accent, sportRef:sport,
    priceNum: o.price ? o.price.min : 0,
    verifyBadge: o.verify==="verified"?"VERIFIED":o.verify==="official"?"OFFICIAL":o.verify==="community"?"COMMUNITY EVENT":"DEMO",
    isReal: o.verify==="verified"||o.verify==="official", isDemo: o.verify==="demo"
  });
}
let EVENTS = RAW.map(resolve);
function reResolve(){ const f=follows(), r=regs(); EVENTS = RAW.map(resolve); }

/* ---------- follow / registration state ---------- */
const LSK="playr_ev_follows_v1", LSR="playr_ev_regs_v1";
function readLS(k){ try{ return JSON.parse(localStorage.getItem(k))||[]; }catch(e){ return []; } }
function writeLS(k,a){ try{ localStorage.setItem(k,JSON.stringify(a)); }catch(e){} }
function syncState(){ _fol=readLS(LSK); _reg=readLS(LSR); }
let _fol=readLS(LSK), _reg=readLS(LSR);
const follows=()=>_fol.slice(), regs=()=>_reg.slice();
const isFollowing=id=>_fol.includes(id);
const isRegistered=id=>_reg.some(r=>r.id===id);
function toggleFollow(id){
  const ev=byId(id); if(!ev) return;
  const i=_fol.indexOf(id);
  if(i>=0){ _fol.splice(i,1); showToast?.("Unfollowed "+ev.name.replace(" (Demo)","")); }
  else { _fol.push(id); showToast?.("Following — you'll get updates for this event 🔔");
    setTimeout(()=>{ window.PLAYR_EV&&window.PLAYR_EV.pushEventNotif&&window.PLAYR_EV.pushEventNotif({t:ev.name,s:"Your followed event has an update.",ago:"now"}); },1800); }
  writeLS(LSK,_fol); refreshIfVisible(); renderHomeNearYou?.();
}

/* ---------- helpers ---------- */
const byId=id=>EVENTS.find(e=>e.id===id);
const MON=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function fmtDate(d){ return d.getDate()+" "+MON[d.getMonth()]+" "+d.getFullYear(); }
function fmtDateShort(d){ return d.getDate()+" "+MON[d.getMonth()]; }
function fmtTime(d){ return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0"); }
function sameDay(a,b){ return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); }
function dayChip(d){
  const now=new Date(), tmr=new Date(now.getTime()+864e5);
  if(sameDay(d,now)) return "TODAY";
  if(sameDay(d,tmr)) return "TOMORROW";
  const wk=new Date(now.getTime()+6*864e5);
  if(d>now&&d<=wk) return "THIS WEEKEND".indexOf("WEEKEND")>=0&&[0,6].includes(d.getDay()) ? "THIS WEEKEND" : DAYS[d.getDate?d.getDay():0].toUpperCase()+" · "+fmtDateShort(d).toUpperCase();
  return fmtDate(d).toUpperCase();
}
function isWeekendPeriod(d){ const now=new Date(); const end=new Date(now.getTime()+7*864e5); const day=d.getDay(); return d>=now&&d<=end&&(day===0||day===6||day===5); }
function priceLabel(e){ return e.price==null ? "FREE" : (e.price.note||("₹"+e.price.min)); }
function distLabel(e){ return e.dist==null?"":(e.dist<1?"<1 km":e.dist+" km"); }
const LEVELS=["WORLD","INTERNATIONAL","NATIONAL","STATE","CITY","COLLEGE","SCHOOL","CLUB","COMMUNITY","AMATEUR"];
const LEVEL_CLS={WORLD:"lv-world",INTERNATIONAL:"lv-intl",NATIONAL:"lv-natl",STATE:"lv-state",CITY:"lv-city",COLLEGE:"lv-col",SCHOOL:"lv-schl",CLUB:"lv-club",COMMUNITY:"lv-comm",AMATEUR:"lv-am"};
function levelBadge(l){ return `<span class="lv-badge ${LEVEL_CLS[l]||""}">${l}</span>`; }
function verifyBadge(e){ const cls=e.isDemo?"vb-demo":e.verify==="verified"?"vb-verified":e.verify==="official"?"vb-official":"vb-community";
  return `<span class="v-badge ${cls}">${e.verifyBadge}</span>`; }
function statusPill(e){
  const s=e.status;
  if(s==="LIVE") return `<span class="st-pill st-live"><span class="dot-live"></span>LIVE NOW</span>`;
  if(s==="COMPLETED") return `<span class="st-pill st-done">COMPLETED</span>`;
  if(e.regStatus==="open") return `<span class="st-pill st-reg">REGISTRATION OPEN</span>`;
  if(e.regStatus==="soldout") return `<span class="st-pill st-closed">SOLD OUT</span>`;
  if(e.regStatus==="closed") return `<span class="st-pill st-closed">REGISTRATION CLOSED</span>`;
  return `<span class="st-pill st-up">UPCOMING</span>`;
}
function mapsUrl(e){ return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent((e.venueReal?e.venueName+", ":"")+e.city); }

/* ---------- event card ---------- */
function card(e,opts){
  opts=opts||{};
  const followed=isFollowing(e.id), registered=isRegistered(e.id);
  const cats=(Array.isArray(e.cats)&&e.cats.length)?`<div class="ev-cats">${e.cats.slice(0,4).map(c=>`<span>${Array.isArray(c)?c[0]:c}</span>`).join("")}</div>`:"";
  return `<div class="ev-card card" style="--accent:${e.accent}" data-ev="${e.id}">
    <div class="ev-media" style="background:linear-gradient(135deg, ${e.accent}2E, #0A0B0D 70%)">
      <span class="ev-glyph">${e.sportIcon}</span>
      <span class="ev-sport" style="--accent:${e.accent}">${e.sportName.toUpperCase()}</span>
      ${e.isReal?"":`<span class="ev-demo-chip">DEMO</span>`}
      <span class="ev-district">${e.zone.toUpperCase()}</span>
    </div>
    <div class="ev-body">
      <div class="ev-badges">${levelBadge(e.level)}${verifyBadge(e)}${statusPill(e)}</div>
      <h4 class="ev-name" onclick="openEventDetail('${e.id}')">${e.name}</h4>
      <div class="ev-when"><b>${dayChip(e.start)}</b><span>${fmtTime(e.start)}${e.end&&!sameDay(e.start,e.end)?" – "+fmtDate(e.end):""}</span></div>
      <div class="ev-where">📍 ${e.venueReal?e.venueName:e.venueName} · ${e.area}, ${e.city}${e.dist!=null&&e.dist<80?` <em>· ${distLabel(e)}</em>`:""}</div>
      <div class="ev-org" onclick="openOrganizer('${e.org}')">by ${window.EV_ORGANIZERS[e.org].n} ${window.EV_ORGANIZERS[e.org].v==="verified"?"✓":""}</div>
      ${cats}
      <div class="ev-meta-row">
        <span class="ev-price ${e.price==null?"free":""}">${priceLabel(e)}</span>
        <span class="ev-team">${e.team?"TEAM":"INDIVIDUAL"}</span>
        <span class="ev-age">${(e.age||"All ages").split("(")[0].split(";")[0].trim().toUpperCase()}</span>
      </div>
      ${e.src?`<div class="ev-src">Source: ${e.src.split("·")[0]}${e.updated?" · Updated "+e.updated:""}</div>`:""}
      <div class="ev-actions">
        <button class="btn btn-primary btn-sm" onclick="openEventDetail('${e.id}')">View Details</button>
        ${e.status!=="COMPLETED"?(e.regStatus==="open"?(e.isReal?`<button class="btn btn-ghost btn-sm" onclick="openEventRegistration('${e.id}')">Register ↗</button>`:`<button class="btn btn-ghost btn-sm" onclick="openEventRegistration('${e.id}')">Register</button>`):(e.regStatus==="closed"||e.regStatus==="soldout"?`<button class="btn btn-ghost btn-sm" disabled>${e.regStatus==="soldout"?"Sold Out":"Reg. Closed"}</button>`:"")):""}
        <button class="ev-icon-btn ${followed?"on":""}" title="Follow event" onclick="PLAYR_EV.toggleFollow('${e.id}')">${followed?"★":"☆"}</button>
        <button class="ev-icon-btn" title="Share" onclick="PLAYR_EV.share('${e.id}')">↗</button>
      </div>
      ${registered?`<div class="ev-reg-flag">✓ You're registered</div>`:""}
      ${e.note?`<div class="ev-note">${e.note}</div>`:""}
    </div>
  </div>`;
}
function miniCard(e){
  return `<button class="ev-mini" style="--accent:${e.accent}" onclick="openEventDetail('${e.id}')">
    <span class="evm-ic">${e.sportIcon}</span>
    <span class="evm-txt"><b>${e.name.replace(" (Demo)","")}</b>
    <i>${dayChip(e.start)} · ${e.area}, ${e.city}</i></span>
    <span class="evm-st ${e.status==="LIVE"?"live":""}">${e.status==="LIVE"?"LIVE":e.status==="COMPLETED"?"DONE":dayChip(e.start).split(" · ")[0]}</span>
  </button>`;
}

/* ---------- search ---------- */
function parseQuery(q){
  const out={freeText:[],date:null,loc:null,sport:null,level:null,price:null}; const STOP=new Set(['event','events','sport','sports','this','in','the','for','and','a','at','me','my','show','find','all','any','near']);
  const t=(q||"").toLowerCase().trim(); if(!t) return out;
  if(/\b(near\s*(me|you)|nearby|around me)\b/.test(t)){ out.loc="near"; }
  const words=t.split(/\s+/); const used=new Array(words.length).fill(false);
  words.forEach((w,i)=>{
    if(/weekend/.test(w)){out.date="weekend";used[i]=true;}
    else if(/today/.test(w)){out.date="today";used[i]=true;}
    else if(/tomorrow/.test(w)){out.date="tomorrow";used[i]=true;}
    else if(/near ?me|nearby|around/.test(w)){out.loc="near";used[i]=true;}
    else if(/free/.test(w)){out.price="free";used[i]=true;}
  });
  const joined=words.map((w,i)=>used[i]?null:w).filter(Boolean);
  // detect city / locality / sport / level words
  joined.forEach(w=>{
    const cityHit=w.length>=3?["mumbai","navi mumbai","thane","pune","delhi","bengaluru","bangalore","hyderabad","chennai","kolkata","ahmedabad","goa","jaipur","lucknow","chandigarh","gurugram","guwahati","bhubaneswar","kolhapur","nashik","lonavala","baramati"].find(c=>c.startsWith(w.slice(0,5))&&w.startsWith(c.slice(0,Math.min(3,c.length)))):null;
    const areaHit=w.length>=4?["colaba","fort","marine drive","worli","lower parel","bandra","khar","andheri","juhu","vile parle","santacruz","powai","bkc","borivali","malad","goregaon","mulund","chembur","dadar","vashi","nerul","kharghar"].find(a=>a.startsWith(w.slice(0,5))):null;
    const sportHit=w.length>=3?Object.keys(BY_SPORT).find(s=>s.startsWith(w)||BY_SPORT[s].name.toLowerCase().startsWith(w)):null;
    const lvlHit=w.length>=4?LEVELS.find(l=>l.toLowerCase().startsWith(w)):null;
    if(cityHit&&!out.loc){out.loc=cityHit==="navi"?"Navi Mumbai":cityHit==="bangalore"?"Bengaluru":cityHit.charAt(0).toUpperCase()+cityHit.slice(1);}
    else if(areaHit&&!out.loc){out.loc="area:"+areaHit.charAt(0).toUpperCase()+areaHit.slice(1);}
    else if(sportHit&&!out.sport){out.sport=sportHit;}
    else if(lvlHit&&!out.level){out.level=lvlHit;}
    else if(!STOP.has(w)) out.freeText.push(w);
  });
  return out;
}
function searchEvents(q){
  const p=parseQuery(q), now=new Date();
  const tmr=new Date(now.getTime()+864e5);
  return EVENTS.filter(e=>{
    if(p.loc==="near" && e.dist!=null && e.dist>25) return false;
    if(p.loc && p.loc!=="near"){
      if(p.loc.startsWith("area:")){ const a=p.loc.slice(5).toLowerCase(); if(!(e.area+" "+e.venueName).toLowerCase().includes(a)) return false; }
      else if(!(e.city+" "+e.zone).toLowerCase().includes(p.loc.toLowerCase())) return false;
    }
    if(p.sport && e.sport!==p.sport && !e.sportName.toLowerCase().includes(p.sport)) return false;
    if(p.level && e.level!==p.level) return false;
    if(p.price==="free" && e.price!=null) return false;
    if(p.date==="today"&&!sameDay(e.start,now)) return false;
    if(p.date==="tomorrow"&&!sameDay(e.start,tmr)) return false;
    if(p.date==="weekend"&&!isWeekendPeriod(e.start)) return false;
    if(p.freeText.length){ const hay=(e.name+" "+e.sportName+" "+e.city+" "+e.area+" "+(e.tags||[]).join(" ")+" "+(e.cats||[]).join(" ")).toLowerCase();
      if(!p.freeText.every(w=>hay.includes(w))) return false; }
    return true;
  });
}

/* ---------- filter state ---------- */
const F={q:"",loc:"near",date:"any",sport:null,level:null,type:null,age:null,price:null,inout:null,status:null,para:false,sort:"soonest"};
const LOC_OPTS=[["near","Near Me"],["Mumbai","Mumbai"],["Navi Mumbai","Navi Mumbai"],["Thane","Thane"],["Maharashtra","Maharashtra"],["India","India"],["International","International"]];
const MUMBAI_AREAS=["South Mumbai","Central Mumbai","Western Suburbs","Eastern Suburbs","Navi Mumbai","Thane","Colaba","Fort","Marine Drive","Worli","Lower Parel","Bandra","Khar","Andheri","Juhu","Vile Parle","Santacruz","Powai","BKC","Borivali","Malad","Goregaon","Mulund","Dadar","Chembur","Vashi","Nerul","Kharghar"];
const DATE_OPTS=[["any","Any date"],["today","Today"],["tomorrow","Tomorrow"],["weekend","This weekend"],["week","This week"],["month","This month"]];
const TYPE_OPTS=[["race","Race"],["tournament","Tournament"],["league","League"],["ride","Ride"],["trek","Trek"],["meetup","Meetup"],["festival","Festival"]];
const SORT_OPTS=[["soonest","Soonest"],["nearest","Nearest"],["popular","Popular"],["price-asc","Price: low → high"],["price-desc","Price: high → low"],["added","Recently added"]];

function applyFilters(list){
  const now=new Date(); const in7=new Date(now.getTime()+7*864e5), in30=new Date(now.getTime()+30*864e5);
  let out=list.filter(e=>{
    if(F.loc==="near"){ if(e.dist==null||e.dist>60) return false; }
    else if(F.loc==="Maharashtra"){ if(!["Mumbai","Navi Mumbai","Thane","Pune","Kolhapur","Lonavala","Nashik","Baramati"].includes(e.city)) return false; }
    else if(F.loc==="India"){ const inSet=["Mumbai","Navi Mumbai","Thane","Pune","Kolhapur","Lonavala","Nashik","Baramati","New Delhi","Bengaluru","Hyderabad","Chennai","Kolkata","Ahmedabad","Goa","Jaipur","Lucknow","Chandigarh","Gurugram","Guwahati","Bhubaneswar","Greater Noida"];
      const national=["NATIONAL","INTERNATIONAL","WORLD"].includes(e.level);
      if(!inSet.includes(e.city) && !national) return false; }
    else if(F.loc==="International"){ if(e.level!=="INTERNATIONAL"&&e.level!=="WORLD") return false; }
    else if(F.loc.startsWith("area:")){ const a=F.loc.slice(5).toLowerCase(); if(!((e.area+" "+e.venueName+" "+e.zone).toLowerCase().includes(a))) return false; }
    else { if(e.city!==F.loc && e.zone!==F.loc) return false; }
    if(F.date==="today"&&!sameDay(e.start,now)) return false;
    if(F.date==="tomorrow"&&!sameDay(e.start,new Date(now.getTime()+864e5))) return false;
    if(F.date==="weekend"&&!isWeekendPeriod(e.start)) return false;
    if(F.date==="week"&&!(e.start>=now&&e.start<=in7)) return false;
    if(F.date==="month"&&!(e.start>=now&&e.start<=in30)) return false;
    if(F.sport&&e.sport!==F.sport&&e.sportName.toLowerCase()!==F.sport) return false;
    if(F.level&&e.level!==F.level) return false;
    if(F.type&&e.type!==F.type) return false;
    if(F.price==="free"&&e.price!=null) return false;
    if(F.price==="paid"&&e.price==null) return false;
    if(F.inout==="indoor"&&!e.venueReal) return false;
    if(F.inout==="indoor"&&e.venueReal&&!window.EV_VENUES[e.venue].indoor) return false;
    if(F.inout==="outdoor"&&e.venueReal&&window.EV_VENUES[e.venue].indoor) return false;
    if(F.status&&e.status!==F.status) return false;
    if(F.age==="kids"&&!/U-1[0-9]|School|school|junior|Junior|All ages|12\+|14\+|10\+/.test(e.age||"")) return false;
    if(F.para && !e.para) return false;
if(F.q.trim()){ return searchEvents(F.q).includes(e); }
    return true;
  });
  const s=F.sort;
  out.sort((a,b)=>{
    if(s==="nearest") return (a.dist??1e9)-(b.dist??1e9);
    if(s==="popular") return parseInt(b.fol)-parseInt(a.fol);
    if(s==="price-asc") return a.priceNum-b.priceNum;
    if(s==="price-desc") return b.priceNum-a.priceNum;
    if(s==="added") return b.idx-a.idx;
    return a.start-b.start;
  });
  return out;
}

/* ---------- page render ---------- */
let lastScroll=0;
function renderEventsPage(){
  const root=document.getElementById("eventsRoot"); if(!root) return;
  const now=new Date();
  const today=EVENTS.filter(e=>sameDay(e.start,now));
  const weekend=EVENTS.filter(e=>isWeekendPeriod(e.start));
  const live=EVENTS.filter(e=>e.status==="LIVE");
  const nearMumbai=EVENTS.filter(e=>["Mumbai","Navi Mumbai","Thane"].includes(e.city));
  const fol=follows(), reg=regs();
  const myFol=fol.map(byId).filter(Boolean), myReg=reg.map(r=>byId(r.id)).filter(Boolean);

  const mySports=(window.PS_follows?window.PS_follows():[]);
  const forYou=EVENTS.filter(e=>e.status!=="COMPLETED"&&mySports.includes(e.sport));
  const trending=EVENTS.filter(e=>e.status!=="COMPLETED").sort((a,b)=>parseInt(b.fol)-parseInt(a.fol)).slice(0,8);
  const majorIndia=EVENTS.filter(e=>(e.level==="NATIONAL"||e.level==="INTERNATIONAL"||e.level==="STATE")&&e.status!=="COMPLETED").sort((a,b)=>a.start-b.start);
  const nearSorted=EVENTS.filter(e=>e.status!=="COMPLETED").sort((a,b)=>(a.dist??1e9)-(b.dist??1e9)).slice(0,12);

  root.innerHTML=`
  <div class="ev-hero">
    <div class="eyebrow">PLAYR Events · India</div>
    <h1 class="section-title">DISCOVER SPORTS EVENTS.</h1>
    <p class="section-sub" style="margin-top:12px;">What's happening in sport? From Wankhede to your neighbourhood turf — Mumbai first, then Maharashtra, India and the world.</p>
    <div class="searchbar ev-search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input id="evSearch" placeholder="Search events — “running Mumbai”, “college football”, “events this weekend”…" value="${F.q.replace(/"/g,"&quot;")}" autocomplete="off">
      ${F.q?`<button class="sb-clear" onclick="PLAYR_EV.clearQ()">Clear</button>`:""}
    </div>
    <div class="ev-quick-chips">
      ${["running Mumbai","college football","padel","chess Mumbai","events this weekend","sports near me"].map(q=>`<button class="chip" onclick="PLAYR_EV.quickSearch('${q}')">${q}</button>`).join("")}
    </div>
    <div class="ev-strip">
      <button class="ev-strip-chip" onclick="PLAYR_EV.setDate('today')"><b>${today.length}</b> TODAY</button>
      <button class="ev-strip-chip" onclick="PLAYR_EV.setDate('weekend')"><b>${weekend.length}</b> THIS WEEKEND</button>
      ${live.length?`<button class="ev-strip-chip live" onclick="PLAYR_EV.setStatus('LIVE')"><span class="dot-live"></span><b>${live.length}</b> LIVE NOW</button>`:""}
      <button class="ev-strip-chip" onclick="PLAYR_EV.scrollToList()"><b>${EVENTS.length}</b> TOTAL EVENTS</button>
      <span class="ev-strip-note">📍 ${USER.label}${USER.precise?" (your location)":" · set as default"}</span>
    </div>
  </div>

  ${(fol.length||reg.length)?`
  <div class="ev-sec" id="myEventsSec">
    <div class="cat-head"><div class="cat-ic">🎟️</div><div><h3 class="cat-name">MY EVENTS</h3><p class="cat-blurb">Everything you follow and every registration, in one place.</p></div></div>
    <div id="myEventsBody">${(window.PLAYR_EV&&window.PLAYR_EV._myEventsHTML||function(){return ""})()}</div>
  </div>`:""}

  <div class="ev-sec">
    <div class="cat-head"><div class="cat-ic">📍</div><div><h3 class="cat-name">EVENTS NEAR YOU</h3><p class="cat-blurb">Mumbai is PLAYR's hero city — filter by locality, from Colaba to Kharghar.</p></div>
      <button class="btn btn-ghost btn-sm" style="margin-left:auto;" onclick="PLAYR_EV.useMyLocation()">Use my location</button></div>
    <div class="ev-area-chips">
      <button class="area-chip ${F.loc==="near"?"on":""}" onclick="PLAYR_EV.setLoc('near')">Near Me</button>
      ${MUMBAI_AREAS.map(a=>`<button class="area-chip ${F.loc==="area:"+a||F.loc===a?"on":""}" onclick="PLAYR_EV.setLoc('${a}')">${a}</button>`).join("")}
      <button class="area-chip ${F.loc==="Maharashtra"?"on":""}" onclick="PLAYR_EV.setLoc('Maharashtra')">Maharashtra</button>
      <button class="area-chip ${F.loc==="India"?"on":""}" onclick="PLAYR_EV.setLoc('India')">India</button>
      <button class="area-chip ${F.loc==="International"?"on":""}" onclick="PLAYR_EV.setLoc('International')">International</button>
    </div>
    <div class="fy-list-ev">${nearSorted.map(e=>miniCard(e)).join("")||"<span class='fy-empty'>No events within range — widen the location filter.</span>"}</div>
  </div>

  ${mySports.length?`<div class="ev-sec">
    <div class="cat-head"><div class="cat-ic">🎯</div><div><h3 class="cat-name">FOR YOU</h3><p class="cat-blurb">Because you follow ${mySports.length} sport${mySports.length>1?"s":""} — ${mySports.map(s=>BY_SPORT[s]?BY_SPORT[s].name:s).join(", ")}.</p></div></div>
    <div class="grid grid-3">${forYou.sort((a,b)=>a.start-b.start).slice(0,3).map(e=>card(e)).join("")||"<span class='fy-empty'>Follow more sports to sharpen recommendations.</span>"}</div>
  </div>`:""}

  <div class="ev-sec">
    <div class="cat-head"><div class="cat-ic">🔥</div><div><h3 class="cat-name">TRENDING NOW</h3><p class="cat-blurb">The events Mumbai can't stop talking about.</p></div></div>
    <div class="grid grid-4">${trending.map(e=>miniTrend(e)).join("")}</div>
  </div>

  <div class="ev-sec">
    <div class="cat-head"><div class="cat-ic">🇮🇳</div><div><h3 class="cat-name">MAJOR EVENTS IN INDIA</h3><p class="cat-blurb">National championships, international fixtures, professional leagues and India's biggest amateur events. Real events carry sources; sample events are badged DEMO.</p></div></div>
    <div class="grid grid-3">${majorIndia.slice(0,6).map(e=>card(e)).join("")}</div>
    <div class="fy-list-ev" style="margin-top:14px;">${majorIndia.slice(6).map(e=>miniCard(e)).join("")}</div>
  </div>

  <div class="ev-sec" id="calendarSec"></div>

  <div class="ev-sec" id="browseSec">
    <div class="cat-head"><div class="cat-ic">🧭</div><div><h3 class="cat-name">BROWSE ALL EVENTS</h3><p class="cat-blurb">Every PLAYR event, every filter you need.</p></div>
      <select class="ev-sort" onchange="PLAYR_EV.setSort(this.value)">${SORT_OPTS.map(s=>`<option value="${s[0]}" ${F.sort===s[0]?"selected":""}>Sort: ${s[1]}</option>`).join("")}</select></div>
    <div class="ev-filterbar">
      <div class="ev-f-group"><label>Location</label><div class="ev-f-chips">${LOC_OPTS.map(o=>`<button class="attr-pill ${F.loc===o[0]?"on":""}" onclick="PLAYR_EV.setLoc('${o[0]}')">${o[1]}</button>`).join("")}</div></div>
      <div class="ev-f-group"><label>Date</label><div class="ev-f-chips">${DATE_OPTS.map(o=>`<button class="attr-pill ${F.date===o[0]?"on":""}" onclick="PLAYR_EV.setDate('${o[0]}')">${o[1]}</button>`).join("")}</div></div>
      <div class="ev-f-group"><label>Sport</label><div class="ev-f-chips"><button class="attr-pill ${!F.sport?"on":""}" onclick="PLAYR_EV.setSport(null)">All</button>${Object.keys(BY_SPORT).filter(s=>EVENTS.some(e=>e.sport===s)).map(s=>`<button class="attr-pill ${F.sport===s?"on":""}" onclick="PLAYR_EV.setSport('${s}')">${BY_SPORT[s].name}</button>`).join("")}</div></div>
      <div class="ev-f-group"><label>Competition level</label><div class="ev-f-chips"><button class="attr-pill ${!F.level?"on":""}" onclick="PLAYR_EV.setLevel(null)">All</button>${LEVELS.filter(l=>EVENTS.some(e=>e.level===l)).map(l=>`<button class="attr-pill ${F.level===l?"on":""}" onclick="PLAYR_EV.setLevel('${l}')">${l}</button>`).join("")}</div></div>
      <div class="ev-f-group"><label>Event type</label><div class="ev-f-chips"><button class="attr-pill ${!F.type?"on":""}" onclick="PLAYR_EV.setType(null)">All</button>${TYPE_OPTS.map(o=>`<button class="attr-pill ${F.type===o[0]?"on":""}" onclick="PLAYR_EV.setType('${o[0]}')">${o[1]}</button>`).join("")}</div></div>
      <div class="ev-f-group"><label>Entry</label><div class="ev-f-chips">${[["any","Any"],["free","Free"],["paid","Paid"]].map(o=>`<button class="attr-pill ${F.price===o[0]||(o[0]==="any"&&!F.price)?"on":""}" onclick="PLAYR_EV.setPrice('${o[0]}')">${o[1]}</button>`).join("")}</div></div>
      <div class="ev-f-group"><label>Venue</label><div class="ev-f-chips">${[["any","Any"],["indoor","Indoor"],["outdoor","Outdoor"]].map(o=>`<button class="attr-pill ${F.inout===o[0]||(o[0]==="any"&&!F.inout)?"on":""}" onclick="PLAYR_EV.setInOut('${o[0]}')">${o[1]}</button>`).join("")}</div></div>
      <div class="ev-f-group"><label>SPCL / Para sport</label><div class="ev-f-chips"><button class="attr-pill ${!F.para?"on":""}" onclick="PLAYR_EV.setPara(false)">All events</button><button class="attr-pill ${F.para?"on":""}" onclick="PLAYR_EV.setPara(true)">SPCL — Para sports only</button></div></div>
      <div class="ev-f-group"><label>Status</label><div class="ev-f-chips"><button class="attr-pill ${!F.status?"on":""}" onclick="PLAYR_EV.setStatus(null)">All</button>${["UPCOMING","LIVE","COMPLETED"].map(s=>`<button class="attr-pill ${F.status===s?"on":""}" onclick="PLAYR_EV.setStatus('${s}')">${s}</button>`).join("")}</div></div>
      <div class="ev-f-group"><label>Age group</label><div class="ev-f-chips"><button class="attr-pill ${!F.age?"on":""}" onclick="PLAYR_EV.setAge(null)">All</button><button class="attr-pill ${F.age==="kids"?"on":""}" onclick="PLAYR_EV.setAge('kids')">Kids & Juniors</button></div></div>
    </div>
    <div id="evResults"></div>
  </div>`;
  renderResults();
  (window.PLAYR_EV&&window.PLAYR_EV._renderCalendar)&&window.PLAYR_EV._renderCalendar();
  const inp=document.getElementById("evSearch");
  if(inp){ let t; inp.addEventListener("input",()=>{ clearTimeout(t); t=setTimeout(()=>{ F.q=inp.value; renderResults(); const i2=document.getElementById("evSearch"); if(i2&&document.activeElement===i2){} },160);
    inp.addEventListener("focus",()=>inp.setSelectionRange(inp.value.length,inp.value.length)); }); }
}
function miniTrend(e){
  const n=parseInt(e.fol);
  return `<div class="trend-ev card" style="--accent:${e.accent}" onclick="openEventDetail('${e.id}')">
    <div class="tr-top"><span class="tr-ic">${e.sportIcon}</span><span class="tr-sport">${e.sportName.toUpperCase()}</span><span class="tr-fol mono-num">${e.fol}</span></div>
    <b class="tr-name">${e.name}</b>
    <div class="tr-meta">${dayChip(e.start)} · ${e.area}, ${e.city}</div>
    ${statusPill(e)}</div>`;
}
function renderResults(){
  const el=document.getElementById("evResults"); if(!el) return;
  const list=applyFilters(F.q.trim()?searchEvents(F.q):EVENTS);
  el.innerHTML = `<div class="srp-head"><h3>${list.length} event${list.length!==1?"s":""}${F.q.trim()?" matching “"+F.q.replace(/</g,"&lt;")+"\"":""}</h3></div>`+
    (list.length?`<div class="grid grid-3">${list.map(e=>card(e)).join("")}</div>`:`<div class="empty-state card"><h4>Nothing matches those filters</h4><p>Try “Near Me”, widen the date, or clear the search.</p></div>`);
}

/* state setters re-render page pieces */
function setLoc(v){ F.loc = v.startsWith("area:")||MUMBAI_AREAS.includes(v) ? (LOC_OPTS.some(o=>o[0]===v)?v:(EVENTS.some(e=>e.zone===v)?v:"area:"+v)) : v; renderEventsPage(); }
function setDate(v){ F.date=v; renderEventsPage(); }
function setSport(v){ F.sport=v; renderEventsPage(); }
function setLevel(v){ F.level=v; renderEventsPage(); }
function setType(v){ F.type=v; renderEventsPage(); }
function setPrice(v){ F.price=v==="any"?null:v; renderEventsPage(); }
function setInOut(v){ F.inout=v==="any"?null:v; renderEventsPage(); }
function setStatus(v){ F.status=v; renderEventsPage(); }
function setAge(v){ F.age=v; renderEventsPage(); }
function setPara(v){ F.para=v; renderEventsPage(); }
function setSort(v){ F.sort=v; renderResults(); }
function quickSearch(q){ F.q=q; renderEventsPage(); const el=document.getElementById("browseSec"); if(el&&el.scrollIntoView) el.scrollIntoView({behavior:"smooth"}); }
function clearQ(){ F.q=""; renderEventsPage(); }
function scrollToList(){ const el=document.getElementById("browseSec"); if(el&&el.scrollIntoView) el.scrollIntoView({behavior:"smooth"}); }
function useMyLocation(){
  if(!navigator.geolocation){ showToast?.("Geolocation not available — using Mumbai"); return; }
  showToast?.("Requesting your location…");
  navigator.geolocation.getCurrentPosition(p=>{ USER.lat=p.coords.latitude; USER.lng=p.coords.longitude; USER.precise=true; USER.label=nearCity(USER.lat,USER.lng);
    reResolve(); renderEventsPage(); showToast?.("Location set: "+USER.label); }, ()=>showToast?.("Couldn't get location — staying on Mumbai"), {timeout:6000});
}
function share(id){
  const e=byId(id); if(!e) return;
  const url=location.origin+location.pathname+"#event-"+id;
  if(navigator.share){ navigator.share({title:e.name,text:e.sportName+" — "+fmtDate(e.start)+" · "+e.city,url}).catch(()=>{}); }
  else if(navigator.clipboard){ navigator.clipboard.writeText(e.name+" · "+fmtDate(e.start)+" · "+e.city+" — "+url).then(()=>showToast?.("Event link copied")).catch(()=>showToast?.("Share: "+e.name)); }
  else showToast?.("Share: "+e.name);
}
function refreshIfVisible(){ const el=document.getElementById("eventsRoot"); if(el&&document.getElementById("view-events")?.classList.contains("active")) renderEventsPage(); }

return { EVENTS, byId, card, miniCard, follows, regs, isFollowing, isRegistered, syncState, toggleFollow, renderEventsPage,
  setLoc,setDate,setSport,setLevel,setType,setPrice,setPara,setInOut,setStatus,setAge,setSort,quickSearch,clearQ,scrollToList,useMyLocation,share,
  fmtDate,fmtTime,dayChip,priceLabel,distLabel,levelBadge,verifyBadge,statusPill,mapsUrl,sameDay,isWeekendPeriod,
  USER, reResolve, searchEvents, parseQuery, applyFilters };
})();
