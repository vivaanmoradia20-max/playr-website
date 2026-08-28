/* ============================================================
   PLAYR — CENTRAL AVATAR SYSTEM
   ------------------------------------------------------------
   Generated sporty vector avatars (no stock photos, ever).
   Gender comes ONLY from an explicit profile field
   (male / female / non-binary / unknown → neutral athletic).
   Variant is derived from a stable hash of the user id/name,
   so the same person ALWAYS gets the same avatar across
   Challenges, Leaderboards, Communities, Feeds, Events,
   Discover, Profile — everywhere.

   Usage:
     AV.html({name:"Rhea Kapoor", size:44})          → inline <span>
     AV.bg("Rhea Kapoor")                            → CSS background url()
     AV.svg({id:"u1", gender:"female"})              → raw SVG string
   ============================================================ */
(function(){
"use strict";

/* ---- palettes (PLAYR: dark bg, lime/cyan accents) ---- */
const SKIN =["#F2C9A0","#E3B084","#C98E5D","#A9713F","#855427","#5F3A1E"];
const SKIND=["#E0B48C","#CE9C6E","#B07947","#935B31","#71441F","#4E2C15"];
const HAIR =["#14151A","#2E1E12","#5A3714","#8A5A22","#C9973C","#D9DBE2","#7A3B20"];
const JERSEY=[["#141519","#E0F808"],["#101722","#46E0FF"],["#151515","#F4F6F1"],["#E0F80812","#E0F808"],["#46E0FF14","#46E0FF"]];
const ACCENT=["#E0F808","#46E0FF","#F4F6F1"];

function hairPaths(gender, style, dk){
  if(gender==="male"){
    switch(style){
      case 0: return `<path d="M32 40 C32 26 40 21 50 21 C60 21 68 26 68 40 L68 36 C68 30 62 24 50 24 C38 24 32 30 32 36 Z" fill="${dk}"/><path d="M32 41 C33 28 40 22 50 22 C60 22 67 28 68 41 L68 44 C66 32 60 27 50 27 C40 27 34 32 32 44 Z" fill="${dk}"/>`;
      case 1: return `<path d="M31 42 C31 27 40 20 50 20 C60 20 69 27 69 42 C69 34 63 26 50 26 C37 26 31 34 31 42 Z" fill="${dk}"/><circle cx="38" cy="30" r="5.4" fill="${dk}"/><circle cx="46" cy="25.5" r="6" fill="${dk}"/><circle cx="55" cy="25.5" r="6" fill="${dk}"/><circle cx="62" cy="30" r="5.4" fill="${dk}"/>`;
      case 2: return `<path d="M33 40 C33 27 41 22 50 22 C59 22 67 27 67 40 L67 38 C67 31 61 26.5 50 26.5 C39 26.5 33 31 33 38 Z" fill="${dk}"/>`;
      default: return `<path d="M32 41 C33 28 40 22 50 22 C60 22 67 28 68 41 L68 45 L65 45 C65 34 59 28 50 28 C41 28 35 34 35 45 L32 45 Z" fill="${dk}"/><path d="M33 41 C34 29 41 23 50 23 C59 23 66 29 67 41 L67 43 C65 32 59 26.5 50 26.5 C41 26.5 35 32 33 43 Z" fill="${dk}"/>`;
    }
  }
  if(gender==="female"){
    switch(style){
      case 0: return `<path d="M31 52 C29 26 39 19 50 19 C61 19 71 26 69 52 L64 52 C66 32 60 25 50 25 C40 25 34 32 36 52 Z" fill="${dk}"/><path d="M30 44 C29 24 40 18 50 18 C60 18 71 24 70 44 L66 44 C66 29 59 24 50 24 C41 24 34 29 34 44 Z" fill="${dk}"/>`;
      case 1: return `<path d="M32 40 C32 26 40 21 50 21 C60 21 68 26 68 40 C68 31 61 25.5 50 25.5 C39 25.5 32 31 32 40 Z" fill="${dk}"/><circle cx="73.5" cy="46" r="7.5" fill="${dk}"/><path d="M71 50 C73 60 72 68 69 74 L65 72 C68 64 68 57 67 51 Z" fill="${dk}"/>`;
      case 2: return `<path d="M31 46 C30 25 40 19 50 19 C60 19 70 25 69 46 L64 46 C65 30 59 25 50 25 C41 25 35 30 36 46 Z" fill="${dk}"/><path d="M33 40 C33 27 41 23 50 23 C59 23 67 27 67 40 C67 32 60 28 50 28 C40 28 33 32 33 40 Z" fill="${dk}"/>`;
      default: return `<path d="M31 42 C31 26 40 20 50 20 C60 20 69 26 69 42 L69 46 L64 44 C64 31 58 25.5 50 25.5 C42 25.5 36 31 36 44 L31 46 Z" fill="${dk}"/><circle cx="38" cy="30" r="5.6" fill="${dk}"/><circle cx="46" cy="25" r="6.2" fill="${dk}"/><circle cx="55" cy="25" r="6.2" fill="${dk}"/><circle cx="62" cy="30" r="5.6" fill="${dk}"/>`;
    }
  }
  /* non-binary / neutral */
  switch(style){
    case 0: return `<path d="M32 42 C32 27 40 22 50 22 C60 22 68 27 68 42 L68 46 L63 44 C63 32 58 27 50 27 C42 27 37 32 37 44 L32 46 Z" fill="${dk}"/>`;
    case 1: return `<path d="M33 40 C33 28 41 23 50 23 C59 23 67 28 67 40 C67 33 60 28.5 50 28.5 C40 28.5 33 33 33 40 Z" fill="${dk}"/><circle cx="40" cy="30" r="5.2" fill="${dk}"/><circle cx="48" cy="26.5" r="5.8" fill="${dk}"/><circle cx="56" cy="27.5" r="5.4" fill="${dk}"/>`;
    default: return `<path d="M33 40 C33 27 41 23 50 23 C59 23 67 27 67 40 L67 42 C65 31 59 26 50 26 C41 26 35 31 33 42 Z" fill="${dk}"/><path d="M30 40 C31 30 38 26 42 26 C38 28 35 33 35 40 Z" fill="${dk}"/>`;
  }
}

/* stable hash → variant */
function hash(str){ let h=2166136261; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function rng(seed){ let a=seed; return function(){ a|=0; a=(a+0x6D2B79F5)|0; let t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; }; }

/* ============================================================
   DEMO USER REGISTRY — gender is an explicit profile field.
   Unknown names resolve to gender:"unknown" → neutral avatar.
   (PLAYR never guesses gender from names.)
   ============================================================ */
window.PLAYR_USERS={
  "Vivaan Moradia":{gender:"male",sport:"Cricket",xp:1840,streak:6},
  "Rhea Kapoor":{gender:"female",sport:"Running",xp:2310,streak:12},
  "Karan Mehta":{gender:"male",sport:"Cricket",xp:1240,streak:3},
  "Ava Chen":{gender:"female",sport:"Swimming",xp:3120,streak:18},
  "Farhan Ali":{gender:"male",sport:"Cycling",xp:1615,streak:7},
  "Simran Gill":{gender:"female",sport:"Trail Running",xp:980,streak:4},
  "Neel Shah":{gender:"male",sport:"Motorsport",xp:1120,streak:2},
  "Arjun Mehta":{gender:"male",sport:"Fitness",xp:2450,streak:21},
  "Kabir Shah":{gender:"male",sport:"Basketball",xp:2180,streak:9},
  "Zoya Khan":{gender:"female",sport:"Goalball",xp:860,streak:5},
  "Dev Solanki":{gender:"male",sport:"Cricket",xp:740,streak:1},
  "Meera Nair":{gender:"female",sport:"Para Swimming",xp:1090,streak:8},
  "Ishaan Verma":{gender:"male",sport:"Wheelchair Basketball",xp:1320,streak:10},
  "Tara Gomes":{gender:"female",sport:"Boccia",xp:540,streak:2},
  "Team Everest IN":{gender:"unknown",sport:"Mountaineering",xp:2210,streak:0},
  "Mumbai Runners":{gender:"unknown",sport:"Running",xp:3400,streak:0}
};
const genderOf=name=>{ const u=window.PLAYR_USERS[name]; return u?u.gender:"unknown"; };
const genderKey=g=>g==="male"||g==="female"?"g":"nb"; // nb = neutral bucket

/* ============================================================
   GENERATOR
   ============================================================ */
function svg(opts){
  const name=opts.name||"Player";
  const gender=(opts.gender && ["male","female","nonbinary","non-binary"].includes(opts.gender)) ? (opts.gender==="non-binary"?"nonbinary":opts.gender) : genderOf(name);
  const key=(genderKey(gender)==="g")?gender:"nonbinary";
  const seed=hash((opts.id||name)+"::"+key);
  const r=rng(seed);
  const skin=SKIN[Math.floor(r()*SKIN.length)], skd=SKIND[SKIN.indexOf(skin)]||SKIN[0];
  const dk=HAIR[Math.floor(r()*HAIR.length)];
  const [jbg,jstripe]=JERSEY[Math.floor(r()*JERSEY.length)];
  const accent=ACCENT[Math.floor(r()*ACCENT.length)];
  const style=Math.floor(r()*4);
  const headband=r()<.4;
  const gid="ag"+seed.toString(36);
  const hairStr=hairPaths(key,style,dk);
  const band=headband?`<path d="M33.5 37 C36 29 42 25.5 50 25.5 C58 25.5 64 29 66.5 37 L66.5 41 C63.5 34 58 31 50 31 C42 31 36.5 34 33.5 41 Z" fill="${accent}" opacity=".92"/>`:"";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${name} avatar">
  <defs>
    <radialGradient id="${gid}" cx="50%" cy="32%" r="75%"><stop offset="0%" stop-color="#1D2026"/><stop offset="100%" stop-color="#0F1114"/></radialGradient>
    <linearGradient id="${gid}j" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${jbg}"/><stop offset="100%" stop-color="#0C0D10"/></linearGradient>
  </defs>
  <rect width="100" height="100" rx="26" fill="url(#${gid})"/>
  <circle cx="50" cy="46" r="36" fill="${accent}" opacity=".07"/>
  <path d="M13 100 C17 76 33 67 50 67 C67 67 83 76 87 100 Z" fill="url(#${gid}j)"/>
  <path d="M13 100 C17 76 33 67 50 67 C67 67 83 76 87 100 L82 100 C79 80 66 72 50 72 C34 72 21 80 18 100 Z" fill="${jstripe}" opacity=".85"/>
  <rect x="43" y="55" width="14" height="15" rx="6" fill="${skd}"/>
  <ellipse cx="33.5" cy="44" rx="2.6" ry="3.4" fill="${skin}"/><ellipse cx="66.5" cy="44" rx="2.6" ry="3.4" fill="${skin}"/>
  <ellipse cx="50" cy="42" rx="16.5" ry="18.5" fill="${skin}"/>
  ${hairStr}${band}
  <ellipse cx="43.5" cy="43" rx="1.9" ry="2.4" fill="#14151A"/><ellipse cx="56.5" cy="43" rx="1.9" ry="2.4" fill="#14151A"/>
  <path d="M40.5 37.5 L46.5 36.8" stroke="${dk}" stroke-width="1.6" stroke-linecap="round"/><path d="M53.5 36.8 L59.5 37.5" stroke="${dk}" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M46.5 51.5 C48 53 52 53 53.5 51.5" stroke="${skd}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <rect x="0.8" y="0.8" width="98.4" height="98.4" rx="25.2" fill="none" stroke="${accent}" stroke-opacity=".28" stroke-width="1.6"/>
</svg>`;
}

/* ---------- public API ---------- */
const enc=s=>encodeURIComponent(s).replace(/'/g,"%27").replace(/"/g,"%22");
window.AV={
  svg,
  html(opts){ const size=(opts.size||44); return `<span class="playr-av" style="width:${size}px;height:${size}px;${opts.style||""}" title="${opts.name||""}" aria-hidden="false">${svg(opts)}</span>`; },
  bg(name,genderOverride){ const o={name}; if(genderOverride) o.gender=genderOverride; return `url('data:image/svg+xml;utf8,${enc(svg(o))}')`; },
  genderOf
};
})();
