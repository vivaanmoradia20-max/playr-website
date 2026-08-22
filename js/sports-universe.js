/* ============================================================
   PLAYR — SPORT UNIVERSE + OLYMPIC HUB
   Auto-generates a full universe (tabs adapt to the sport) for
   every sport in the catalogue, plus the Olympic Hub page.
   ============================================================ */
(function(){
"use strict";
const B=window.PLAYR_SPORTS, BY={}; B.forEach(s=>BY[s.id]=s);
const fmt=window.PS_fmtFol, catOf=window.PS_catOf, badge=window.PS_badgeHTML, ed=window.PS_editionLabel, gen=window.PS_gen;
let current=null, currentTab=null;

const DEFAULT_TABS=["Feed","Latest","History","Athletes","Community","Challenges","Events","Stats"];
const PEAKS=[["Everest",8849],["K2",8611],["Kangchenjunga",8586],["Lhotse",8516],["Makalu",8485],["Cho Oyu",8188],["Dhaulagiri",8167],["Manaslu",8163],["Nanga Parbat",8126],["Annapurna I",8091],["Gasherbrum I",8080],["Broad Peak",8051],["Gasherbrum II",8035],["Shishapangma",8027]];
const CRICKET_MARKS=[["100 international centuries","Sachin Tendulkar — the only player ever"],["First ODI double century","Sachin Tendulkar, 200* vs South Africa (2010)"],["Six sixes in an over","Yuvraj Singh, T20 World Cup 2007"],["Highest Test innings total","952/6 — Sri Lanka vs India, Colombo 1997"],["Fastest T20 century","Chris Gayle — 30 balls, IPL 2013"],["Most T20I wickets","A record still being rewritten every season"]];

/* ---------- open from anywhere ---------- */
window.openSport=function(id){ if(!BY[id]) return; switchView("sports"); setSportUniverse(id); };
window.setSportUniverse=function(id){
  if(!BY[id]) return; current=id;
  const s=BY[id], cat=catOf(s), following=window.PS_isFollowing(id);
  const tabs=(s.tabsOverride||DEFAULT_TABS).slice();
  if(s.risk==="high"){ const i=tabs.indexOf("Challenges"); if(i>=0) tabs[i]="Safety"; else tabs.push("Safety"); }
  currentTab=tabs[0];
  const hist=(window.SPORT_HISTORY&&window.SPORT_HISTORY[id])||null;

  const root=document.getElementById("universeRoot"); if(!root) return;
  root.innerHTML=`
  <div class="su2-hero" style="--accent:${cat.accent}; background:${s.image}">
    <span class="su2-watermark">${s.icon}</span>
    <div class="su2-in">
      <div class="su2-top">
        <div class="su2-icon">${s.icon}</div>
        <div>
          <div class="su2-badges">${badge(s)}</div>
          <h1 class="su2-title">${s.name.toUpperCase()}</h1>
          <div class="su2-sub">${(s.subcategory? s.subcategory+" · ":"")+cat.name}</div>
        </div>
        <div class="su2-side">
          <div class="su2-fol mono-num">${fmt(s.followers)} followers</div>
          <button class="follow-btn ${following?"following":""}" id="su2Follow" onclick="toggleFollowSport('${s.id}',this)">${following?"Following":"+ Follow"}</button>
        </div>
      </div>
      <p class="su2-desc">${s.description}</p>
      ${s.olympicNote?`<div class="su2-note"><b>${ed(s.olympicEdition).toUpperCase()}</b> — ${s.olympicNote}</div>`:""}
      ${s.risk==="high"?`<div class="su2-risk"><b>Community & information only.</b> PLAYR presents ${s.name} culture, stories and safety education — it does not create challenges or mechanics that encourage participation in high-risk activities. Train only with accredited instructors and local authorities.</div>`:""}
      ${s.disciplines.length?`<div class="su2-prog">
        <div class="su2-prog-head">${s.isOlympic?`OLYMPIC PROGRAMME · ${ed(s.olympicEdition).toUpperCase()} <span>Sport → Discipline → Events</span>`:`DISCIPLINES & FORMATS`}</div>
        <div class="su2-disc-grid">${s.disciplines.map(d=>`
          <div class="su2-disc"><b>${d.name}</b>${d.eventCount?`<span class="mono-num">${d.eventCount} events</span>`:""}
            ${d.events.length?`<ul>${d.events.map(e=>`<li>${e}</li>`).join("")}</ul>`:""}</div>`).join("")}
        </div></div>`:""}
    </div>
  </div>

  <div class="su2-qsw">
    <div class="su2-qsw-label">Jump to another sport:</div>
    <div class="su2-qsw-list" id="su2Qsw">${qswHTML("")}</div>
    <input id="su2QswInput" class="su2-qsw-input" placeholder="Type a sport…" autocomplete="off">
  </div>

  <div class="su-tabs su2-tabs" id="suTabs"></div>
  <div id="suPanels"></div>

  <div class="maylike">
    <div class="fy-row-head"><div class="eyebrow" style="margin:0">You may also like</div></div>
    <div class="fy-list">${window.PS_related(id,8).map(x=>window.PS_miniCard(x)).join("")}</div>
  </div>`;

  document.getElementById("su2QswInput").addEventListener("input",e=>{ document.getElementById("su2Qsw").innerHTML=qswHTML(e.target.value); });
  renderTabs(); renderPanel();
  window.scrollTo({top:0});
};
function qswHTML(q){
  const t=q.trim().toLowerCase();
  let list = t? window.PS_searchSports(t).slice(0,10) : B.filter(x=>x.popularity>=80).slice(0,12);
  return list.filter(x=>x.id!==current).map(x=>`<button class="chip" style="--accent:${catOf(x).accent}" onclick="setSportUniverse('${x.id}')">${x.icon} ${x.name}</button>`).join("")||`<span class="fy-empty">No sport found.</span>`;
}
function renderTabs(){
  const s=BY[current];
  const tabs=(s.tabsOverride||DEFAULT_TABS).slice();
  if(s.risk==="high"){ const i=tabs.indexOf("Challenges"); if(i>=0) tabs[i]="Safety"; else tabs.push("Safety"); }
  const el=document.getElementById("suTabs"); if(!el) return;
  el.innerHTML=tabs.map(t=>`<div class="su-tab ${t===currentTab?"active":""}" data-t="${t}" onclick="PS_setSuTab('${t}')">${t}</div>`).join("");
}
window.PS_setSuTab=function(t){ currentTab=t; renderTabs(); renderPanel(); };
window.renderSuTabs=renderTabs;

/* ---------- panel renderers (content adapts to the sport) ---------- */
function athleteGrid(s){
  const A=gen.athletes(s,8), legends=gen.legends(s);
  let h=`<div class="grid grid-4">`+A.map(a=>`<div class="card athlete-card">
      <div class="athlete-photo" style="background:${s.image}"><span>${a.n.split(" ").map(w=>w[0]).slice(0,2).join("")}</span></div>
      <div class="athlete-name">${a.n}</div><div class="athlete-sub">${a.role} · ${fmt(a.followers)} followers</div>
      <button class="follow-btn" style="background:transparent;" onclick="showToast('Following ${a.n}')">+ Follow</button></div>`).join("")+`</div>`;
  if(legends) h+=`<div class="fy-row-head" style="margin-top:26px;"><div class="eyebrow" style="margin:0">All-time greats of ${s.name}</div></div>
    <div class="legend-row">${legends.map(l=>`<div class="legend-chip card">${s.icon} ${l}</div>`).join("")}</div>`;
  return h;
}
function panelFor(s,t){
  const G=gen;
  switch(t){
    case "Feed":{
      const posts=G.posts(s,4);
      return `<div class="feed-col" style="margin:0;">`+posts.map(p=>`
        <div class="card" style="padding:18px 20px;margin-bottom:14px;">
          <div class="fp-head"><div class="fp-avatar" style="background:${s.image};display:flex;align-items:center;justify-content:center;font-size:18px;">${s.icon}</div>
          <div><div class="fp-name">${p.name}</div><div class="fp-meta">${s.name.toUpperCase()} · ${p.role.toUpperCase()} · ${p.time}</div></div></div>
          <p style="margin:12px 0;color:var(--text);font-size:14.5px;line-height:1.55;">${p.text}</p>
          <div class="fp-actions" style="color:var(--muted);">♥ ${fmt(p.likes)} &nbsp; 💬 ${p.comments} &nbsp; <span style="margin-left:auto;font-family:var(--mono);font-size:11px;color:var(--muted-2);">DEMO COMMUNITY POST</span></div>
        </div>`).join("")+`</div>`;
    }
    case "Latest":{
      const L=G.latest(s,4);
      return `<div class="grid grid-3">`+L.map(x=>`<div class="card" style="padding:22px;"><div class="pill pill-cyan" style="margin-bottom:12px;">Community</div><h4 style="font-size:16px;font-weight:800;margin-bottom:8px;line-height:1.35;">${x[0]}</h4><p style="color:var(--muted);font-size:13px;line-height:1.5;">${x[1]}</p></div>`).join("")+`</div>`;
    }
    case "History":{
      const H=(window.SPORT_HISTORY||{})[s.id];
      if(!H) return `<div class="empty-state card"><h4>${s.name}'s history is waiting to be written.</h4><p>PLAYR doesn't invent facts. This timeline fills with verified milestones and community stories — fans and historians can contribute first.</p><button class="btn btn-primary btn-sm" style="margin-top:14px;" onclick="showToast('Thanks — history contributions open soon')">Contribute history</button></div>`;
      return `<div style="margin-bottom:18px;" class="eyebrow">Milestones in ${s.name}</div>`+H.map(h=>`<div class="timeline-card"><div class="tl-year">${h.y}</div><div class="tl-body"><h4>${h.e}</h4><p>${h.d}</p></div></div>`).join("");
    }
    case "Athletes": case "Players": case "Drivers": return athleteGrid(s);
    case "Community":{
      const C=G.communities(s,4);
      return C.map(c=>`<div class="card" style="padding:20px 22px;margin-bottom:14px;display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap;"><div><div style="font-weight:800;margin-bottom:6px;">${c.n}</div><p style="color:var(--muted);font-size:14px;">${c.t}</p></div><div style="text-align:right;"><div class="mono-num" style="color:var(--lime);font-size:15px;">${c.members}</div><button class="join-btn" onclick="toggleJoin(this,'${c.n}')">Join</button></div></div>`).join("");
    }
    case "Challenges":{
      const C=G.challenges(s);
      return `<div class="pill pill-coral" style="margin-bottom:16px;">Recreational · Social · Unofficial</div>`+C.map(c=>`<div class="card" style="padding:26px;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:14px;"><div><h4 style="font-size:17px;font-weight:800;margin-bottom:6px;">${c.t}</h4><p style="color:var(--muted);font-size:14px;">${c.d}</p></div><button class="btn btn-primary btn-sm" onclick="switchView('challenges')">Join Challenge</button></div>`).join("");
    }
    case "Safety":{
      return `<div class="card" style="padding:28px;border-left:3px solid #FFB13D;">
        <h4 style="font-size:20px;margin-bottom:12px;">Safety first — always.</h4>
        <p style="color:var(--muted);font-size:14px;line-height:1.7;">${s.name} carries real risk. PLAYR deliberately offers <b>no challenges or performance mechanics</b> here — only stories, education and community. If you pursue ${s.name}:</p>
        <ul style="margin:14px 0 0 18px;color:var(--muted);font-size:14px;line-height:2;">
          <li>Train with accredited schools, guides and instructors only</li>
          <li>Use certified, maintained equipment — every time</li>
          <li>Follow local authorities, permits and conditions</li>
          <li>Never attempt progression beyond your certification</li>
          <li>Insurance and emergency planning are non-negotiable</li>
        </ul></div>`;
    }
    case "Events":{
      const E=G.events(s,4);
      return E.map(e=>`<div class="card" style="padding:26px;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-bottom:14px;"><div><h4 style="font-size:17px;font-weight:800;margin-bottom:6px;">${e.n}</h4><p style="color:var(--muted);font-size:14px;font-family:var(--mono);">${e.d}</p></div><button class="btn btn-ghost btn-sm" onclick="switchView('events')">View Events</button></div>`).join("");
    }
    case "Stats": case "Statistics":{
      return `<div class="stat-row">`+G.stats(s).map(x=>`<div class="stat-block"><div class="flap">${x.v}</div><div class="stat-label">${x.l}</div></div>`).join("")+`</div><p style="color:var(--muted-2);font-size:12px;margin-top:14px;font-family:var(--mono);">PLATFORM CONTENT COUNTS — DEMO DATA, NOT OFFICIAL FIGURES.</p>`;
    }
    case "Records":{
      if(s.id==="cricket") return `<div class="grid grid-3">`+CRICKET_MARKS.map(m=>`<div class="card" style="padding:22px;"><div class="pill pill-lime" style="margin-bottom:12px;">All-time mark</div><h4 style="font-size:16px;font-weight:800;margin-bottom:8px;">${m[0]}</h4><p style="color:var(--muted);font-size:13px;">${m[1]}</p></div>`).join("")+`</div>`;
      return panelFor(s,"Stats");
    }
    case "Matches":{
      const teams=["Mumbai XI","Delhi Dashers","Bengaluru Blasters","Chennai Chargers","Kolkata Kings","Pune Prowlers"];
      const R=(function(){let a=42;return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};})();
      const fix=[]; for(let i=0;i<3;i++){ const x=Math.floor(R()*6), y=Math.floor(R()*6); fix.push({a:teams[(x+i*2)%6],b:teams[(y+i*3+1)%6],s:i===2?`${Math.floor(R()*180+120)}–${Math.floor(R()*170+110)}`:"—",t:["Sat, 5:00 PM","Sat, 7:30 PM","Sun, 4:00 PM"][i]}); }
      return `<div class="card">${fix.map(f=>`<div class="fixture-row"><div class="fixture-team left">${f.a}</div><div></div><div class="fixture-score">${f.s}<div style="font-family:var(--mono);font-size:10px;color:var(--muted-2);margin-top:4px;">${f.t}</div></div><div></div><div class="fixture-team">${f.b}</div></div>`).join("")}</div><p style="color:var(--muted-2);font-size:12px;margin-top:12px;font-family:var(--mono);">DEMO FIXTURES — COMMUNITY MATCH TRACKING.</p>`;
    }
    case "Teams":{
      const T=["Mumbai XI","Delhi Dashers","Bengaluru Blasters","Chennai Chargers","Kolkata Kings","Pune Prowlers","Jaipur Jaguars","Hyderabad Hawks"];
      return `<div class="grid grid-4">${T.map(t=>`<div class="card" style="padding:20px;text-align:center;font-weight:700;font-size:14px;border-top:3px solid var(--accent,#E0F808);">${s.icon} ${t}</div>`).join("")}</div>`;
    }
    case "Summits":{
      return `<div class="card">${PEAKS.slice(0,8).map(p=>`<div class="fixture-row"><div class="fixture-team left">${p[0]}</div><div></div><div class="fixture-score">${p[1]}m</div><div></div><div class="fixture-team">8,000m crown</div></div>`).join("")}</div>
      <div class="fy-row-head" style="margin-top:24px;"><div class="eyebrow" style="margin:0">All 14 eight-thousanders, logged by the community</div></div>
      <div class="grid grid-4" style="margin-top:14px;">${PEAKS.slice(8).map(p=>`<div class="card" style="padding:14px 16px;display:flex;justify-content:space-between;font-size:13px;"><b>${p[0]}</b><span class="mono-num" style="color:var(--lime);">${p[1]}m</span></div>`).join("")}</div>`;
    }
    case "Expeditions":{
      const E=[["Stok Kangri Winter Line","Ladakh · Dec 2026 · 14 members"],["Everest 2027 spring window","Nepal · Apr–May 2027 · applications open"],["Kedartal Community Trek","Uttarakhand · Oct 2026 · 22 members"],["Manaslu reconnaissance","Nepal · Mar 2027 · invite only"]];
      return `<div class="pill pill-muted" style="margin-bottom:16px;">Expedition log — follow along, don't follow up the mountain.</div>`+E.map(e=>`<div class="card" style="padding:22px 24px;margin-bottom:12px;display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap;"><b style="font-size:15px;">${e[0]}</b><span style="font-family:var(--mono);font-size:12px;color:var(--muted);">${e[1]}</span></div>`).join("");
    }
    case "Training":{
      const T=[["Build the base","Easy volume 80% of the week — conversational pace, always."],["One quality day","Intervals or hills — short, sharp, and never back-to-back with hard days."],["Strength twice a week","Calves, hips, core — runners who lift keep running."],["Sleep is training","The session happens in the run; the adaptation happens in bed."],["Log everything on PLAYR","Community-verified streaks beat motivation."]];
      return `<div class="grid grid-3">${T.map(t=>`<div class="card" style="padding:22px;"><h4 style="font-size:15px;font-weight:800;margin-bottom:8px;">${t[0]}</h4><p style="color:var(--muted);font-size:13px;line-height:1.6;">${t[1]}</p></div>`).join("")}</div>`;
    }
    case "Races":{
      return panelFor(s,"Events");
    }
    default: return panelFor(s,"Latest");
  }
}
function renderPanel(){
  const s=BY[current]; if(!s) return;
  const el=document.getElementById("suPanels"); if(!el) return;
  el.innerHTML=panelFor(s,currentTab);
}

/* ============================================================
   OLYMPIC HUB
   ============================================================ */
function mini(s){ return `<button class="mini-sport" style="--accent:${catOf(s).accent}" onclick="openSport('${s.id}')"><span class="ms-ic">${s.icon}</span><span class="ms-n">${s.name}</span>${badge(s)}</button>`; }
function badgeCompact(s){ return badge(s); }

window.renderOlympicHub=function(){
  const root=document.getElementById("olympicRoot"); if(!root) return;
  const E=window.OLYMPIC_EDITIONS;
  const summer=B.filter(s=>s.olySeason==="summer").sort((a,b)=>b.popularity-a.popularity);
  const winter=B.filter(s=>s.olySeason==="winter").sort((a,b)=>b.popularity-a.popularity);
  const la28new=E.LA28.newSports.map(id=>BY[id]).filter(Boolean);
  const past=B.filter(s=>s.olyBadge==="past");
  const hubCSS=(id,c)=>`<div class="oh-banner card" style="--accent:${c}"><div><div class="pill pill-lime" style="margin-bottom:12px;">${id.dates}</div><h3>${id.city.toUpperCase()}</h3><p style="color:var(--muted);font-size:14px;margin-top:8px;max-width:560px;line-height:1.6;">${id.tagline} ${id.sports} sports${id.events?` · ${id.events} events`:""}.</p></div></div>`;

  root.innerHTML=`
  <div class="oh-hero">
    <span class="oh-rings"><i style="background:#0081C8"></i><i style="background:#000"></i><i style="background:#EE334E"></i><i style="background:#00A651"></i><i style="background:#FCB131"></i></span>
    <div class="eyebrow" style="justify-content:center;">The PLAYR Olympic Hub</div>
    <h1 class="section-title">EVERY GAMES.<br>EVERY SPORT. ONE PLACE.</h1>
    <p class="section-sub">The full Olympic programme — sport, discipline and event — plus the road to LA28 and the stories in between. Badges are always tied to the relevant Games.</p>
    <div class="disc-counters">
      <div class="dcount"><b>${summer.length}</b><span>Summer-Programme Sports</span></div>
      <div class="dcount"><b>${winter.length}</b><span>Winter-Programme Sports</span></div>
      <div class="dcount"><b>${E.MC26.events}</b><span>MC2026 Events</span></div>
      <div class="dcount"><b>${E.LA28.sports}</b><span>LA28 Sports</span></div>
    </div>
  </div>

  <div class="oh-sec">
    <div class="cat-head"><div class="cat-ic">🇺🇸</div><div><h3 class="cat-name">ROAD TO LA28</h3><p class="cat-blurb">${E.LA28.tagline} ${E.LA28.dates} · ${E.LA28.sports} sports.</p></div><div class="cat-count mono-num">${E.LA28.sports}</div></div>
    ${hubCSS(E.LA28,"#46E0FF")}
    <div class="fy-row-head" style="margin-top:22px;"><div class="eyebrow" style="margin:0">The five additional sports — confirmed at the 141st IOC Session</div></div>
    <div class="grid grid-4" style="margin-top:14px;">${la28new.map(s=>window.PS_card(s)).join("")}</div>
    <ul class="oh-notes">${E.LA28.notes.map(n=>`<li>${n}</li>`).join("")}</ul>
  </div>

  <div class="oh-sec">
    <div class="cat-head"><div class="cat-ic">❄️</div><div><h3 class="cat-name">MILANO CORTINA 2026</h3><p class="cat-blurb">${E.MC26.tagline} ${E.MC26.dates}.</p></div><div class="cat-count mono-num">16</div></div>
    ${hubCSS(E.MC26,"#A9D9FF")}
    <div class="fy-list" style="margin-top:18px;">${winter.map(mini).join("")}</div>
    <ul class="oh-notes">${E.MC26.notes.map(n=>`<li>${n}</li>`).join("")}</ul>
  </div>

  <div class="oh-sec">
    <div class="cat-head"><div class="cat-ic">☀</div><div><h3 class="cat-name">SUMMER OLYMPIC SPORTS</h3><p class="cat-blurb">The current summer programme — Paris 2024 core continuing to LA28, plus the LA28 class. Tap any sport for its disciplines and events.</p></div><div class="cat-count mono-num">${summer.length}</div></div>
    <div class="fy-list">${summer.map(mini).join("")}</div>
    ${past.length?`<div class="fy-row-head" style="margin-top:26px;"><div class="eyebrow" style="margin:0">Recently on the programme</div></div><div class="fy-list">${past.map(mini).join("")}</div>`:""}
  </div>

  <div class="oh-sec">
    <div class="cat-head"><div class="cat-ic">❄</div><div><h3 class="cat-name">WINTER OLYMPIC SPORTS</h3><p class="cat-blurb">The full 16-sport Milano Cortina 2026 programme — with ski mountaineering making its debut.</p></div><div class="cat-count mono-num">${winter.length}</div></div>
    <div class="fy-list">${winter.map(mini).join("")}</div>
  </div>

  <div class="oh-sec">
    <div class="cat-head"><div class="cat-ic">📜</div><div><h3 class="cat-name">OLYMPIC HISTORY</h3><p class="cat-blurb">From Olympia to Brisbane — the moments that made the Games.</p></div></div>
    ${(window.OLYMPIC_TIMELINE||[]).map(h=>`<div class="timeline-card"><div class="tl-year">${h.y}</div><div class="tl-body"><h4>${h.t}</h4><p>${h.d}</p></div></div>`).join("")}
  </div>

  <div class="oh-sec">
    <div class="cat-head"><div class="cat-ic">🏆</div><div><h3 class="cat-name">OLYMPIC RECORDS</h3><p class="cat-blurb">Marks that have stood the test of time — world and Olympic records, labelled.</p></div></div>
    <div class="card oh-rec">
      <div class="oh-rec-row oh-rec-head"><span>Sport</span><span>Mark</span><span>Athlete</span><span>Where</span></div>
      ${(window.OLYMPIC_RECORDS||[]).map(r=>`<div class="oh-rec-row"><span>${r.sport}</span><b class="mono-num" style="color:var(--lime);">${r.mark}</b><span>${r.who}</span><span style="color:var(--muted);">${r.what} · ${r.where}</span></div>`).join("")}
    </div>
  </div>

  <div class="oh-sec">
    <div class="cat-head"><div class="cat-ic">⭐</div><div><h3 class="cat-name">OLYMPIC ATHLETES</h3><p class="cat-blurb">Follow tomorrow's Olympians on PLAYR today — plus the legends who wrote the record books.</p></div></div>
    <div class="legend-row">${(window.SPORT_LEGENDS.athletics||[]).concat(window.SPORT_LEGENDS.aquatics||[]).slice(0,6).map(l=>`<div class="legend-chip card">🏅 ${l}</div>`).join("")}</div>
    <div class="fy-row-head" style="margin-top:22px;"><div class="eyebrow" style="margin:0">Rising on PLAYR — demo community profiles</div></div>
    <div class="grid grid-4" style="margin-top:14px;">${window.PS_gen.athletes(BY.athletics||B[0],4).map(a=>`<div class="card" style="padding:20px;"><div style="font-weight:800;margin-bottom:4px;">${a.n}</div><div style="color:var(--muted);font-size:12.5px;">${a.role} · Athletics</div><button class="follow-btn" style="margin-top:12px;background:transparent;" onclick="showToast('Following ${a.n}')">+ Follow</button></div>`).join("")}</div>
  </div>

  <div class="oh-sec">
    <div class="cat-head"><div class="cat-ic">👥</div><div><h3 class="cat-name">OLYMPIC COMMUNITIES</h3><p class="cat-blurb">Where the Games never end — fan communities for every edition.</p></div></div>
    <div class="grid grid-3">${(window.OLYMPIC_HUB_COMMUNITIES||[]).map(c=>`<div class="card" style="padding:22px;"><div style="font-weight:800;margin-bottom:6px;">${c.n}</div><p style="color:var(--muted);font-size:13px;margin-bottom:12px;">${c.d}</p><div style="display:flex;justify-content:space-between;align-items:center;"><span class="mono-num" style="color:var(--lime);">${c.members}</span><button class="join-btn" onclick="toggleJoin(this,'${c.n}')">Join</button></div></div>`).join("")}</div>
  </div>

  <div class="oh-sec">
    <div class="cat-head"><div class="cat-ic">📅</div><div><h3 class="cat-name">OLYMPIC EVENTS</h3><p class="cat-blurb">Watch parties, runs and meetups around the Olympic calendar.</p></div></div>
    <div class="grid grid-3">${(window.OLYMPIC_HUB_EVENTS||[]).map(e=>`<div class="card" style="padding:22px;"><div class="pill pill-cyan" style="margin-bottom:12px;">${e.date}</div><div style="font-weight:800;margin-bottom:6px;">${e.n}</div><p style="color:var(--muted);font-size:13px;">${e.d}</p></div>`).join("")}</div>
  </div>`;
};
})();
