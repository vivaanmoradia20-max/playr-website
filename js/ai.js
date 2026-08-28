/* ============================================================
   PLAYR AI — your AI-powered sports companion
   ------------------------------------------------------------
   ARCHITECTURE (no fake chatbot):

   Frontend (this file)
     ↓ POST { messages, context } to AI_CHAT_ENDPOINT (default /api/chat)
   Serverless proxy (api/chat.js — deploy to Vercel/Netlify/any Node)
     ↓ attaches AI_API_KEY (SERVER-SIDE ONLY), system prompt, rate limits
   AI provider (OpenAI / Anthropic / Gemini / OpenRouter via AI_PROVIDER)
     ↓ reply
   Frontend renders it here.

   If the endpoint is not configured, PLAYR AI says so honestly and
   names the exact setup (docs/ai-setup.md). No canned "AI" answers.

   Additionally, PLAYR AI answers PLATFORM-DATA questions locally —
   computed from the real site engines (events, communities, sports
   catalogue) and labelled as such. That's real data, not fake AI.
   ============================================================ */
(function(){
"use strict";
let open=false, booted=false, busy=false, lastSend=0;
const HIST_KEY="playr_ai_history_v1";
const $=s=>document.querySelector(s);

/* ---------- system prompt (mirrors api/chat.js) ---------- */
const SYSTEM_PROMPT=`You are PLAYR AI, the sports intelligence assistant inside PLAYR — an all-sports social platform.
Help users understand and explore the world of sport: rules, history, major competitions, athletes, teams, terminology, training, equipment, Olympic, para and emerging sports.
Never fabricate scores, standings, rankings, news or live data; if information may be outdated, say so.
Be clear, concise and engaging. When relevant, suggest exploring PLAYR communities, sports pages or events — but answer the actual question first; do not over-promote.`;

/* ---------- context (view + sport/community, no personal data) ---------- */
function context(){
  const c={view:(document.querySelector(".view.active")||{}).id||"home"};
  try{
    const h=(location.hash||"");
    if(h.indexOf("#/discover-sport/")===0) c.sport=decodeURIComponent(h.split("/")[2]||"").replace(/-/g," ");
  }catch(e){}
  const t=document.querySelector(".su2-title");
  if(t&&c.view==="view-sports") c.sport=t.textContent.toLowerCase();
  const dh=document.querySelector(".com-detail-hero h1");
  if(dh&&c.view==="view-communities") c.community=dh.textContent.toLowerCase();
  return c;
}
function contextLine(){
  const c=context();
  if(c.sport) return `You're exploring ${c.sport}. What would you like to know?`;
  if(c.community) return `You're in the ${c.community} community. Need help with anything?`;
  if(c.view==="view-events") return "You're browsing PLAYR events. Want help finding one?";
  if(c.view==="view-shop") return "You're in the PLAYR Shop. Looking for something specific?";
  if(c.view==="view-spcl") return "You're in SPCL PLAYERS. Want to learn about a para-sport?";
  return null;
}

/* ---------- endpoint ---------- */
function endpoint(){
  const env=window.PLAYR_ENV||{};
  return env.AI_CHAT_ENDPOINT||"/api/chat";
}
function configured(){
  const env=window.PLAYR_ENV||{};
  return !!(env.AI_CHAT_ENDPOINT&&/^https?:\/\//.test(env.AI_CHAT_ENDPOINT));
}

/* ---------- platform-data answers (real, computed) ---------- */
function platformAnswer(q){
  const t=q.toLowerCase();
  /* events */
  if(/\b(event|events|match|race|tournament|game|weekend|coming up|happening)\b/.test(t)&&window.PLAYR_EV){
    let evs=PLAYR_EV.EVENTS.filter(e=>e.status!=="COMPLETED");
    const city=(t.match(/mumbai|delhi|pune|bengaluru|hyderabad|chennai|kolkata|goa/)||[])[0];
    const weekend=/weekend/.test(t);
    if(city) evs=evs.filter(e=>(e.city+" "+e.zone).toLowerCase().includes(city));
    const sportHint=(t.match(/run|running|marathon/)&&"running")||(t.match(/football/)&&"football")||(t.match(/cricket/)&&"cricket")||(t.match(/cycl/)&&"cycling")||(t.match(/swim/)&&"aquatics")||(t.match(/chess/)&&"chess")||(t.match(/padel/)&&"padel");
    if(sportHint) evs=evs.filter(e=>e.sport===sportHint);
    if(weekend) evs=evs.filter(e=>PLAYR_EV.isWeekendPeriod(e.start));
    evs=evs.sort((a,b)=>a.start-b.start).slice(0,4);
    if(evs.length){
      const lines=evs.map(e=>`• <b>${e.name}</b> — ${PLAYR_EV.fmtDate(e.start)} · ${e.area}, ${e.city}${e.isDemo?" (DEMO)":""}`).join("<br>");
      return {html:`Here's what the PLAYR events engine has${city?" in "+city:""}${weekend?" this weekend":""}:<br><br>${lines}<br><br><span class="ai-src">FROM PLAYR'S EVENT ENGINE · VERIFIED + DEMO LISTINGS</span>`, actions:[["EXPLORE EVENTS","switchView('events')"]]};
    }
  }
  /* community recommendations */
  if(/\bcommunit|people|club|group\b/.test(t)&&window.PLAYR_COM){
    const sportHint=(t.match(/run|running/)&&"Running")||(t.match(/football/)&&"Football")||(t.match(/cricket/)&&"Cricket")||(t.match(/cycl/)&&"Cycling")||(t.match(/trek|adventure|hike/)&&"Trekking")||(t.match(/swim/)&&"Swimming");
    let list=window.PLAYR_COMMUNITIES;
    if(sportHint) list=list.filter(c=>c.sport===sportHint);
    else if(/adventure/.test(t)) list=list.filter(c=>c.cat==="ADVENTURE");
    else list=list.filter(c=>c.trend);
    const picks=list.slice(0,3);
    if(picks.length){
      const lines=picks.map(c=>`• <b>${c.name}</b> — ${c.desc}`).join("<br>");
      return {html:`${sportHint?`Communities for ${sportHint}:`:"Communities you might like:"}<br><br>${lines}`, actions:[["EXPLORE COMMUNITIES","switchView('communities')"]]};
    }
  }
  /* sport discovery / recommendations */
  if(/\b(start following|new sport|recommend|discover|try|beginner|which sport|explore)\b/.test(t)&&window.PLAYR_SPORTS){
    const adventure=/adventure|outdoor|mountain|trek|climb/.test(t);
    const team=/team|friends|group/.test(t);
    let picks=[];
    if(adventure) picks=["mountaineering","trail-running","rock-climbing","surfing","trekking"];
    else if(team) picks=["football","basketball","volleyball","kabaddi","cricket"];
    else picks=["running","badminton","cycling","swimming","table-tennis"];
    const names=picks.map(id=>{const s=window.getSport&&getSport(id);return s?s.name:null;}).filter(Boolean);
    if(names.length){
      return {html:`You could explore ${adventure?"adventure sports":team?"team sports":"these"}: <b>${names.join(", ")}</b>. Each one has a full universe on PLAYR — feed, events, communities and challenges.${adventure?"":" Want a community to go with it?"}`,
        actions:[["EXPLORE COMMUNITIES","switchView('communities')"],["DISCOVER SPORT","switchView('discover')"]]};
    }
  }
  /* SPCL PLAYERS / para */
  if(/\bpara|spcl|classification|paralympic|disability sport\b/.test(t)){
    return {html:`SPCL PLAYERS is PLAYR's dedicated space celebrating para-athletes and para-sports — 29 sanctioned Para sports across summer and winter. Classification is <b>sport-specific</b>: athletes are grouped by how an impairment affects that sport's activities, so results come down to training and execution. Want me to open the full hub?`,
      actions:[["OPEN SPCL PLAYERS","switchView('spcl')"]]};
  }
  /* olympics pointer */
  if(/\bolymic|olympic/.test(t)&&window.PLAYR_SPORTS){
    const n=window.PLAYR_SPORTS.filter(s=>s.isOlympic).length;
    return {html:`PLAYR's catalogue covers ${n} Olympic-programme sports with their disciplines and events — including the LA28 and Milano Cortina 2026 programmes. Ask me about any specific Olympic sport, or browse the directory.`,
      actions:[["DISCOVER SPORT","switchView('discover')"]]};
  }
  return null;
}

/* ---------- chat UI ---------- */
function boot(){
  if(booted) return; booted=true;
  const btn=document.createElement("button");
  btn.id="aiFab"; btn.className="ai-fab"; btn.setAttribute("aria-label","Open PLAYR AI");
  btn.innerHTML=`<span class="ai-fab-star">✦</span> ASK PLAYR AI`;
  btn.onclick=toggle;
  document.body.appendChild(btn);
}
function toggle(){ open?close():openChat(); }
function openChat(){
  if(open) return; open=true;
  const chat=document.createElement("div"); chat.id="aiChat"; chat.className="ai-chat"; chat.setAttribute("role","dialog"); chat.setAttribute("aria-label","PLAYR AI chat");
  chat.innerHTML=`
    <div class="ai-head">
      <div class="ai-head-in">
        <div class="ai-logo">✦</div>
        <div><b>PLAYR AI</b><span>Your AI sports companion.</span></div>
      </div>
      <div class="ai-head-actions">
        <button class="ai-ic" aria-label="Chat history" onclick="PLAYR_AI.showHistory()">🕘</button>
        <button class="ai-ic" aria-label="Close PLAYR AI" onclick="PLAYR_AI.close()">✕</button>
      </div>
    </div>
    <div class="ai-body" id="aiBody"></div>
    <div class="ai-inputrow">
      <input id="aiInput" placeholder="Ask anything about sports..." maxlength="500" autocomplete="off">
      <button class="ai-send" id="aiSend" aria-label="Send message" onclick="PLAYR_AI.send()">SEND</button>
    </div>`;
  document.body.appendChild(chat);
  document.body.classList.add("ai-open");
  const b=$("#aiBody");
  const ctxLine=contextLine();
  b.innerHTML+=bubble("ai",`Hey! I'm <b>PLAYR AI</b>. Ask me anything about sports.${ctxLine?`<br><br><span class="ai-ctx">${ctxLine}</span>`:""}`);
  b.innerHTML+=`<div class="ai-suggest">${["What is the history of Formula 1?","Explain the rules of badminton.","How does the offside rule work?","What running events are coming up?","Tell me about SPCL PLAYERS"].map(q=>`<button onclick="PLAYR_AI.ask('${q.replace(/'/g,"\\'")}')">${q}</button>`).join("")}</div>`;
  const inp=$("#aiInput");
  inp.addEventListener("keydown",e=>{ if(e.key==="Enter") window.PLAYR_AI.send(); });
  setTimeout(()=>inp.focus(),80);
}
function close(){ const c=$("#aiChat"); if(c) c.remove(); open=false; document.body.classList.remove("ai-open"); }
function bubble(role,html){ return `<div class="ai-msg ${role}">${html}</div>`; }
function actionsHTML(actions){
  return actions?`<div class="ai-actions">${actions.map(a=>`<button onclick="${a[1]}">${a[0]}</button>`).join("")}</div>`:"";
}
function scrollBottom(){ const b=$("#aiBody"); if(b) b.scrollTop=b.scrollHeight; }

/* ---------- send pipeline ---------- */
async function send(preset){
  const inp=$("#aiInput"); const q=(preset||inp.value||"").trim();
  if(!q||busy) return;
  /* rate limit: 1 message / 4s */
  const now=Date.now();
  if(now-lastSend<4000){ toast("One at a time — PLAYR AI needs a few seconds between messages."); return; }
  lastSend=now;
  if(!preset) inp.value="";
  const b=$("#aiBody");
  const sug=b.querySelector(".ai-suggest"); if(sug) sug.remove();
  b.innerHTML+=bubble("user",q.replace(/</g,"&lt;"));
  /* platform-data path (real, computed) */
  const plat=platformAnswer(q);
  if(plat){
    b.innerHTML+=bubble("ai",plat.html)+actionsHTML(plat.actions);
    saveHistory(q); scrollBottom(); return;
  }
  /* LLM path via serverless proxy */
  busy=true;
  const typing=document.createElement("div"); typing.className="ai-msg ai typing"; typing.id="aiTyping";
  typing.innerHTML=`<span class="ai-dots"><i></i><i></i><i></i></span> PLAYR AI is thinking…`;
  b.appendChild(typing); scrollBottom();
  const sendBtn=$("#aiSend"); if(sendBtn) sendBtn.disabled=true;
  try{
    const res=await fetch(endpoint(),{
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({messages:[{role:"user",content:q}],context:context()})
    });
    typing.remove();
    if(res.status===429){ b.innerHTML+=bubble("ai","PLAYR AI is currently busy. Please try again shortly."); scrollBottom(); return; }
    if(!res.ok) throw new Error("http "+res.status);
    const data=await res.json();
    if(!data||!data.reply) throw new Error("bad payload");
    b.innerHTML+=bubble("ai",String(data.reply).replace(/</g,"&lt;").replace(/\n/g,"<br>"));
    saveHistory(q);
  }catch(e){
    typing.remove();
    if(!configured()){
      b.innerHTML+=bubble("ai",`I can't answer open sports questions yet — the AI service isn't connected.<br><br><b>To activate PLAYR AI:</b><br>1. Deploy <span class="ai-code">api/chat.js</span> (serverless)<br>2. Set <span class="ai-code">AI_API_KEY</span> + <span class="ai-code">AI_MODEL</span> env vars<br>3. Point <span class="ai-code">PLAYR_ENV.AI_CHAT_ENDPOINT</span> at it<br><br>Full steps: <span class="ai-code">docs/ai-setup.md</span><br><br>Meanwhile I can answer <b>PLAYR platform questions</b> — try “What running events are coming up?”`);
    } else {
      b.innerHTML+=bubble("ai","PLAYR AI is temporarily unavailable. Please try again.");
    }
  }
  busy=false; if(sendBtn) sendBtn.disabled=false; scrollBottom();
}
function ask(q){ send(q); }
function saveHistory(q){
  try{
    const h=JSON.parse(localStorage.getItem(HIST_KEY)||"[]");
    h.unshift({q,when:Date.now()}); localStorage.setItem(HIST_KEY,JSON.stringify(h.slice(0,10)));
  }catch(e){}
}
function showHistory(){
  const h=(()=>{ try{ return JSON.parse(localStorage.getItem(HIST_KEY)||"[]"); }catch(e){ return []; } })();
  const b=$("#aiBody");
  b.innerHTML+=`<div class="ai-history"><b>RECENT CHATS</b>${h.length?h.slice(0,6).map(x=>`<button onclick="PLAYR_AI.ask('${x.q.replace(/'/g,"\\'")}')">${x.q.slice(0,44)}</button>`).join(""):"<span>No history yet — stored locally in this browser until the backend ships.</span>"}</div>`;
  scrollBottom();
}
function toast(msg){ if(window.showToast) showToast(msg); }

window.PLAYR_AI={open:openChat, close, send, ask, showHistory, toggle};
if(document.readyState!=="loading") boot(); else document.addEventListener("DOMContentLoaded",boot);
})();
