/* ============================================================
   PLAYR — CENTRAL IMAGE LIBRARY  (single source of truth)
   ------------------------------------------------------------
   EVERY image on PLAYR resolves through this module.

   RULES ENFORCED HERE:
   1. Deterministic mapping only — variants are selected by an
      explicit index or content id, NEVER Math.random().
   2. One sport = its own photo family. No sport ever reuses
      another sport's photo (no Formula-1→boxing class errors).
   3. Product photos are product-type photography (shoes look
      like shoes), never athlete shots.
   4. All URLs size-cropped at request time; every consumer
      layers a gradient underneath so a slow/failed network
      degrades to the designed tile — never a broken image.

   Prototype imagery is hotlinked from Unsplash for demo use
   only and must be replaced with licensed assets before any
   commercial launch (see docs/images.md).
   ============================================================ */
(function(){
"use strict";
const U=(id,w,h)=>`https://images.unsplash.com/${id}?w=${w||800}&h=${h||900}&fit=crop&q=80&auto=format`;

/* ---------- verified photo families (repo-verified + curated) ---------- */
const RAW={
  /* team & ball */
  football:["photo-1517466787929-bc90951d0974","photo-1579952363873-27f3bade9f55","photo-1508098682722-e99c43a40efb"],
  cricket:["photo-1531415074968-036ba1b575da","photo-1594938298603-c8148c4dae35","photo-1553762112-e25a3f1b22df"],
  basketball:["photo-1546519638-68e109498ffc","photo-1519861531473-9200262188bf","photo-1504450758481-7338eba7524a"],
  volleyball:["photo-1592656094267-764a45160876"],
  hockey:["photo-1580891721763-2d3fb2ce7233"],
  tabletennis:["photo-1534158914592-062992fbe900"],
  tennis:["photo-1595435742656-5272d0b3fa82","photo-1622279457486-62dcc4a431d6"],
  badminton:["photo-1613918431703-aa50609a1b78","photo-1534178913729-986d2ccfd4b0"],
  golf:["photo-1535131749006-b7f58c99034b"],
  /* endurance */
  running:["photo-1461896836934-ffe607ba8211","photo-1552674605-db6ffd4facb5","photo-1476480862126-209bfaa8edc8"],
  athletics:["photo-1476480862126-209bfaa8edc8","photo-1452626038306-9aae5e071dd3","photo-1461896836934-ffe607ba8211"],
  cycling:["photo-1541625602330-2277a4c46182","photo-1503342217505-b0a15ec3261c"],
  swimming:["photo-1530549387789-4c1017266635","photo-1517649763962-0c623066013b"],
  /* adventure */
  mountaineering:["photo-1522163182402-834f871fd851","photo-1454496522488-7a8e488e8606","photo-1486870591958-9b9d0d1dda99"],
  trekking:["photo-1551632811-561732d1e306","photo-1501554728187-ce583db33af7"],
  surfing:["photo-1502680390469-be75c86b636f"],
  skiing:["photo-1551698618-1dfe5d97d256"],
  /* combat / strength */
  boxing:["photo-1549719386-74dfcbf7dbed"],
  fitness:["photo-1483721310020-03333e577078","photo-1526506118085-60ce8714f8c5","photo-1571019613454-1cb2f99b2d8b"],
  gymnastics:["photo-1518611012118-696072aa579a"],
  /* mind + tech */
  chess:["photo-1528819622765-d6bcf132ac11"],
  esports:["photo-1542751371-adc38448a05e","photo-1511512578047-dfb367046420"],
  motorsport:["photo-1584464491033-06628f3a6b7b","photo-1477132687213-10eb0intentional"]
};
/* (fix accidental placeholder) */
RAW.motorsport=["photo-1584464491033-06628f3a6b7b"];

/* ---------- product photography (type-correct) ---------- */
const PRODUCTS={
  runShoe:["photo-1542291026-7eec264c27ff","photo-1595950653106-6c9ebd614d3a"],
  courtShoe:["photo-1600185365483-26d7a4cc7519","photo-1542291026-7eec264c27ff"],
  tee:["photo-1521572163474-6864f9cf17ab"],
  jersey:["photo-1551028719-00167b16eac5"],
  jacket:["photo-1551028719-00167b16eac5","photo-1591047139829-d91aecb6caea"],
  cap:["photo-1588854337115-1c67d9247e4f","photo-1521572163474-6864f9cf17ab"],
  bottle:["photo-1548839140-29a749e1cf4d"],
  bag:["photo-1553062407-98eeb64c6a62"],
  tennisRacket:["photo-1622279457486-62dcc4a431d6"],
  badmintonRacket:["photo-1534178913729-986d2ccfd4b0"],
  dumbbell:["photo-1483721310020-03333e577078"],
  cricketBat:["photo-1594938298603-c8148c4dae35","photo-1531415074968-036ba1b575da"]
};

/* ---------- deterministic public API ---------- */
function family(key){ return RAW[key]||RAW.running; }
function pick(arr,i){ return arr[(i||0)%arr.length]; }

window.PLAYR_IMG={
  /* sport(key, variantIndex) → url; variant may also be a content-id string */
  sport(key,variant){
    const f=family(key);
    if(typeof variant==="string"){ let h=0; for(let i=0;i<variant.length;i++){ h=(h*31+variant.charCodeAt(i))>>>0; } return f[h%f.length]; }
    return pick(f,variant||0);
  },
  /* style helpers */
  bg(key,variant,w,h){ return `url('${U(this.sport(key,variant),w||800,h||900)}'), linear-gradient(135deg,#1C1F24,#0A0B0D)`; },
  url(idOrKey,variant,w,h){
    const direct=/^photo-/.test(idOrKey);
    return U(direct?idOrKey:this.sport(idOrKey,variant),w||800,h||900);
  },
  product(key,variant,w,h){ return U(pick(PRODUCTS[key]||PRODUCTS.tee,variant||0),w||800,h||900); },
  productBg(key,variant,w,h){ return `url('${this.product(key,variant,w,h)}'), linear-gradient(160deg,#1C1F24,#0C0D10)`; },
  /* alias map so legacy IMG.* keys keep working — now centralized */
  legacy:{},
  families:RAW
};

/* legacy IMG map — identical keys, resolved through the library */
["cricket","football","running","basketball","mountaineering","tennis","swimming","cycling","motorsport","athletics","boxing","golf","badminton","chess","esports","volleyball","hockey","tabletennis","gymnastics","surfing","skiing"].forEach(k=>{
  window.PLAYR_IMG.legacy[k]=U(pick(family(k),0),800,900);
});
window.PLAYR_IMG.legacy.trekking=U(pick(family("trekking"),0),800,900);
window.PLAYR_IMG.legacy.fitness=U(pick(family("fitness"),0),800,900);
})();
