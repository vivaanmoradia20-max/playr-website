/* ============================================================
   PLAYR — AUTH + ONBOARDING UI
   Auth screen (Sign in / Create account / Forgot) → 5-step
   onboarding (Welcome → Sports → Follow → Profile → Enter) →
   personalized home. Nav states, profile menu, log out, gates.
   ============================================================ */
(function(){
"use strict";
const A=window.PLAYR_AUTH;
let view="signin";           // signin | signup | forgot
let obStep=0;                // 0 = not onboarding
let obData={ sports:[], follows:[] };
const COLLAGE=["cricket","football","running","mountaineering","basketball","formula-1","tennis","swimming"];
const IMGS={cricket:"photo-1531415074968-036ba1b575da",football:"photo-1517466787929-bc90951d0974",running:"photo-1461896836934-ffe607ba8211",mountaineering:"photo-1522163182402-834f871fd851",basketball:"photo-1546519638-68e109498ffc","formula-1":"photo-1584464491033-06628f3a6b7b",tennis:"photo-1595435742656-5272d0b3fa82",swimming:"photo-1530549387789-4c1017266635"};
const img=(id,w,h)=>`https://images.unsplash.com/${IMGS[id]}?w=${w||600}&h=${h||800}&fit=crop`;
const quickSports=["cricket","football","basketball","running","tennis","badminton","aquatics","cycling","mountaineering","formula-1","athletics","boxing","golf","hockey","volleyball","chess","esports"];
const sportLabel=id=>{ const s=window.getSport&&getSport(id); return s?s.name:(id==="aquatics"?"Swimming":id==="formula-1"?"Motorsport":id); };

/* ================= HELPERS ================= */
const esc=t=>String(t==null?"":t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const emailOk=e=>/^\S+@\S+\.\S+$/.test(e.trim());
const unameOk=u=>/^[a-z0-9_.]{3,20}$/.test(u.trim().toLowerCase());
const pwOk=p=>p.length>=8 && /[a-zA-Z]/.test(p) && /[0-9]/.test(p);
function fieldErr(id,msg){ const el=document.getElementById(id); if(!msg){ if(el) el.remove(); return; }
  let e=document.getElementById(id); if(e){ e.textContent=msg; return; }
  const input=document.getElementById(id.replace("err-","")); e=document.createElement("div");
  e.id=id; e.className="a-err"; e.textContent=msg;
  (input?input.parentElement:document.getElementById("aForm")).appendChild(e);
}
function busy(btn,on,txt){ if(!btn) return; btn.disabled=on; btn.textContent=on?(btn.dataset.loading||"PLEASE WAIT…"):(txt||btn.dataset.label||"CONTINUE"); }
function setTab(v){ view=v; const root=document.getElementById("authRoot"); if(root) renderAuth(); }

/* ================= AUTH MODAL ================= */
window.openAuth=function(tab){ openAuthModal(tab||"landing"); };
function openAuthModal(tab){
  if(A.user){ switchView("profile"); return; }   // already signed in → own PLAYR
  view=tab||"landing"; obStep=0;
  closeModal("authModal");
  const ov=document.createElement("div"); ov.id="authModal"; ov.className="a-overlay";
  ov.innerHTML=`<div class="a-modal">
    <div class="a-side">
      <div class="a-side-bg"></div>
      <div class="a-side-in">
        <img src="assets/brand/playr-wordmark.png" alt="PLAYR" class="a-logo">
        <div class="a-side-quotes">
          <div class="a-q">“Every sport. Every story.<br>One community.”</div>
          <div class="a-collage">${COLLAGE.map((s,i)=>`<div style="background-image:url('${img(s)}'); animation-delay:${i*.6}s"></div>`).join("")}</div>
        </div>
      </div>
    </div>
    <div class="a-main">
      <button class="a-close" aria-label="Close" onclick="PLAYR_AUTH_UI.close()">✕</button>
      <div id="authRoot"></div>
    </div>
  </div>`;
  document.body.appendChild(ov);
  renderAuth();
}
window.PLAYR_AUTH_UI={ close:()=>closeModal("authModal") };
function closeModal(id){ const m=document.getElementById(id); if(m) m.remove(); }

function renderAuth(){
  const root=document.getElementById("authRoot"); if(!root) return;
  if(view==="landing") root.innerHTML=landingHTML();
  else if(view==="signin") root.innerHTML=signinHTML();
  else if(view==="signup") root.innerHTML=signupHTML();
  else if(view==="forgot") root.innerHTML=forgotHTML();
}
function logoHead(){ return `<img src="assets/brand/playr-wordmark.png" alt="PLAYR" class="a-logo-sm">`; }

/* ---------- LANDING (JOIN PLAYR) ---------- */
function landingHTML(){
  return `${logoHead()}
    <h2 class="a-title xl">WELCOME TO PLAYR.</h2>
    <p class="a-tag">ONE PASSION. ONE COMMUNITY.</p>
    <p class="a-sub">The social platform where the entire world of sport lives. Sign in or create your free account.</p>
    <div class="a-landing-btns">
      <button class="btn btn-primary a-submit" onclick="PLAYR_AUTH_UI.tab('signin')">SIGN IN</button>
      <button class="btn btn-ghost a-submit" style="margin-top:0;" onclick="PLAYR_AUTH_UI.tab('signup')">CREATE ACCOUNT</button>
    </div>
    <div class="a-alt" style="margin-top:18px;">Already have an account? <button class="a-link strong" onclick="PLAYR_AUTH_UI.tab('signin')">Sign In</button></div>
    <div class="a-alt">New to PLAYR? <button class="a-link strong" onclick="PLAYR_AUTH_UI.tab('signup')">Create Account</button></div>`;
}

/* ---------- SIGN IN ---------- */
function signinHTML(){
  return `<div class="a-backrow"><button class="a-link" onclick="PLAYR_AUTH_UI.tab('landing')">← Welcome</button><span class="a-tabs mini"><button class="a-tab on">SIGN IN</button><button class="a-tab" onclick="PLAYR_AUTH_UI.tab('signup')">CREATE ACCOUNT</button></span></div>
    ${logoHead()}
    <h2 class="a-title">WELCOME BACK.</h2>
    <p class="a-tag">ONE PASSION. ONE COMMUNITY.</p>
    <div class="a-form" id="aForm">
      <label class="a-field"><span>EMAIL</span><input id="si-id" autocomplete="username" placeholder="you@playr.com"></label>
      <label class="a-field"><span>PASSWORD</span><input id="si-pw" type="password" autocomplete="current-password" placeholder="••••••••"></label>
      <button class="a-link" onclick="PLAYR_AUTH_UI.tab('forgot')">Forgot password?</button>
      <button class="btn btn-primary a-submit" data-label="SIGN IN" data-loading="SIGNING YOU IN…" onclick="PLAYR_AUTH_UI.signIn(this)">SIGN IN</button>
      <div class="a-alt">Don't have an account? <button class="a-link strong" onclick="PLAYR_AUTH_UI.tab('signup')">Create Account</button></div>
      <button class="btn btn-ghost a-submit ghost-alt" style="margin-top:0;" onclick="PLAYR_AUTH_UI.tab('signup')">CREATE ACCOUNT</button>
    </div>`;
}

/* ---------- SIGN UP ---------- */
function signupHTML(){
  const sports=window.PLAYR_SPORTS?window.PLAYR_SPORTS.slice().sort((a,b)=>b.popularity-a.popularity).slice(0,24):[];
  return `<div class="a-backrow"><button class="a-link" onclick="PLAYR_AUTH_UI.tab('landing')">← Welcome</button><span class="a-tabs mini"><button class="a-tab" onclick="PLAYR_AUTH_UI.tab('signin')">SIGN IN</button><button class="a-tab on">CREATE ACCOUNT</button></span></div>
    ${logoHead()}
    <h2 class="a-title">CREATE YOUR PLAYR ACCOUNT.</h2>
    <p class="a-tag">ONE PASSION. ONE COMMUNITY.</p>
    <div class="a-form" id="aForm">
      <label class="a-field"><span>FULL NAME</span><input id="su-name" placeholder="Rhea Kapoor"></label>
      <label class="a-field"><span>USERNAME</span><input id="su-user" placeholder="rheak" autocomplete="off"><i class="a-hint">3–20 chars · a-z 0-9 _ .</i></label>
      <label class="a-field"><span>EMAIL</span><input id="su-email" type="email" placeholder="you@playr.com"></label>
      <div class="a-2col">
        <label class="a-field"><span>PASSWORD</span><input id="su-pw" type="password" placeholder="8+ chars, letters & numbers"></label>
        <label class="a-field"><span>CONFIRM PASSWORD</span><input id="su-pw2" type="password" placeholder="Repeat password"></label>
      </div>
      <div class="a-2col">
        <label class="a-field"><span>GENDER <em>(for your avatar)</em></span>
          <select id="su-gender"><option value="">Prefer not to say</option><option value="female">Female</option><option value="male">Male</option><option value="non-binary">Non-binary</option></select></label>
        <label class="a-field"><span>PRIMARY SPORT / INTERESTS</span>
          <select id="su-sport"><option value="">Just browsing</option>${sports.map(x=>`<option value="${x.id}">${x.name}</option>`).join("")}</select></label>
      </div>
      <label class="a-photo"><input type="file" id="su-photo" accept="image/*"><span>📷 Add profile photo <em>(optional)</em></span></label>
      <button class="btn btn-primary a-submit" data-label="CREATE ACCOUNT" data-loading="CREATING YOUR PLAYR ACCOUNT…" onclick="PLAYR_AUTH_UI.signUp(this)">CREATE ACCOUNT</button>
      <div class="a-alt">Already have an account? <button class="a-link strong" onclick="PLAYR_AUTH_UI.tab('signin')">Sign In</button></div>
      <button class="btn btn-ghost a-submit ghost-alt" style="margin-top:0;" onclick="PLAYR_AUTH_UI.tab('signin')">SIGN IN</button>
    </div>`;
}

/* ---------- FORGOT ---------- */
function forgotHTML(){
  return `<div class="a-backrow"><button class="a-link" onclick="PLAYR_AUTH_UI.tab('signin')">← Sign In</button></div>
    ${logoHead()}
    <h2 class="a-title">RESET PASSWORD.</h2>
    <p class="a-tag">ONE PASSION. ONE COMMUNITY.</p>
    <div class="a-form" id="aForm">
      <p class="a-sub">Enter your account email and we'll send you a reset link.</p>
      <label class="a-field"><span>EMAIL</span><input id="fp-email" type="email" placeholder="you@playr.com"></label>
      <button class="btn btn-primary a-submit" data-label="RESET PASSWORD" onclick="PLAYR_AUTH_UI.forgot(this)">RESET PASSWORD</button>
    </div>`;
}

/* ================= ACTIONS ================= */
const UI=window.PLAYR_AUTH_UI;
UI.tab=setTab;

UI.signIn=async function(btn){
  ["err-si-id","err-si-pw"].forEach(e=>fieldErr(e));
  const id=(document.getElementById("si-id")||{}).value||"", pw=(document.getElementById("si-pw")||{}).value||"";
  let bad=false;
  if(!id.trim()){ fieldErr("err-si-id","Please complete this field."); bad=true; }
  if(!pw){ fieldErr("err-si-pw","Please complete this field."); bad=true; }
  if(bad) return;
  busy(btn,true);
  try{
    const u=await A.signIn({identifier:id,password:pw});
    busy(btn,false,"SIGN IN"); closeModal("authModal");
    showToast(`Welcome back, ${esc(u.name.split(" ")[0])} ⚡`);
    applyState(u);
    if(!u.sports || !u.sports.length){ startOnboarding(); } else { refreshWorld(); switchView("home"); }
  }catch(e){ busy(btn,false,"SIGN IN"); fieldErr("err-si-id", A.friendly(e)); }
};

UI.signUp=async function(btn){
  ["err-su-name","err-su-user","err-su-email","err-su-pw","err-su-pw2","err-su-gender","err-su-sport"].forEach(e=>fieldErr(e));
  const name=(document.getElementById("su-name")||{}).value||"", user=(document.getElementById("su-user")||{}).value||"",
        email=(document.getElementById("su-email")||{}).value||"", pw=(document.getElementById("su-pw")||{}).value||"", pw2=(document.getElementById("su-pw2")||{}).value||"";
  let bad=false;
  if(!name.trim()){ fieldErr("err-su-name","Please complete this field."); bad=true; }
  if(!user.trim()){ fieldErr("err-su-user","Please complete this field."); bad=true; }
  else if(!unameOk(user)){ fieldErr("err-su-user","3–20 characters: letters, numbers, _ or ."); bad=true; }
  if(!email.trim()){ fieldErr("err-su-email","Please complete this field."); bad=true; }
  else if(!emailOk(email)){ fieldErr("err-su-email","Please enter a valid email address."); bad=true; }
  if(!pw.trim()){ fieldErr("err-su-pw","Please complete this field."); bad=true; }
  else if(!pwOk(pw)){ fieldErr("err-su-pw","At least 8 characters, with letters and numbers."); bad=true; }
  if(pw2!==pw){ fieldErr("err-su-pw2","Passwords do not match."); bad=true; }
  if(bad) return;
  busy(btn,true);
  try{
    const photo=await readPhoto("su-photo");
    const gender=(((document.getElementById("su-gender")||{}).value)||"").trim();
    const sport=(((document.getElementById("su-sport")||{}).value)||"").trim();
    const res=await A.signUp({name:name.trim(),username:user.trim(),email,password:pw,gender,sport});
    if(photo && A.user) await A.updateProfile({avatar:photo});
    busy(btn,false,"CREATE ACCOUNT");
    if(res.confirmed===false){        // Supabase email confirmation pending
      closeModal("authModal");
      showToast("Account created — check your email to confirm, then sign in ✓");
      openAuthModal("signin");
      return;
    }
    closeModal("authModal");
    showToast("Welcome to PLAYR.");
    startOnboarding();
  }catch(e){ busy(btn,false,"CREATE ACCOUNT");
    const m=A.friendly(e);
    fieldErr(/username/i.test(m)?"err-su-user":/already registered/i.test(m)?"err-su-email":"err-su-email", m); }
};

UI.forgot=async function(btn){
  fieldErr("err-fp-email");
  const email=(document.getElementById("fp-email")||{}).value||"";
  if(!emailOk(email)){ fieldErr("err-fp-email","Enter a valid email address."); return; }
  busy(btn,true);
  try{ await A.resetPassword(email); }
  catch(e){ busy(btn,false,"RESET PASSWORD"); fieldErr("err-fp-email",A.friendly(e)); return; }
  busy(btn,false,"RESET PASSWORD");
  const root=document.getElementById("authRoot");
  if(root) root.innerHTML=`${logoHead()}<h2 class="a-title">RESET PASSWORD.</h2><p class="a-tag">ONE PASSION. ONE COMMUNITY.</p>
    <div class="a-form"><div class="a-success"><b>Check your email.</b><p>We've sent a password reset link to <b>${esc(email)}</b>. It expires in a little while — didn't get it? Check spam or try again.</p></div>
    <button class="btn btn-ghost a-submit" onclick="PLAYR_AUTH_UI.tab('signin')">← Back to sign in</button></div>`;
};

function readPhoto(id){
  return new Promise(res=>{
    const f=(document.getElementById(id)||{}).files;
    if(!f||!f[0]) return res(null);
    const r=new FileReader();
    r.onload=()=>{ // downscale for storage
      const im=new Image();
      im.onload=()=>{ const c=document.createElement("canvas"); const s=Math.min(1, 256/Math.max(im.width,im.height));
        c.width=im.width*s; c.height=im.height*s;
        c.getContext("2d").drawImage(im,0,0,c.width,c.height);
        try{ res(c.toDataURL("image/jpeg",.82)); }catch(e){ res(r.result); } };
      im.onerror=()=>res(null); im.src=r.result;
    };
    r.onerror=()=>res(null);
    r.readAsDataURL(f[0]);
  });
}

/* ================= ONBOARDING (5 steps) ================= */
function startOnboarding(){
  obStep=1; obData={sports:(A.user&&A.user.sports||[]).slice(),follows:[]};
  closeModal("authModal");
  const ov=document.createElement("div"); ov.id="onboardModal"; ov.className="a-overlay";
  ov.innerHTML=`<div class="a-modal ob-modal2">
    <div class="a-side ob-side"><div class="a-side-bg"></div>
      <div class="a-side-in">
        <img src="assets/brand/playr-wordmark.png" alt="PLAYR" class="a-logo">
        <div class="ob-progress"><i id="obBar"></i></div>
        <div class="ob-stepnum mono-num" id="obStepNum"></div>
      </div>
    </div>
    <div class="a-main"><div id="obRoot"></div></div>
  </div>`;
  document.body.appendChild(ov);
  renderOb();
}
UI.skipOnboarding=function(){ finishOnboarding(); };
function renderOb(){
  const root=document.getElementById("obRoot"); if(!root) return;
  const pct=[0,20,40,60,80,100][obStep]||0;
  const bar=document.getElementById("obBar"); if(bar) bar.style.width=pct+"%";
  const sn=document.getElementById("obStepNum"); if(sn) sn.textContent="STEP "+obStep+" / 5";
  if(obStep===1) root.innerHTML=`
    <div class="ob-step-head"><h2 class="a-title">WELCOME TO PLAYR.</h2><p class="a-tag">ONE PASSION. ONE COMMUNITY.</p></div>
    <p class="ob-lead">Five quick steps and your sports world is live.</p>
    <ol class="ob-steps-list">
      <li><b>01</b> Welcome</li><li><b>02</b> Choose your sports</li><li><b>03</b> Follow people & communities</li><li><b>04</b> Create your profile</li><li><b>05</b> Enter PLAYR</li>
    </ol>
    <button class="btn btn-primary a-submit" onclick="PLAYR_AUTH_UI.obNext()">LET'S GO →</button>
    <button class="a-link center" onclick="PLAYR_AUTH_UI.skipOnboarding()">Skip for now</button>`;
  if(obStep===2){
    const sel=new Set(obData.sports);
    root.innerHTML=`
    <div class="ob-step-head"><h2 class="a-title">WHAT DO YOU PLAY?</h2><p class="a-sub">Choose the sports you want to see in your PLAYR feed.</p></div>
    <input class="a-search" placeholder="Search 200+ sports…" oninput="PLAYR_AUTH_UI.obSearch(this.value)">
    <div class="ob-grid" id="obSports">${obSportsHTML(quickSports,sel)}</div>
    <div class="ob-foot"><span class="mono-num" id="obCount">${sel.size} selected</span>
      <button class="btn btn-primary" data-label="CONTINUE" onclick="PLAYR_AUTH_UI.obSportsNext(this)">CONTINUE →</button></div>`;
  }
  if(obStep===3){
    const recs=obRecs();
    root.innerHTML=`
    <div class="ob-step-head"><h2 class="a-title">FOLLOW YOUR WORLD.</h2><p class="a-sub">Athletes, creators, teams and communities${obData.sports.length?" in "+obData.sports.slice(0,3).map(sportLabel).join(", ")+(obData.sports.length>3?"…":""):" you picked"}.</p></div>
    <div class="ob-follow-list" id="obFollows">${recs.map((r,i)=>`
      <div class="ob-follow" data-f="${i}">
        <div class="of-av" style="background-image:url('${r.img}')"></div>
        <div class="of-txt"><b>${esc(r.name)}</b><i>${esc(r.sub)}</i></div>
        <button class="of-btn" data-on="0" onclick="PLAYR_AUTH_UI.obFollow(this,'${i}')">${r.kind==="community"?"JOIN":"FOLLOW"}</button>
      </div>`).join("")}</div>
    <div class="ob-foot"><span class="mono-num" id="obFollowCount">0 followed</span>
      <button class="btn btn-primary" data-label="CONTINUE" onclick="PLAYR_AUTH_UI.obNext()">CONTINUE →</button></div>`;
  }
  if(obStep===4){
    const u=A.user||{};
    root.innerHTML=`
    <div class="ob-step-head"><h2 class="a-title">CREATE YOUR PLAYR PROFILE.</h2><p class="a-sub">This is how the community sees you.</p></div>
    <div class="a-form" id="aForm">
      <div class="ob-av-row">
        <div class="ob-big-av" id="obAv" style="background-image:url('${u.avatar||""}')">${u.avatar?"":esc((u.name||"P")[0].toUpperCase())}</div>
        <label class="a-photo"><input type="file" id="ob-photo" accept="image/*" onchange="PLAYR_AUTH_UI.obPhoto(this)"><span>📷 Upload photo</span></label>
      </div>
      <label class="a-field"><span>DISPLAY NAME</span><input id="ob-name" value="${esc(u.name||"")}"></label>
      <label class="a-field"><span>USERNAME</span><input id="ob-user" value="${esc(u.username||"")}" readonly></label>
      <label class="a-field"><span>BIO</span><input id="ob-bio" placeholder="Runner. Dreamer. Mumbai. ⚡" maxlength="120"></label>
      <label class="a-field"><span>LOCATION</span><input id="ob-loc" placeholder="Mumbai, India"></label>
      <label class="a-field static"><span>FAVOURITE SPORTS</span>
        <div class="ob-chips">${(obData.sports.length?obData.sports:["cricket"]).map(s=>`<i>${sportLabel(s)}</i>`).join("")}</div></label>
      <button class="btn btn-primary a-submit" data-label="COMPLETE PROFILE" onclick="PLAYR_AUTH_UI.obProfile(this)">COMPLETE PROFILE</button>
    </div>`;
  }
  if(obStep===5){
    const u=A.user||{};
    root.innerHTML=`<div class="ob-welcome">
      <img src="assets/brand/playr-mark.png" alt="" class="ob-mark">
      <h2 class="a-title xl">WELCOME TO PLAYR,<br>${esc((u.name||"PLAYER").split(" ")[0].toUpperCase())}.</h2>
      <p class="a-tag">ONE PASSION. ONE COMMUNITY.</p>
      <p class="ob-lead">Your sports world starts here.</p>
      <button class="btn btn-primary a-submit xl" onclick="PLAYR_AUTH_UI.obEnter()">ENTER PLAYR →</button>
    </div>`;
  }
}
UI.obNext=function(){ obStep++; renderOb(); };
UI.obSearch=function(q){
  const t=(q||"").toLowerCase();
  const list=(window.PS_searchSports&&q?PS_searchSports(q).slice(0,30).map(s=>s.id):quickSports);
  document.getElementById("obSports").innerHTML=obSportsHTML(list,new Set(obData.sports));
};
function obSportsHTML(list,sel){
  return list.map(id=>{ const s=getSport(id); if(!s) return "";
    return `<button class="ob-sport ${sel.has(id)?"on":""}" style="--accent:${PS_catOf(s).accent}" data-s="${id}" onclick="PLAYR_AUTH_UI.obPick('${id}')">
      <span>${s.icon}</span><b>${sportLabel(id)}</b><i class="ob-check">✓</i></button>`; }).join("");
}
UI.obPick=function(id){
  const i=obData.sports.indexOf(id);
  if(i>=0) obData.sports.splice(i,1); else obData.sports.push(id);
  const sel=new Set(obData.sports);
  document.querySelectorAll("#obSports .ob-sport").forEach(b=>b.classList.toggle("on",sel.has(b.dataset.s)));
  const c=document.getElementById("obCount"); if(c) c.textContent=obData.sports.length+" selected";
};
UI.obSportsNext=async function(btn){
  if(!obData.sports.length){ showToast("Pick at least one sport — there are 207 to choose from ⚡"); return; }
  busy(btn,true);
  try{
    await A.setSports(obData.sports.slice());
    // wire into the existing personalization engine (For You feed, challenges, events)
    obData.sports.forEach(id=>{ if(window.PS_follows&&!PS_isFollowing(id)) toggleFollowSport(id,null); });
    try{ localStorage.setItem("playr_onboarded_v1","1"); }catch(e){}
  }catch(e){}
  busy(btn,false,"CONTINUE"); obStep=3; renderOb();
};
function obRecs(){
  const out=[]; const sports=obData.sports.length?obData.sports:["cricket","running"];
  sports.slice(0,4).forEach(id=>{
    const s=getSport(id); if(!s||!window.PS_gen) return;
    PS_gen.athletes(s,1).forEach(a=>out.push({name:a.n,sub:a.role+" · "+sportLabel(id),img:img(id in IMGS?id:"running",200,200),kind:"athlete"}));
    PS_gen.communities(s,1).forEach(c=>out.push({name:c.n,sub:c.members+" members · community",img:img(id in IMGS?id:"cricket",200,200),kind:"community"}));
  });
  const uniq=[]; const seen=new Set();
  out.forEach(r=>{ if(!seen.has(r.name)&&uniq.length<8){seen.add(r.name);uniq.push(r);} });
  return uniq;
}
UI.obFollow=function(btn,i){
  const on=btn.dataset.on==="1";
  btn.dataset.on=on?"0":"1";
  btn.classList.toggle("on",!on);
  btn.textContent=(obRecs()[i].kind==="community"?"JOIN":"FOLLOW")+(on?"":"ED ✓");
  const n=document.querySelectorAll('.of-btn.on').length;
  const c=document.getElementById("obFollowCount"); if(c) c.textContent=n+" followed";
};
UI.obPhoto=async function(input){
  const photo=await readPhoto("ob-photo");
  if(photo){ const av=document.getElementById("obAv"); av.style.backgroundImage=`url('${photo}')`; av.textContent=""; window.__obPhoto=photo; }
};
UI.obProfile=async function(btn){
  const name=((document.getElementById("ob-name")||{}).value||"").trim();
  fieldErr("err-ob-name");
  if(!name){ fieldErr("err-ob-name","A display name is required."); return; }
  busy(btn,true);
  try{
    await A.updateProfile({ name, bio:((document.getElementById("ob-bio")||{}).value||"").trim(),
      location:((document.getElementById("ob-loc")||{}).value||"").trim(), avatar:window.__obPhoto||((A.user||{}).avatar||"") });
    busy(btn,false,"COMPLETE PROFILE"); showToast("Profile saved ✓");
  }catch(e){ busy(btn,false,"COMPLETE PROFILE"); }
  obStep=5; renderOb();
};
UI.obEnter=function(){ finishOnboarding(); };
function finishOnboarding(){
  closeModal("onboardModal");
  applyState(A.user);
  refreshWorld();
  switchView("home");
  showToast("Welcome to PLAYR — your world is ready 🎉");
  try{ window.scrollTo({top:0}); }catch(e){}
}
function refreshWorld(){
  try{ window.PS_refreshPersonalized&&PS_refreshPersonalized(); window.renderHomeNearYou&&renderHomeNearYou(); }catch(e){}
  try{ buildHomeV2(); renderHomeFeed(); }catch(e){}
}

/* ================= SESSION STATE + NAV ================= */
function applyState(user){
  document.querySelectorAll(".join-btn-desktop, .join-cta").forEach(b=>{
    if(user){ b.textContent="MY PLAYR"; b.dataset.authed="1"; }
    else { b.textContent="JOIN PLAYR"; delete b.dataset.authed; }
  });
  const dd=document.getElementById("ddProfileBody");
  if(dd) dd.innerHTML=user?authedMenu(user):anonMenu();
  if(user){
    const nameEl=document.querySelector("#profile-athlete .profile-name");
    const subEl=document.querySelector("#profile-athlete .profile-sub");
    const avEl=document.querySelector("#profile-athlete .profile-avatar");
    if(nameEl) nameEl.textContent=user.name;
    if(subEl) subEl.textContent=(user.sports||[]).slice(0,4).map(sportLabel).join(" · ").toUpperCase()+(user.location?" · "+user.location.toUpperCase():"");
    if(avEl){ avEl.style.backgroundImage=user.avatar?`url('${user.avatar}')`:AV.bg(user.name,user.gender); avEl.style.backgroundSize='cover'; }
    try{ localStorage.setItem("playr_onboarded_v1","1"); }catch(e){}
  }
}
function authedMenu(u){
  const av=u.avatar?`<div class="dd-avatar" style="background-image:url('${u.avatar}'); background-size:cover;"></div>`:`<div class="dd-avatar" style="background-image:${AV.bg(u.name,u.gender)}; background-size:cover;"></div>`;
  const item=(label,fn)=>`<div class="dropdown-item" style="cursor:pointer;" onclick="${fn}"><div><div class="dd-title">${label}</div></div></div>`;
  return `${av.replace("dd-avatar","dd-avatar dd-me")} 
    <div class="dropdown-item" style="cursor:pointer;" onclick="switchView('profile')"><div><div class="dd-title">${esc(u.name)}</div><div class="dd-sub">@${esc(u.username)} · View profile</div></div></div>
    ${item("My Sports","PLAYR_AUTH_UI.mySports()")}
    ${item("My Communities","switchView('communities')")}
    ${item("My Challenges","switchView('challenges')")}
    ${item("My Events","PLAYR_AUTH_UI.myEvents()")}
    ${item("PLAYR+","switchView('plus')")}
    ${item("Settings","PLAYR_AUTH_UI.settings()")}
    ${item("Log Out","PLAYR_AUTH_UI.logout()")}`;
}
function anonMenu(){
  return `<div class="dropdown-item" style="cursor:pointer;" onclick="switchView('profile')">
      <div class="dd-avatar" style="background:linear-gradient(135deg,var(--lime),var(--cyan));"></div>
      <div><div class="dd-title">Guest</div><div class="dd-sub">View demo profile</div></div></div>
    <div class="dropdown-item" style="cursor:pointer;" onclick="openAuth('signin')"><div><div class="dd-title" style="color:var(--lime);">Sign in</div></div></div>
    <div class="dropdown-item" style="cursor:pointer;" onclick="openAuth('signup')"><div><div class="dd-title">Create account</div></div></div>
    <div class="dropdown-item" style="cursor:pointer;" onclick="switchView('plus')"><div><div class="dd-title">Upgrade to PLAYR+</div></div></div>`;
}
UI.mySports=function(){
  const u=A.user; if(!u) return;
  const sports=(u.sports||[]).map(id=>`<button class="mini-sport" onclick="openSport('${id}')"><span class="ms-ic">${(getSport(id)||{}).icon||"🏅"}</span><span class="ms-n">${sportLabel(id)}</span></button>`).join("");
  openSheet("MY SPORTS", sports||"<p class='fy-empty'>No sports saved yet — pick some in Discover.</p>"+`<button class="btn btn-primary btn-sm" onclick="PLAYR_AUTH_UI.closeSheet();switchView('discover')">Choose sports</button>`);
};
UI.myEvents=function(){
  switchView("events");
  setTimeout(()=>{ const el=document.getElementById("myEventsSec"); if(el&&el.scrollIntoView) el.scrollIntoView({behavior:"smooth"}); },150);
};
UI.settings=function(){
  const u=A.user; if(!u) return;
  openSheet("SETTINGS", `
    <div class="set-row"><b>Account</b><span>${esc(u.email)}</span></div>
    <div class="set-row"><b>Auth mode</b><span>${A.mode()==="supabase"?"Supabase (connected)":"Local demo — connect Supabase in js/config.js"}</span></div>
    <div class="set-row"><b>Sports</b><span>${(u.sports||[]).length} followed</span></div>
    <div style="display:flex;gap:10px;margin-top:18px;">
      <button class="btn btn-ghost btn-sm" onclick="PLAYR_AUTH_UI.closeSheet();switchView('profile')">Edit profile</button>
      <button class="btn btn-ghost btn-sm" style="border-color:var(--coral);color:var(--coral);" onclick="PLAYR_AUTH_UI.logout()">Log out</button>
    </div>`);
};
UI.logout=async function(){
  UI.closeSheet();
  await A.signOut();
  applyState(null);
  switchView("home");
  showToast("Signed out — see you on the field 👋");
};
function openSheet(title,inner){
  UI.closeSheet();
  const ov=document.createElement("div"); ov.id="sheetModal"; ov.className="a-overlay";
  ov.innerHTML=`<div class="a-sheet"><button class="a-close" onclick="PLAYR_AUTH_UI.closeSheet()">✕</button>
    <h3 class="a-sheet-title">${title}</h3><div class="a-sheet-body">${inner}</div></div>`;
  ov.addEventListener("click",e=>{ if(e.target===ov) UI.closeSheet(); });
  document.body.appendChild(ov);
}
UI.closeSheet=function(){ closeModal("sheetModal"); };

/* ================= AUTH GATE ================= */
UI.require=function(after){
  if(A.user){ after&&after(); return true; }
  const ov=document.createElement("div"); ov.id="gateModal"; ov.className="a-overlay";
  ov.innerHTML=`<div class="a-gate">
    <img src="assets/brand/playr-wordmark.png" alt="PLAYR" class="a-logo-sm">
    <h3 class="a-title sm">JOIN PLAYR TO CONTINUE.</h3>
    <p class="a-sub">Create your sports identity to post, challenge and join.</p>
    <div class="a-gate-btns">
      <button class="btn btn-ghost" onclick="PLAYR_AUTH_UI.gateClose();openAuth('signin')">SIGN IN</button>
      <button class="btn btn-primary" onclick="PLAYR_AUTH_UI.gateClose();openAuth('signup')">CREATE ACCOUNT</button>
    </div>
    <button class="a-link center" onclick="PLAYR_AUTH_UI.gateClose()">Not now</button>
  </div>`;
  ov.addEventListener("click",e=>{ if(e.target===ov) UI.closeGate(); });
  document.body.appendChild(ov);
  return false;
};
UI.gateClose=function(){ closeModal("gateModal"); };
window.requireAuth=UI.require;

/* ================= INIT ================= */
UI.init=async function(){
  await A.init();
  applyState(A.user);
  A.onChange(applyState);
};
})();
