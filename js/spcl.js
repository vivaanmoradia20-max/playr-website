/* ============================================================
   PLAYR — SPCL EXPERIENCE
   Sport Without Limits. PLAYR's Para-sport ecosystem:
   landing page, Para-sport universes, athletes, feed,
   competitions, history, classification, India, communities,
   challenges, home + shop integration, events hookup.
   ============================================================ */
(function(){
"use strict";
const ACC="#4DA6FF";
const CAT=window.SPORT_CATEGORIES.find(c=>c.id==="spcl");
const BY={}; window.PLAYR_SPORTS.forEach(s=>{ if(s.category==="spcl") BY[s.id]=s; });
const spclBy=id=>!!BY[id];
const fmt=n=>n>=1e6?(n/1e6).toFixed(1).replace(/\.0$/,"")+"M":n>=1e3?Math.round(n/1e3)+"K":""+n;

/* ---------- route spcl sports to SPCL universes ---------- */
const _origOpenSport = window.openSport;
window.openSport = function(id){ if(spclBy(id)){ switchView("spcl"); openSpclSport(id); return; } return _origOpenSport.apply(null,arguments); };

/* ============================================================
   SPCL MAIN VIEW
   ============================================================ */
let spclRendered=false;
window.renderSpcl=function(){
  const root=document.getElementById("spclRoot"); if(!root) return;
  const spclSports=window.PLAYR_SPORTS.filter(s=>s.category==="spcl");
  const summer=spclSports.filter(s=>s.subcategory==="Summer Para Sport");
  const winter=spclSports.filter(s=>s.subcategory==="Winter Para Sport");
  const followed=window.PS_follows?PS_follows().filter(spclBy):[];

  root.innerHTML=`
  <!-- HERO -->
  <div class="spcl-hero">
    <div class="spcl-hero-bg"></div>
    <div class="wrap spcl-hero-in">
      <div class="spcl-brandchip">🔷 SPCL PLAYERS · A PLAYR COMMUNITY</div>
      <h1>SPORT WITHOUT<br>LIMITS.</h1>
      <p>Meet the athletes, discover the sports, follow the competition and connect with a community built around Para sport.</p>
      <div class="spcl-hero-btns">
        <button class="btn btn-primary" onclick="SPCL.scrollTo('spcl-sports')">Explore SPCL PLAYERS</button>
        <button class="btn btn-ghost" onclick="SPCL.scrollTo('spcl-athletes')">Meet the Athletes</button>
      </div>
      <div class="spcl-hero-stats mono-num">
        <span><b>29</b> SANCTIONED PARA SPORTS</span><i></i>
        <span><b>23+6</b> SUMMER + WINTER</span><i></i>
        <span><b>4</b> VERIFIED INDIAN GREATS</span>
      </div>
    </div>
  </div>

  <!-- WHAT SPCL IS -->
  <div class="wrap spcl-what rv">
    <div class="spcl-what-left">
      <div class="eyebrow">SPCL PLAYERS — Sports for Every Capability. Limitless Potential.</div>
      <h2 class="section-title">SKILL. COMPETITION.<br>COMMUNITY.</h2>
      <p>SPCL PLAYERS is PLAYR's dedicated space celebrating para-athletes and para-sports, giving players, communities and supporters greater visibility, connection and participation.</p>
      <div class="spcl-pillars">
        ${[["SKILL","Technique honed over thousands of hours."],["COMPETITION","Every class, every final, every hundredth."],["DISCIPLINE","Training logs nobody claps for."],["ACHIEVEMENT","Records, medals, firsts — documented."],["COMMUNITY","Teams, guides, coaches, fans."],["ACCESS","Sport that opens doors, never closes them."]].map(p=>`<div class="spcl-pillar"><b>${p[0]}</b><span>${p[1]}</span></div>`).join("")}
      </div>
      <p class="spcl-disclaimer">SPCL PLAYERS is PLAYR's own Para-sport community brand. It is not the IPC, the Paralympic movement or any official organisation — official information is credited to its sources.</p>
    </div>
  </div>

  <!-- SUB NAV -->
  <div class="spcl-subnav" id="spclSubnav">
    ${[["Overview","spcl-what"],["Sports","spcl-sports"],["Athletes","spcl-athletes"],["Events","spcl-events"],["Communities","spcl-communities"],["History","spcl-history"],["Classification","spcl-classification"],["India","spcl-india"]].map(x=>`<button onclick="SPCL.scrollTo('${x[1]}')">${x[0]}</button>`).join("")}
  </div>

  <!-- ATHLETES -->
  <div class="spcl-sec wrap" id="spcl-athletes">
    <div class="cat-head"><div class="cat-ic" style="--x:${ACC}">🥇</div><div><h3 class="cat-name">SPCL PLAYERS ATHLETES</h3><p class="cat-blurb">Verified profiles carry public, documented achievements. Demo profiles are badged DEMO.</p></div></div>
    <div class="grid grid-4">
      ${window.SPCL_REAL_ATHLETES.map(a=>`
        <div class="spcl-ath card verified">
          <div class="sa-av" style="--a:${ACC}">${a.n.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
          <b class="sa-name">${a.n}</b>
          <div class="sa-meta">${a.sport.toUpperCase()} · ${a.c.toUpperCase()}</div>
          <p class="sa-ach">${a.ach}</p>
          <div class="sa-foot"><span class="mono-num">${a.fol} followers</span><button class="follow-btn" onclick="showToast('Following ${a.n}')">+ Follow</button></div>
          <span class="sa-flag">VERIFIED FACTS</span>
        </div>`).join("")}
      ${window.SPCL_DEMO_ATHLETES.slice(0,4).map(a=>`
        <div class="spcl-ath card demo">
          <div class="sa-av">${a.n.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
          <b class="sa-name">${a.n}</b>
          <div class="sa-meta">${a.sport.toUpperCase()} · ${a.c.toUpperCase()}</div>
          <p class="sa-ach">${a.role}.</p>
          <div class="sa-foot"><span class="mono-num">${a.fol} followers</span><button class="follow-btn" onclick="showToast('Following ${a.n}')">+ Follow</button></div>
          <span class="sa-flag demo">DEMO</span>
        </div>`).join("")}
    </div>
  </div>

  <!-- PARA SPORTS DIRECTORY -->
  <div class="spcl-sec wrap" id="spcl-sports">
    <div class="cat-head"><div class="cat-ic" style="--x:${ACC}">🔷</div><div><h3 class="cat-name">EXPLORE PARA SPORTS</h3><p class="cat-blurb">The IPC's current sanctioned Para-sport listing — 23 summer and 6 winter. Tap any sport to enter its SPCL PLAYERS universe.</p></div>
      <div class="cat-count mono-num">29</div></div>
    <div class="spcl-sumwin"><h4 class="section-title" style="font-size:26px;">SUMMER PARA SPORTS <em class="mono-num">${summer.length}</em></h4></div>
    <div class="grid grid-4">${summer.map(s=>window.PS_card(s)).join("")}</div>
    <div class="spcl-sumwin"><h4 class="section-title" style="font-size:26px;">WINTER PARA SPORTS <em class="mono-num">${winter.length}</em></h4></div>
    <div class="grid grid-4">${winter.map(s=>window.PS_card(s)).join("")}</div>
  </div>

  <!-- FEED -->
  <div class="spcl-sec wrap" id="spcl-feed">
    <div class="cat-head"><div class="cat-ic" style="--x:${ACC}">⚡</div><div><h3 class="cat-name">YOUR SPCL PLAYERS FEED</h3><p class="cat-blurb">Athlete posts, competition updates, training stories and records — the same social system as PLAYR.</p></div></div>
    <div class="feed-tabs" id="spclFeedTabs">
      <div class="feed-tab active" onclick="SPCL.feedTab('foryou')">For You</div>
      <div class="feed-tab" onclick="SPCL.feedTab('following')">Following</div>
      <div class="feed-tab" onclick="SPCL.feedTab('trending')">Trending</div>
    </div>
    <div id="spclFeedBody"></div>
  </div>

  <!-- HAPPENING NOW -->
  <div class="spcl-sec wrap" id="spcl-events">
    <div class="cat-head"><div class="cat-ic" style="--x:${ACC}">🏟️</div><div><h3 class="cat-name">SPCL PLAYERS HAPPENING NOW</h3><p class="cat-blurb">Live, upcoming and recent — verified where possible, demo where labelled.</p></div>
      <button class="btn btn-ghost btn-sm" style="margin-left:auto;" onclick="SPCL.openEvents()">All Para events →</button></div>
    <div class="spcl-events-grid">
      ${window.SPCL_REAL_EVENTS.map(e=>`
        <div class="spcl-ev card ${e.st==="COMPLETED"?"done":""}">
          <div class="spcl-ev-st ${e.st==="COMPLETED"?"":"up"}">${e.st}</div>
          <b>${e.n}</b>
          <div class="mono-num spcl-ev-meta">${e.d} · ${e.loc}</div>
          <p>${e.info}</p>
          <div class="spcl-ev-src mono-num">${e.src}</div>
        </div>`).join("")}
      <div class="spcl-ev card demo">
        <div class="spcl-ev-st">DEMO</div>
        <b>Mumbai Wheelchair Basketball League — finals night</b>
        <div class="mono-num spcl-ev-meta">THIS SEASON · NSCI DOME, WORLI</div>
        <p>Four teams, one trophy, the loudest crowd in the hall. Demo community fixture on the SPCL PLAYERS calendar.</p>
        <div class="spcl-ev-src mono-num">DEMO EVENT — NOT A REAL LISTING</div>
      </div>
    </div>
  </div>

  <!-- HISTORY -->
  <div class="spcl-sec wrap" id="spcl-history">
    <div class="cat-head"><div class="cat-ic" style="--x:${ACC}">📜</div><div><h3 class="cat-name">HISTORY OF PARA SPORT</h3><p class="cat-blurb">From Stoke Mandeville to Nagoya — the milestones that built the Paralympic movement.</p></div></div>
    ${window.SPCL_TIMELINE.map(h=>`<div class="timeline-card"><div class="tl-year">${h.y}</div><div class="tl-body"><h4>${h.t}</h4><p>${h.d}</p></div></div>`).join("")}
  </div>

  <!-- CLASSIFICATION -->
  <div class="spcl-sec wrap" id="spcl-classification">
    <div class="cat-head"><div class="cat-ic" style="--x:${ACC}">🧭</div><div><h3 class="cat-name">HOW CLASSIFICATION WORKS</h3><p class="cat-blurb">Fair competition, engineered sport by sport.</p></div></div>
    <div class="spcl-classify card">
      <p>"Para sport classification is <b>sport-specific</b>. It is designed to ensure that athletes compete as fairly as possible by grouping eligible athletes according to how their impairment affects sport performance."</p>
      <p class="spcl-classify-sub">Impairments affect the activities of each sport differently — that's why a class in swimming isn't a class in wheelchair basketball. Classification is about <b>activity, not disability labels</b>.</p>
      <div class="spcl-class-steps">
        <div><b>1 · Eligibility</b><span>Athletes meet the sport's eligible impairment types.</span></div>
        <div><b>2 · Assessment</b><span>Sport-specific technical tests by trained classifiers.</span></div>
        <div><b>3 · Sport class</b><span>Grouped by impact on that sport's performance — never by medical diagnosis alone.</span></div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="SPCL.learnMore()">LEARN MORE</button>
      <p class="spcl-classify-note">PLAYR never publishes an individual's classification or medical information — that stays with athletes and classifiers.</p>
    </div>
  </div>

  <!-- COMMUNITIES -->
  <div class="spcl-sec wrap" id="spcl-communities">
    <div class="cat-head"><div class="cat-ic" style="--x:${ACC}">👥</div><div><h3 class="cat-name">SPCL PLAYERS COMMUNITIES</h3><p class="cat-blurb">Members, posts, events, challenges, athletes and discussions — built around each sport.</p></div></div>
    <div class="grid grid-4">${window.SPCL_COMMUNITIES.map(c=>`
      <div class="spcl-com card">
        <div class="sc-ic">${c.n.includes("Wheelchair")?"🏀":c.n.includes("Blind")?"⚽":c.n.includes("Swimming")?"🏊":c.n.includes("Cycling")?"🚴":c.n.includes("Boccia")?"⚪":c.n.includes("Athletics")?"🏃":"🇮🇳"}</div>
        <b>${c.n}</b><p>${c.d}</p>
        <div class="sa-foot"><span class="mono-num">${c.m}</span><button class="join-btn" onclick="toggleJoin(this,'${c.n}')">Join</button></div>
      </div>`).join("")}</div>
  </div>

  <!-- INDIA -->
  <div class="spcl-sec wrap" id="spcl-india">
    <div class="cat-head"><div class="cat-ic" style="--x:${ACC}">🇮🇳</div><div><h3 class="cat-name">PARA SPORT INDIA</h3><p class="cat-blurb">PLAYR launches in India — this is the home of Indian Para sport on SPCL PLAYERS.</p></div></div>
    <div class="spcl-india-grid">
      <div class="spcl-india-facts">
        ${window.SPCL_INDIA.facts.map(f=>`<div class="timeline-card"><div class="tl-year">${f[0]}</div><div class="tl-body"><p>${f[1]}</p></div></div>`).join("")}
        <p class="spcl-ev-src mono-num">${window.SPCL_INDIA.note}</p>
      </div>
      <div>
        <div class="card spcl-india-cta">
          <div class="eyebrow">Discover</div>
          <h4>INDIAN PARA EVENTS ON PLAYR</h4>
          <p>Competitions, championships and community Para-sport events across India — filtered straight from the PLAYR events engine.</p>
          <button class="btn btn-primary btn-sm" onclick="SPCL.openEvents()">Browse Para events</button>
        </div>
        <div class="card spcl-india-cta">
          <div class="eyebrow">Community</div>
          <h4>INDIAN PARA SPORT COMMUNITY</h4>
          <p>112K members strong — athlete AMAs, watch parties and local meetups.</p>
          <button class="btn btn-ghost btn-sm" onclick="showToast('Joined Indian Para Sport Community ✓')">Join community</button>
        </div>
      </div>
    </div>
  </div>

  <!-- CHALLENGES (safe & accessible) -->
  <div class="spcl-sec wrap" id="spcl-challenges">
    <div class="cat-head"><div class="cat-ic" style="--x:${ACC}">🧠</div><div><h3 class="cat-name">SPCL PLAYERS CHALLENGES</h3><p class="cat-blurb">Recreational only — predictions, trivia and knowledge. No risky physical challenges on SPCL PLAYERS, ever.</p></div></div>
    <div class="grid grid-3">
      ${[["Para Sport History Quiz","10 rounds from Stoke Mandeville to Nagoya.","PLAY NOW"],["Predict the Finalist","Call the finals before they happen — no stakes but pride.","PREDICT"],["Name That Para Sport","Identify the most Para-sport events from their classes.","START"],["Classification Basics","Learn how classes work — 5 questions, all levels.","LEARN"]].map(c=>`
        <div class="spcl-chz card"><b>${c[0]}</b><p>${c[1]}</p><button class="btn btn-ghost btn-sm" onclick="showToast('${c[0]} — opening on SPCL PLAYERS ⚡')">${c[2]}</button></div>`).join("")}
    </div>
  </div>

  <!-- SHOP TEASER -->
  <div class="spcl-sec wrap" id="spcl-shop">
    <div class="spcl-shop-banner card">
      <div>
        <div class="pill pill-lime" style="margin-bottom:12px;">SPCL PLAYERS DROP</div>
        <h4>SPORTS FOR EVERY CAPABILITY.<br>LIMITLESS POTENTIAL.</h4>
        <p>PLAYR-original SPCL PLAYERS merch — no IPC or Paralympic affiliation, just the community's colours.</p>
      </div>
      <button class="btn btn-primary" onclick="switchView('shop')">Shop SPCL PLAYERS →</button>
    </div>
  </div>`;

  renderSpclFeed("foryou");
  spclRendered=true;
};

/* ---------- feed ---------- */
const SPCL_POSTS={
  foryou:[
    {who:"Ishaan Verma",tag:"Wheelchair Basketball",t:"1h",txt:"Finals-week reps done. Chair's dialed in, screens are crisp — see you Sunday at the dome. 🏀⚡",likes:2140,com:88},
    {who:"Meera Nair",tag:"Para Swimming",t:"3h",txt:"Negative split today for the first time this block. S8 gang, the work is working. 🏊",likes:987,com:41},
    {who:"SPCL PLAYERS",tag:"On this day",t:"5h",txt:"1948: an archery contest at Stoke Mandeville Hospital plants the seed of the entire Paralympic movement.",likes:5402,com:173},
    {who:"Zoya Khan",tag:"Goalball",t:"8h",txt:"Bell work until the gym closed. Ear > eye, every single time. 🥅",likes:1340,com:52},
    {who:"Indian Para Sport Community",t:"12h",tag:"Community",txt:"Road to Nagoya starts now — the Asian Para Games run 18–24 October. Who's following with us? 🇮🇳",likes:3210,com:206}
  ],
  following:[
    {who:"Arjun Bisht",tag:"Para Athletics",t:"2h",txt:"Block 3 done. The chart says volume down, speed up — the legs agree. 🏃‍♂️",likes:764,com:33},
    {who:"Tara Gomes",tag:"Boccia",t:"6h",txt:"Ramp settings finally perfect. Two millimetres matter more than you think. ⚪",likes:512,com:29}
  ],
  trending:[
    {who:"SPCL PLAYERS",tag:"Records",t:"1d",txt:"Sumit Antil's F64 javelin world records: the benchmark keeps moving. Full stats in the Para Athletics universe. 🎯",likes:8602,com:340},
    {who:"Vikram Rathore",tag:"Wheelchair Rugby",t:"1d",txt:"Chair hits are part of the sport. Respect the engineering. 🏉",likes:2901,com:141},
    {who:"SPCL PLAYERS",tag:"Classification",t:"2d",txt:"Sport-specific, activity-based, athlete-first. If classification confuses you, our 60-second guide is in the Classification tab. 🧭",likes:4110,com:97}
  ]
};
function renderSpclFeed(tab){
  const order=["foryou","following","trending"]; const idx=order.indexOf(tab);
  document.querySelectorAll("#spclFeedTabs .feed-tab").forEach((el,i)=>el.classList.toggle("active", i===idx));
  const el=document.getElementById("spclFeedBody"); if(!el) return;
  el.innerHTML=`<div class="feed-col" style="margin:0;">${SPCL_POSTS[tab].map((p,i)=>`
    <div class="card spcl-post">
      <div class="spcl-post-head"><div class="sa-av sm" style="--a:${ACC}">${p.who.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
        <div><b>${p.who}</b><div class="mono-num spcl-post-meta">${p.tag.toUpperCase()} · ${p.t}</div></div></div>
      <p>${p.txt}</p>
      <div class="spcl-post-actions">
        <button onclick="SPCL.like(this,${p.likes})">♥ <span>${fmt(p.likes)}</span></button>
        <button onclick="showToast('Comments — join the conversation on SPCL')">💬 ${p.com}</button>
        <button onclick="showToast('Link copied — share the moment')">↗ Share</button>
        <button onclick="showToast('Saved to your collection')">🔖 Save</button>
      </div>
    </div>`).join("")}</div>`;
}
window.SPCL={
  scrollTo(id){ const el=document.getElementById(id); if(el&&el.scrollIntoView) el.scrollIntoView({behavior:"smooth",block:"start"}); },
  feedTab(tab){ renderSpclFeed(tab); },
  like(btn,n){ const on=btn.classList.toggle("on"); const s=btn.querySelector("span"); s.textContent=fmt(n+(on?1:0)); },
  openEvents(){ switchView("events"); if(window.PLAYR_EV&&window.PLAYR_EV.setPara) window.PLAYR_EV.setPara(true); },
  learnMore(){
    const ov=document.createElement("div"); ov.id="spclLearn"; ov.className="a-overlay";
    ov.innerHTML=`<div class="a-sheet spcl-learn">
      <button class="a-close" onclick="document.getElementById('spclLearn').remove()">✕</button>
      <h3 class="a-sheet-title">CLASSIFICATION, PROPERLY EXPLAINED.</h3>
      <p>Classification exists for one reason: <b>fair competition</b>. It groups athletes by how much an impairment affects the specific activities of a sport — so results come down to training, tactics and execution.</p>
      <ul>
        <li><b>Sport-specific:</b> an impairment that affects swimming minimally may affect wheelchair racing significantly — each sport tests its own classes.</li>
        <li><b>Three steps:</b> eligible impairment types → sport-specific assessment by trained classifiers → sport class (e.g. T64, S8, BC4, SL4).</li>
        <li><b>Classes evolve:</b> as sports and science evolve, classes are reviewed by the international federations.</li>
        <li><b>Athlete-first:</b> classification is about activity limits, not defining anyone. PLAYR never shares an athlete's medical or classification details.</li>
      </ul>
      <p class="spcl-ev-src mono-num">EDUCATIONAL SUMMARY — DETAILED RULES LIVE WITH THE IPC & INTERNATIONAL FEDERATIONS.</p>
      <button class="btn btn-primary btn-sm" onclick="document.getElementById('spclLearn').remove()">GOT IT</button>
    </div>`;
    document.body.appendChild(ov);
  }
};

/* ============================================================
   SPCL SPORT UNIVERSES
   ============================================================ */
let suSport=null, suTab=null;
function openSpclSport(id){
  const s=BY[id]; if(!s) return;
  suSport=id; const tabs=s.tabsOverride||["Feed","Latest","Athletes","History","Community","Events","Results","Stats"];
  suTab=tabs[0];
  const root=document.getElementById("spclUniverseRoot"); if(!root) return;
  const following=window.PS_isFollowing&&PS_isFollowing(id);
  const demoAth=window.SPCL_DEMO_ATHLETES.filter(a=>a.sport===s.name).concat(window.SPCL_DEMO_ATHLETES.slice(0,3));
  root.innerHTML=`
  <div class="su2-hero" style="--accent:${ACC}; background:linear-gradient(135deg, ${ACC}2E 0%, #0A0B0D 100%)">
    <span class="su2-watermark">${s.icon}</span>
    <div class="su2-in">
      <div class="su2-top"><div class="su2-icon">${s.icon}</div>
        <div><div class="su2-badges"><span class="badge b-spcl">SPCL · ${s.subcategory.toUpperCase()}</span></div>
          <h1 class="su2-title">${s.name.toUpperCase()}</h1>
          <div class="su2-sub">${s.subcategory} · Part of PLAYR's Para-sport ecosystem</div></div>
        <div class="su2-side"><div class="su2-fol mono-num">${fmt(s.followers)} followers</div>
          <button class="follow-btn ${following?"following":""}" onclick="toggleFollowSport('${s.id}',this)">${following?"Following":"+ Follow"}</button></div>
      </div>
      <p class="su2-desc">${s.description}</p>
      <div class="su2-note"><b>SPORT WITHOUT LIMITS</b> — SPCL PLAYERS universes celebrate performance first. Classification details stay with athletes and classifiers.</div>
    </div>
  </div>
  <div class="su-tabs su2-tabs" id="spclSuTabs">${tabs.map(t=>`<div class="su-tab" data-t="${t}" onclick="SPCL.suTab('${t}')">${t}</div>`).join("")}</div>
  <div id="spclSuPanel"></div>
  <div class="maylike"><div class="fy-row-head"><div class="eyebrow" style="margin:0">More SPCL PLAYERS worlds</div></div>
    <div class="fy-list">${Object.keys(BY).filter(k=>k!==id).slice(0,8).map(k=>window.PS_miniCard(BY[k])).join("")}</div></div>`;
  setSuTab(tabs[0]);
  window.scrollTo({top:0});
}
window.SPCL.suTab=function(t){ setSuTab(t); };
function setSuTab(t){
  suTab=t;
  document.querySelectorAll("#spclSuTabs .su-tab").forEach(el=>el.classList.toggle("active",el.dataset.t===t));
  const s=BY[suSport], el=document.getElementById("spclSuPanel"); if(!el) return;
  const ath=window.SPCL_DEMO_ATHLETES.filter(a=>a.sport===s.name).concat(window.SPCL_REAL_ATHLETES.filter(a=>a.sport===s.name));
  const list=ath.length?ath:window.SPCL_DEMO_ATHLETES.slice(0,4);
  switch(t){
    case "Feed": el.innerHTML=`<div class="feed-col" style="margin:0;">${SPCL_POSTS.foryou.slice(0,3).map(p=>`
      <div class="card spcl-post"><div class="spcl-post-head"><div class="sa-av sm" style="--a:${ACC}">${p.who.split(" ").map(w=>w[0]).slice(0,2).join("")}</div><div><b>${p.who}</b><div class="mono-num spcl-post-meta">${p.tag.toUpperCase()} · ${p.t}</div></div></div><p>${p.txt}</p>
      <div class="spcl-post-actions"><button onclick="SPCL.like(this,${p.likes})">♥ <span>${fmt(p.likes)}</span></button><button onclick="showToast('Comments — join in')">💬 ${p.com}</button><button onclick="showToast('Link copied')">↗ Share</button><button onclick="showToast('Saved')">🔖 Save</button></div></div>`).join("")}</div>`; break;
    case "Latest": el.innerHTML=`<div class="grid grid-3">${[
      ["Community recap: the week in "+s.name,"Results, moments and the posts you loved from the "+s.name+" feed.", "COMMUNITY"],
      ["Road to Aichi-Nagoya","The Asian Para Games run 18–24 October 2026 — 18 Para sports, 45 NPCs.", "VERIFIED"],
      ["Training thread: "+s.name+" drills","The community's most-saved drill post this month.", "DEMO"]].map(x=>`<div class="card" style="padding:22px;"><div class="pill ${x[2]==="VERIFIED"?"pill-lime":x[2]==="DEMO"?"pill-muted":"pill-cyan"}" style="margin-bottom:12px;">${x[2]}</div><h4 style="font-size:15px;font-weight:800;margin-bottom:8px;line-height:1.35;">${x[0]}</h4><p style="color:var(--muted);font-size:13px;line-height:1.5;">${x[1]}</p></div>`).join("")}</div>`; break;
    case "Athletes": el.innerHTML=`<div class="grid grid-4">${list.map(a=>`
      <div class="card spcl-ath ${a.ach?"verified":"demo"}"><div class="sa-av">${a.n.split(" ").map(w=>w[0]).slice(0,2).join("")}</div><b class="sa-name">${a.n}</b><div class="sa-meta">${(a.role||a.ach||"").slice(0,52).toUpperCase()}</div><div class="sa-foot"><span class="mono-num">${a.fol||"50K"}</span><button class="follow-btn" onclick="showToast('Following ${a.n}')">+ Follow</button></div>${a.ach?'<span class="sa-flag">VERIFIED FACTS</span>':'<span class="sa-flag demo">DEMO</span>'}</div>`).join("")}</div>`; break;
    case "Teams": el.innerHTML=`<div class="grid grid-4">${["Mumbai Sparks","Delhi Dusk","Bengaluru Bolt","Chennai Charge","Pune Pacer","Hyderabad Heat"].map(t=>`<div class="card" style="padding:20px;text-align:center;font-weight:700;font-size:14px;border-top:3px solid ${ACC};">${s.icon} ${t}</div>`).join("")}</div><p class="mono-num" style="color:var(--muted-2);font-size:11px;margin-top:12px;">DEMO TEAM ROSTERS — COMMUNITY-MANAGED.</p>`; break;
    case "Rules / Format": el.innerHTML=`<div class="card" style="padding:26px;"><div class="eyebrow">${s.name} — format & classes</div>
      <p style="color:var(--muted);font-size:14px;line-height:1.75;">${s.description}</p>
      <ul style="margin:14px 0 0 18px;color:var(--muted);font-size:13.5px;line-height:2;">
        <li>Classes are <b>sport-specific</b> — grouped by how an impairment affects this sport's activities.</li>
        <li>Formats (match length, divisions, equipment) are set by the international federation for this sport.</li>
        <li>PLAYR summarizes publicly available rules and never publishes individual classifications.</li>
      </ul>
      <button class="btn btn-ghost btn-sm" style="margin-top:16px;" onclick="SPCL.learnMore()">How classification works →</button></div>`; break;
    case "History": {
      const first=window.SPCL_TIMELINE.slice(0,5);
      el.innerHTML=`<div class="empty-state card" style="padding:26px;"><h4>${s.name}'s story is written by its community</h4><p>PLAYR publishes verified milestones only — fans and historians contribute the rest.</p></div>`+first.map(h=>`<div class="timeline-card"><div class="tl-year">${h.y}</div><div class="tl-body"><h4>${h.t}</h4><p>${h.d}</p></div></div>`).join(""); break; }
    case "Community": el.innerHTML=window.SPCL_COMMUNITIES.slice(0,4).map(c=>`
      <div class="card" style="padding:20px 22px;margin-bottom:12px;display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap;"><div><b>${c.n}</b><p style="color:var(--muted);font-size:13.5px;">${c.d}</p></div><div style="text-align:right;"><div class="mono-num" style="color:var(--lime);">${c.m}</div><button class="join-btn" onclick="toggleJoin(this,'${c.n}')">Join</button></div></div>`).join(""); break;
    case "Events": el.innerHTML=window.SPCL_REAL_EVENTS.map(e=>`
      <div class="card" style="padding:24px;margin-bottom:12px;display:flex;justify-content:space-between;gap:18px;align-items:center;flex-wrap:wrap;"><div><b>${e.n}</b><div class="mono-num" style="color:var(--muted);font-size:12px;margin-top:6px;">${e.d} · ${e.loc}</div></div><button class="btn btn-ghost btn-sm" onclick="SPCL.openEvents()">View events</button></div>`).join(""); break;
    case "Results": el.innerHTML=`<div class="empty-state card"><h4>Results land here — verified only</h4><p>Competition results are published after official confirmation, credited to paralympic.org and the international federations. PLAYR never invents results.</p><button class="btn btn-ghost btn-sm" style="margin-top:14px;" onclick="SPCL.openEvents()">Browse Para events</button></div>`; break;
    case "Stats": el.innerHTML=`<div class="stat-row">${window.PS_gen.stats(s).map(x=>`<div class="stat-block"><div class="flap">${x.v}</div><div class="stat-label">${x.l}</div></div>`).join("")}</div><p class="mono-num" style="color:var(--muted-2);font-size:11px;margin-top:12px;">PLATFORM CONTENT COUNTS — DEMO DATA.</p>`; break;
  }
}

/* ============================================================
   HOME + SHOP INTEGRATION
   ============================================================ */
window.renderSpclHome=function(){
  const el=document.getElementById("spclHomeSec"); if(!el) return;
  const feat=window.SPCL_REAL_ATHLETES[0], demoA=window.SPCL_DEMO_ATHLETES[0];
  const ev=window.SPCL_REAL_EVENTS[0], com=window.SPCL_COMMUNITIES[6];
  el.innerHTML=`<div class="wrap">
    <div class="cat-head"><div class="cat-ic" style="--x:${ACC}">🔷</div><div><h3 class="cat-name">SPCL PLAYERS — SPORTS FOR EVERY CAPABILITY.<br>LIMITLESS POTENTIAL.</h3><p class="cat-blurb">PLAYR's Para-sport ecosystem — athletes, competitions, history and community in one place.</p></div>
      <button class="btn btn-primary btn-sm" style="margin-left:auto;" onclick="switchView('spcl')">Explore SPCL PLAYERS</button></div>
    <div class="spcl-home-grid">
      <div class="spcl-hc card feat" onclick="SPCL.scrollTo2('spcl-athletes')">
        <div class="spcl-hc-tag">FEATURED ATHLETE · VERIFIED FACTS</div>
        <b>${feat.n}</b><p>${feat.sport} · ${feat.c}</p><p class="spcl-hc-sub">${feat.ach.slice(0,84)}…</p>
      </div>
      <div class="spcl-hc card" onclick="openSport('wheelchair-basketball')">
        <div class="spcl-hc-tag">FEATURED PARA SPORT</div>
        <b>🏀 Wheelchair Basketball</b><p>78K followers · SPCL universe</p>
      </div>
      <div class="spcl-hc card" onclick="SPCL.openEvents()">
        <div class="spcl-hc-tag">NEXT UP · VERIFIED</div>
        <b>${ev.n}</b><p>${ev.d} · ${ev.loc}</p>
      </div>
      <div class="spcl-hc card" onclick="switchView('spcl')">
        <div class="spcl-hc-tag">COMMUNITY</div>
        <b>${com.n}</b><p>${com.m} · open to everyone</p>
      </div>
    </div>
  </div>`;
};
window.SPCL.scrollTo2=function(){ switchView("spcl"); setTimeout(()=>window.SPCL.scrollTo("spcl-athletes"),120); };

window.renderSpclShop=function(){
  const el=document.getElementById("spclShopSec"); if(!el) return;
  el.innerHTML=`<div class="wrap">
    <div class="drop-banner spcl-drop">
      <div>
        <div class="pill" style="margin-bottom:12px;background:rgba(77,166,255,.14);color:${ACC};border:1px solid rgba(77,166,255,.35);">SPCL PLAYERS — Sports for Every Capability. Limitless Potential.</div>
        <h3 style="font-family:var(--display);font-size:32px;text-transform:uppercase;">THE SPCL DROP</h3>
        <p style="color:var(--muted);margin-top:6px;max-width:460px;">PLAYR-original SPCL PLAYERS merch. Not affiliated with the IPC or any official Paralympic merchandise.</p>
      </div>
    </div>
    <div class="grid grid-4">
      ${window.SPCL_MERCH.map(m=>`<div class="card product-card"><div class="product-media spcl-merch-ic">${m.icon}</div><div class="product-body"><div class="product-cat">SPCL PLAYERS</div><div class="product-name">${m.n}</div><div class="product-row"><span class="product-price">${m.p}</span><button class="btn btn-primary btn-sm" onclick="showToast('Added to cart')">Shop Now</button></div></div></div>`).join("")}
    </div>
  </div>`;
};

window.initSpcl=function(){
  window.renderSpclHome();
  window.renderSpclShop();
  if(document.getElementById("view-spcl").classList.contains("active")) window.renderSpcl();
};
})();
