/* ============================================================
   PLAYR AI — your AI-powered sports companion
   ------------------------------------------------------------
   REAL AI PIPELINE (no canned answers):
     chatbox → PLAYR_ENV.AI_CHAT_ENDPOINT (serverless proxy
     api/chat.js) → AI provider (Groq/OpenAI/Claude/Gemini via
     AI_API_KEY, server-side only) → {reply} → chatbox.

     Set js/config.js → AI_CHAT_ENDPOINT to your deployed proxy
     (docs/ai-setup.md — 2-minute setup, Groq has a free tier).
     Until then, open questions honestly say the service isn't
     connected — never fake answers.

   Platform-data questions (events, communities, sports catalogue,
     SPCL PLAYERS…) are answered locally from PLAYR's real engines
     and labelled as such. Both paths share one chat UI.
   ============================================================ */
(function(){
"use strict";
let open=false, booted=false, busy=false, lastSend=0, lastQuestion=null;
let convo=[];                                   /* [{role,content}] memory */
const HIST_KEY="playr_ai_history_v1", CONVO_KEY="playr_ai_convo_v1";
const $=s=>document.querySelector(s);

/* ---------- context (view/sport/community only — never PII) ---------- */
function context(){
  const c={view:((document.querySelector(".view.active")||{}).id||"home").replace("view-","")};
  try{ const h=decodeURIComponent(location.hash||"");
    if(h.indexOf("#/discover-sport/")===0) c.sport=h.split("/")[2].replace(/-/g," ");
  }catch(e){}
  const t=document.querySelector(".su2-title"); if(t&&c.view==="sports") c.sport=t.textContent.toLowerCase();
  const dh=document.querySelector(".com-detail-hero h1"); if(dh&&c.view==="communities") c.community=dh.textContent.toLowerCase();
  return c;
}
function contextLine(){
  const c=context();
  if(c.sport) return `You're exploring ${c.sport}. What would you like to know?`;
  if(c.community) return `You're in the ${c.community} community. Need help with anything?`;
  if(c.view==="events") return "You're browsing PLAYR events. Want help finding one?";
  if(c.view==="shop") return "You're in the PLAYR Shop. Looking for something specific?";
  if(c.view==="spcl") return "You're in SPCL PLAYERS. Want to learn about a para-sport?";
  return null;
}

/* ---------- endpoint ---------- */
const endpoint=()=>{ const e=(window.PLAYR_ENV||{}).AI_CHAT_ENDPOINT; return (e&&/^https?:\/\//.test(e))?e:null; };

/* ---------- quick questions (per product spec) ---------- */
const CHIPS=[
  ["⚽ Football Rules","What is offside in football?"],
  ["🏏 Cricket Basics","Explain cricket to me — how is the game played?"],
  ["🏎️ Formula 1","How does Formula 1 qualifying work?"],
  ["🏀 Basketball","What is a triple-double in basketball?"],
  ["🏅 Olympic Sports","What sports are included in the Olympics?"],
  ["♿ Para Sports","Tell me about para athletics."]
];

/* ---------- platform-data answers (real, computed, labelled) ---------- */
function platformAnswer(q){
  const t=q.toLowerCase();
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
  if(/\bcommunit|people|club|group\b/.test(t)&&window.PLAYR_COMMUNITIES){
    const sportHint=(t.match(/run|running/)&&"Running")||(t.match(/football/)&&"Football")||(t.match(/cricket/)&&"Cricket")||(t.match(/cycl/)&&"Cycling")||(t.match(/trek|adventure|hike/)&&"Trekking")||(t.match(/swim/)&&"Swimming");
    let list=window.PLAYR_COMMUNITIES;
    list=sportHint?list.filter(c=>c.sport===sportHint):(/adventure/.test(t)?list.filter(c=>c.cat==="ADVENTURE"):list.filter(c=>c.trend));
    if(list.length){
      return {html:`${sportHint?`Communities for ${sportHint}:`:"Communities you might like:"}<br><br>${list.slice(0,3).map(c=>`• <b>${c.name}</b> — ${c.desc}`).join("<br>")}`, actions:[["EXPLORE COMMUNITIES","switchView('communities')"]]};
    }
  }
  if(/\b(start following|new sport|recommend|discover|try|beginner|which sport|explore)\b/.test(t)&&window.PLAYR_SPORTS){
    const adventure=/adventure|outdoor|mountain|trek|climb/.test(t), team=/team|friends|group/.test(t);
    const picks=(adventure?["mountaineering","trail-running","rock-climbing","surfing","trekking"]:team?["football","basketball","volleyball","kabaddi","cricket"]:["running","badminton","cycling","swimming","table-tennis"])
      .map(id=>{const s=window.getSport&&getSport(id);return s?s.name:null;}).filter(Boolean);
    if(picks.length) return {html:`You could explore <b>${picks.join(", ")}</b> — each has a full universe on PLAYR: feed, events, communities and challenges.`,
      actions:[["EXPLORE COMMUNITIES","switchView('communities')"],["DISCOVER SPORT","switchView('discover')"]]};
  }
  if(/\bpara|spcl|classification|paralympic|disability sport\b/.test(t)){
    return {html:`SPCL PLAYERS is PLAYR's dedicated space celebrating para-athletes and para-sports — 29 sanctioned Para sports across summer and winter, from para athletics and para swimming to wheelchair basketball, boccia and goalball. Classification is <b>sport-specific</b>: athletes are grouped by how an impairment affects that sport's activities, so results come down to training and execution. Want the full hub?`,
      actions:[["OPEN SPCL PLAYERS","switchView('spcl')"]]};
  }
  if(/\bolymic|olympic/.test(t)&&window.PLAYR_SPORTS){
    const n=window.PLAYR_SPORTS.filter(x=>x.isOlympic).length;
    return {html:`PLAYR's catalogue covers <b>${n} Olympic-programme sports</b> with their disciplines and events — including the LA28 and Milano Cortina 2026 programmes. Ask me about any specific Olympic sport, or browse the directory.`,
      actions:[["DISCOVER SPORT","switchView('discover')"]]};
  }
  return null;
}

/* ---------- markdown-lite (escaped first, then formatted) ---------- */
function mdLite(txt){
  let h=String(txt).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  h=h.replace(/\*\*([^*\n]+)\*\*/g,"<b>$1</b>");
  h=h.split("\n").map(l=>/^\s*[-•]\s+/.test(l)?`<span class="ai-li">${l.replace(/^\s*[-•]\s+/,"")}</span>`:l).join("<br>");
  h=h.replace(/<span class="ai-li">/g,'<span class="ai-li">• ').replace(/<\/span><br>/g,"</span>");
  return h;
}

/* ---------- UI ---------- */
function boot(){
  if(booted) return; booted=true;
  const btn=document.createElement("button");
  btn.id="aiFab"; btn.className="ai-fab"; btn.setAttribute("aria-label","Open PLAYR AI");
  btn.innerHTML=`<span class="ai-fab-star">✦</span> ASK PLAYR AI`;
  btn.onclick=toggle; document.body.appendChild(btn);
}
function toggle(){ open?close():openChat(); }
function openChat(){
  if(open) return; open=true;
  const chat=document.createElement("div"); chat.id="aiChat"; chat.className="ai-chat"; chat.setAttribute("role","dialog"); chat.setAttribute("aria-label","PLAYR AI chat");
  chat.innerHTML=`
    <div class="ai-head">
      <div class="ai-head-in">
        <div class="ai-logo">✦</div>
        <div><b>PLAYR AI</b><span>Your intelligent sports assistant.</span></div>
      </div>
      <div class="ai-head-actions">
        <button class="ai-ic" aria-label="Clear chat" onclick="PLAYR_AI.clear()">🗑</button>
        <button class="ai-ic" aria-label="Chat history" onclick="PLAYR_AI.showHistory()">🕘</button>
        <button class="ai-ic" aria-label="Close PLAYR AI" onclick="PLAYR_AI.close()">✕</button>
      </div>
    </div>
    <div class="ai-body" id="aiBody"></div>
    <div class="ai-inputrow">
      <input id="aiInput" placeholder="Ask anything about sports..." maxlength="500" autocomplete="off">
      <button class="ai-send" id="aiSend" aria-label="Send message" onclick="PLAYR_AI.send()">SEND</button>
    </div>`;
  document.body.appendChild(chat); document.body.classList.add("ai-open");
  const b=$("#aiBody");
  const ctx=contextLine();
  b.innerHTML+=bubble("ai",`Hey! I'm <b>PLAYR AI</b> — ask me anything about sport: rules, history, athletes, training, Olympic and para-sports.${ctx?`<br><br><span class="ai-ctx">${ctx}</span>`:""}`);
  b.innerHTML+=`<div class="ai-suggest">${CHIPS.map(([label,q])=>`<button onclick="PLAYR_AI.ask('${q.replace(/'/g,"\\'")}')">${label}</button>`).join("")}</div>`;
  restoreConvo();
  const inp=$("#aiInput");
  inp.addEventListener("keydown",e=>{ if(e.key==="Enter") window.PLAYR_AI.send(); });
  setTimeout(()=>inp.focus(),80);
}
function close(){ const c=$("#aiChat"); if(c) c.remove(); open=false; document.body.classList.remove("ai-open"); }
function bubble(role,html){ return `<div class="ai-msg ${role}">${html}</div>`; }
function scrollBottom(){ const b=$("#aiBody"); if(b) b.scrollTop=b.scrollHeight; }

/* ---------- conversation persistence ---------- */
function persistConvo(){ try{ localStorage.setItem(CONVO_KEY,JSON.stringify(convo.slice(-10))); }catch(e){} }
function restoreConvo(){
  try{ convo=JSON.parse(localStorage.getItem(CONVO_KEY)||"[]").filter(m=>m&&(m.role==="user"||m.role==="assistant")&&typeof m.content==="string").slice(-10); }catch(e){ convo=[]; }
  if(convo.length){
    const b=$("#aiBody");
    b.innerHTML+=`<div class="ai-history"><b>CONTINUING YOUR LAST CHAT</b><button onclick="PLAYR_AI.clear()">START FRESH</button></div>`;
    convo.slice(-4).forEach(m=>{ b.innerHTML+=bubble(m.role==="user"?"user":"ai", m.role==="user"?m.content.replace(/</g,"&lt;"):mdLite(m.content)); });
  }
}

/* ---------- send pipeline ---------- */
async function send(preset){
  const inp=$("#aiInput"); const q=(preset||inp.value||"").trim();
  if(!q||busy) return;
  const now=Date.now();
  if(now-lastSend<4000){ toast("One at a time — PLAYR AI needs a few seconds between messages."); return; }
  lastSend=now; lastQuestion=q;
  if(!preset) inp.value="";
  const b=$("#aiBody");
  const sug=b.querySelector(".ai-suggest"); if(sug) sug.remove();
  b.innerHTML+=bubble("user",q.replace(/</g,"&lt;"));

  /* platform-data path (real engines) */
  const plat=platformAnswer(q);
  if(plat){ convo.push({role:"user",content:q}); convo.push({role:"assistant",content:"(PLAYR platform answer with actions)"}); persistConvo(); saveRecent(q);
    b.innerHTML+=bubble("ai",plat.html)+`<div class="ai-actions">${plat.actions.map(a=>`<button onclick="${a[1]}">${a[0]}</button>`).join("")}</div>`;
    scrollBottom(); return; }

  /* LLM path */
  busy=true;
  const typing=document.createElement("div"); typing.className="ai-msg ai typing"; typing.id="aiTyping";
  typing.innerHTML=`<span class="ai-dots"><i></i><i></i><i></i></span> PLAYR AI is thinking…`;
  b.appendChild(typing); scrollBottom();
  const sendBtn=$("#aiSend"); if(sendBtn) sendBtn.disabled=true;
  const url=endpoint();
  const ctl=("AbortController" in window)?new AbortController():null;
  const killer=ctl?setTimeout(()=>ctl.abort(),45000):null;
  try{
    if(!url) throw Object.assign(new Error("not configured"),{soft:true});
    const res=await fetch(url,{
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({messages:convo.concat([{role:"user",content:q}]).slice(-10),context:context()}),
      signal:ctl?ctl.signal:undefined
    });
    typing.remove();
    if(res.status===429){ failBubble("PLAYR AI is currently busy. Please try again shortly."); }
    else if(res.status===401){ failBubble("PLAYR AI's API key appears invalid (server AI_API_KEY)."); }
    else if(!res.ok){ const d=await res.json().catch(()=>({})); failBubble(d.error||"PLAYR AI is temporarily unavailable. Please try again."); }
    else{
      const data=await res.json();
      const reply=data&&data.reply;
      if(!reply||!String(reply).trim()) failBubble("PLAYR AI returned an empty response. Please try again.");
      else{
        convo.push({role:"user",content:q},{role:"assistant",content:String(reply)});
        convo=convo.slice(-10); persistConvo(); saveRecent(q);
        b.innerHTML+=bubble("ai",mdLite(reply)); scrollBottom();
      }
    }
  }catch(e){
    if(typing.parentNode) typing.remove();
    const aborted=e&&e.name==="AbortError";
    if(e&&e.soft){
      failBubble(`I can't answer open sports questions yet — the AI service isn't connected.<br><br><b>To activate PLAYR AI (≈2 minutes):</b><br>1. Deploy <span class="ai-code">api/chat.js</span> (e.g. Vercel)<br>2. Set <span class="ai-code">AI_API_KEY</span> (+ optional <span class="ai-code">AI_MODEL</span>)<br>3. Paste the URL into <span class="ai-code">js/config.js → AI_CHAT_ENDPOINT</span><br><br>Steps + free-tier key links: <span class="ai-code">docs/ai-setup.md</span>`);
    } else if(aborted){
      failBubble("PLAYR AI took too long to respond. Please try again.");
    } else {
      failBubble("PLAYR AI is temporarily unavailable. Please try again.");
    }
  }
  if(killer) clearTimeout(killer);
  busy=false; if(sendBtn) sendBtn.disabled=false; scrollBottom();
}
function failBubble(msg){
  const b=$("#aiBody");
  b.innerHTML+=bubble("ai",`${msg}<div class="ai-actions"><button onclick="PLAYR_AI.retry()">RETRY</button></div>`);
  scrollBottom();
}
function retry(){ const q=lastQuestion; lastSend=0; close(); openChat(); if(q) setTimeout(()=>ask(q),120); }
function ask(q){ send(q); }
function clear(){
  convo=[]; try{ localStorage.removeItem(CONVO_KEY); }catch(e){}
  const b=$("#aiBody"); if(b) b.innerHTML="";
  const ctx=contextLine();
  b.innerHTML=bubble("ai",`Fresh start. Ask me anything about sport ⚡${ctx?`<br><br><span class="ai-ctx">${ctx}</span>`:""}`)+
    `<div class="ai-suggest">${CHIPS.map(([label,q])=>`<button onclick="PLAYR_AI.ask('${q.replace(/'/g,"\\'")}')">${label}</button>`).join("")}</div>`;
  scrollBottom();
}
function saveRecent(q){
  try{ const h=JSON.parse(localStorage.getItem(HIST_KEY)||"[]"); h.unshift({q,when:Date.now()}); localStorage.setItem(HIST_KEY,JSON.stringify(h.slice(0,10))); }catch(e){}
}
function showHistory(){
  let h=[]; try{ h=JSON.parse(localStorage.getItem(HIST_KEY)||"[]"); }catch(e){}
  const b=$("#aiBody");
  b.innerHTML+=`<div class="ai-history"><b>RECENT CHATS</b>${h.length?h.slice(0,6).map(x=>`<button onclick="PLAYR_AI.ask('${x.q.replace(/'/g,"\\'")}')">${x.q.slice(0,44)}</button>`).join(""):"<span>No history yet.</span>"}</div>`;
  scrollBottom();
}
function toast(msg){ if(window.showToast) showToast(msg); }

window.PLAYR_AI={open:openChat, close, send, ask, retry, clear, showHistory, toggle};
if(document.readyState!=="loading") boot(); else document.addEventListener("DOMContentLoaded",boot);
})();
