/* ============================================================
   PLAYR — AUTHENTICATION CORE
   ------------------------------------------------------------
   Two backends, one API:

   1. SUPABASE MODE — if js/config.js contains a real
      SUPABASE_URL + SUPABASE_ANON_KEY, supabase-js is loaded
      lazily from CDN and ALL auth goes through Supabase Auth
      (sign up / sign in / sign out / password reset / session
      persistence). Only the public anon key is ever used —
      the service_role key must NEVER go in frontend code.

   2. LOCAL DEMO MODE — no config: accounts + sessions live in
      localStorage (passwords hashed with SHA-256 where
      available). The complete journey works today; swapping
      in Supabase credentials later requires zero code changes.
   ============================================================ */
window.PLAYR_AUTH = (function(){
"use strict";
const LS_USERS="playr_users_v2", LS_SESSION="playr_session_v2";
const read=(k)=>{ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } };
const write=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };

let sb=null, sbTried=false, currentUser=null, listeners=[];

/* ---------- backend detection ---------- */
function configured(){
  const c=window.PLAYR_ENV||{};
  return !!(c.SUPABASE_URL && c.SUPABASE_ANON_KEY &&
    !/YOUR-|PLACEHOLDER|xxx/i.test(c.SUPABASE_URL+c.SUPABASE_ANON_KEY));
}
async function supa(){
  if(sb||sbTried) return sb;
  sbTried=true;
  if(!configured()) return null;
  try{
    await new Promise((res,rej)=>{ const s=document.createElement("script");
      s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"; s.onload=res; s.onerror=rej;
      document.head.appendChild(s); });
    sb=window.supabase.createClient(window.PLAYR_ENV.SUPABASE_URL, window.PLAYR_ENV.SUPABASE_ANON_KEY);
  }catch(e){ sb=null; }
  return sb;
}
const mode=()=> configured() ? "supabase" : "local";

/* ---------- password hashing (local mode only) ---------- */
async function hash(pw){
  try{
    const buf=await crypto.subtle.digest("SHA-256", new TextEncoder().encode("playr::"+pw));
    return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
  }catch(e){ // fallback (e.g. non-secure context) — demo mode only
    let h=5381; for(const ch of "playr::"+pw) h=(h*33)^ch.charCodeAt(0);
    return "djb2:"+((h>>>0).toString(16));
  }
}
const uuid=()=> (crypto.randomUUID?crypto.randomUUID():"u-"+Date.now()+"-"+Math.random().toString(36).slice(2,10));

/* ---------- error translation (never leak raw technical errors) ---------- */
function friendly(err){
  const raw=String(err&&err.message||err||"");
  if(/^(Incorrect|Email or password|That email|That username|Please |Too many|Network problem|In Supabase mode)/.test(raw)) return raw; // already friendly
  const msg=raw.toLowerCase();
  if(/invalid login credentials|invalid username or password/.test(msg)) return "Email or password is incorrect.";
  if(/user already registered|already been registered/.test(msg)) return "That email is already registered — try signing in instead.";
  if(/password should be at least/.test(msg)) return "Password must be at least 8 characters.";
  if(/unable to validate email|invalid format/.test(msg)) return "Please enter a valid email address.";
  if(/email not confirmed/.test(msg)) return "Please confirm your email first — check your inbox.";
  if(/rate limit|too many/.test(msg)) return "Too many attempts — please wait a moment and try again.";
  if(/failed to fetch|networkerror|network/.test(msg)) return "Network problem — check your connection and try again.";
  return "Something went wrong — please try again.";
}

/* ---------- local users ---------- */
const users=()=>read(LS_USERS)||[];
function findLocal(identifier){
  const id=identifier.trim().toLowerCase();
  return users().find(u=>u.email.toLowerCase()===id || u.username.toLowerCase()===id) || null;
}

/* ---------- map to PLAYR user shape ---------- */
const mapUser=(u,extra)=>Object.assign({
  id:u.id, email:u.email, name:u.name||u.full_name||"", username:u.username||"", gender:u.gender||"",
  avatar:u.avatar||u.profile_image||"", bio:u.bio||"", location:u.location||"",
  sports:u.sports||[]
}, extra||{});

/* ---------- API ---------- */
async function init(){
  if(mode()==="supabase"){
    const client=await supa();
    if(client){
      try{
        const { data } = await client.auth.getSession();
        if(data && data.session){
          const su=data.session.user, meta=su.user_metadata||{};
          currentUser=mapUser({ id:su.id, email:su.email, name:meta.full_name, username:meta.username, avatar:meta.avatar, bio:meta.bio, location:meta.location, sports:meta.sports });
        }
        client.auth.onAuthStateChange(async (evt, session)=>{
          if(evt==="SIGNED_OUT"){ currentUser=null; emit(); }
          else if(session){ const su=session.user, meta=su.user_metadata||{};
            currentUser=mapUser({ id:su.id, email:su.email, name:meta.full_name, username:meta.username, avatar:meta.avatar, bio:meta.bio, location:meta.location, sports:meta.sports }); emit(); }
        });
      }catch(e){ /* fall back to public mode silently */ }
    }
  } else {
    const s=read(LS_SESSION);
    if(s && s.userId){ const u=users().find(x=>x.id===s.userId); if(u) currentUser=mapUser(u); }
  }
  return currentUser;
}

async function signUp({name, username, email, password, gender, sport}){
  email=email.trim().toLowerCase(); username=username.trim().toLowerCase();
  if(mode()==="supabase"){
    const client=await supa();
    if(!client) throw new Error("Network problem — check your connection and try again.");
    const { data, error } = await client.auth.signUp({ email, password,
      options:{ data:{ full_name:name, username, gender, sports: sport?[sport]:[] } } });
    if(error) throw new Error(friendly(error));
    if(data && data.user && data.session){
      currentUser=mapUser({ id:data.user.id, email, name, username, gender, sports: sport?[sport]:[] });
      writeSession(); emit(); return { user:currentUser, confirmed:true };
    }
    return { confirmed:false }; // email confirmation required
  }
  if(findLocal(email) || users().find(u=>u.username===username)){
    const byEmail=!!findLocal(email);
    throw new Error(byEmail ? "That email is already registered — try signing in instead." : "That username is already taken — try another.");
  }
  const u={ id:uuid(), email, name:name.trim(), username, gender:gender||"", pw:await hash(password), avatar:"", bio:"", location:"", sports: sport?[sport]:[], created:new Date().toISOString() };
  const all=users(); all.push(u); write(LS_USERS, all);
  currentUser=mapUser(u); writeSession(); emit();
  return { user:currentUser, confirmed:true };
}

async function signIn({identifier, password}){
  if(mode()==="supabase"){
    const email=/^\S+@\S+\.\S+$/.test(identifier.trim()) ? identifier.trim().toLowerCase() : null;
    if(!email) throw new Error("In Supabase mode, please sign in with your email address.");
    const client=await supa();
    if(!client) throw new Error("Network problem — check your connection and try again.");
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if(error) throw new Error(friendly(error));
    const meta=(data.user.user_metadata||{});
    currentUser=mapUser({ id:data.user.id, email:data.user.email, name:meta.full_name, username:meta.username, avatar:meta.avatar, bio:meta.bio, location:meta.location, sports:meta.sports });
    writeSession(); emit(); return currentUser;
  }
  const u=findLocal(identifier);
  if(!u || u.pw!==await hash(password)) throw new Error("Email or password is incorrect.");
  currentUser=mapUser(u); writeSession(); emit(); return currentUser;
}

async function signOut(){
  if(mode()==="supabase" && sb){ try{ await sb.auth.signOut(); }catch(e){} }
  currentUser=null; localStorage.removeItem(LS_SESSION); emit();
}

async function resetPassword(email){
  email=email.trim().toLowerCase();
  if(mode()==="supabase"){
    const client=await supa();
    if(!client) throw new Error("Network problem — check your connection and try again.");
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo:location.origin+location.pathname });
    if(error) throw new Error(friendly(error));
    return true;
  }
  return true; // demo: message shown by UI
}

async function updateProfile(patch){
  if(!currentUser) return null;
  const next=Object.assign({}, currentUser, patch);
  if(mode()==="supabase" && sb){
    try{ await sb.from("profiles").upsert({ user_id:next.id, full_name:next.name, username:next.username, bio:next.bio, location:next.location, profile_image:next.avatar, sports:next.sports }); }catch(e){}
    try{ await sb.auth.updateUser({ data:{ full_name:next.name, username:next.username, avatar:next.avatar, bio:next.bio, location:next.location, sports:next.sports } }); }catch(e){}
  } else {
    const all=users(); const i=all.findIndex(u=>u.id===next.id);
    if(i>=0){ const keep=all[i].pw; all[i]=Object.assign({}, next, {pw:keep}); write(LS_USERS, all); }
    writeSession();
  }
  currentUser=next; emit(); return next;
}

function writeSession(){
  if(currentUser) write(LS_SESSION, { userId:currentUser.id, at:Date.now() });
}
function setSports(ids){
  return updateProfile({ sports:ids });
}

/* events */
function emit(){ listeners.forEach(f=>{ try{ f(currentUser); }catch(e){} }); }
function onChange(f){ listeners.push(f); }

return { init, signUp, signIn, signOut, resetPassword, updateProfile, setSports,
  get user(){ return currentUser; }, mode, configured, friendly, onChange };
})();
