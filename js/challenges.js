/* ============================================================
   PLAYR — CHALLENGES v2
   Compete. Complete. Conquer.
   Featured hero · categories · cards · trending · leaderboard ·
   my challenges · details modal · achievements · create form.
   Avatars: central AV system (gender from profile only).
   ============================================================ */
(function(){
"use strict";
const U=window.PLAYR_USERS, fmt=n=>n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e3?(n/1e3).toFixed(1).replace(/\.0$/,"")+"K":""+n;
const today=()=>new Date();

/* ---------- CHALLENGE CATALOG (reusable data structure) ---------- */
const CATALOG=[
  {id:"run-streak-30",title:"30 DAY RUNNING STREAK",sport:"Running",cat:"RUNNING",icon:"🏃",difficulty:"Intermediate",duration:"30 days",goal:"30 sessions",participants:2481,progress:76,xp:3200,daysLeft:12,featured:1,live:1,
   desc:"Complete at least one running session every day for 30 consecutive days.",
   rules:["Minimum 1 KM per session","One valid session per day","GPS verification where applicable","Missing a day breaks the streak"],trend:"+312 today"},
  {id:"run-50k-month",title:"RUN 50K THIS MONTH",sport:"Running",cat:"RUNNING",icon:"🏃",difficulty:"Intermediate",duration:"1 month",goal:"50 KM",participants:1248,progress:78,xp:500,daysLeft:8,trend:"+188 today"},
  {id:"10k-weekend",title:"10K WEEKEND SPRINT",sport:"Running",cat:"RUNNING",icon:"⏱",difficulty:"Beginner",duration:"1 weekend",goal:"10 KM",participants:1863,progress:92,xp:300,daysLeft:2,live:1,trend:"+500 today"},
  {id:"pushup-100",title:"100 PUSH-UPS A DAY",sport:"Fitness",cat:"FITNESS",icon:"💪",difficulty:"Intermediate",duration:"14 days",goal:"1,400 reps",participants:942,progress:64,xp:450,daysLeft:9,trend:"+320 today"},
  {id:"core-21",title:"21-DAY CORE CHALLENGE",sport:"Fitness",cat:"FITNESS",icon:"🔥",difficulty:"Beginner",duration:"21 days",goal:"21 sessions",participants:763,progress:55,xp:400,daysLeft:14,isnew:1},
  {id:"yorker-drill",title:"YORKER ACCURACY DRILL",sport:"Cricket",cat:"CRICKET",icon:"🏏",difficulty:"Advanced",duration:"2 weeks",goal:"50 hits",participants:655,progress:41,xp:350,daysLeft:11},
  {id:"t20-fantasy",title:"T20 PREDICTION LEAGUE",sport:"Cricket",cat:"CRICKET",icon:"🏆",difficulty:"Beginner",duration:"Season",goal:"Match weeks",participants:2104,progress:60,xp:800,daysLeft:20,community:1},
  {id:"keepy-uppy-100",title:"100 KEEPY-UPPYS",sport:"Football",cat:"FOOTBALL",icon:"⚽",difficulty:"Intermediate",duration:"10 days",goal:"100 touches",participants:1187,progress:72,xp:400,daysLeft:6},
  {id:"skills-football",title:"FOOTBALL SKILLS CHALLENGE",sport:"Football",cat:"FOOTBALL",icon:"⚽",difficulty:"Advanced",duration:"1 week",goal:"Skill reel",participants:834,progress:48,xp:600,daysLeft:5,trend:"+210 today"},
  {id:"free-throws-50",title:"50 FREE THROWS",sport:"Basketball",cat:"BASKETBALL",icon:"🏀",difficulty:"Intermediate",duration:"1 day",goal:"50 shots",participants:512,progress:88,xp:250,daysLeft:3},
  {id:"cycle-100k",title:"CYCLING 100K",sport:"Cycling",cat:"CYCLING",icon:"🚴",difficulty:"Advanced",duration:"1 month",goal:"100 KM",participants:1096,progress:52,xp:700,daysLeft:13,trend:"+180 today"},
  {id:"swim-10k",title:"SWIM 10K THIS MONTH",sport:"Swimming",cat:"SWIMMING",icon:"🏊",difficulty:"Elite",duration:"1 month",goal:"10 KM",participants:421,progress:39,xp:900,daysLeft:16},
  {id:"trek-steps",title:"10K STEPS × 7 TREK WEEK",sport:"Trekking",cat:"ADVENTURE",icon:"🥾",difficulty:"Beginner",duration:"7 days",goal:"70K steps",participants:1388,progress:83,xp:350,daysLeft:4},
  {id:"blitz-streak",title:"5-MIN BLITZ STREAK",sport:"Chess",cat:"SKILLS",icon:"♟",difficulty:"Intermediate",duration:"7 days",goal:"21 games",participants:974,progress:67,xp:400,daysLeft:7},
  {id:"cube-sub30",title:"CUBE UNDER 30 SECONDS",sport:"Speedcubing",cat:"SKILLS",icon:"🧩",difficulty:"Advanced",duration:"2 weeks",goal:"Sub-30 solve",participants:356,progress:45,xp:500,daysLeft:10,isnew:1},
  {id:"city-relay",title:"MUMBAI CITY RELAY",sport:"Community",cat:"COMMUNITY",icon:"🤝",difficulty:"Beginner",duration:"1 weekend",goal:"Team legs",participants:1620,progress:90,xp:300,daysLeft:2,community:1,live:1}
];
const CATS=["ALL","FITNESS","RUNNING","CRICKET","FOOTBALL","BASKETBALL","CYCLING","SWIMMING","ADVENTURE","SKILLS","COMMUNITY"];
const DIFF_CLS={"Beginner":"d-beg","Intermediate":"d-int","Advanced":"d-adv","Elite":"d-elite"};

/* joined state (persists per session) */
const LSK="playr_ch_v2_joined", LSKC="playr_ch_v2_created";
const joined=()=>{ try{ return JSON.parse(localStorage.getItem(LSK))||{}; }catch(e){ return {}; } };
const saveJoined=j=>{ try{ localStorage.setItem(LSK,JSON.stringify(j)); }catch(e){} };
const created=()=>{ try{ return JSON.parse(localStorage.getItem(LSKC))||[]; }catch(e){ return []; } };

let state={cat:"ALL", loading:false, myTab:"active"};
let detailId=null;

/* ---------- LEADERBOARD (gender from PLAYR_USERS only) ---------- */
const BOARD=[
  ["Arjun Mehta",96,2450,21],["Rhea Kapoor",94,2310,12],["Kabir Shah",91,2180,9],
  ["Ava Chen",89,3120,18],["Farhan Ali",85,1615,7],["Meera Nair",82,1090,8],
  ["Ishaan Verma",80,1320,10],["Simran Gill",77,980,4],["Dev Solanki",74,740,1],["Zoya Khan",71,860,5]
].map((r,i)=>({rank:i+1,name:r[0],progress:r[1],xp:r[2],streak:r[3],gender:U[r[0]].gender,sport:U[r[0]].sport}));

const ACHIEVEMENTS=[
  {icon:"🏆",name:"FIRST CHALLENGE",desc:"Completed your first challenge.",got:1},
  {icon:"🔥",name:"7 DAY STREAK",desc:"Completed challenges for 7 consecutive days.",got:1},
  {icon:"⚡",name:"SPEED DEMON",desc:"Completed a speed-based challenge.",got:0},
  {icon:"💪",name:"10 CHALLENGES",desc:"Completed 10 challenges.",got:0},
  {icon:"🌎",name:"COMMUNITY PLAYER",desc:"Participated in a community challenge.",got:1}
];

/* ---------- render helpers ---------- */
const daysLabel=c=>c.daysLeft<=1?"FINAL DAY":c.daysLeft+" DAYS LEFT";
function cardHTML(c){
  const j=joined()[c.id];
  const prog=j&&j.progress!=null?j.progress:c.progress;
  return `<div class="ch2-card ${c.featured?"feat":""}" data-id="${c.id}" style="--acc:${catAccent(c.cat)}" tabindex="0" role="button" aria-label="${c.title} challenge, ${c.difficulty}, ${daysLabel(c)}" onclick="PLAYR_CH.open('${c.id}')">
    <div class="ch2-media">${mediaInner(c)}</div>
    <div class="ch2-body">
      <div class="ch2-tags"><span class="ch2-cat">${c.icon} ${c.cat}</span><span class="ch2-diff ${DIFF_CLS[c.difficulty]}">${c.difficulty.toUpperCase()}</span></div>
      <h4 class="ch2-title">${c.title}</h4>
      <div class="ch2-progress"><div class="ch2-bar"><i style="width:${prog}%"></i></div><span class="mono-num">${prog}%</span></div>
      <div class="ch2-meta mono-num">
        <span>👥 ${c.participants.toLocaleString("en-IN")} PLAYERS</span><span>⏱ ${c.duration}</span><span>⚡ +${c.xp.toLocaleString("en-IN")} XP</span><span class="ch2-days">${daysLabel(c)}</span>
      </div>
      <div class="ch2-actions">
        <button class="btn ${j?"btn-ghost":"btn-primary"} btn-sm ch2-join" data-id="${c.id}" onclick="event.stopPropagation();PLAYR_CH.join('${c.id}',this)">${j?"JOINED ✓":"JOIN CHALLENGE"}</button>
        <button class="ch2-details" onclick="event.stopPropagation();PLAYR_CH.open('${c.id}')">Details</button>
      </div>
    </div>
  </div>`;
}
function mediaInner(c){
  const badges=(c.live?'<span class="ch2-b live"><span class="dot-w"></span>LIVE</span>':'')+(c.trend?`<span class="ch2-b trend">↑ ${c.trend.replace(" today","")}/DAY</span>`:"")+(c.isnew?'<span class="ch2-b new">NEW</span>':"");
  return `<span class="ch2-glyph">${c.icon}</span>${badges}`;
}
function catAccent(cat){
  return {FITNESS:"#FF6A4D",RUNNING:"#E0F808",CRICKET:"#E0F808",FOOTBALL:"#46E0FF",BASKETBALL:"#FF9E3D",CYCLING:"#46E0FF",SWIMMING:"#46E0FF",ADVENTURE:"#B98CFF",SKILLS:"#FF8CD8",COMMUNITY:"#7FA8FF"}[cat]||"#E0F808";
}

/* ---------- main render ---------- */
function render(){
  const root=document.getElementById("challengesRoot"); if(!root) return;
  const all=CATALOG.concat(created());
  const list=state.cat==="ALL"?all:all.filter(c=>c.cat===state.cat);
  const featured=all.find(c=>c.featured);
  const trending=all.filter(c=>c.trend).slice(0,4);
  const user=window.PLAYR_AUTH?PLAYR_AUTH.user:null;
  const j=joined();

  root.innerHTML=`
  <!-- HERO -->
  <div class="ch-hero">
    <div class="ch-hero-bg"></div>
    <div class="wrap ch-hero-grid">
      <div class="ch-hero-copy">
        <div class="eyebrow">PLAYR Challenges</div>
        <h1>COMPETE.<br>COMPLETE.<br><span>CONQUER.</span></h1>
        <p>Take on challenges, compete with the community, build your streak and prove what you can do.</p>
        <button class="btn btn-primary" onclick="PLAYR_CH.create()">+ CREATE CHALLENGE</button>
      </div>
      ${featured?featuredHTML(featured):""}
    </div>
  </div>

  <!-- MY CHALLENGES / JOIN PROMPT -->
  <div class="wrap ch-sec" id="myChWrap">${user?myChallengesHTML(user,j):joinPromptHTML()}</div>

  <!-- CATEGORIES -->
  <div class="wrap ch-sec">
    <div class="ch-cats" id="chCats">${CATS.map(c=>`<button class="ch-cat ${state.cat===c?"on":""}" onclick="PLAYR_CH.setCat('${c}')">${c}</button>`).join("")}</div>
    <div id="chGridWrap">${state.loading?skeletonHTML(4):`<div class="ch-grid">${list.map(cardHTML).join("")}</div>${!list.length?emptyHTML():""}`}</div>
  </div>

  <!-- TRENDING -->
  <div class="wrap ch-sec">
    <div class="cat-head"><div class="cat-ic">🔥</div><div><h3 class="cat-name">TRENDING NOW</h3><p class="cat-blurb">Challenges gaining players right now.</p></div></div>
    <div class="ch-trend-row">${trending.map(c=>`
      <button class="ch-trend" style="--acc:${catAccent(c.cat)}" onclick="PLAYR_CH.open('${c.id}')">
        <span class="ctr-ic">${c.icon}</span>
        <span class="ctr-txt"><b>${c.title}</b><i>${c.trend}</i></span>
        ${(c.live?'<span class="ch2-b live"><span class="dot-w"></span>LIVE</span>':'<span class="ch2-b trend">↑ TRENDING</span>')}
      </button>`).join("")}
    </div>
  </div>

  <!-- LEADERBOARD -->
  <div class="wrap ch-sec">
    <div class="cat-head"><div class="cat-ic">🏅</div><div><h3 class="cat-name">CHALLENGE LEADERBOARD</h3><p class="cat-blurb">Top of the PLAYR challenge community this month.</p></div>
      <button class="btn btn-ghost btn-sm" style="margin-left:auto;" onclick="PLAYR_CH.fullBoard()">VIEW FULL LEADERBOARD</button></div>
    <div class="ch-board card">
      <div class="chb-row chb-head mono-num"><span>RANK</span><span>PLAYER</span><span class="chb-h">SPORT</span><span class="chb-h">PROGRESS</span><span class="chb-h">XP</span><span class="chb-h">STREAK</span></div>
      ${BOARD.slice(0,6).map(r=>boardRow(r)).join("")}
    </div>
  </div>

  <!-- ACHIEVEMENTS -->
  <div class="wrap ch-sec">
    <div class="cat-head"><div class="cat-ic">🎖</div><div><h3 class="cat-name">ACHIEVEMENTS</h3><p class="cat-blurb">Badges you earn by competing.</p></div></div>
    <div class="ch-achs">${ACHIEVEMENTS.map(a=>`
      <div class="ch-ach ${a.got?"got":""}">
        <div class="cha-badge"><span>${a.icon}</span></div>
        <b>${a.name}</b><p>${a.desc}</p>
      </div>`).join("")}
    </div>
  </div>`;

  animateProgress(root);
}

function featuredHTML(c){
  const j=joined()[c.id];
  return `<div class="ch-feat card">
    <div class="chf-tag">FEATURED CHALLENGE ${c.live?'<span class="ch2-b live"><span class="dot-w"></span>LIVE</span>':""}</div>
    <div class="chf-head"><span class="chf-glyph">${c.icon}</span>
      <div><h3>${c.title}</h3><div class="mono-num chf-sub">${c.difficulty.toUpperCase()} · ${c.duration.toUpperCase()}</div></div></div>
    <p>${c.desc}</p>
    <div class="chf-stats mono-num">
      <span><b>${c.participants.toLocaleString("en-IN")}</b> PLAYERS</span><span><b>${c.daysLeft}</b> DAYS REMAINING</span><span><b>+${c.xp.toLocaleString("en-IN")}</b> XP</span>
    </div>
    <div class="ch2-progress big"><div class="ch2-bar"><i style="width:${c.progress}%"></i></div><span class="mono-num">${c.progress}%</span></div>
    <button class="btn btn-primary chf-join" data-id="${c.id}" onclick="PLAYR_CH.join('${c.id}',this)">${j?"JOINED ✓":"JOIN CHALLENGE"}</button>
  </div>`;
}
function myChallengesHTML(user,j){
  const joinedList=Object.keys(j).map(id=>CATALOG.concat(created()).find(c=>c.id===id)).filter(Boolean);
  const active=joinedList.filter(c=>(j[c.id].progress!=null?j[c.id].progress:c.progress)<100);
  const done=joinedList.filter(c=>(j[c.id].progress!=null?j[c.id].progress:c.progress)>=100);
  const saved=created();
  const tabs=[["active","Active",active],["completed","Completed",done],["saved","Saved",saved]];
  const list={active,completed:done,saved:saved||[]}[state.myTab]||[];
  const stats=[["CURRENT STREAK",U[user.name]?U[user.name].streak+" days":user.streak||"6 days"],["COMPLETED",done.length+" challenges"],["XP EARNED",fmt(Object.keys(j).reduce((s,id)=>{const c=CATALOG.find(x=>x.id===id);return s+(c?c.xp:0);},0))],["BEST RANK","#"+(2+done.length)]];
  return `<div class="cat-head"><div class="cat-ic">🎯</div><div><h3 class="cat-name">MY CHALLENGES</h3><p class="cat-blurb">Your competition dashboard, ${user.name.split(" ")[0]}.</p></div></div>
  <div class="ch-mystats">${stats.map(s=>`<div class="ch-stat card"><b class="mono-num">${s[1]}</b><span>${s[0]}</span></div>`).join("")}</div>
  <div class="ch-tabs">${tabs.map(t=>`<button class="ch-tab ${state.myTab===t[0]?"on":""}" onclick="PLAYR_CH.myTab('${t[0]}')">${t[1].toUpperCase()} <em>${t[2].length}</em></button>`).join("")}</div>
  ${list.length?`<div class="ch-mylist">${list.map(c=>{
    const p=j[c.id]&&j[c.id].progress!=null?j[c.id].progress:c.progress;
    const goalText=c.id==="run-streak-30"?"23 / 30 DAYS":c.goal;
    return `<div class="ch-my" style="--acc:${catAccent(c.cat)}" onclick="PLAYR_CH.open('${c.id}')">
      <span class="ctr-ic">${c.icon}</span>
      <div class="chm-mid"><b>${c.title}</b>
        <div class="ch2-progress"><div class="ch2-bar"><i style="width:${p}%"></i></div><span class="mono-num">${p}%</span></div>
        <span class="mono-num chm-goal">${goalText}</span></div>
      <span class="chm-days mono-num">${daysLabel(c)}</span></div>`;}).join("")}</div>`
  :`<div class="ch-empty card"><b>You haven't joined any challenges yet.</b><p>Pick one below — most finishers earn their badge in under a month.</p></div>`}`;
}
function joinPromptHTML(){
  return `<div class="ch-joinprompt card">
    <div><div class="eyebrow">Your dashboard</div><h3>TRACK YOUR STREAKS.</h3><p>Join PLAYR to keep your challenges, XP and streak in one place — free.</p></div>
    <div class="ch-jp-btns"><button class="btn btn-primary" onclick="openAuth('signup')">JOIN PLAYR</button><button class="btn btn-ghost" onclick="openAuth('signin')">SIGN IN</button></div>
  </div>`;
}
function boardRow(r,hide){
  const av=window.AV.html({name:r.name,size:40});
  return `<div class="chb-row ${r.rank===1?"gold":""}" ${hide?'style="display:none;"':""}>
    <span class="chb-rank mono-num">${String(r.rank).padStart(2,"0")}</span>
    <span class="chb-player">${av}<b>${r.name}</b></span>
    <span class="chb-h chb-sport">${r.sport}</span>
    <span class="chb-h chb-prog"><div class="ch2-bar sm"><i style="width:${r.progress}%"></i></div><em class="mono-num">${r.progress}%</em></span>
    <span class="chb-h mono-num chb-xp">${fmt(r.xp)} XP</span>
    <span class="chb-h mono-num chb-streak">🔥 ${r.streak}d</span>
  </div>`;
}
function skeletonHTML(n){ return `<div class="ch-grid">${Array.from({length:n}).map(()=>`<div class="ch2-card skel"><div class="ch2-media"></div><div class="ch2-body"><div class="sk-line w60"></div><div class="sk-line w40"></div><div class="sk-line w90"></div><div class="sk-btn"></div></div></div>`).join("")}</div>`; }
function emptyHTML(){ return `<div class="ch-empty card"><b>No challenges available right now.</b><p>Try another category — or create the first one.</p><button class="btn btn-ghost btn-sm" style="margin-top:12px;" onclick="PLAYR_CH.create()">CREATE CHALLENGE</button></div>`; }

function animateProgress(root){
  root.querySelectorAll(".ch2-bar i").forEach(bar=>{
    const w=bar.style.width; bar.style.width="0%";
    requestAnimationFrame(()=>{ bar.style.transition="width 1s cubic-bezier(.2,.7,.2,1)"; bar.style.width=w; });
  });
}

/* ---------- modal: challenge details ---------- */
window.PLAYR_CH={
  open(id){
    const c=CATALOG.concat(created()).find(x=>x.id===id); if(!c) return;
    detailId=id;
    const j=joined()[id];
    const ov=document.createElement("div"); ov.id="chModal"; ov.className="a-overlay";
    ov.addEventListener("click",e=>{ if(e.target===ov) PLAYR_CH.close(); });
    ov.innerHTML=`<div class="ch-modal card" role="dialog" aria-label="${c.title}">
      <button class="a-close" aria-label="Close" onclick="PLAYR_CH.close()">✕</button>
      <div class="chm-hero" style="--acc:${catAccent(c.cat)}">
        <span class="chm-glyph">${c.icon}</span>
        <div class="chm-tags"><span class="ch2-cat">${c.cat}</span><span class="ch2-diff ${DIFF_CLS[c.difficulty]}">${c.difficulty.toUpperCase()}</span>${c.live?'<span class="ch2-b live"><span class="dot-w"></span>LIVE</span>':""}</div>
        <h3>${c.title}</h3>
        <p>${c.desc||"A community challenge on PLAYR."}</p>
      </div>
      <div class="chm-grid">
        <div class="chm-rules"><label class="mono-num">RULES</label>
          <ul>${(c.rules||["Log your activity on PLAYR","One valid entry per day","Recreational — play safe, play fair"]).map(r=>`<li>${r}</li>`).join("")}</ul>
          <label class="mono-num">DURATION</label>
          <p class="chm-line">${c.duration} · ends in ${c.daysLeft} day${c.daysLeft===1?"":"s"}</p>
          <label class="mono-num">REWARD</label>
          <p class="chm-line">+${fmt(c.xp)} XP ${c.featured?"· PLAYR Achievement Badge":""}</p>
        </div>
        <div class="chm-side">
          <div class="chm-stats mono-num">
            <span><b>${c.participants.toLocaleString("en-IN")}</b> PLAYERS</span><span><b>${c.progress}%</b> AVG</span><span><b>+${c.xp.toLocaleString("en-IN")}</b> XP</span>
          </div>
          <div class="ch2-progress big"><div class="ch2-bar"><i style="width:${c.progress}%"></i></div><span class="mono-num">${c.progress}%</span></div>
          <label class="mono-num" style="margin:16px 0 8px; display:block;">TOP OF THE BOARD</label>
          <div class="chm-board">${BOARD.slice(0,3).map(r=>boardRow(r)).join("")}</div>
          <button class="btn btn-primary chm-join" data-id="${c.id}" style="width:100%; margin-top:14px;" onclick="PLAYR_CH.join('${c.id}',this)">${j?"JOINED ✓":"JOIN CHALLENGE"}</button>
        </div>
      </div>
    </div>`;
    document.body.appendChild(ov);
    const bar=ov.querySelector(".ch2-bar i"); if(bar){ const w=bar.style.width; bar.style.width="0%"; requestAnimationFrame(()=>{ bar.style.transition="width 1s cubic-bezier(.2,.7,.2,1)"; bar.style.width=w; }); }
  },
  close(){ const m=document.getElementById("chModal"); if(m) m.remove(); },
  setCat(c){
    state.cat=c;
    document.querySelectorAll("#chCats .ch-cat").forEach(b=>b.classList.toggle("on",b.textContent===c));
    const wrap=document.getElementById("chGridWrap"); if(!wrap) return;
    wrap.innerHTML=skeletonHTML(3);
    setTimeout(()=>{ render(); },260);
  },
  myTab(t){ state.myTab=t; render(); },
  join(id,btn){
    const j=joined();
    if(j[id]){ delete j[id]; saveJoined(j); if(btn){btn.textContent="JOIN CHALLENGE"; btn.classList.remove("btn-ghost"); btn.classList.add("btn-primary");} showToast("Left challenge — your XP stays banked"); }
    else{
      const c=CATALOG.concat(created()).find(x=>x.id===id);
      j[id]={progress:Math.min(99,(c.progress||40)+2),when:new Date().toISOString()};
      saveJoined(j);
      if(btn){btn.textContent="JOINED ✓"; btn.classList.add("btn-ghost"); btn.classList.remove("btn-primary"); btn.style.boxShadow="0 0 24px -6px rgba(224,248,8,.6)"; setTimeout(()=>btn.style.boxShadow="",900);}
      showToast(`Challenge joined ✓ +${c?fmt(c.xp):"500"} XP on completion`);
    }
    const user=window.PLAYR_AUTH?PLAYR_AUTH.user:null;
    if(user){ const w=document.getElementById("myChWrap"); if(w){ w.innerHTML=myChallengesHTML(user,j); } }
  },
  fullBoard(){
    const ov=document.createElement("div"); ov.id="chBoardModal"; ov.className="a-overlay";
    ov.addEventListener("click",e=>{ if(e.target===ov) PLAYR_CH.closeBoard(); });
    ov.innerHTML=`<div class="ch-board modal card" role="dialog" aria-label="Full leaderboard">
      <button class="a-close" aria-label="Close" onclick="PLAYR_CH.closeBoard()">✕</button>
      <h3 class="ch-board-title">CHALLENGE LEADERBOARD</h3>
      <div class="chb-row chb-head mono-num"><span>RANK</span><span>PLAYER</span><span class="chb-h">SPORT</span><span class="chb-h">PROGRESS</span><span class="chb-h">XP</span><span class="chb-h">STREAK</span></div>
      ${BOARD.map(r=>boardRow(r)).join("")}
    </div>`;
    document.body.appendChild(ov);
  },
  closeBoard(){ const m=document.getElementById("chBoardModal"); if(m) m.remove(); },

  /* ---------- CREATE CHALLENGE ---------- */
  create(){
    const ov=document.createElement("div"); ov.id="chCreate"; ov.className="a-overlay";
    const sports=["Running","Cycling","Fitness","Cricket","Football","Basketball","Swimming","Trekking","Chess","Speedcubing","Community"];
    ov.innerHTML=`<div class="ch-create card" role="dialog" aria-label="Create challenge">
      <button class="a-close" aria-label="Close" onclick="PLAYR_CH.closeCreate()">✕</button>
      <h3 class="ch-create-title">CREATE A CHALLENGE.</h3>
      <div class="ch-form">
        <label class="a-field"><span>CHALLENGE NAME *</span><input id="cc-name" placeholder="e.g. Morning 5K × 14 days"></label>
        <div class="cc-row">
          <label class="a-field"><span>SPORT *</span><select id="cc-sport">${sports.map(s=>`<option>${s}</option>`).join("")}</select></label>
          <label class="a-field"><span>CATEGORY *</span><select id="cc-cat">${CATS.slice(1).map(s=>`<option>${s}</option>`).join("")}</select></label>
        </div>
        <label class="a-field"><span>DESCRIPTION *</span><input id="cc-desc" placeholder="What must players do?"></label>
        <div class="cc-row">
          <label class="a-field"><span>DIFFICULTY *</span><select id="cc-diff"><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Elite</option></select></label>
          <label class="a-field"><span>DURATION *</span><input id="cc-dur" placeholder="e.g. 14 days"></label>
        </div>
        <div class="cc-row">
          <label class="a-field"><span>GOAL *</span><input id="cc-goal" placeholder="e.g. 14 sessions"></label>
          <label class="a-field"><span>REWARD (XP) *</span><input id="cc-xp" type="number" value="400"></label>
        </div>
        <label class="a-field"><span>RULES</span><input id="cc-rules" placeholder="Rule 1; Rule 2; Rule 3"></label>
        <div class="cc-row">
          <label class="a-field"><span>MAX PARTICIPANTS</span><input id="cc-max" type="number" value="500"></label>
          <label class="a-field"><span>CHALLENGE IMAGE</span><select id="cc-icon"><option>🏃</option><option>💪</option><option>🏏</option><option>⚽</option><option>🏀</option><option>🚴</option><option>🏊</option><option>🥾</option><option>♟</option><option>🤝</option></select></label>
        </div>
        <p class="cc-err" id="cc-err" style="display:none;"></p>
        <button class="btn btn-primary" id="cc-submit" onclick="PLAYR_CH.submitCreate(this)">CREATE CHALLENGE</button>
        <p class="cc-fine mono-num">RECREATIONAL CHALLENGES ONLY — NO RISKY PHYSICAL TASKS. PLAY SAFE.</p>
      </div>
    </div>`;
    document.body.appendChild(ov);
  },
  closeCreate(){ const m=document.getElementById("chCreate"); if(m) m.remove(); },
  submitCreate(btn){
    const v=id=>((document.getElementById(id)||{}).value||"").trim();
    const err=document.getElementById("cc-err");
    const need=[["cc-name","Challenge name is required."],["cc-desc","Description is required."],["cc-dur","Duration is required."],["cc-goal","Goal is required."]];
    for(const [id,msg] of need){ if(!v(id)){ err.textContent=msg; err.style.display="block"; document.getElementById(id).focus(); return; } }
    err.style.display="none";
    btn.disabled=true; btn.textContent="CREATING…";
    setTimeout(()=>{
      const c={id:"custom-"+Date.now().toString(36),title:v("cc-name").toUpperCase(),sport:v("cc-sport"),cat:v("cc-cat"),icon:v("cc-icon")||"🏅",
        difficulty:v("cc-diff"),duration:v("cc-dur"),goal:v("cc-goal"),participants:1,progress:0,xp:Math.max(50,Math.min(5000,parseInt(v("cc-xp"))||400)),
        daysLeft:30,desc:v("cc-desc"),rules:(v("cc-rules")||"").split(";").map(x=>x.trim()).filter(Boolean),isnew:1,max:parseInt(v("cc-max"))||500};
      const all=created(); all.push(c); try{ localStorage.setItem(LSKC,JSON.stringify(all)); }catch(e){}
      PLAYR_CH.closeCreate();
      render();
      showToast("Challenge created ✓ Live in the community grid");
    },600);
  }
};

window.initChallenges=render;
window.PLAYR_CH.render=render;
window.PLAYR_CH.lookup=id=>CATALOG.concat(created()).find(x=>x.id===id);
})();
