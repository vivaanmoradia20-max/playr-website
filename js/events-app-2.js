/* ============================================================
   PLAYR — EVENTS ENGINE · PART 2
   Event detail · Registration · Calendar · My Events ·
   Organizer pages · Home integration · Notifications
   ============================================================ */
(function(){
"use strict";
const E = window.PLAYR_EV;
const V = window.EV_VENUES, O = window.EV_ORGANIZERS;
let calMode="month", calDate=new Date(), calSelected=null, detailId=null, regModal=null;

/* ============ EVENT DETAIL PAGE ============ */
window.openEventDetail = function(id){
  const ev = E.byId(id); if(!ev) return;
  detailId=id;
  const root=document.getElementById("eventsRoot"); if(!root) return;
  const followed=E.isFollowing(id), registered=E.isRegistered(id);
  const tabs=["About","Schedule","Format & Categories","Venue","Registration","Teams & Players","Results","Highlights","Community"];
  const org=O[ev.org];
  const related=E.EVENTS.filter(x=>x.id!==id&&(x.sport===ev.sport||x.city===ev.city)).sort((a,b)=>(b.sport===ev.sport?2:0)+(b.city===ev.city?1:0)-((a.sport===ev.sport?2:0)+(a.city===ev.city?1:0))).slice(0,6);

  root.innerHTML=`
  <button class="btn btn-ghost btn-sm" onclick="PLAYR_EV.backToList()">← All Events</button>
  <div class="evd-hero" style="--accent:${ev.accent};background:linear-gradient(135deg, ${ev.accent}30, #0A0B0D 72%)">
    <span class="evd-watermark">${ev.sportIcon}</span>
    <div class="evd-in">
      <div class="evd-badges">${E.levelBadge(ev.level)}${E.verifyBadge(ev)}${E.statusPill(ev)}</div>
      <h1 class="evd-title">${ev.name}</h1>
      <div class="evd-meta">
        <div><label>Date</label><b>${E.fmtDate(ev.start)}</b>${ev.end&&!E.sameDay(ev.start,ev.end)?`<span>– ${E.fmtDate(ev.end)}</span>`:""}</div>
        <div><label>Time</label><b>${E.fmtTime(ev.start)}${ev.status!=="COMPLETED"?" – "+E.fmtTime(ev.end):""}</b></div>
        <div><label>Venue</label><b>${ev.venueName}</b><span>${ev.area}, ${ev.city}</span></div>
        <div><label>Organizer</label><b class="evd-org-link" onclick="openOrganizer('${ev.org}')">${org.n} ${org.v==="verified"?"<em>✓ verified</em>":""}</b><span>${org.type}</span></div>
      </div>
      <div class="evd-actions">
        ${ev.status!=="COMPLETED"?(ev.regStatus==="open"?(ev.isReal
          ?`<a class="btn btn-primary" href="${ev.regUrl||"#"}" target="_blank" rel="noopener">Register on organizer site ↗</a><button class="btn btn-ghost" onclick="PLAYR_EV.toggleFollow('${ev.id}')">${followed?"★ Following":"☆ Follow Event"}</button>`
          :`<button class="btn btn-primary" onclick="openEventRegistration('${ev.id}')">${registered?"✓ Registered":"Register"}</button><button class="btn btn-ghost" onclick="PLAYR_EV.toggleFollow('${ev.id}')">${followed?"★ Following":"☆ Follow Event"}</button>`)
        :(ev.regStatus==="closed"||ev.regStatus==="soldout"
          ?`<button class="btn btn-ghost" disabled>${ev.regStatus==="soldout"?"SOLD OUT":"REGISTRATION CLOSED"}</button><button class="btn btn-ghost" onclick="PLAYR_EV.toggleFollow('${ev.id}')">${followed?"★ Following":"☆ Follow Event"}</button>`
          :`<button class="btn btn-ghost" onclick="PLAYR_EV.toggleFollow('${ev.id}')">${followed?"★ Following":"☆ Follow Event"}</button>`))
        :`<button class="btn btn-ghost" onclick="PLAYR_EV.toggleFollow('${ev.id}')">${followed?"★ Following":"☆ Follow Event"}</button>`}
        <button class="btn btn-ghost" onclick="PLAYR_EV.share('${ev.id}')">Share</button>
        ${ev.venueReal?`<a class="btn btn-ghost" href="${E.mapsUrl(ev)}" target="_blank" rel="noopener">📍 Directions</a>`:""}
      </div>
      ${ev.isDemo?`<div class="evd-demo-note">DEMO EVENT — a prototype sample, not a real listing. Real events on PLAYR carry a source and last-updated date.</div>`:""}
      ${ev.src?`<div class="evd-src">Source: ${ev.src}${ev.updated?" · Last updated: "+ev.updated:""}</div>`:""}
      ${ev.note?`<div class="evd-note">${ev.note}</div>`:""}
    </div>
  </div>
  <div class="su-tabs evd-tabs" id="evdTabs">${tabs.map((t,i)=>`<div class="su-tab ${i===0?"active":""}" data-t="${t}" onclick="PLAYR_EV.setEvdTab('${t}')">${t}${t==="Results"&&ev.status!=="COMPLETED"?" (after event)":""}</div>`).join("")}</div>
  <div id="evdPanel"></div>
  <div class="maylike">
    <div class="fy-row-head"><div class="eyebrow" style="margin:0">You may also like</div></div>
    <div class="fy-list">${related.map(e=>E.miniCard(e)).join("")||"<span class='fy-empty'>More events coming soon.</span>"}</div>
  </div>`;
  window.PLAYR_EV.setEvdTab("About");
  window.scrollTo({top:0});
};
function relatedScore(x,ev){ return (x.sport===ev.sport?2:0)+(x.city===ev.city?1:0); }
window.PLAYR_EV.setEvdTab = function(tab){
  document.querySelectorAll("#evdTabs .su-tab").forEach(t=>t.classList.toggle("active",t.dataset.t===tab));
  const ev=E.byId(detailId); if(!ev) return;
  const el=document.getElementById("evdPanel"); if(!el) return;
  const org=O[ev.org];
  el.innerHTML=panelFor(ev,tab,org);
};
function schedHTML(ev){
  if(ev.sched) return `<div class="sched-timeline">${ev.sched.map(s=>`<div class="sched-row"><span class="sched-t mono-num">${s[0]}</span><span class="sched-e">${s[1]}</span></div>`).join("")}</div>`;
  if(ev.results) return `<div class="empty-state card" style="padding:26px;"><p>Schedule window has passed — results are in the Results tab.</p></div>`;
  return `<div class="empty-state card" style="padding:26px;"><h4>Detailed schedule from the organizer</h4><p>PLAYR doesn't publish timings it can't verify. ${ev.regUrl?`Check the <a href="${ev.regUrl}" target="_blank" rel="noopener" style="color:var(--lime);">organizer listing</a>`:"Check the organizer's channels"} for the official run of play.</p></div>`;
}
function panelFor(ev,tab,org){
  const registered=E.isRegistered(ev.id);
  switch(tab){
    case "About":
      return `<div class="evd-grid">
        <div class="card evd-about"><div class="eyebrow">About this event</div><p style="color:var(--muted);font-size:14.5px;line-height:1.75;">${ev.desc}</p>
          <div class="evd-facts">
            ${[["Sport",ev.sportName],["Level",ev.level],["Entry",E.priceLabel(ev)],["Format",ev.team?"Team":"Individual"],["Age",ev.age||"All ages"],["Gender",ev.gender||"Open"],["Prize",ev.prize||"—"],["City",ev.city]]
              .map(f=>`<div class="evd-fact"><label>${f[0]}</label><b>${f[1]}</b></div>`).join("")}
          </div>
          ${ev.note?`<div class="evd-note">${ev.note}</div>`:""}
        </div>
        <div>
          <div class="card evd-orgcard" onclick="openOrganizer('${ev.org}')" style="cursor:pointer;">
            <div class="eyebrow">Organized by</div>
            <div class="org-row"><span class="org-ic">${org.type==="Federation"?"🏛":org.type==="League"?"🏆":org.type==="College"?"🎓":org.type==="Academy"?"🎯":org.type==="Event Company"?"🎪":"🤝"}</span>
              <div><b>${org.n}</b> ${org.v==="verified"?"<em class='vcheck'>✓</em>":""}<div class="mono-num" style="color:var(--muted);font-size:11.5px;">${org.type} · ${org.fol} followers</div></div></div>
            <p style="color:var(--muted);font-size:13px;line-height:1.6;">${org.d}</p>
            <span class="btn btn-ghost btn-sm">View organizer →</span>
          </div>
          <div class="card" style="padding:20px 22px;margin-top:14px;">
            <div class="eyebrow">Event community</div>
            <div style="display:flex;align-items:center;gap:12px;"><b class="mono-num" style="font-size:22px;color:var(--lime);">${ev.fol}</b><span style="color:var(--muted);font-size:13px;">followers</span>
            <button class="btn btn-ghost btn-sm" style="margin-left:auto;" onclick="PLAYR_EV.setEvdTab('Community')">Open →</button></div>
          </div>
        </div></div>`;
    case "Schedule": return schedHTML(ev);
    case "Format & Categories":
      return `<div class="grid grid-3">${(ev.cats||["Open"]).map(c=>`<div class="card" style="padding:22px;border-top:3px solid var(--accent);"><b style="font-size:15px;">${Array.isArray(c)?c[0]:c}</b><p style="color:var(--muted);font-size:12.5px;margin-top:6px;">${ev.type==="race"?"Timed category":ev.type==="tournament"?"Knockout / pool draw":"Event category"}</p></div>`).join("")}</div>
        <div class="card" style="padding:20px 22px;margin-top:16px;"><div class="eyebrow">Format</div>
        <p style="color:var(--muted);font-size:13.5px;line-height:1.7;">${ev.team?"Team entry — gather your squad before registration closes.":"Individual entry — your category is confirmed at check-in."} ${ev.status==="COMPLETED"?"This event has concluded.":ev.regStatus==="open"?"Registration is open.":"Registration is not currently open."}</p></div>`;
    case "Venue":
      return `<div class="evd-venue card">
        <div class="evd-map" style="--accent:${ev.accent}"><span class="evd-pin">📍</span><span class="evd-map-city">${ev.city.toUpperCase()}</span></div>
        <div class="evd-venue-body">
          <b>${ev.venueName}</b>
          <p style="color:var(--muted);font-size:13.5px;">${ev.area} · ${ev.zone} · ${ev.city}${ev.state?", "+ev.state:""}, India</p>
          ${ev.venueReal?`<a class="btn btn-ghost btn-sm" style="margin-top:12px;" href="${E.mapsUrl(ev)}" target="_blank" rel="noopener">Open in Maps / Get Directions ↗</a>`:
          `<p style="color:var(--muted-2);font-size:12px;margin-top:10px;">Venue to be confirmed by the organizer — PLAYR doesn't publish unverified addresses.</p>`}
          ${ev.dist!=null&&ev.dist<200?`<div class="mono-num" style="color:var(--lime);margin-top:12px;font-size:13px;">≈ ${E.distLabel(ev).trim()} from you</div>`:""}
        </div></div>`;
    case "Registration":
      if(registered) return `<div class="empty-state card" style="border-left:3px solid var(--lime);"><h4>✓ You're registered</h4><p>Find this event any time under <b>My Events → Registered</b>. ${ev.isDemo?"Demo registration — no payment or personal data involved.":""}</p></div>`;
      if(ev.status==="COMPLETED") return `<div class="empty-state card"><h4>Registration closed</h4><p>This event has concluded — see Results for outcomes.</p></div>`;
      if(ev.isReal) return `<div class="card" style="padding:26px;"><div class="eyebrow">Registration</div>
        <p style="color:var(--muted);font-size:14px;line-height:1.7;margin:8px 0 16px;">This is a real, third-party event — PLAYR doesn't process its registrations. Register on the organizer's official page:</p>
        <a class="btn btn-primary" href="${ev.regUrl||"#"}" target="_blank" rel="noopener">Register on organizer site ↗</a>
        <button class="btn btn-ghost" style="margin-left:8px;" onclick="PLAYR_EV.toggleFollow('${ev.id}')">☆ Follow for updates instead</button>
        ${ev.regDeadline?`<p class="mono-num" style="color:var(--muted-2);font-size:11.5px;margin-top:14px;">REGISTRATION DEADLINE: ${E.fmtDate(ev.regDeadline)}</p>`:""}</div>`;
      if(ev.regStatus!=="open") return `<div class="empty-state card"><h4>${ev.regStatus==="soldout"?"Sold out":"Registration closed"}</h4><p>Follow the event to hear about the next edition.</p></div>`;
      return `<div class="card" style="padding:26px;"><div class="eyebrow">Registration</div>
        <p style="color:var(--muted);font-size:14px;margin:8px 0 16px;">Entry: <b style="color:var(--text)">${E.priceLabel(ev)}</b>${ev.regDeadline?` · closes ${E.fmtDate(ev.regDeadline)}`:""}</p>
        <button class="btn btn-primary" onclick="openEventRegistration('${ev.id}')">Start registration →</button></div>`;
    case "Teams & Players":
      if(ev.team) return `<div class="evd-grid"><div class="card" style="padding:22px;"><div class="eyebrow">Registered teams (demo view)</div>
        ${["Mumbai XI","Dadar Daredevils","Bandra Blasters","Thane Titans","Powai Prowlers","Navi Ninjas","Versova Vikings","Sion Strikers"].slice(0,Math.max(4,6+(ev.idx%3))).map((t,i)=>`<div class="sched-row"><span class="sched-t mono-num">#${String(i+1).padStart(2,"0")}</span><span class="sched-e">${t}</span></div>`).join("")}
        </div><div class="card" style="padding:22px;"><div class="eyebrow">Team roster rules</div>
        <p style="color:var(--muted);font-size:13.5px;line-height:1.7;">${ev.desc}</p></div></div>`;
      return `<div class="card" style="padding:22px;"><div class="eyebrow">Registered athletes (demo view)</div>
        ${["Rhea K.","Karan M.","Ananya I.","Farhan A.","Simran G.","Neel S.","Zoya D.","Vihaan P."].slice(0,6+(ev.idx%3)).map((t,i)=>`<div class="sched-row"><span class="sched-t mono-num">#${String(i+1).padStart(2,"0")}</span><span class="sched-e">${t}</span></div>`).join("")}
        <p style="color:var(--muted-2);font-size:11.5px;margin-top:12px;" class="mono-num">DEMO ROSTER — GROWS AS PLAYRS REGISTER</p></div>`;
    case "Results":
      if(!ev.results) return `<div class="empty-state card"><h4>${ev.status==="COMPLETED"?"Results coming from the organizer":"Results land here after the event"}</h4><p>${ev.status==="COMPLETED"?"Verified results, winners and highlights are posted as soon as they're confirmed.":"Follow the event to get notified the moment results drop."}</p></div>`;
      return `<div class="card" style="padding:26px;"><div class="eyebrow">Winners</div>
        ${ev.results.w.map(r=>`<div class="sched-row"><span class="sched-t">${r[0]}</span><span class="sched-e"><b>${r[1]}</b></span></div>`).join("")}
        <div class="eyebrow" style="margin-top:20px;">Highlights</div>
        <p style="color:var(--muted);font-size:13.5px;">${ev.results.h}</p>
        ${ev.results.photos?`<div class="photo-strip">${Array.from({length:6}).map((_,i)=>`<div class="photo-cell" style="--accent:${ev.accent}"><span>📷</span></div>`).join("")}</div>
        <p class="mono-num" style="color:var(--muted-2);font-size:11px;margin-top:8px;">${ev.results.photos} COMMUNITY PHOTOS</p>`:""}</div>
        <div style="margin-top:14px;"><button class="btn btn-ghost btn-sm" onclick="PLAYR_EV.setEvdTab('Community')">Community discussion →</button></div>`;
    case "Highlights":
      return `<div class="grid grid-3">
        ${["Finish-line moments","Crowd & community","Podium"].map((h,i)=>`<div class="card" style="overflow:hidden;"><div style="height:150px;background:linear-gradient(135deg,${ev.accent}33,#0A0B0D);display:flex;align-items:center;justify-content:center;font-size:40px;">${ev.status==="COMPLETED"?"📸":"🕒"}</div><div style="padding:14px 16px;"><b style="font-size:13.5px;">${h}</b><p style="color:var(--muted-2);font-size:11.5px;margin-top:4px;">${ev.status==="COMPLETED"?"Gallery live — "+(ev.results?ev.results.photos:40+i*30)+" photos":"Drops after the event"}</p></div></div>`).join("")}</div>`;
    case "Community":
      return `<div class="evd-grid"><div>
        ${[["Rhea K.","2h","Is the 21K wave starting from the same gate as last year?"],["Karan M.","5h","Anyone want to carpool from Powai? 3 seats 🚗"],["Mumbai Runners","1d","Training thread pinned — 6 weeks to go, last long run this Sunday 🏃"],["Ananya I.","2d","First timer here — any pacing advice for the 10K?"]].map(p=>`
        <div class="card" style="padding:18px 20px;margin-bottom:12px;"><div style="display:flex;gap:10px;align-items:center;margin-bottom:8px;"><div class="evd-com-av" style="--accent:${ev.accent}">${p[0][0]}</div><b style="font-size:13.5px;">${p[0]}</b><span class="mono-num" style="color:var(--muted-2);font-size:11px;margin-left:auto;">${p[1]}</span></div>
        <p style="color:var(--muted);font-size:13.5px;">${p[2]}</p></div>`).join("")}
        <button class="btn btn-ghost btn-sm" onclick="requireAuth(()=>showToast('Post to the event community — coming soon'))">+ Post to community</button>
        </div><div class="card" style="padding:22px;height:fit-content;">
        <div class="eyebrow">Community</div>
        <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:10px;"><b class="mono-num" style="font-size:26px;color:var(--lime);">${ev.fol}</b><span style="color:var(--muted);font-size:12.5px;">followers</span></div>
        <p style="color:var(--muted);font-size:12.5px;line-height:1.6;margin-bottom:14px;">Race discussion, training tips, photos and results — the event's home between editions.</p>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <button class="btn btn-ghost btn-sm" onclick="PLAYR_EV.toggleFollow('${ev.id}')">${E.isFollowing(ev.id)?"★ Following":"☆ Follow event"}</button>
          ${ev.sport==="trekking"||ev.sport==="mountaineering"||["boxing","judo","mma","taekwondo","wrestling"].includes(ev.sport)?"" :`<button class="btn btn-ghost btn-sm" onclick="requireAuth(()=>showToast('Challenge sent to your friends 🏆'))">Challenge friends</button>`}
          <button class="btn btn-ghost btn-sm" onclick="PLAYR_EV.share('${ev.id}')">Share</button>
        </div></div></div>`;
  }
  return "";
}
window.PLAYR_EV.backToList = function(){ detailId=null; E.renderEventsPage(); };

/* ============ REGISTRATION MODAL ============ */
window.openEventRegistration = function(id){
  const ev=E.byId(id); if(!ev) return;
  const div=document.createElement("div"); div.id="evRegModal"; div.className="ob-overlay";
  const cats=(ev.cats||["Open"]).map(c=>Array.isArray(c)?c[0]:c);
  div.innerHTML=`<div class="ob-modal card">
    <div class="ob-head"><div><div class="eyebrow">Registration</div><h3>${ev.name.replace(" (Demo)","").toUpperCase()}</h3>
    <p>${E.fmtDate(ev.start)} · ${ev.venueName}, ${ev.city} · ${E.priceLabel(ev)}</p></div>
    <button class="ob-close" onclick="PLAYR_EV.closeReg()">✕</button></div>
    <div class="ev-reg-form">
      <label>Participant name<input id="regName" placeholder="Your name (optional in demo)"></label>
      <label>Category<select id="regCat">${cats.map(c=>`<option>${c}</option>`).join("")}</select></label>
      ${/U-|School|school|Junior|junior|12\+|14\+|10\+|All ages/.test(ev.age||"")&&cats.length>1?`<label>Age group<select id="regAge">${(ev.age||"").split(/,|\/| and /).map(a=>a.trim()).filter(Boolean).map(a=>`<option>${a}</option>`).join("")||"<option>Open</option>"}</select></label>`:""}
      ${ev.team?`<label>Team name<input id="regTeam" placeholder="Your team's name"></label>`:""}
      <label>Contact (optional)<input id="regPhone" placeholder="Phone or email — not stored in this demo"></label>
      ${ev.price?`<div class="reg-price-row"><span>Entry fee</span><b>${E.priceLabel(ev)}</b></div>`:`<div class="reg-price-row"><span>Entry fee</span><b style="color:var(--lime);">FREE</b></div>`}
      <p class="reg-fine">Demo registration — PLAYR collects only what's shown, stores nothing sensitive, and processes no payments.</p>
    </div>
    <div class="ob-foot"><span></span><div>
      <button class="btn btn-ghost btn-sm" onclick="PLAYR_EV.closeReg()">Cancel</button>
      <button class="btn btn-primary btn-sm" onclick="PLAYR_EV.confirmReg('${ev.id}')">Confirm Registration</button>
    </div></div></div>`;
  document.body.appendChild(div);
};
window.PLAYR_EV.closeReg = function(){ const m=document.getElementById("evRegModal"); if(m) m.remove(); };
window.PLAYR_EV.confirmReg = function(id){
  const ev=E.byId(id); if(!ev) return;
  const cat=(document.getElementById("regCat")||{}).value||"Open";
  const name=(document.getElementById("regName")||{}).value||"You";
  const team=(document.getElementById("regTeam")||{}).value||null;
  const regs=JSON.parse(localStorage.getItem("playr_ev_regs_v1")||"[]");
  if(!regs.some(r=>r.id===id)) regs.push({id,cat,name,team,when:new Date().toISOString()});
  localStorage.setItem("playr_ev_regs_v1",JSON.stringify(regs));
  E.syncState(); E.reResolve();
  window.PLAYR_EV.closeReg();
  showToast?.("Registered ✓ Added to My Events");
  const modal=document.getElementById("evRegModal");
  if(!E.isFollowing(id)){ const fol=JSON.parse(localStorage.getItem("playr_ev_follows_v1")||"[]"); fol.push(id); localStorage.setItem("playr_ev_follows_v1",JSON.stringify(fol)); E.syncState(); E.reResolve(); }
  if(detailId===id) openEventDetail(id); else E.renderEventsPage();
  renderHomeNearYou();
  pushEventNotif({t:ev.name,s:"You're registered — see you at "+E.fmtTime(ev.start)+".",ago:"now"});
};

/* ============ MY EVENTS ============ */
let myTab="following";
window.PLAYR_EV.setMyTab=function(t){ myTab=t; const el=document.getElementById("myEventsBody"); if(el) el.innerHTML=myEventsHTML(); };
function myEventsHTML(){
  const fol=E.follows().map(E.byId).filter(Boolean);
  const reg=E.regs().map(r=>E.byId(r.id)).filter(Boolean);
  const now=new Date();
  const up=[...fol,...reg].filter((v,i,a)=>a.indexOf(v)===i&&v.start>now).sort((a,b)=>a.start-b.start);
  const past=[...fol,...reg].filter((v,i,a)=>a.indexOf(v)===i&&v.start<=now).sort((a,b)=>b.start-a.start);
  const tabs=[["following","Following",fol.length],["registered","Registered",reg.length],["upcoming","Upcoming",up.length],["past","Past",past.length]];
  const list={following:fol,registered:reg,upcoming:up,past:past}[myTab]||[];
  return `<div class="su-tabs" style="margin-bottom:20px;">${tabs.map(t=>`<div class="su-tab ${myTab===t[0]?"active":""}" onclick="PLAYR_EV.setMyTab('${t[0]}')">${t[1]} <em>${t[2]}</em></div>`).join("")}</div>`+
    (list.length?`<div class="grid grid-3">${list.map(e=>E.card(e)).join("")}</div>`:`<div class="empty-state card"><h4>Nothing here yet</h4><p>Tap ☆ on any event to follow it, or register for a demo event — it'll show up here.</p></div>`);
}

/* ============ ORGANIZER PAGE ============ */
window.openOrganizer = function(orgId){
  const org=O[orgId]; if(!org) return;
  const evs=E.EVENTS.filter(e=>e.org===orgId);
  const now=new Date();
  const up=evs.filter(e=>e.start>now).sort((a,b)=>a.start-b.start);
  const past=evs.filter(e=>e.start<=now).sort((a,b)=>b.start-a.start);
  const div=document.createElement("div"); div.id="orgModal"; div.className="ob-overlay";
  div.innerHTML=`<div class="ob-modal card org-modal">
    <div class="ob-head"><div style="display:flex;gap:16px;align-items:center;">
      <div class="org-big-ic">${org.type==="Federation"?"🏛":org.type==="League"?"🏆":org.type==="College"?"🎓":org.type==="Academy"?"🎯":org.type==="Event Company"?"🎪":"🤝"}</div>
      <div><h3 style="font-family:var(--display);font-size:28px;letter-spacing:.02em;">${org.n.toUpperCase()} ${org.v==="verified"?"<em class='vcheck'>✓ VERIFIED</em>":org.demo?"<em class='vdemo'>DEMO ORGANIZER</em>":""}</h3>
      <div class="mono-num" style="color:var(--muted);font-size:11.5px;margin-top:6px;">${org.type.toUpperCase()} · ${org.fol.toUpperCase()} FOLLOWERS · ${(org.sports||[]).join(" · ").toUpperCase()}</div></div></div>
      <button class="ob-close" onclick="PLAYR_EV.closeOrg()">✕</button></div>
    <p style="color:var(--muted);font-size:14px;line-height:1.7;margin:14px 0 20px;">${org.d}</p>
    <div style="display:flex;gap:10px;margin-bottom:22px;">
      <button class="btn btn-primary btn-sm" onclick="showToast('Following ${org.n} — you'll see their next events first')">+ Follow organizer</button>
      <button class="btn btn-ghost btn-sm" onclick="PLAYR_EV.shareOrg('${orgId}')">Share</button>
    </div>
    ${up.length?`<div class="eyebrow">Upcoming events (${up.length})</div><div class="grid grid-2">${up.map(e=>E.card(e)).join("")}</div>`:""}
    ${past.length?`<div class="eyebrow" style="margin-top:20px;">Past events (${past.length})</div><div class="fy-list-ev">${past.map(e=>E.miniCard(e)).join("")}</div>`:""}
  </div>`;
  document.body.appendChild(div);
};
window.PLAYR_EV.closeOrg=function(){ const m=document.getElementById("orgModal"); if(m) m.remove(); };
window.PLAYR_EV.shareOrg=function(id){ const org=O[id]; if(navigator.clipboard) navigator.clipboard.writeText(org.n+" on PLAYR").then(()=>showToast?.("Organizer link copied")); else showToast?.("Share: "+org.n); };

/* ============ CALENDAR ============ */
window.PLAYR_EV.setCalMode=function(m){ calMode=m; renderCalendar(); };
window.PLAYR_EV.calNav=function(d){ calDate=new Date(calDate.getFullYear(),calDate.getMonth()+d,1); renderCalendar(); };
window.PLAYR_EV.pickDay=function(iso){ calSelected=new Date(iso); renderCalendar(); };
function renderCalendar(){
  const root=document.getElementById("calendarSec"); if(!root) return;
  const y=calDate.getFullYear(), m=calDate.getMonth();
  const first=new Date(y,m,1), last=new Date(y,m+1,0);
  const startPad=first.getDay();
  const daysIn=last.getDate();
  const now=new Date();
  const eventsOn=d=>E.EVENTS.filter(e=>E.sameDay(e.start,d));
  let head=`<div class="cat-head"><div class="cat-ic">🗓️</div><div><h3 class="cat-name">SPORTS CALENDAR</h3><p class="cat-blurb">Click any date to see everything happening that day.</p></div></div>
  <div class="cal-bar"><button class="btn btn-ghost btn-sm" onclick="PLAYR_EV.calNav(-1)">←</button><b class="cal-month">${["January","February","March","April","May","June","July","August","September","October","November","December"][m]} ${y}</b><button class="btn btn-ghost btn-sm" onclick="PLAYR_EV.calNav(1)">→</button>
  <div class="cal-modes">${["month","week","list"].map(x=>`<button class="attr-pill ${calMode===x?"on":""}" onclick="PLAYR_EV.setCalMode('${x}')">${x.toUpperCase()}</button>`).join("")}</div></div>`;
  let body="";
  if(calMode==="month"){
    let cells="";
    for(let i=0;i<startPad;i++) cells+="<div class='cal-cell empty'></div>";
    for(let d=1;d<=daysIn;d++){
      const dd=new Date(y,m,d); const evs=eventsOn(dd);
      const isToday=E.sameDay(dd,now); const sel=calSelected&&E.sameDay(dd,calSelected);
      cells+=`<button class="cal-cell ${isToday?"today":""} ${sel?"sel":""} ${evs.length?"has":""}" onclick="PLAYR_EV.pickDay('${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}')">
        <span class="cal-d">${d}</span>${evs.slice(0,3).map(e=>`<i class="cal-dot" style="--accent:${e.accent}" title="${e.name}"></i>`).join("")}${evs.length>3?`<em class="cal-more">+${evs.length-3}</em>`:""}</button>`;
    }
    body=`<div class="cal-grid">${cells}</div>`+(calSelected?dayPanel(calSelected):"");
  } else if(calMode==="week"){
    const ws=new Date(now); ws.setDate(now.getDate()-now.getDay());
    let cols="";
    for(let i=0;i<7;i++){
      const d=new Date(ws); d.setDate(ws.getDate()+i);
      const evs=eventsOn(d);
      cols+=`<div class="cal-wk-col ${E.sameDay(d,now)?"today":""}"><div class="cal-wk-head">${["SUN","MON","TUE","WED","THU","FRI","SAT"][i]} ${d.getDate()}</div>
        ${evs.length?evs.map(e=>`<button class="cal-wk-ev" style="--accent:${e.accent}" onclick="openEventDetail('${e.id}')"><i>${E.fmtTime(e.start)}</i><b>${e.name.replace(" (Demo)","")}</b><span>${e.sportName} · ${e.area}</span></button>`).join(""):"<span class='cal-wk-none'>—</span>"}</div>`;
    }
    body=`<div class="cal-week">${cols}</div>`;
  } else {
    const up=E.EVENTS.filter(e=>e.start>=new Date(now.getTime()-864e5)).sort((a,b)=>a.start-b.start);
    let cur=null, acc="";
    up.forEach(e=>{
      const key=E.fmtDate(e.start);
      if(key!==cur){ if(cur) acc+="</div>"; acc+=`<div class="cal-list-day"><div class="cal-list-date">${E.dayChip(e.start).toUpperCase()}<span>${key}</span></div><div class="cal-list-evs">`; cur=key; }
      acc+=`<button class="cal-wk-ev" style="--accent:${e.accent}" onclick="openEventDetail('${e.id}')"><i>${E.fmtTime(e.start)}</i><b>${e.name.replace(" (Demo)","")}</b><span>${e.sportName} · ${e.area}, ${e.city}</span></button>`;
    });
    acc+="</div></div>";
    body=`<div class="cal-list">${acc}</div>`;
  }
  root.innerHTML=head+body;
}
function dayPanel(d){
  const evs=E.EVENTS.filter(e=>E.sameDay(e.start,d));
  return `<div class="cal-day-panel card"><div class="eyebrow">${["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()]}, ${E.fmtDate(d)}</div>
    ${evs.length?evs.map(e=>`<button class="cal-wk-ev big" style="--accent:${e.accent}" onclick="openEventDetail('${e.id}')"><i>${E.fmtTime(e.start)}</i><b>${e.name}</b><span>${e.sportName} · ${e.venueName}, ${e.city}</span><span class="cal-ev-open">→</span></button>`).join(""):"<p style='color:var(--muted);font-size:13.5px;padding:8px 0;'>No events on this date — pick another day.</p>"}</div>`;
}

/* ============ HOME INTEGRATION ============ */
window.renderHomeNearYou = function(){
  const root=document.getElementById("homeNearYou"); if(!root) return;
  const now=new Date();
  const picks=E.EVENTS.filter(e=>e.status!=="COMPLETED").sort((a,b)=>a.start-b.start)
    .filter(e=>e.dist==null||e.dist<50).slice(0,6);
  root.innerHTML=`<div class="wrap">
    <div class="section-head"><div><div class="eyebrow">Happening near you · ${E.USER.label}</div><h2 class="section-title" style="font-size:clamp(34px,4.6vw,56px);">WHAT'S ON<br>THIS WEEK.</h2></div>
    <button class="btn btn-primary" onclick="switchView('events')">Explore All Events</button></div>
    <div class="grid grid-3">${picks.map(e=>E.card(e)).join("")}</div>
  </div>`;
};

/* ============ NOTIFICATIONS ============ */
const EV_NOTIFS=[
  {t:"Mumbai Half Marathon (Demo)",s:"Your followed event has an update.",ago:"12m"},
  {t:"PLAYR Events",s:"3 new sports events near you this week.",ago:"1h"},
  {t:"Registration closing",s:"BKC Padel Saturday Open closes tomorrow.",ago:"3h"}
];
function pushEventNotif(n){
  const dd=document.getElementById("dd-notif"); if(!dd) return;
  const div=document.createElement("div"); div.className="dropdown-item";
  div.innerHTML=`<div class="dd-avatar" style="background:linear-gradient(135deg,var(--lime),var(--cyan));"></div><div><div class="dd-title">${n.t}</div><div class="dd-sub">${n.s} · ${n.ago}</div></div>`;
  dd.prepend(div);
}
window.PLAYR_EV.pushEventNotif=pushEventNotif;

/* ============ INIT ============ */
window.PLAYR_EV._myEventsHTML=myEventsHTML;
window.PLAYR_EV._renderCalendar=renderCalendar;
window.renderCalendar=renderCalendar;
window.initEventsSystem=function(){
  renderHomeNearYou();
  EV_NOTIFS.forEach(n=>pushEventNotif(n));
  E.renderEventsPage();
};
})();
