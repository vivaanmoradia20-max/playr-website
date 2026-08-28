/* ============================================================
   PLAYR — CENTRAL VISUAL SYSTEM  (v2: zero photography)
   ------------------------------------------------------------
   Every visual on PLAYR resolves through this module. Photos are
   GONE: sports, products, communities, events and covers all use
   generated SVG visuals — gradient tiles with the sport's own
   glyph from the catalogue, line-art product illustrations and
   typographic brand monograms.

   GUARANTEES
   1. Correct mapping, always: a tile's glyph comes from the
      sport's own catalogue icon (Formula 1 → 🏎️, never 🥊).
   2. Deterministic: variant = index or hash of a content id.
      Deterministic only — never randomized; data URIs, zero network.
   3. Unique per content: hue + geometry shift per sport & variant,
      so no two cards share a visual unless they share a sport.
   4. Accessible: consumers pair every glyph with a text label;
      tiles carry <title> inside the SVG.

   See docs/images.md for the replacement/licensing notes.
   ============================================================ */
(function(){
"use strict";

/* ---------- base icon map (catalogue icons take priority at runtime) ---------- */
const ICONS={
  football:"⚽",cricket:"🏏",basketball:"🏀",tennis:"🎾",badminton:"🏸",
  swimming:"🏊",cycling:"🚴",running:"🏃",athletics:"🏃",boxing:"🥊",
  motorsport:"🏎️","formula-1":"🏎️",mountaineering:"🏔️",trekking:"🥾",
  surfing:"🏄",skiing:"⛷️",snowboard:"🏂",gymnastics:"🤸",wrestling:"🤼",
  archery:"🏹",volleyball:"🏐",hockey:"🏑",tabletennis:"🏓",golf:"⛳",
  chess:"♟️",esports:"🎮",fitness:"🏋️",weightlifting:"🏋️",judo:"🥋",
  parasport:"🔷",para:"🔷",default:"🏅"
};

/* ---------- hue families per sport key (deg) ---------- */
const HUES={
  football:145,cricket:80,basketball:28,tennis:130,badminton:190,
  swimming:195,cycling:200,running:75,athletics:65,boxing:12,
  motorsport:0,"formula-1":0,mountaineering:262,trekking:150,
  surfing:190,skiing:205,snowboard:210,gymnastics:300,wrestling:20,
  archery:45,volleyball:35,hockey:160,tabletennis:220,golf:120,
  chess:285,esports:255,fitness:15,weightlifting:15,judo:170,
  default:82
};

function iconFor(key){
  try{ const s=window.getSport&&getSport(key); if(s&&s.icon) return s.icon; }catch(e){}
  return ICONS[key]||ICONS.default;
}
function hueFor(key){
  try{
    const s=window.getSport&&getSport(key);
    if(s){ const c=(window.SPORT_CATEGORIES||[]).find(x=>x.id===s.category);
      if(c){ const m=c.accent.match(/#([0-9a-f]{6})/i); if(m){
        const n=parseInt(m[1],16), r=(n>>16)&255,g=(n>>8)&255,b=n&255;
        const mx=Math.max(r,g,b),mn=Math.min(r,g,b); let h=0;
        if(mx!==mn){ const d=mx-mn;
          h=mx===r?((g-b)/d+(g<b?6:0)):mx===g?((b-r)/d+2):((r-g)/d+4); h*=60; }
        return Math.round(h); } } }
  }catch(e){}
  return HUES[key]!=null?HUES[key]:HUES.default;
}
/* stable hash for string variants */
function hash(str){ let h=2166136261; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function vIndex(variant){ return typeof variant==="number"?variant:(variant?hash(String(variant))%7:0); }

const enc=s=>encodeURIComponent(s).replace(/'/g,"%27").replace(/"/g,"%22").replace(/#/g,"%23");

/* ---------- SPORT TILE: gradient + grid + glow + big glyph ---------- */
function tileSVG(key,variant,w,h,opts){
  opts=opts||{};
  const v=vIndex(variant), hue=hueFor(key), icon=opts.icon||iconFor(key);
  const ang=120+(v*37)%180;                       // deterministic angle per variant
  const hue2=(hue+40+(v*23))%360;
  const gx=25+((v*29)%50), gy=20+((v*31)%40);     // glow position drifts
  const W=w||800,H=h||900;
  const svg=
`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<title>${key} visual</title>
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${ang-90} .5 .5)">
<stop offset="0" stop-color="hsl(${hue} 65% 16%)"/><stop offset=".55" stop-color="hsl(${hue2} 55% 9%)"/><stop offset="1" stop-color="#0A0B0D"/>
</linearGradient>
<radialGradient id="r" cx="${gx}%" cy="${gy}%" r="70%"><stop offset="0" stop-color="hsl(${hue} 90% 60%)" stop-opacity=".22"/><stop offset="1" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#g)"/>
<rect width="${W}" height="${H}" fill="url(#r)"/>
<g stroke="hsl(${hue} 60% 70%)" stroke-opacity=".07">
<line x1="0" y1="${H/6}" x2="${W}" y2="${H/6}"/><line x1="0" y1="${H*2/6}" x2="${W}" y2="${H*2/6}"/><line x1="0" y1="${H/2}" x2="${W}" y2="${H/2}"/><line x1="0" y1="${H*4/6}" x2="${W}" y2="${H*4/6}"/><line x1="0" y1="${H*5/6}" x2="${W}" y2="${H*5/6}"/>
<line x1="${W/6}" y1="0" x2="${W/6}" y2="${H}"/><line x1="${W/3}" y1="0" x2="${W/3}" y2="${H}"/><line x1="${W/2}" y1="0" x2="${W/2}" y2="${H}"/><line x1="${W*2/3}" y1="0" x2="${W*2/3}" y2="${H}"/><line x1="${W*5/6}" y1="0" x2="${W*5/6}" y2="${H}"/>
</g>
<circle cx="${W-gx}%" cy="${H-gy}%" r="${Math.min(W,H)*.16}" fill="none" stroke="hsl(${hue2} 80% 65%)" stroke-opacity=".12" stroke-width="2"/>
<text x="50%" y="${opts.small?"54%":"52%"}" font-size="${Math.min(W,H)*(opts.small?.34:.42)}" text-anchor="middle" dominant-baseline="middle" filter="drop-shadow(0 ${Math.round(Math.min(W,H)*.03)}px rgba(0,0,0,.55))">${icon}</text>
<rect x="1.5" y="1.5" width="${W-3}" height="${H-3}" rx="0" fill="none" stroke="hsl(${hue} 70% 65%)" stroke-opacity=".1" stroke-width="3"/>
</svg>`;
  return "data:image/svg+xml;utf8,"+enc(svg);
}

/* ---------- PRODUCT LINE-ART (lime stroke silhouettes) ---------- */
const STROKE="#E0F808", CYAN="#46E0FF", DIM="#5E6472";
const ART={
  runShoe:`<path d="M40 150 C60 120 90 118 120 132 C150 146 175 150 205 158 C235 166 245 178 243 196 C241 212 228 220 205 220 L70 220 C50 220 38 208 38 190 Z" fill="none" stroke="${STROKE}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M60 190 L230 190" stroke="${CYAN}" stroke-width="5" stroke-opacity=".8"/>
    <path d="M95 132 L110 158 M130 140 L142 162" stroke="${DIM}" stroke-width="5"/>
    <circle cx="205" cy="200" r="9" fill="none" stroke="${CYAN}" stroke-width="4"/><circle cx="175" cy="205" r="9" fill="none" stroke="${CYAN}" stroke-width="4"/>`,
  tee:`<path d="M85 60 L115 45 Q140 66 165 45 L195 60 L215 95 L188 110 L188 205 Q140 218 92 205 L92 110 L65 95 Z" fill="none" stroke="${STROKE}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M115 45 Q140 70 165 45" stroke="${CYAN}" stroke-width="5" fill="none"/>
    <rect x="118" y="120" width="44" height="44" fill="none" stroke="${CYAN}" stroke-width="5" transform="rotate(12 140 142)"/>`,
  jersey:`<path d="M85 60 L115 45 Q140 66 165 45 L195 60 L218 96 L190 112 L190 208 Q140 222 90 208 L90 112 L62 96 Z" fill="none" stroke="${STROKE}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M92 150 Q140 168 188 150" stroke="${CYAN}" stroke-width="5" fill="none"/>
    <text x="140" y="192" font-size="26" text-anchor="middle" fill="${CYAN}" font-family="monospace" font-weight="bold">10</text>`,
  cap:`<path d="M60 150 Q60 82 140 82 Q220 82 220 150 Z" fill="none" stroke="${STROKE}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M220 150 Q268 152 272 170 Q240 176 220 170 Z" fill="none" stroke="${CYAN}" stroke-width="6"/>
    <circle cx="140" cy="82" r="8" fill="none" stroke="${CYAN}" stroke-width="5"/>
    <path d="M100 118 L180 118" stroke="${DIM}" stroke-width="4"/>`,
  bottle:`<rect x="105" y="60" width="70" height="24" rx="6" fill="none" stroke="${CYAN}" stroke-width="6"/>
    <path d="M100 84 L180 84 L188 210 Q188 232 140 232 Q92 232 92 210 Z" fill="none" stroke="${STROKE}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M112 140 L168 140" stroke="${CYAN}" stroke-width="5"/>
    <path d="M118 168 Q140 178 162 168" stroke="${STROKE}" stroke-width="4" fill="none"/>`,
  bag:`<path d="M70 110 L210 110 L222 216 Q222 232 204 232 L76 232 Q58 232 58 216 Z" fill="none" stroke="${STROKE}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M105 110 Q105 70 140 70 Q175 70 175 110" fill="none" stroke="${CYAN}" stroke-width="6"/>
    <path d="M92 168 L188 168" stroke="${CYAN}" stroke-width="5"/>
    <rect x="120" y="140" width="40" height="16" rx="4" fill="none" stroke="${STROKE}" stroke-width="4"/>`,
  tennisRacket:`<ellipse cx="140" cy="95" rx="58" ry="72" fill="none" stroke="${STROKE}" stroke-width="7"/>
    <path d="M92 60 L188 130 M92 130 L188 60 M140 24 L140 166 M84 95 L196 95" stroke="${DIM}" stroke-width="2.5"/>
    <path d="M140 167 L128 216 L152 216 Z" fill="none" stroke="${CYAN}" stroke-width="6" stroke-linejoin="round"/>`,
  badmintonRacket:`<ellipse cx="140" cy="92" rx="46" ry="62" fill="none" stroke="${STROKE}" stroke-width="7"/>
    <path d="M100 62 L180 122 M100 122 L180 62 M140 30 L140 154 M96 92 L184 92" stroke="${DIM}" stroke-width="2.5"/>
    <path d="M140 154 L150 214 L130 214 Z" fill="none" stroke="${CYAN}" stroke-width="6" stroke-linejoin="round"/>
    <circle cx="212" cy="180" r="11" fill="none" stroke="${CYAN}" stroke-width="5"/><path d="M204 172 L220 188 M220 172 L204 188" stroke="${CYAN}" stroke-width="3"/>`,
  dumbbell:`<path d="M80 140 L200 140" stroke="${STROKE}" stroke-width="10" stroke-linecap="round"/>
    <rect x="62" y="104" width="26" height="72" rx="8" fill="none" stroke="${STROKE}" stroke-width="7"/>
    <rect x="192" y="104" width="26" height="72" rx="8" fill="none" stroke="${STROKE}" stroke-width="7"/>
    <path d="M40 140 L62 140 M218 140 L240 140" stroke="${CYAN}" stroke-width="6" stroke-linecap="round"/>`,
  cricketBat:`<path d="M118 60 L162 60 L162 150 L186 178 L186 224 Q140 236 94 224 L94 178 L118 150 Z" fill="none" stroke="${STROKE}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M118 150 L162 150" stroke="${DIM}" stroke-width="4"/>
    <circle cx="216" cy="84" r="16" fill="none" stroke="${CYAN}" stroke-width="5"/>
    <path d="M118 74 L162 74" stroke="${CYAN}" stroke-width="3" stroke-opacity=".7"/>`,
  courtShoe:`<path d="M40 150 C60 122 92 120 122 134 C152 148 178 152 206 160 C236 168 246 180 244 198 C242 214 228 222 206 222 L70 222 C50 222 38 210 38 192 Z" fill="none" stroke="${STROKE}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M62 196 L232 196" stroke="${CYAN}" stroke-width="5"/><path d="M150 92 L162 134" stroke="${CYAN}" stroke-width="5" stroke-linecap="round"/>`
};
function productSVG(type,variant,w,h){
  const v=vIndex(variant);
  const art=ART[type]||ART.tee;
  const ang=140+(v*41)%160;
  const W=w||640,H=h||640;
  const svg=
`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 280 280">
<title>${type} product visual</title>
<defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${ang-90} .5 .5)">
<stop offset="0" stop-color="#1C1F24"/><stop offset="1" stop-color="#0C0D10"/></linearGradient>
<radialGradient id="pr" cx="50%" cy="34%" r="65%"><stop offset="0" stop-color="#E0F808" stop-opacity=".07"/><stop offset="1" stop-opacity="0"/></radialGradient></defs>
<rect width="280" height="280" fill="url(#pg)"/><rect width="280" height="280" fill="url(#pr)"/>
<circle cx="236" cy="44" r="52" fill="none" stroke="#46E0FF" stroke-opacity=".1" stroke-width="2"/>
${art}
</svg>`;
  return "data:image/svg+xml;utf8,"+enc(svg);
}

/* ---------- BRAND MONOGRAMS (typographic — no unofficial logo art) ---------- */
function brandSVG(brand){
  const word=(brand||"PLAYR").toUpperCase();
  const svg=
`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="96" viewBox="0 0 240 96">
<title>${word} monogram</title>
<rect x="2" y="2" width="236" height="92" rx="20" fill="#101208" stroke="#E0F808" stroke-opacity=".45" stroke-width="2.5"/>
<text x="120" y="52" font-size="${word.length>7?26:34}" text-anchor="middle" dominant-baseline="middle" fill="#F4F6F1" font-family="Arial Black, Arial, sans-serif" font-weight="900" letter-spacing="2">${word}</text>
<text x="120" y="76" font-size="11" text-anchor="middle" fill="#E0F808" font-family="monospace" letter-spacing="3">× PLAYR — CONCEPT</text>
</svg>`;
  return "data:image/svg+xml;utf8,"+enc(svg);
}

/* ---------- gradients for large covers ---------- */
function coverGrad(key,variant){
  const v=vIndex(variant), hue=hueFor(key), hue2=(hue+42)%360;
  return `radial-gradient(120% 90% at ${20+v*9}% 12%, hsl(${hue} 80% 55% / .16), transparent 55%), linear-gradient(${135+v*24}deg, hsl(${hue} 55% 13%) 0%, hsl(${hue2} 45% 8%) 48%, #0A0B0D 100%)`;
}

/* ---------- public API (back-compatible shapes) ---------- */
window.PLAYR_IMG={
  sport(key,variant,w,h){ return tileSVG(key,variant,w,h); },
  bg(key,variant,w,h){ return `url('${tileSVG(key,variant,w,h)}'), ${coverGrad(key,variant)}`; },
  cover(key,variant){ return coverGrad(key,variant); },
  url(keyOrId,variant,w,h){ return tileSVG(keyOrId,variant,w,h); },
  product(type,variant,w,h){ return productSVG(type,variant,w,h); },
  productBg(type,variant,w,h){ return `url('${productSVG(type,variant,w,h)}'), linear-gradient(160deg,#1C1F24,#0C0D10)`; },
  brandLogo(brand){ return brandSVG(brand); },
  icon(key){ return iconFor(key); },
  legacy:{}, families:ICONS
};

/* legacy IMG.* keys — now generated tiles (identical key list) */
["cricket","football","running","basketball","mountaineering","tennis","swimming","cycling","motorsport","athletics","boxing","golf","badminton","chess","esports","volleyball","hockey","tabletennis","gymnastics","surfing","skiing","trekking","fitness"].forEach(k=>{
  window.PLAYR_IMG.legacy[k]=tileSVG(k,0,800,900);
});

/* central visual registry for consumers that want icons directly */
window.PLAYR_VIS={
  icons:ICONS,
  icon:iconFor,
  brandLogo:brandSVG,
  tile:tileSVG
};
})();
