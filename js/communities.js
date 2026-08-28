/* ============================================================
   PLAYR — COMMUNITIES v2
   Find your sport. Find your people. Build your community.
   ------------------------------------------------------------
   Persistence is HONEST: joins, posts, discussions and created
   communities are stored in localStorage for this prototype and
   clearly labelled as such. Permanent storage arrives with the
   Supabase backend (docs/communities-schema.sql pattern).
   Images resolve through the central PLAYR_IMG library — every
   community carries its own deterministic sport-matched visual.
   ============================================================ */
(function(){
"use strict";
const P=window.PLAYR_IMG;
const fmt=n=>n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e3?(n/1e3).toFixed(1).replace(/\.0$/,"")+"K":""+n;

/* ---------- community data ---------- */
const K=(id,cat)=>({imgKey:id,cat});
const DATA=[
  {id:"mumbai-runners",name:"Mumbai Runners",sport:"Running",cat:"RUNNING",city:"Mumbai",type:"LOCAL",members:34200,act:214,trend:1,
   desc:"Everything running in Mumbai — routes, races, challenges and the people who make 5AM feel normal.",rules:["Be encouraging — every pace is a real pace.","No selling without admin approval.","Route photos welcome, spam is not."]},
  {id:"run-mumbai",name:"Run Mumbai",sport:"Running",cat:"RUNNING",city:"Mumbai",type:"SPORT-SPECIFIC",members:12800,act:96,
   desc:"Marine Drive splits, monsoon training plans and the city's weekend long-run roster."},
  {id:"mumbai-football",name:"Mumbai Football Community",sport:"Football",cat:"FOOTBALL",city:"Mumbai",type:"LOCAL",members:18900,act:143,trend:1,
   desc:"Turf bookings, pickup nights, matchday meetups — Mumbai's football heartbeat."},
  {id:"indian-football",name:"Indian Football Fans",sport:"Football",cat:"FOOTBALL",city:"India",type:"PUBLIC",members:88400,act:511,
   desc:"ISL, I-League, the Blue Tigers and every grassroots story in between."},
  {id:"cricket-talk",name:"Cricket Talk India",sport:"Cricket",cat:"CRICKET",city:"India",type:"PUBLIC",members:124000,act:934,trend:1,
   desc:"Selection debates, series previews and the eternal question: bazball or build?"},
  {id:"indian-cricket",name:"Indian Cricket Fans",sport:"Cricket",cat:"CRICKET",city:"India",type:"PUBLIC",members:1100000,act:2100,
   desc:"The biggest cricket family on PLAYR — from maidan cricket to the World Cup."},
  {id:"mumbai-cyclists",name:"Mumbai Cyclists",sport:"Cycling",cat:"CYCLING",city:"Mumbai",type:"LOCAL",members:21500,act:168,trend:1,
   desc:"Aarey dawn rides, BKC sprints and the occasional 100K that was definitely your idea."},
  {id:"mumbai-basketball",name:"Mumbai Basketball Crew",sport:"Basketball",cat:"BASKETBALL",city:"Mumbai",type:"LOCAL",members:9400,act:77,
   desc:"Half-court culture, inter-college hype and Sunday runs across the city."},
  {id:"mumbai-trekking",name:"Mumbai Trekking Collective",sport:"Trekking",cat:"ADVENTURE",city:"Mumbai",type:"LOCAL",members:62000,act:302,trend:1,
   desc:"Sahyadri weekends, monsoon waterfalls and responsible trail culture."},
  {id:"mumbai-swimmers",name:"Mumbai Swimmers",sport:"Swimming",cat:"SWIMMING",city:"Mumbai",type:"LOCAL",members:7300,act:41,
   desc:"Pool intervals, open-water prep and the great chlorine hair debate."},
  {id:"tennis-india",name:"Tennis India",sport:"Tennis",cat:"TENNIS",city:"India",type:"SPORT-SPECIFIC",members:28600,act:164,trend:1,
   desc:"Grand Slam threads, Delhi winter schedules and finding a hitting partner near you."},
  {id:"badminton-india",name:"Badminton India",sport:"Badminton",cat:"BADMINTON",city:"India",type:"SPORT-SPECIFIC",members:41200,act:238,
   desc:"Court bookings, drill videos and the smash-form checks you asked for."},
  {id:"chess-india",name:"Chess India",sport:"Chess",cat:"EMERGING SPORTS",city:"India",type:"PUBLIC",members:53900,act:383,
   desc:"From prodigy watch to your first rated tournament — all levels, one board."},
  {id:"f1-india",name:"Formula 1 India",sport:"Formula 1",cat:"MOTORSPORT",city:"India",type:"SPORT-SPECIFIC",members:47700,act:356,trend:1,
   desc:"Race-week threads, tyre-strategy wars and 4:30AM alarm solidarity."},
  {id:"adventure-india",name:"Adventure India",sport:"Mountaineering",cat:"ADVENTURE",city:"India",type:"PUBLIC",members:76800,act:290,
   desc:"Expedition logs, Himalayan courses and safety-first planning for every altitude."},
  {id:"fitness-india",name:"Fitness India",sport:"Fitness",cat:"FITNESS",city:"India",type:"PUBLIC",members:93200,act:617,
   desc:"Programming, form checks and the compound-lift gospel — bro-science gets fact-checked."},
  {id:"combat-india",name:"Combat Sports India",sport:"Boxing",cat:"COMBAT SPORTS",city:"India",type:"SPORT-SPECIFIC",members:33100,act:201,
   desc:"Boxing, wrestling, BJJ, MMA — gyms, competitions and technique talk."},
  {id:"winter-india",name:"Winter Sports India",sport:"Skiing",cat:"WINTER SPORTS",city:"India",type:"SPORT-SPECIFIC",members:8100,act:34,
   desc:"Gulmarg powder, dry-slope dreams and India's winter athletes on the world stage."},
  {id:"para-india",name:"Para-Sports India",sport:"SPCL PLAYERS",cat:"PARA-SPORTS",city:"India",type:"PUBLIC",members:112000,act:488,trend:1,icon:"🔷",noImg:true,
   desc:"PLAYR's home for Indian Para sport — part of SPCL PLAYERS. Athletes, fans, classifiers, coaches, all welcome.",rules:["Athlete-first language, always.","Classification questions answered with official sources — never speculation about individuals."]},
  {id:"emerging-india",name:"Emerging Sports India",sport:"Pickleball",cat:"EMERGING SPORTS",city:"India",type:"PUBLIC",members:19800,act:156,icon:"✦",noImg:true,
   desc:"Pickleball, padel, speedcubing, ultimate — the sports India is just discovering."}
];
const CATS=["ALL","TRENDING","POPULAR","NEW","NEAR YOU","MY COMMUNITIES"];
const SPORT_CATS=["FOOTBALL","CRICKET","BASKETBALL","TENNIS","BADMINTON","RUNNING","CYCLING","SWIMMING","MOTORSPORT","MOUNTAINEERING","ADVENTURE","FITNESS","COMBAT SPORTS","WINTER SPORTS","WATER SPORTS","PARA-SPORTS","EMERGING SPORTS"];
const SPORT_KEY={Running:"running",Football:"football",Cricket:"cricket",Cycling:"cycling",Basketball:"basketball",Trekking:"trekking",Swimming:"swimming",Tennis:"tennis",Badminton:"badminton",Chess:"chess","Formula 1":"motorsport",Mountaineering:"mountaineering",Fitness:"fitness",Boxing:"boxing",Skiing:"skiing",Pickleball:"badminton"};

/* deterministic unique image per community */
function bg(c){
  if(c.noImg) return null;
  const idx=DATA.indexOf(c);
  return P.bg(SPORT_KEY[c.sport]||"running", idx, 800, 600);
}

/* ---------- state (honest localStorage) ---------- */
const LSK_J="playr_com_joined_v1", LSK_P="playr_com_posts_v1", LSK_D="playr_com_disc_v1", LSK_C="playr_com_created_v1";
const read=k=>{ try{ return JSON.parse(localStorage.getItem(k))||{}; }catch(e){ return {}; } };
const write=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };
const isJoined=id=>!!read(LSK_J)[id];
const all=()=>DATA.concat(Object.values(read(LSK_C)));

/* seeded demo posts + discussions (clearly labelled demo) */
function seedPosts(c){
  const sp=SPORT_KEY[c.sport]||"running";
  return [
    {who:"Karan Mehta",t:"2h",txt:`Just completed my first 10K! 🔥 Six months ago I couldn't finish 2. Thanks ${c.name} for the push.`,likes:214,com:18,kind:"achievement"},
    {who:c.name+" Crew",t:"6h",txt:"Weekend plan is live — drop a 👍 if you're in. Newcomers warmly welcome.",likes:98,com:12,kind:"event"},
    {who:"Simran Gill",t:"1d",txt:"Question for the veterans: what's the one thing you wish you knew in your first month?",likes:156,com:44,kind:"question"}
  ];
}
function seedDisc(c){
  const q={"RUNNING":["Best running tracks in the city?","Tips for my first race day?","Morning vs evening sessions — what works for you?"],
   "CRICKET":["Which cricket format do you prefer and why?","Best nets in the city for beginners?"],
   "FOOTBALL":["Best turf bookings this weekend?","How do we get more kids into football?"],
   "ADVENTURE":["Monsoon trail safety — share your checklists","First Himalayan trek: expectations vs reality"]}[c.cat]||["What should every newcomer to "+c.sport+" know?","Your best moment in this sport so far?"];
  return q.map((x,i)=>({id:c.id+"-d"+i,title:x,by:i%2?"Rhea Kapoor":"Arjun Mehta",replies:8+i*7,likes:24+i*13,saved:false,when:(i+1)+"d"}));
}

/* ---------- main render ---------- */
let F={q:"",filter:"ALL",cat:"ALL"};
function render(){
  const root=document.getElementById("communitiesRoot"); if(!root) return;
  const list=all().filter(c=>{
    if(F.filter==="TRENDING"&&!c.trend) return false;
    if(F.filter==="POPULAR"&&c.members<40000) return false;
    if(F.filter==="NEW"&&!(c.isNew||c.created)) return false;
    if(F.filter==="NEAR YOU"&&c.city!=="Mumbai") return false;
    if(F.filter==="MY COMMUNITIES"&&!isJoined(c.id)) return false;
    if(F.cat!=="ALL"&&c.cat!==F.cat) return false;
    if(F.q.trim()){ const t=F.q.toLowerCase(); const hay=(c.name+" "+c.sport+" "+c.cat+" "+c.city+" "+c.desc).toLowerCase(); if(!t.split(/\s+/).every(w=>hay.includes(w))) return false; }
    return true;
  }).sort((a,b)=>b.members-a.members);
  const trending=all().filter(c=>c.trend).sort((a,b)=>b.act-a.act);
  const mine=all().filter(c=>isJoined(c.id));

  root.innerHTML=`
  <div class="com-hero">
    <div class="com-hero-bg"></div>
    <div class="wrap com-hero-in">
      <div class="eyebrow">PLAYR Communities</div>
      <h1>COMMUNITIES.</h1>
      <p class="com-tag">Your sport. Your people. Your community.</p>
      <p class="com-sub">Connect with fans, athletes, creators and sports enthusiasts who share your passion.</p>
      <div class="com-hero-btns">
        <button class="btn btn-primary" onclick="PLAYR_COM.explore()">EXPLORE COMMUNITIES</button>
        <button class="btn btn-ghost" onclick="PLAYR_COM.create()">CREATE COMMUNITY</button>
      </div>
    </div>
  </div>

  <div class="wrap com-sec">
    ${mine.length?`<div class="cat-head"><div class="cat-ic">📌</div><div><h3 class="cat-name">MY COMMUNITIES</h3><p class="cat-blurb">${mine.length} joined · unread updates shown are demo counters until the backend connects.</p></div></div>
    <div class="com-mine">${mine.map(c=>`
      <button class="com-mine-card" onclick="PLAYR_COM.open('${c.id}')">
        ${bg(c)?`<div class="cmc-img" style="background:${bg(c)}"></div>`:`<div class="cmc-img icon" style="--a:${c.id==="para-india"?"#4DA6FF":"var(--lime)"}">${c.icon||"🏅"}</div>`}
        <div class="cmc-body"><b>${c.name}</b>
          <div class="mono-num cmc-meta"><span>💬 ${2+(c.name.length%3)} NEW</span><span>📅 ${1+(c.members%3)} EVENTS</span><span>🏆 ${1+(c.act%2)} CHALLENGE${(c.act%2)?"":"S"}</span></div>
        </div><span class="cmc-go">→</span>
      </button>`).join("")}</div>`:""}

    <div class="cat-head"><div class="cat-ic">🔥</div><div><h3 class="cat-name">TRENDING COMMUNITIES</h3><p class="cat-blurb">High engagement right now — activity figures are static demo data.</p></div></div>
    <div class="strip-scroll com-trend">${trending.map(c=>`
      <button class="com-trend-card" onclick="PLAYR_COM.open('${c.id}')">
        ${bg(c)?`<div class="ctc-img" style="background:${bg(c)}"></div>`:`<div class="ctc-img icon">${c.icon||"🏅"}</div>`}
        <div class="ctc-body"><b>${c.name}</b><span class="mono-num">● ${c.act} ACTIVE NOW</span></div>
      </button>`).join("")}</div>

    <div class="cat-head" id="comExplore"><div class="cat-ic">🧭</div><div><h3 class="cat-name">DISCOVER COMMUNITIES</h3><p class="cat-blurb">Find your sport. Find your people.</p></div></div>
    <div class="searchbar com-search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input id="comSearch" placeholder="Search communities, sports or interests…" value="${F.q.replace(/"/g,"&quot;")}" autocomplete="off">
    </div>
    <div class="chip-row">${CATS.map(x=>`<button class="chip ${F.filter===x?"active":""}" onclick="PLAYR_COM.setFilter('${x}')">${x}</button>`).join("")}</div>
    <div class="chip-row">${["ALL"].concat(SPORT_CATS).map(x=>`<button class="chip ${F.cat===x?"active":""}" style="--accent:${x==="PARA-SPORTS"?"#4DA6FF":"var(--lime)"}" onclick="PLAYR_COM.setCat('${x}')">${x}</button>`).join("")}</div>
    <div class="srp-head"><h3>${list.length} communities</h3></div>
    <div class="grid grid-3 com-grid">${list.map(cardHTML).join("")||'<div class="empty-state card"><b>No communities match.</b><p>Try another filter — or create the missing one.</p></div>'}</div>
    <p class="mono-num com-note">JOIN / POST / DISCUSSION ACTIONS ARE STORED LOCALLY IN THIS PROTOTYPE — THEY CONNECT TO THE PLAYR DATABASE AT LAUNCH.</p>
  </div>`;
  const inp=document.getElementById("comSearch");
  if(inp){ let t; inp.addEventListener("input",()=>{ clearTimeout(t); t=setTimeout(()=>{ F.q=inp.value; render(); const i2=document.getElementById("comSearch"); if(i2){i2.focus(); i2.setSelectionRange(i2.value.length,i2.value.length);} },160); }); }
}
function cardHTML(c){
  const j=isJoined(c.id);
  return `<div class="com-card card" onclick="PLAYR_COM.open('${c.id}')" tabindex="0" role="button" aria-label="${c.name} community, ${fmt(c.members)} members">
    ${bg(c)?`<div class="coc-img" style="background:${bg(c)}"></div>`:`<div class="coc-img icon" style="--a:${c.cat==="PARA-SPORTS"?"#4DA6FF":"var(--lime)"}">${c.icon||"🏅"}</div>`}
    <div class="coc-body">
      <div class="coc-tags mono-num"><span>${c.sport.toUpperCase()}</span>${c.city&&c.city!=="India"?`<span class="loc">📍 ${c.city.toUpperCase()}</span>`:""}<span>${c.type}</span></div>
      <b class="coc-name">${c.name}</b>
      <p class="coc-desc">${c.desc}</p>
      <div class="coc-foot mono-num">
        <span>${fmt(c.members)} MEMBERS</span>
        <span class="act">● ${c.act} ACTIVE NOW</span>
        ${j?'<span class="joined">✓ JOINED</span>':""}
      </div>
      <button class="btn ${j?"btn-ghost":"btn-primary"} btn-sm coc-join" onclick="event.stopPropagation();PLAYR_COM.join('${c.id}',this)">${j?"JOINED":"JOIN COMMUNITY"}</button>
    </div>
  </div>`;
}

/* ---------- detail ---------- */
let openId=null, tab="feed";
function openDetail(id){
  const c=all().find(x=>x.id===id); if(!c) return;
  openId=id; tab="feed";
  const root=document.getElementById("communitiesRoot");
  renderDetail();
  window.scrollTo({top:0});
}
function renderDetail(){
  const c=all().find(x=>x.id===openId); if(!c) return;
  const root=document.getElementById("communitiesRoot");
  const j=isJoined(c.id);
  const tabs=["feed","discussions","events","challenges","members","about"];
  root.innerHTML=`
  <button class="btn btn-ghost btn-sm" onclick="PLAYR_COM.back()">← All communities</button>
  <div class="com-detail-hero" style="${bg(c)?`background:${bg(c)};`:`background:linear-gradient(135deg, rgba(77,166,255,.25), #141519);`}">
    <div class="com-dh-veil"></div>
    <div class="com-dh-in">
      <div class="com-dh-tags mono-num"><span>${c.sport.toUpperCase()}</span>${c.city&&c.city!=="India"?`<span>📍 ${c.city.toUpperCase()}</span>`:""}<span>${c.type}</span></div>
      <h1>${c.name.toUpperCase()}</h1>
      <p>${c.desc}</p>
      <div class="com-dh-stats mono-num"><span><b>${fmt(c.members)}</b> MEMBERS</span><span><b>${c.act}</b> ACTIVE NOW</span></div>
      <div class="com-dh-actions">
        <button class="btn ${j?"btn-ghost":"btn-primary"}" onclick="PLAYR_COM.join('${c.id}',this,true)">${j?"JOINED ✓":"JOIN"}</button>
        ${c.cat==="PARA-SPORTS"?'<button class="btn btn-ghost" onclick="switchView(\'spcl\')">SPCL PLAYERS →</button>':""}
      </div>
    </div>
  </div>
  <div class="su-tabs com-tabs">${tabs.map(t=>`<div class="su-tab ${tab===t?"active":""}" data-t="${t}" onclick="PLAYR_COM.setTab('${t}')">${t.toUpperCase()}</div>`).join("")}</div>
  <div id="comPanel"></div>`;
  renderPanel(c);
}
function renderPanel(c){
  const el=document.getElementById("comPanel"); if(!el) return;
  const posts=read(LSK_P)[c.id]||[];
  if(tab==="feed"){
    const seeded=seedPosts(c);
    el.innerHTML=`
    <div class="com-postbox card">
      <textarea id="comPostTxt" rows="2" placeholder="Share something with ${c.name}… (stored locally in this prototype)" maxlength="400"></textarea>
      <div class="com-pb-row mono-num"><span id="comPostCount">0/400</span>
        <button class="btn btn-primary btn-sm" onclick="PLAYR_COM.post()">POST</button></div>
    </div>
    ${(posts.slice().reverse()).map(p=>userPostHTML(p)).join("")}
    ${seeded.map((p,i)=>`
      <div class="card com-post">
        <div class="spcl-post-head"><div class="sa-av sm" style="--a:var(--lime)">${p.who.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
          <div><b>${p.who}</b><div class="mono-num spcl-post-meta">${p.kind.toUpperCase()} · ${p.t} · DEMO POST</div></div></div>
        <p>${p.txt}</p>
        <div class="spcl-post-actions">
          <button onclick="SPCL.like(this,${p.likes})">♥ <span>${fmt(p.likes)}</span></button>
          <button onclick="showToast('Comments open with the community backend')">💬 ${p.com}</button>
          <button onclick="showToast('Link copied')">↗ Share</button>
          <button onclick="showToast('Saved')">🔖 Save</button>
          <button class="warn" onclick="PLAYR_COM.report('post')">⚑ Report</button>
        </div>
      </div>`).join("")}`;
    const ta=document.getElementById("comPostTxt");
    if(ta) ta.addEventListener("input",()=>{ document.getElementById("comPostCount").textContent=ta.value.length+"/400"; });
  }
  else if(tab==="discussions"){
    const userD=(read(LSK_D)[c.id]||[]);
    const allD=userD.concat(seedDisc(c));
    el.innerHTML=`
    <div class="com-disc-new card">
      <input id="comDiscTitle" placeholder="Start a discussion — ask the community anything…" maxlength="120">
      <button class="btn btn-primary btn-sm" onclick="PLAYR_COM.newDiscussion()">CREATE DISCUSSION</button>
    </div>
    ${allD.map(d=>`
      <div class="card com-disc" onclick="PLAYR_COM.openDiscussion('${c.id}','${d.id}')">
        <b>${d.title}</b>
        <div class="mono-num cod-meta"><span>by ${d.by}</span><span>💬 ${d.replies} replies</span><span>♥ ${d.likes}</span><span>${d.when}</span></div>
      </div>`).join("")}`;
  }
  else if(tab==="events"){
    const evs=findEvents(c);
    el.innerHTML= evs.length? evs.map(e=>`
      <div class="card" style="padding:22px 24px;margin-bottom:12px;display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap;">
        <div><b>${e.name}</b><div class="mono-num" style="color:var(--muted);font-size:11.5px;margin-top:6px;">${PLAYR_EV.fmtDate(e.start)} · ${e.area}, ${e.city} · ${e.isDemo?"DEMO":"VERIFIED"}</div></div>
        <button class="btn btn-ghost btn-sm" onclick="openEventDetail('${e.id}')">VIEW EVENT</button>
      </div>`).join("") : `<div class="empty-state card"><b>No ${c.sport} events listed yet.</b><p>Browse the full PLAYR events engine — Mumbai first, then all of India.</p><button class="btn btn-ghost btn-sm" style="margin-top:12px;" onclick="switchView('events')">EXPLORE EVENTS</button></div>`;
  }
  else if(tab==="challenges"){
    const chs=findChallenges(c);
    el.innerHTML= chs.length? chs.map(ch=>`
      <div class="card" style="padding:22px 24px;margin-bottom:12px;display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap;border-left:3px solid var(--lime);">
        <div><b>${ch.title}</b><div class="mono-num" style="color:var(--muted);font-size:11.5px;margin-top:6px;">${ch.cat} · ${ch.participants.toLocaleString("en-IN")} PLAYERS · +${ch.xp.toLocaleString("en-IN")} XP · ${ch.daysLeft} DAYS LEFT</div></div>
        <button class="btn btn-primary btn-sm" onclick="PLAYR_CH.join('${ch.id}',this)">JOIN CHALLENGE</button>
      </div>`).join("") : `<div class="empty-state card"><b>No live ${c.sport} challenges.</b><p>Open PLAYR Challenges to browse every active competition.</p><button class="btn btn-ghost btn-sm" style="margin-top:12px;" onclick="switchView('challenges')">BROWSE CHALLENGES</button></div>`;
  }
  else if(tab==="members"){
    const av=window.PLAYR_USERS?Object.keys(PLAYR_USERS):[];
    el.innerHTML=`<div class="grid grid-4">${av.slice(0,8).map((n,i)=>`
      <div class="card" style="padding:18px;display:flex;align-items:center;gap:12px;">
        ${AV.html({name:n,size:40})}
        <div><b style="font-size:13px;">${n}</b><div class="mono-num" style="font-size:9px;color:var(--muted);">${i===0?"ADMIN · "+(PLAYR_USERS[n].sport||"").toUpperCase():"MEMBER · "+(PLAYR_USERS[n].sport||"").toUpperCase()}</div></div>
      </div>`).join("")}</div>
      <p class="mono-num com-note">DEMO MEMBER LIST — REAL ROSTERS SHIP WITH THE BACKEND.</p>`;
  }
  else if(tab==="about"){
    el.innerHTML=`<div class="com-about card">
      <div class="eyebrow">About</div>
      <p style="color:var(--muted);font-size:14px;line-height:1.75;">${c.desc}</p>
      <div class="eyebrow" style="margin-top:18px;">Community rules</div>
      <ul>${(c.rules||["Be kind — banter is fine, abuse is not.","No spam or unsolicited selling.","Keep it on-sport; use #general for anything else."]).map(r=>`<li>${r}</li>`).join("")}</ul>
      <div class="eyebrow" style="margin-top:18px;">Safety &amp; moderation</div>
      <div class="com-mod-grid">
        <button onclick="PLAYR_COM.report('post')">⚑ Report post</button>
        <button onclick="PLAYR_COM.report('user')">⚑ Report user</button>
        <button onclick="showToast('User muted (local prototype state)')">🔇 Mute user</button>
        <button onclick="showToast('User blocked (local prototype state)">⛔ Block user</button>
        <button onclick="PLAYR_COM.guidelines()">📜 Community guidelines</button>
        <button onclick="showToast('Admin tools (remove/pin/manage) activate with the backend — structured and ready.')">🛡 Admin controls</button>
      </div>
      <p class="mono-num com-note">MODERATION ACTIONS ARE WIRED TO THE UI AND STRUCTURED FOR THE BACKEND — NOTHING IS CLAIMED TO BE LIVE POLICY ENFORCEMENT YET.</p>
    </div>`;
  }
}
function userPostHTML(p){
  return `<div class="card com-post mine">
    <div class="spcl-post-head"><div class="sa-av sm" style="--a:var(--lime)">${p.who.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
      <div><b>${p.who}</b><div class="mono-num spcl-post-meta">YOU · JUST NOW · STORED LOCALLY</div></div>
      <button class="warn" style="margin-left:auto;" onclick="PLAYR_COM.deletePost('${p.id}')">DELETE</button></div>
    <p>${p.txt.replace(/</g,"&lt;")}</p>
    <div class="spcl-post-actions"><button onclick="SPCL.like(this,0)">♥ <span>0</span></button><button onclick="showToast('Comments open with the community backend')">💬 0</button><button onclick="showToast('Link copied')">↗ Share</button><button onclick="showToast('Saved')">🔖 Save</button><button class="warn" onclick="PLAYR_COM.report('post')">⚑ Report</button></div>
  </div>`;
}
function findEvents(c){
  if(!window.PLAYR_EV) return [];
  const sportMap={"Running":["running"],"Football":["football"],"Cricket":["cricket"],"Cycling":["cycling"],"Basketball":["basketball"],"Swimming":["aquatics"],"Tennis":["tennis"],"Badminton":["badminton"],"Trekking":["trekking"],"Mountaineering":["mountaineering","trekking"],"Formula 1":["motorsport"],"Boxing":["boxing","judo"],"SPCL PLAYERS":null};
  const keys=sportMap[c.sport];
  if(keys===null) return PLAYR_EV.EVENTS.filter(e=>e.para).slice(0,3);
  if(!keys) return [];
  return PLAYR_EV.EVENTS.filter(e=>e.status!=="COMPLETED"&&keys.includes(e.sport)).sort((a,b)=>a.start-b.start).slice(0,3);
}
function findChallenges(c){
  if(!window.PLAYR_CH||!PLAYR_CH.lookup) return [];
  const map={"Running":["run-streak-30","run-50k-month","10k-weekend"],"Cycling":["cycle-100k"],"Football":["keepy-uppy-100","skills-football"],"Cricket":["yorker-drill","t20-fantasy"],"Basketball":["free-throws-50"],"Swimming":["swim-10k"],"Trekking":["trek-steps"],"Mountaineering":["trek-steps"],"Fitness":["pushup-100","core-21"],"Boxing":["pushup-100"],"Chess":["blitz-streak"]};
  return (map[c.sport]||[]).map(id=>PLAYR_CH.lookup(id)).filter(Boolean).slice(0,3);
}

/* ---------- actions ---------- */
window.PLAYR_COM={
  render, open:openDetail,
  back(){ render(); window.scrollTo({top:0}); },
  setTab(t){ tab=t; document.querySelectorAll(".com-tabs .su-tab").forEach(x=>x.classList.toggle("active",x.dataset.t===t)); const c=all().find(x=>x.id===openId); renderPanel(c); },
  setFilter(f){ F.filter=f; render(); },
  setCat(c){ F.cat=c; render(); },
  explore(){ const el=document.getElementById("comExplore"); if(el&&el.scrollIntoView) el.scrollIntoView({behavior:"smooth"}); },
  join(id,btn,fromDetail){
    const j=read(LSK_J); const c=all().find(x=>x.id===id); if(!c) return;
    if(j[id]){ delete j[id]; showToast("Left "+c.name); } else { j[id]={when:Date.now()}; showToast("Joined "+c.name+" ✓ (saved locally in this prototype)"); pushNotif(c.name,"Community announcement — welcome aboard! Check the feed."); }
    write(LSK_J,j);
    if(fromDetail){ renderDetail(); } else { render(); }
  },
  post(){
    const c=all().find(x=>x.id===openId);
    const ta=document.getElementById("comPostTxt"); if(!ta||!ta.value.trim()||!c) return;
    const txt=ta.value.trim();
    if(spammy(txt)){ showToast("Hold on — that looks like spam. Rephrase and try again."); return; }
    const u=(window.PLAYR_AUTH&&PLAYR_AUTH.user)?PLAYR_AUTH.user.name:"You";
    const store=read(LSK_P); (store[c.id]=store[c.id]||[]).push({id:"p"+Date.now(),who:u,txt,t:"just now"}); write(LSK_P,store);
    renderPanel(c); showToast("Posted to "+c.name+" (local prototype)");
  },
  deletePost(pid){
    const c=all().find(x=>x.id===openId); const store=read(LSK_P);
    if(store[c.id]) store[c.id]=store[c.id].filter(p=>p.id!==pid);
    write(LSK_P,store); renderPanel(c); showToast("Post removed");
  },
  newDiscussion(){
    const inp=document.getElementById("comDiscTitle"); const c=all().find(x=>x.id===openId);
    if(!inp||!inp.value.trim()||!c) return;
    if(spammy(inp.value)){ showToast("That title looks like spam — try again."); return; }
    const u=(window.PLAYR_AUTH&&PLAYR_AUTH.user)?PLAYR_AUTH.user.name:"You";
    const store=read(LSK_D); (store[c.id]=store[c.id]||[]).unshift({id:c.id+"-u"+Date.now(),title:inp.value.trim().replace(/</g,"&lt;"),by:u,replies:0,likes:0,when:"now"});
    write(LSK_D,store); renderPanel(c); showToast("Discussion created (local prototype)");
  },
  openDiscussion(cid,did){
    const c=all().find(x=>x.id===cid);
    const d=[(read(LSK_D)[cid]||[]),seedDisc(c)].flat().find(x=>x.id===did); if(!d) return;
    openSheet(`<b>${d.title}</b><div class="mono-num" style="color:var(--muted);font-size:11px;margin:8px 0 14px;">by ${d.by} · ${d.replies} replies</div>
      <div class="com-replybox card"><textarea placeholder="Write a reply… (local prototype)" rows="2"></textarea><button class="btn btn-primary btn-sm" onclick="showToast('Reply stored locally when the community backend ships')">REPLY</button></div>
      <p class="mono-num com-note">REPLIES, LIKES AND REPORTS ARE STRUCTURED FOR THE BACKEND.</p>`);
  },
  report(kind){ openSheet(`<b>Report ${kind}</b><p style="color:var(--muted);font-size:13.5px;line-height:1.7;margin:10px 0 14px;">Reports flag content to community admins and PLAYR moderation. In this prototype nothing is transmitted — the flow activates with the backend.</p>
    <div style="display:flex;flex-direction:column;gap:8px;">
    ${["Spam","Harassment or abuse","Hate speech","Misinformation","Something else"].map(r=>`<button class="btn btn-ghost btn-sm" style="justify-content:flex-start;" onclick="showToast('Report recorded (prototype) — thank you'); PLAYR_AUTH_UI.closeSheet();">${r}</button>`).join("")}</div>`); },
  guidelines(){ openSheet(`<b>PLAYR Community Guidelines</b>
    <ul style="margin:12px 0 0 18px;color:var(--muted);font-size:13.5px;line-height:1.9;">
      <li><b style="color:var(--text)">Athlete-first, always.</b> Banter yes, abuse never.</li>
      <li><b style="color:var(--text)">No spam or scams.</b> Automated posting is removed.</li>
      <li><b style="color:var(--text)">Respect officials and classifications.</b> Never speculate about an individual's classification or health.</li>
      <li><b style="color:var(--text)">Safety over stunts.</b> No encouragement of risky challenges.</li>
      <li><b style="color:var(--text)">Report, don't retaliate.</b> Moderators review every report.</li>
    </ul>`); },
  create(){
    const ov=document.createElement("div"); ov.id="comCreateModal"; ov.className="a-overlay";
    const sports=["Running","Football","Cricket","Cycling","Basketball","Swimming","Tennis","Badminton","Trekking","Mountaineering","Formula 1","Fitness","Boxing","Chess","Skiing","Pickleball"];
    ov.innerHTML=`<div class="ch-create card" role="dialog" aria-label="Create community">
      <button class="a-close" aria-label="Close" onclick="PLAYR_COM.closeCreate()">✕</button>
      <h3 class="ch-create-title">CREATE YOUR COMMUNITY.</h3>
      <div class="ch-form">
        <label class="a-field"><span>COMMUNITY NAME *</span><input id="cc-name" placeholder="e.g. Andheri Night Cyclists"></label>
        <div class="cc-row">
          <label class="a-field"><span>SPORT *</span><select id="cc-sport">${sports.map(s=>`<option>${s}</option>`).join("")}</select></label>
          <label class="a-field"><span>LOCATION</span><input id="cc-loc" placeholder="Mumbai"></label>
        </div>
        <label class="a-field"><span>DESCRIPTION *</span><input id="cc-desc" placeholder="What is this community about?"></label>
        <div class="cc-row">
          <label class="a-field"><span>TYPE</span><select id="cc-type"><option>PUBLIC</option><option>LOCAL</option><option>SPORT-SPECIFIC</option><option>PRIVATE</option></select></label>
          <label class="a-field"><span>CATEGORY</label><select id="cc-cat">${SPORT_CATS.map(s=>`<option>${s}</option>`).join("")}</select></label>
        </div>
        <label class="a-field"><span>RULES (one per line)</span><textarea id="cc-rules" rows="2" placeholder="Be encouraging&#10;No spam"></textarea></label>
        <p class="cc-err" id="cc-err" style="display:none;"></p>
        <button class="btn btn-primary" onclick="PLAYR_COM.submitCreate(this)">CREATE</button>
        <p class="cc-fine mono-num">PROTOTYPE: THE COMMUNITY IS SAVED LOCALLY IN YOUR BROWSER. IT SYNCS TO THE PLAYR DATABASE WHEN THE BACKEND SHIPS.</p>
      </div></div>`;
    document.body.appendChild(ov);
  },
  closeCreate(){ const m=document.getElementById("comCreateModal"); if(m) m.remove(); },
  submitCreate(btn){
    const v=id=>((document.getElementById(id)||{}).value||"").trim();
    const err=document.getElementById("cc-err");
    if(!v("cc-name")||!v("cc-desc")){ err.textContent="Please complete this field."; err.style.display="block"; return; }
    err.style.display="none"; btn.disabled=true; btn.textContent="CREATING…";
    setTimeout(()=>{
      const id="custom-com-"+Date.now().toString(36);
      const store=read(LSK_C);
      store[id]={id,name:v("cc-name"),sport:v("cc-sport"),cat:v("cc-cat")||"EMERGING SPORTS",city:v("cc-loc")||"India",type:v("cc-type")||"PUBLIC",
        members:1,act:1,isNew:true,created:true,desc:v("cc-desc"),rules:v("cc-rules")?v("cc-rules").split("\n").map(x=>x.trim()).filter(Boolean):undefined};
      write(LSK_C,store);
      const j=read(LSK_J); j[id]={when:Date.now()}; write(LSK_J,j);
      PLAYR_COM.closeCreate(); F.filter="MY COMMUNITIES"; render();
      showToast('Community created — saved locally in this prototype ✓');
    },500);
  }
};
function openSheet(inner){
  const UI=window.PLAYR_AUTH_UI;
  if(UI&&UI.closeSheet){ /* reuse auth sheet */ }
  const old=document.getElementById("comSheet"); if(old) old.remove();
  const ov=document.createElement("div"); ov.id="comSheet"; ov.className="a-overlay";
  ov.addEventListener("click",e=>{ if(e.target===ov) ov.remove(); });
  ov.innerHTML=`<div class="a-sheet"><button class="a-close" onclick="document.getElementById('comSheet').remove()">✕</button><div class="com-sheet-body">${inner}</div></div>`;
  document.body.appendChild(ov);
}
function spammy(t){
  if(t.length<2) return true;
  if(/(https?:\/\/\S+\s*){3,}/i.test(t)) return true;   // link spam
  if(/\b\d{10}\b/.test(t)) return true;                    // phone-number dumps
  if(/^[\s\d+]*$/.test(t)) return true;                     // empty/numeric-only
  if(/(.)\1{6,}/.test(t)) return true;                       // character flooding
  return false;
}
function pushNotif(t,s){
  const dd=document.getElementById("dd-notif"); if(!dd) return;
  const div=document.createElement("div"); div.className="dropdown-item";
  div.innerHTML=`<div class="dd-avatar" style="background:linear-gradient(135deg,var(--lime),var(--cyan));"></div><div><div class="dd-title">${t}</div><div class="dd-sub">${s} · now</div></div>`;
  dd.prepend(div);
}

/* legacy bridge: old components call toggleJoin(this,name) */
window.PLAYR_COMMUNITIES=DATA;
window.COMMUNITIES=DATA.map(c=>({n:c.name,members:fmt(c.members)+" members",img:(SPORT_KEY[c.sport]?P.sport(SPORT_KEY[c.sport],DATA.indexOf(c)):"") }));
window.toggleJoin=function(btn,name){ btn.classList.toggle("joined"); const j=btn.classList.contains("joined"); btn.textContent=j?"Joined":"Join"; showToast(j?`Joined ${name} ✓ (local prototype)`:`Left ${name}`); };
window.renderCommunitiesView=render;
window.PLAYR_COM_BG=function(c){ if(c.noImg) return "linear-gradient(135deg, rgba(77,166,255,.3), #141519)"; return P.bg(SPORT_KEY[c.sport]||"running", DATA.indexOf(c), 800, 500); };
window.initCommunities=render;
})();
