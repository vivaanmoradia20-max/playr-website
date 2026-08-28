/* ============================================================
   PLAYR — LIVE SCORES  ("Follow the action. Live, all in one place.")
   ------------------------------------------------------------
   REAL DATA ONLY. Provider-adapter architecture:

     espn (default, keyless): browser → site.api.espn.com
       VERIFIED live + CORS*: Football (20+ leagues incl. Indian
       Super League), Basketball (NBA/WNBA), Ice Hockey (NHL),
       American Football (NFL + CFB), Baseball (MLB), F1 race
       weekends (session status only — no fabricated positions).
     proxy (optional): browser → /api/live-scores → SPORTS_API_KEY
       provider (api/live-scores.js) — enables cricket/tennis etc.
       Set PLAYR_ENV.LIVE_SCORES_ENDPOINT to activate.

   NEVER fake: no hardcoded scores, no random data, no invented
   venues. Missing data renders as "Data unavailable".
   Engine: normalized matches, sport-specific score renderers,
   dedup + in-memory/localStorage cache, visibility-aware smart
   polling (60s live / 5min idle), India-first ordering.
   ============================================================ */
(function(){
"use strict";
const LSQ=s=>document.querySelector(s), LSQA=s=>[...document.querySelectorAll(s)];
const LSK="playr_ls_favs_v1", LSKC="playr_ls_cache_v1";

/* ---------------- provider adapters ---------------- */
const ESPN_BASE="https://site.api.espn.com/apis/site/v2/sports";
const LEAGUES=[
  ["soccer","eng.1","Premier League"],["soccer","esp.1","LaLiga"],["soccer","ger.1","Bundesliga"],
  ["soccer","ita.1","Serie A"],["soccer","fra.1","Ligue 1"],["soccer","ned.1","Eredivisie"],
  ["soccer","por.1","Primeira Liga"],["soccer","ind.1","Indian Super League"],["soccer","usa.1","MLS"],
  ["soccer","mex.1","Liga MX"],["soccer","jpn.1","J1 League"],["soccer","aus.1","A-League"],
  ["soccer","uefa.champions","UEFA Champions League"],["soccer","uefa.europa","UEFA Europa League"],
  ["soccer","uefa.europa.conf","UEFA Conference League"],["soccer","fifa.world","FIFA World Cup"],
  ["soccer","fifa.worldq.afc","FIFA World Cup Qualifiers — AFC"],["soccer","fifa.worldq.uefa","WCQ — UEFA"],
  ["soccer","fifa.worldq.conmebol","WCQ — CONMEBOL"],["soccer","fifa.worldq.caf","WCQ — CAF"],
  ["soccer","concacaf.gold","CONCACAF Gold Cup"],["soccer","afc.cup","AFC Asian Cup"],
  ["basketball","nba","NBA"],["basketball","wnba","WNBA"],
  ["hockey","nhl","NHL"],
  ["football","nfl","NFL"],["football","college-football","NCAA Football"],
  ["baseball","mlb","MLB"],
  ["racing","f1","Formula 1"]
];
const SPORT_META={
  soccer:{key:"football",label:"FOOTBALL",icon:"⚽"},
  basketball:{key:"basketball",label:"BASKETBALL",icon:"🏀"},
  hockey:{key:"hockey",label:"HOCKEY",icon:"🏒"},
  football:{key:"nfl",label:"AM. FOOTBALL",icon:"🏈"},
  baseball:{key:"baseball",label:"BASEBALL",icon:"⚾"},
  racing:{key:"motorsport",label:"MOTORSPORT",icon:"🏎️"}
};
function baseURL(){ const o=window.__LS_OVERRIDE; return o&&o.base?o.base.replace(/\/+$/,""):ESPN_BASE; }
const espnUrl=(cat,lg)=>`${baseURL()}/${cat}/${lg}/scoreboard`;

function normESPN(ev,cat,lgName){
  const comp=(ev.competitions||[])[0]; if(!comp) return null;
  const st=(ev.status||{}).type||{};
  const state=st.state==="in"?"live":st.state==="post"?"post":"pre";
  const teams={};
  (comp.competitors||[]).forEach(c=>{ if(c.homeAway) teams[c.homeAway]=c; });
  const h=teams.home, a=teams.away;
  const venue=(comp.venue||{}).fullName||"";
  const country=((comp.venue||{}).address||{}).country||"";
  const tName=x=>x&&(x.team||{}).displayName||"";
  const india=(/india/i.test(lgName))||(/india/i.test(country))||(/india/i.test(tName(h)+tName(a)));
  const meta=SPORT_META[cat]||{key:cat,label:cat.toUpperCase(),icon:"🏅"};
  return {
    id:"espn-"+ev.id, provider:"espn",
    sport:meta.key, sportLabel:meta.label, icon:meta.icon,
    competition:lgName, competitionSlug:lgName,
    status:state, statusDetail:st.detail||st.description||"",
    clock:ev.status&&ev.status.displayClock||"",
    startTime:ev.date||null,
    homeTeam:tName(h)||"—", awayTeam:tName(a)||"—",
    homeAb:(h&&(h.team||{}).abbreviation)||"", awayAb:(a&&(a.team||{}).abbreviation)||"",
    homeScore:h&&h.score!=null?String(h.score):null,
    awayScore:a&&a.score!=null?String(a.score):null,
    period:comp.status&&comp.status.period||ev.status&&ev.status.period||null,
    venue, country, india,
    raceName: cat==="racing"? (ev.name||""):"",
    lastUpdated:Date.now()
  };
}
const espnAdapter={
  async fetchAll(onPartial){
    const out=[]; let done=0; const CONC=6; let idx=0; let failures=0;
    const worker=async()=>{ while(idx<LEAGUES.length){
      const [cat,lg,name]=LEAGUES[idx++];
      try{
        const r=await fetch(espnUrl(cat,lg),{headers:{Accept:"application/json"}});
        if(r.ok){ const j=await r.json();
          (j.events||[]).forEach(ev=>{ const m=normESPN(ev,cat,name); if(m) out.push(m); });
        } else failures++;
      }catch(e){ failures++; }
      if(++done%8===0) onPartial&&onPartial(out.slice());
    }};
    await Promise.all(Array.from({length:CONC},worker));
    if(failures>=LEAGUES.length) throw new Error("provider unreachable");
    return out;
  }
};
const proxyAdapter={
  endpoint(){ const e=(window.PLAYR_ENV||{}).LIVE_SCORES_ENDPOINT; return e&&/^https?:\/\//.test(e)?e:null; },
  async fetchAll(onPartial){
    const url=this.endpoint(); if(!url) throw new Error("no endpoint");
    const r=await fetch(url,{headers:{Accept:"application/json"}});
    if(!r.ok) throw new Error("proxy "+r.status);
    const j=await r.json();
    return (j.matches||[]).map(m=>Object.assign({lastUpdated:Date.now()},m));
  }
};
const activeProvider=()=>proxyAdapter.endpoint()?proxyAdapter:espnAdapter;

/* ---------------- engine: cache, dedupe, poll ---------------- */
const S={matches:null, error:null, loading:false, fetchedAt:0, inflight:false, timer:null, lastRender:0};
const readCache=()=>{ try{ return JSON.parse(localStorage.getItem(LSKC)); }catch(e){ return null; } };
const writeCache=()=>{ try{ localStorage.setItem(LSKC,JSON.stringify({at:S.fetchedAt,matches:S.matches})); }catch(e){} };

async function refresh(onPartial){
  if(S.inflight) return; S.inflight=true; S.loading=true; S.error=null;
  try{
    S.matches=await activeProvider().fetchAll(onPartial);
    S.fetchedAt=Date.now(); writeCache();
  }catch(e){ S.error=e; }
  S.inflight=false; S.loading=false;
}
function schedulePolling(){
  clearInterval(S.timer);
  S.timer=setInterval(()=>{
    if(document.hidden) return;
    const hasLive=(S.matches||[]).some(m=>m.status==="live");
    const active=LSQ("#view-live")&&LSQ("#view-live").classList.contains("active");
    if(Date.now()-S.fetchedAt>(hasLive&&(active||homeStripVisible()))?60000:300000) refreshAndRender();
  },20000);
}
const homeStripVisible=()=>LSQ("#homeLiveStrip")&&LSQ("#view-home").classList.contains("active");
async function refreshAndRender(){ await refresh(); renderAll(); }
function bootFromCache(){
  const c=readCache();
  if(c&&c.matches&&Date.now()-c.at<30*60*1000){ S.matches=c.matches; S.fetchedAt=c.at; return true; }
  return false;
}

/* ---------------- favourites (device-local, honest) ---------------- */
const favs=()=>{ try{ return JSON.parse(localStorage.getItem(LSK))||[]; }catch(e){ return []; } };
const isFav=id=>favs().includes(id);
function toggleFav(id){ const f=favs(); const i=f.indexOf(id); i>=0?f.splice(i,1):f.push(id);
  try{ localStorage.setItem(LSK,JSON.stringify(f)); }catch(e){}
  showToast(i>=0?"Removed from favourites":"Added to favourites ⭐ (saved on this device)"); renderAll(); }

/* ---------------- filters ---------------- */
let F={status:"live", sport:"ALL", scope:"ALL", q:"", favOnly:false};
function filtered(){
  let list=(S.matches||[]).slice();
  if(F.status!=="ALL") list=list.filter(m=>m.status===F.status);
  if(F.sport!=="ALL") list=list.filter(m=>m.sport===F.sport);
  if(F.scope==="INDIA") list=list.filter(m=>m.india);
  if(F.scope==="INTL") list=list.filter(m=>!m.india);
  if(F.favOnly) list=list.filter(m=>isFav(m.id));
  if(F.q.trim()){ const t=F.q.toLowerCase();
    list=list.filter(m=>(m.homeTeam+" "+m.awayTeam+" "+m.competition+" "+(m.raceName||"")).toLowerCase().includes(t)); }
  const order={live:0,pre:1,post:2};
  return list.sort((a,b)=>(a.status===b.status?0:order[a.status]-order[b.status])||(b.india-a.india)||(Math.abs(new Date(a.startTime)-Date.now())-Math.abs(new Date(b.startTime)-Date.now())));
}

/* ---------------- sport-specific score renderers ---------------- */
function scoreHTML(m){
  if(m.sport==="football"||m.sport==="nfl") return footballScore(m);
  if(m.sport==="basketball") return basketballScore(m);
  if(m.sport==="hockey") return hockeyScore(m);
  if(m.sport==="baseball") return baseballScore(m);
  if(m.sport==="motorsport") return motorsportScore(m);
  return genericScore(m);
}
const row=(m,side)=>{ const nm=side==="h"?m.homeTeam:m.awayTeam, ab=side==="h"?m.homeAb:m.awayAb, sc=side==="h"?m.homeScore:m.awayScore;
  return `<div class="ls-side ${m.status==="post"&&winnerIs(m,side)?"won":""}">
    <span class="ls-ab">${ab||nm.slice(0,3).toUpperCase()}</span><span class="ls-nm">${nm}</span>
    <span class="ls-sc">${sc!=null?sc:"—"}</span></div>`; };
function winnerIs(m,side){ const h=parseFloat(m.homeScore),a=parseFloat(m.awayScore);
  if(isNaN(h)||isNaN(a)||h===a) return false; return side==="h"?h>a:a>h; }
function footballScore(m){ return `${row(m,"h")}<div class="ls-mid"><span class="ls-vs">vs</span></div>${row(m,"a")}
  ${m.status==="live"?`<div class="ls-clock mono-num">🔴 ${m.clock||m.statusDetail||"LIVE"}</div>`:m.status==="pre"?`<div class="ls-clock mono-num">${fmtTime(m.startTime)}</div>`:`<div class="ls-clock mono-num">✓ ${m.statusDetail||"FULL TIME"}</div>`}`; }
function basketballScore(m){ const q=m.period?("Q"+m.period):"";
  return `${row(m,"h")}<div class="ls-mid"><span class="ls-vs">vs</span></div>${row(m,"a")}
  <div class="ls-clock mono-num">${m.status==="live"?"🔴 "+(m.clock||q||"LIVE"):m.status==="pre"?fmtTime(m.startTime):"✓ "+(m.statusDetail||"FINAL")}</div>`; }
const hockeyScore=baseballScore;
function baseballScore(m){ return `${row(m,"h")}<div class="ls-mid"><span class="ls-vs">vs</span></div>${row(m,"a")}
  <div class="ls-clock mono-num">${m.status==="live"?"🔴 "+(m.clock||"IN PROGRESS"):m.status==="pre"?fmtTime(m.startTime):"✓ "+(m.statusDetail||"FINAL")}</div>`; }
function motorsportScore(m){ return `<div class="ls-race">
  <span class="ls-race-icon">🏎️</span><b>${m.raceName||m.competition}</b>
  <span class="mono-num">${m.status==="live"?"🔴 SESSION LIVE":m.status==="pre"?fmtTime(m.startTime):"✓ "+(m.statusDetail||"COMPLETED")}</span>
  <p class="mono-num ls-note">SESSION STATUS ONLY — NO LIVE POSITIONS IN THIS FEED</p></div>`; }
function genericScore(m){ return `${row(m,"h")}<div class="ls-mid"><span class="ls-vs">vs</span></div>${row(m,"a")}
  <div class="ls-clock mono-num">${m.statusDetail||""}</div>`; }

/* ---------------- time helpers ---------------- */
function fmtTime(iso){ if(!iso) return "Time TBC";
  try{ const d=new Date(iso);
    return d.toLocaleString(undefined,{weekday:"short",hour:"2-digit",minute:"2-digit"})+" · "+(Intl.DateTimeFormat().resolvedOptions().timeZone||"local");
  }catch(e){ return "Time TBC"; } }
function ago(ts){ const s=Math.max(0,Math.round((Date.now()-ts)/1000));
  if(s<15) return "just now"; if(s<60) return s+"s ago";
  const m=Math.round(s/60); return m<60?m+" min ago":Math.round(m/60)+"h ago"; }

/* ---------------- cards ---------------- */
function statusBadge(m){
  if(m.status==="live") return '<span class="ls-badge live"><span class="dot-w"></span>LIVE</span>';
  if(m.status==="pre") return '<span class="ls-badge pre">UPCOMING</span>';
  return '<span class="ls-badge post">✓ COMPLETED</span>';
}
function cardHTML(m){
  const fav=isFav(m.id);
  return `<div class="ls-card ${m.status}" data-mid="${m.id}" tabindex="0" role="button" aria-label="${m.homeTeam} vs ${m.awayTeam}, ${m.competition}, ${m.status}">
    <div class="ls-top"><span class="ls-sport mono-num">${m.icon} ${m.sportLabel}</span>
      <span class="ls-comp mono-num">${m.competition}${m.india?' <em class="ls-in">🇮🇳</em>':""}</span>
      <button class="ls-fav ${fav?"on":""}" aria-label="Favourite this match" onclick="event.stopPropagation();PLAYR_LS.fav('${m.id}')">${fav?"★":"☆"}</button></div>
    <div class="ls-score">${scoreHTML(m)}</div>
    <div class="ls-foot"><span class="mono-num ls-venue">${m.venue?("📍 "+m.venue):"Venue unavailable"}</span>
      <button class="ls-details" onclick="event.stopPropagation();PLAYR_LS.details('${m.id}')">MATCH DETAILS →</button></div>
  </div>`;
}

/* ---------------- page render ---------------- */
function render(){
  const root=LSQ("#liveRoot"); if(!root) return;
  const sports=["ALL"].concat([...new Set((S.matches||[]).map(m=>m.sport))]);
  if(S.error&&!S.matches){
    root.innerHTML=`<div class="wrap section"><div class="sec-error card"><b>LIVE SCORES ARE TEMPORARILY UNAVAILABLE</b><p>Please try again shortly.</p><button class="btn btn-primary btn-sm" onclick="PLAYR_LS.retry()">RETRY</button></div></div>`;
    return;
  }
  const list=filtered();
  const counts={live:(S.matches||[]).filter(m=>m.status==="live").length,pre:(S.matches||[]).filter(m=>m.status==="pre").length,post:(S.matches||[]).filter(m=>m.status==="post").length};
  const stale=S.error&&S.matches?`<div class="ls-stale mono-num">⚠ CONNECTION LOST — SHOWING LAST KNOWN SCORES · <button class="ls-details" onclick="PLAYR_LS.retry()">RETRY</button></div>`:"";
  root.innerHTML=`
  <div class="ls-hero"><div class="ls-hero-bg"></div><div class="wrap ls-hero-in">
    <div class="eyebrow">PLAYR Live Scores</div>
    <h1>LIVE SCORES.</h1>
    <p class="ls-tag">Follow the action. Live, all in one place.</p>
    <p class="mono-num ls-updated">${S.loading?"LOADING LIVE DATA…":S.fetchedAt?("Live • Updated "+ago(S.fetchedAt)):""}</p>
  </div></div>
  <div class="wrap ls-sec">
    ${stale}
    <div class="ls-tabs">
      ${[["live","🔴 LIVE"],["pre","UPCOMING"],["post","COMPLETED"],["ALL","ALL"]].map(([v,l])=>`<button class="ls-tab ${F.status===v?"on":""}" onclick="PLAYR_LS.setStatus('${v}')">${l}${v!=="ALL"?` <em>${counts[v]||0}</em>`:""}</button>`).join("")}
    </div>
    <div class="searchbar ls-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input id="lsSearch" placeholder="Search teams, players, leagues..." value="${F.q.replace(/"/g,"&quot;")}" autocomplete="off"></div>
    <div class="chip-row ls-sports">${sports.map(s=>`<button class="chip ${F.sport===s?"active":""}" onclick="PLAYR_LS.setSport('${s}')">${sportChip(s)}</button>`).join("")}</div>
    <div class="chip-row">
      <button class="chip ${F.scope==="ALL"?"active":""}" onclick="PLAYR_LS.setScope('ALL')">ALL REGIONS</button>
      <button class="chip ${F.scope==="INDIA"?"active":""}" onclick="PLAYR_LS.setScope('INDIA')">🇮🇳 INDIA</button>
      <button class="chip ${F.scope==="INTL"?"active":""}" onclick="PLAYR_LS.setScope('INTL')">INTERNATIONAL</button>
      <button class="chip ${F.favOnly?"active":""}" onclick="PLAYR_LS.setFavOnly()">⭐ MY FAVOURITES</button>
    </div>
    ${S.loading&&!S.matches?'<div class="ls-skel"><div class="ls-card skel"></div><div class="ls-card skel"></div><div class="ls-card skel"></div></div>':
      list.length?`<div class="ls-grid">${list.map(cardHTML).join("")}</div>`
      :`<div class="empty-state card ls-empty"><b>${F.status==="live"?"NO LIVE MATCHES RIGHT NOW":"NO MATCHES FOR THIS FILTER"}</b><p>Check upcoming matches or explore another sport.</p><button class="btn btn-ghost btn-sm" style="margin-top:12px;" onclick="PLAYR_LS.setStatus('pre')">VIEW UPCOMING</button></div>`}
    <p class="mono-num ls-src">LIVE DATA · ${activeProvider()===proxyAdapter?"PLAYR LIVE PROXY":"ESPN PUBLIC FEED"} · NO FABRICATED SCORES — MISSING FIELDS SHOW AS UNAVAILABLE</p>
  </div>`;
  const inp=LSQ("#lsSearch");
  if(inp){ let t; inp.addEventListener("input",()=>{ clearTimeout(t); t=setTimeout(()=>{ F.q=inp.value; render(); const i2=LSQ("#lsSearch"); if(i2){i2.focus(); i2.setSelectionRange(i2.value.length,i2.value.length);} },160); }); }
}
function sportChip(s){ if(s==="ALL") return "ALL";
  const m=(S.matches||[]).find(x=>x.sport===s); return m?m.icon+" "+m.sportLabel:s; }

/* ---------------- details modal (API fields only) ---------------- */
function details(id){
  const m=(S.matches||[]).find(x=>x.id===id); if(!m) return;
  const f=(l,v)=>`<div class="lsd-row"><span>${l}</span><b>${v!=null&&v!==""?v:"Data unavailable"}</b></div>`;
  const ov=document.createElement("div"); ov.id="lsModal"; ov.className="a-overlay";
  ov.addEventListener("click",e=>{ if(e.target===ov) ov.remove(); });
  ov.innerHTML=`<div class="ch-create card ls-modal" role="dialog" aria-label="Match details">
    <button class="a-close" aria-label="Close" onclick="document.getElementById('lsModal').remove()">✕</button>
    <div class="lsd-head"><span class="ls-sport mono-num">${m.icon} ${m.sportLabel}</span>${statusBadge(m)}</div>
    <h3 class="lsd-title">${m.sport==="motorsport"?(m.raceName||m.competition):m.homeTeam+" vs "+m.awayTeam}</h3>
    ${m.sport!=="motorsport"?`<div class="ls-score">${scoreHTML(m)}</div>`:""}
    <div class="lsd-rows">
      ${f("COMPETITION",m.competition)}
      ${f("STATUS",m.statusDetail||(m.status==="live"?"In progress":m.status==="pre"?"Upcoming":"Completed"))}
      ${f("START TIME",m.startTime?fmtTime(m.startTime):null)}
      ${f("VENUE",m.venue)}
      ${f("REGION",m.country||(m.india?"India":"—"))}
    </div>
    <p class="mono-num ls-src">FIELDS SHOWN ARE EVERYTHING THIS FEED PROVIDES FOR THIS MATCH — NOTHING IS INVENTED.</p>
  </div>`;
  document.body.appendChild(ov);
}

/* ---------------- home strip ---------------- */
function renderHomeStrip(){
  const el=LSQ("#homeLiveStrip"); if(!el) return;
  if(S.error&&!S.matches){ el.innerHTML=`<div class="wrap"><div class="ls-home card"><b class="mono-num">🔴 LIVE SCORES</b><p>Live scores are temporarily unavailable.</p><button class="btn btn-ghost btn-sm" onclick="PLAYR_LS.retry()">RETRY</button></div></div>`; return; }
  const live=(S.matches||[]).filter(m=>m.status==="live");
  const picks=(live.length?live:(S.matches||[]).filter(m=>m.status==="pre")).slice(0,4);
  el.innerHTML=`<div class="wrap">
    <div class="cat-head"><div class="cat-ic">📡</div><div><h3 class="cat-name">LIVE SCORES</h3><p class="cat-blurb">Follow the action. Live, all in one place.</p></div>
      <button class="btn btn-ghost btn-sm" style="margin-left:auto;" onclick="PLAYR_LS.open()">VIEW ALL LIVE SCORES →</button></div>
    ${picks.length?`<div class="ls-home-grid">${picks.map(m=>`
      <button class="ls-home-card" onclick="PLAYR_LS.open()">
        ${statusBadge(m)}
        <span class="mono-num ls-hc-sport">${m.icon} ${m.sportLabel}</span>
        <b class="ls-hc-score">${m.sport==="motorsport"?(m.raceName||""):(m.homeAb||m.homeTeam)+" "+(m.homeScore!=null?m.homeScore:"–")+" — "+(m.awayScore!=null?m.awayScore:"–")+" "+(m.awayAb||m.awayTeam)}</b>
        <span class="mono-num ls-hc-sub">${m.status==="live"?(m.clock||"LIVE"):m.status==="pre"?fmtTime(m.startTime).split("·")[0]:(m.statusDetail||"FT")} · ${m.competition}</span>
      </button>`).join("")}</div>`
    :`<div class="ls-home card"><b>No live matches right now.</b><p>Check upcoming matches or explore another sport.</p><button class="btn btn-ghost btn-sm" onclick="PLAYR_LS.open()">VIEW UPCOMING</button></div>`}
  </div>`;
}
function renderAll(){ render(); renderHomeStrip(); }

/* ---------------- public API ---------------- */
window.PLAYR_LS={
  setStatus(v){ F.status=v; render(); }, setSport(s){ F.sport=s; render(); },
  setScope(v){ F.scope=v; render(); }, setFavOnly(){ F.favOnly=!F.favOnly; render(); },
  fav:toggleFav, details,
  open(){ switchView("live"); },
  retry(){ refreshAndRender(); },
  renderAll
};
window.initLiveScores=function(){
  bootFromCache();
  renderAll();
  refreshAndRender();          // real network fetch
  schedulePolling();
};
})();
