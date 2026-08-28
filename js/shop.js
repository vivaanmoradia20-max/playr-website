/* ============================================================
   PLAYR — SHOP v2 : premium multi-brand sports marketplace
   ------------------------------------------------------------
   LEGAL MODEL
   • Brand-collab items are clearly labelled "× PLAYR — CONCEPT"
     (prototype explorations). PLAYR has NO affiliation with or
     licence from any brand shown. No "official partnership" is
     claimed anywhere.
   • PLAYR EXCLUSIVE items are genuinely PLAYR-branded.

   Data-driven: every product is one object in PLAYR_PRODUCTS —
   add a line, the whole shop (filters/search/cards/detail) picks
   it up automatically.
   ============================================================ */
(function(){
"use strict";
const P=window.PLAYR_IMG;
const INR=n=>"₹"+n.toLocaleString("en-IN");

/* ---------- reusable product structure ---------- */
const D=(o)=>Object.assign({gallery:null,sizes:["S","M","L","XL"],availability:"In stock",isConcept:true,playrBranding:"PLAYR wordmark — left chest",qty:1,tags:[]},o);
window.PLAYR_PRODUCTS=[
  /* NIKE */
  D({id:"nk-shoe",brand:"NIKE",name:"Pegasus-Style Running Shoes",sport:"Running",cat:"FOOTWEAR",price:11495,img:"runShoe",imgv:0,
    desc:"Responsive road-running shoes with a breathable engineered mesh upper — built for daily kilometres and tempo days alike.",sizes:["UK 6","UK 7","UK 8","UK 9","UK 10","UK 11"],playrBranding:"PLAYR tag — heel clip"}),
  D({id:"nk-jersey",brand:"NIKE",name:"Match Football Jersey",sport:"Football",cat:"SPORTSWEAR",price:3499,img:"jersey",imgv:0,
    desc:"Lightweight Dri-FIT match jersey with ventilated knit panels — the same silhouette the modern game is played in.",playrBranding:"PLAYR wordmark — right sleeve"}),
  D({id:"nk-tee",brand:"NIKE",name:"Dri-FIT Training Tee",sport:"Training",cat:"SPORTSWEAR",price:1995,img:"tee",imgv:0,
    desc:"Sweat-wicking training staple. Flat seams, standard fit, gym-to-street.",playrBranding:"PLAYR wordmark — back neck"}),
  D({id:"nk-cap",brand:"NIKE",name:"Aerobill Performance Cap",sport:"Training",cat:"ACCESSORIES",price:1295,img:"cap",imgv:0,
    desc:"Lightweight performance cap with moisture-wicking sweatband and adjustable closure.",sizes:["One Size"],playrBranding:"PLAYR loop tag — side"}),
  D({id:"nk-jacket",brand:"NIKE",name:"Shield Running Jacket",sport:"Running",cat:"SPORTSWEAR",price:7499,img:"jacket",imgv:1,
    desc:"Water-repellent running shell with chevron ventilation — made for monsoon tempo runs.",playrBranding:"PLAYR wordmark — left chest",availability:"Low stock"}),
  /* ON */
  D({id:"on-shoe",brand:"ON",name:"Cloud-Style Running Shoes",sport:"Running",cat:"FOOTWEAR",price:13999,img:"runShoe",imgv:1,
    desc:"CloudTec-style cushioning that lands soft and launches forward — the everyday neutral road shoe.",sizes:["UK 6","UK 7","UK 8","UK 9","UK 10"],playrBranding:"PLAYR tag — tongue"}),
  D({id:"on-tee",brand:"ON",name:"Performance Running Tee",sport:"Running",cat:"SPORTSWEAR",price:2499,img:"tee",imgv:0,
    desc:"Feather-light technical tee with reflective detail for low-light miles.",playrBranding:"PLAYR wordmark — hem"}),
  D({id:"on-ls",brand:"ON",name:"Long-Sleeve Running Top",sport:"Running",cat:"SPORTSWEAR",price:3299,img:"jacket",imgv:0,
    desc:"Brushed long-sleeve base layer for cold morning starts.",availability:"In stock",playrBranding:"PLAYR wordmark — sleeve"}),
  D({id:"on-cap",brand:"ON",name:"Running Cap",sport:"Running",cat:"ACCESSORIES",price:1999,img:"cap",imgv:0,sizes:["One Size"],
    desc:"Packable race-day cap with laser-cut ventilation.",playrBranding:"PLAYR loop tag — side"}),
  /* ONE8 */
  D({id:"one8-jersey",brand:"ONE8",name:"Cricket Training Jersey",sport:"Cricket",cat:"SPORTSWEAR",price:2999,img:"jersey",imgv:0,
    desc:"Cricket-inspired training jersey — breathable back panels, athletic cut for net sessions.",playrBranding:"PLAYR wordmark — right chest"}),
  D({id:"one8-tee",brand:"ONE8",name:"Training Tee",sport:"Training",cat:"SPORTSWEAR",price:1799,img:"tee",imgv:0,
    desc:"Soft-touch cotton-poly training tee with drop-tail hem.",playrBranding:"PLAYR tag — sleeve"}),
  D({id:"one8-cap",brand:"ONE8",name:"Cricket Cap",sport:"Cricket",cat:"ACCESSORIES",price:1199,img:"cap",imgv:0,sizes:["One Size"],
    desc:"Classic cricket training cap with moisture band.",playrBranding:"PLAYR wordmark — side"}),
  /* ADIDAS */
  D({id:"ad-jersey",brand:"ADIDAS",name:"Football Home Jersey",sport:"Football",cat:"SPORTSWEAR",price:3299,img:"jersey",imgv:0,
    desc:"AEROREADY football jersey with a fan-fit cut and woven crest zone.",playrBranding:"PLAYR wordmark — back neck"}),
  D({id:"ad-shoe",brand:"ADIDAS",name:"Adizero-Style Running Shoes",sport:"Running",cat:"FOOTWEAR",price:9999,img:"runShoe",imgv:0,
    desc:"Lightstrike-style trainer tuned for intervals and race-day pace.",sizes:["UK 6","UK 7","UK 8","UK 9","UK 10","UK 11"],playrBranding:"PLAYR tag — heel"}),
  D({id:"ad-shorts",brand:"ADIDAS",name:"Training Shorts",sport:"Training",cat:"SPORTSWEAR",price:1499,img:"tee",imgv:0,
    desc:"Moisture-managing training shorts with zip pocket.",playrBranding:"PLAYR wordmark — hem"}),
  D({id:"ad-track",brand:"ADIDAS",name:"Sereno Track Jacket",sport:"Training",cat:"SPORTSWEAR",price:4499,img:"jacket",imgv:1,
    desc:"Classic tricot track jacket — warm-ups, cool-downs, matchday rows.",playrBranding:"PLAYR wordmark — chest"}),
  /* PUMA */
  D({id:"pm-tee",brand:"PUMA",name:"Football Fan Tee",sport:"Football",cat:"SPORTSWEAR",price:1299,img:"tee",imgv:0,
    desc:"Cotton fan tee with oversized back print.",playrBranding:"PLAYR tag — sleeve"}),
  D({id:"pm-shoe",brand:"PUMA",name:"Velocity Running Shoes",sport:"Running",cat:"FOOTWEAR",price:8999,img:"runShoe",imgv:1,
    desc:"Snappy everyday rocker with a plush heel ride.",sizes:["UK 6","UK 7","UK 8","UK 9","UK 10"],playrBranding:"PLAYR tag — tongue"}),
  D({id:"pm-top",brand:"PUMA",name:"Training Top",sport:"Training",cat:"SPORTSWEAR",price:1899,img:"tee",imgv:0,
    desc:"dryCELL training top with raglan sleeves for full range.",playrBranding:"PLAYR wordmark — back"}),
  /* ASICS */
  D({id:"as-shoe",brand:"ASICS",name:"Gel-Style Running Shoes",sport:"Running",cat:"FOOTWEAR",price:10495,img:"runShoe",imgv:0,
    desc:"GEL-cushioned stability workhorse — the long-run specialist.",sizes:["UK 6","UK 7","UK 8","UK 9","UK 10","UK 11"],playrBranding:"PLAYR tag — heel clip"}),
  D({id:"as-tee",brand:"ASICS",name:"Performance Tee",sport:"Running",cat:"SPORTSWEAR",price:2199,img:"tee",imgv:0,
    desc:"Flat-lock performance tee that stays put at pace.",playrBranding:"PLAYR wordmark — hem"}),
  /* UNDER ARMOUR */
  D({id:"ua-comp",brand:"UNDER ARMOUR",name:"Compression Training Top",sport:"Training",cat:"SPORTSWEAR",price:2799,img:"tee",imgv:0,
    desc:"Second-skin compression top with four-way stretch.",sizes:["S","M","L","XL","XXL"],playrBranding:"PLAYR wordmark — chest"}),
  D({id:"ua-shorts",brand:"UNDER ARMOUR",name:"Training Shorts",sport:"Training",cat:"SPORTSWEAR",price:1799,img:"tee",imgv:0,
    desc:"Light woven shorts with sweat-wicking liner.",playrBranding:"PLAYR tag — hem"}),
  /* WILSON / HEAD / YONEX */
  D({id:"wl-racket",brand:"WILSON",name:"Pro Staff-Style Tennis Racket",sport:"Tennis",cat:"EQUIPMENT",price:18999,img:"tennisRacket",imgv:0,sizes:["Grip 1","Grip 2","Grip 3"],
    desc:"Control-oriented graphite frame for aggressive ball-strikers.",playrBranding:"PLAYR band — handle",availability:"Concept — not produced"}),
  D({id:"wl-balls",brand:"WILSON",name:"Tour Tennis Balls (3-Pack)",sport:"Tennis",cat:"ACCESSORIES",price:699,img:"tennisRacket",imgv:0,sizes:["One Pack"],
    desc:"Pressurised felt balls for match play.",playrBranding:"PLAYR ring — lid",availability:"In stock"}),
  D({id:"hd-racket",brand:"HEAD",name:"Radical-Style Tennis Racket",sport:"Tennis",cat:"EQUIPMENT",price:16499,img:"tennisRacket",imgv:0,sizes:["Grip 2","Grip 3"],
    desc:"Modern-player frame blending spin and stability.",playrBranding:"PLAYR band — handle",availability:"Concept — not produced"}),
  D({id:"yn-racket",brand:"YONEX",name:"Astrox-Style Badminton Racket",sport:"Badminton",cat:"EQUIPMENT",price:12499,img:"badmintonRacket",imgv:0,sizes:["G4 Grip"],
    desc:"Head-heavy smash frame with a slim-shaft profile.",playrBranding:"PLAYR band — cone",availability:"Concept — not produced"}),
  D({id:"yn-tee",brand:"YONEX",name:"Verycool Badminton Tee",sport:"Badminton",cat:"SPORTSWEAR",price:1899,img:"tee",imgv:0,
    desc:"Air-cooling badminton tee with stretch side panels.",playrBranding:"PLAYR wordmark — back"}),

  /* ---------- PLAYR EXCLUSIVE (genuinely ours) ---------- */
  D({id:"pl-tee",brand:"PLAYR",name:"PLAYR Performance Tee",sport:"Training",cat:"PLAYR EXCLUSIVE",price:1499,img:"tee",imgv:0,isConcept:false,
    desc:"The house tee — black, lime wordmark, built for everything.",playrBranding:"PLAYR wordmark — chest"}),
  D({id:"pl-hoodie",brand:"PLAYR",name:"PLAYR Training Hoodie",sport:"Training",cat:"PLAYR EXCLUSIVE",price:2499,img:"jacket",imgv:0,isConcept:false,
    desc:"Heavyweight fleece hoodie with the lime diamond, inner pocket.",sizes:["S","M","L","XL","XXL"],playrBranding:"PLAYR diamond — chest"}),
  D({id:"pl-cap",brand:"PLAYR",name:"PLAYR Running Cap",sport:"Running",cat:"PLAYR EXCLUSIVE",price:999,img:"cap",imgv:0,isConcept:false,sizes:["One Size"],
    desc:"Feather-light cap, reflective lime trim for night kms.",playrBranding:"PLAYR wordmark — front"}),
  D({id:"pl-bottle",brand:"PLAYR",name:"PLAYR Sports Bottle 750ml",sport:"Training",cat:"PLAYR EXCLUSIVE",price:899,img:"bottle",imgv:0,isConcept:false,sizes:["750ml"],
    desc:"Insulated steel bottle — cold for 12 hours, lime measurement strip.",playrBranding:"PLAYR wordmark — body"}),
  D({id:"pl-jersey",brand:"PLAYR",name:"PLAYR Training Jersey",sport:"Football",cat:"PLAYR EXCLUSIVE",price:1899,img:"jersey",imgv:0,isConcept:false,
    desc:"Two-tone training jersey for community scrimmages.",playrBranding:"PLAYR diamond — chest"}),
  D({id:"pl-bag",brand:"PLAYR",name:"PLAYR Gym Bag",sport:"Training",cat:"PLAYR EXCLUSIVE",price:2299,img:"bag",imgv:0,isConcept:false,sizes:["35L"],
    desc:"Kit-sized duffel with a ventilated boot tunnel and lime zips.",playrBranding:"PLAYR wordmark — side panel"})
];

const CATS=["ALL","RUNNING","CRICKET","FOOTBALL","TENNIS","BADMINTON","BASKETBALL","CYCLING","TRAINING","ADVENTURE","SPORTSWEAR","FOOTWEAR","EQUIPMENT","ACCESSORIES","PLAYR EXCLUSIVE"];
const BRANDS=["ALL","NIKE","ON","ONE8","ADIDAS","PUMA","ASICS","UNDER ARMOUR","WILSON","HEAD","YONEX","PLAYR"];

/* ---------- state ---------- */
const LSK_C="playr_cart_v1", LSK_W="playr_wishlist_v1";
const read=k=>{ try{ return JSON.parse(localStorage.getItem(k))||[]; }catch(e){ return []; } };
const write=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };
let F={cat:"ALL",brand:"ALL",q:"", view:null};

const byId=id=>window.PLAYR_PRODUCTS.find(p=>p.id===id);
const inCart=id=>read(LSK_C).some(x=>x.id===id);
const inWish=id=>read(LSK_W).includes(id);

/* ---------- gallery: main image + variants (deterministic) ---------- */
function galleryFor(p){
  const g=[P.product(p.img,p.imgv,900,900), P.product(p.img,(p.imgv||0)+1,900,900), P.sport(sportKey(p.sport),1,900,900), P.sport(sportKey(p.sport),2,900,900)];
  return g;
}
function sportKey(sport){ return ({Running:"running",Training:"fitness",Football:"football",Cricket:"cricket",Tennis:"tennis",Badminton:"badminton",Basketball:"basketball",Cycling:"cycling",Adventure:"trekking"})[sport]||"fitness"; }

/* ---------- card ---------- */
function cardHTML(p){
  const concept=p.isConcept&&p.brand!=="PLAYR";
  const wished=inWish(p.id);
  return `<div class="shop-card card" data-pid="${p.id}" onclick="PLAYR_SHOP.open('${p.id}')" tabindex="0" role="button" aria-label="${p.brand} ${p.name}, ${INR(p.price)}">
    <div class="shc-media" style="--acc:${p.brand==="PLAYR"?"var(--lime)":"#46E0FF"}">
      <img src="${P.product(p.img,p.imgv,640,640)}" alt="${p.brand} ${p.name} — PLAYR ${concept?"concept collaboration":"exclusive"}" loading="lazy" onerror="this.style.display='none'">
      ${concept?'<span class="shc-badge">× PLAYR — CONCEPT</span>':p.brand==="PLAYR"?'<span class="shc-badge exclusive">PLAYR EXCLUSIVE</span>':""}
      <button class="shc-wish ${wished?"on":""}" aria-label="Add ${p.name} to wishlist" onclick="event.stopPropagation();PLAYR_SHOP.wish('${p.id}',this)">${wished?"♥":"♡"}</button>
    </div>
    <div class="shc-body">
      <div class="shc-brand mono-num">${p.brand}${concept?' <em>× PLAYR</em>':""}</div>
      <b class="shc-name">${p.name}</b>
      <div class="shc-meta mono-num">${p.sport.toUpperCase()} · ${p.cat.toUpperCase()}</div>
      <div class="shc-row">
        <span class="shc-price">${INR(p.price)}</span>
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();PLAYR_SHOP.cart('${p.id}',this)">ADD TO CART</button>
      </div>
    </div>
  </div>`;
}

/* ---------- shop page ---------- */
function render(){
  const root=document.getElementById("shopRoot"); if(!root) return;
  if(F.view){ openDetail(F.view); F.view=null; }
  const q=F.q.trim().toLowerCase();
  const list=window.PLAYR_PRODUCTS.filter(p=>{
    if(F.cat!=="ALL"&&p.cat!==F.cat) return false;
    if(F.brand!=="ALL"&&p.brand!==F.brand) return false;
    if(q){ const hay=(p.brand+" "+p.name+" "+p.sport+" "+p.cat+" "+(p.tags||[]).join(" ")+" playr").toLowerCase();
      if(!q.split(/\s+/).every(w=>hay.includes(w))) return false; }
    return true;
  });
  const collabBrands=["NIKE","ON","ONE8","ADIDAS","PUMA"];

  root.innerHTML=`
  <div class="shop-hero">
    <div class="shop-hero-bg"></div>
    <div class="wrap">
      <div class="eyebrow">PLAYR Shop · Concept Marketplace</div>
      <h1 class="section-title">GEAR UP.<br>GAME DAY.</h1>
      <p class="shop-sub">Premium sports equipment and apparel — brand collaboration <em>concepts</em> and genuine PLAYR exclusives, all in one marketplace.</p>
      <div class="searchbar shop-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input id="shopSearch" placeholder="Search products, brands or sports…" value="${F.q.replace(/"/g,"&quot;")}" autocomplete="off">
        ${F.q?'<button class="sb-clear" onclick="PLAYR_SHOP.clearQ()">Clear</button>':""}
      </div>
    </div>
  </div>

  <div class="wrap">
    <div class="shop-legal mono-num">CONCEPT COLLABORATIONS ARE PROTOTYPE EXPLORATIONS — PLAYR IS NOT AFFILIATED WITH, OR LICENSED BY, ANY BRAND SHOWN.</div>

    <div class="cat-head" style="margin-top:34px;"><div class="cat-ic">✦</div><div><h3 class="cat-name">FEATURED COLLABORATIONS</h3><p class="cat-blurb">Imagined partnerships across the biggest names in sport.</p></div></div>
    <div class="shop-collabs">${collabBrands.map((b,i)=>`
      <button class="shop-collab" style="--i:${i}" onclick="PLAYR_SHOP.setBrand('${b}')">
        <b>${b} <em>× PLAYR</em></b><span>CONCEPT</span><i>VIEW LINE →</i>
      </button>`).join("")}
    </div>

    <div class="shop-filterbar">
      <div class="ev-f-group"><label>Category</label><div class="ev-f-chips" id="shopCats">${CATS.map(c=>`<button class="attr-pill ${F.cat===c?"on":""}" onclick="PLAYR_SHOP.setCat('${c}')">${c}</button>`).join("")}</div></div>
      <div class="ev-f-group"><label>Brand</label><div class="ev-f-chips" id="shopBrands">${BRANDS.map(b=>`<button class="attr-pill ${F.brand===b?"on":""}" onclick="PLAYR_SHOP.setBrand('${b}')">${b}</button>`).join("")}</div></div>
    </div>

    <div class="srp-head"><h3>${list.length} product${list.length!==1?"s":""}${F.brand!=="ALL"?" · "+F.brand:""}${F.cat!=="ALL"?" · "+F.cat:""}</h3></div>
    <div class="grid grid-4" id="shopGrid">${list.map(cardHTML).join("")||'<div class="empty-state card"><b>No products match.</b><p>Try another brand or clear the search.</p></div>'}</div>

    <div class="cat-head" style="margin-top:60px;"><div class="cat-ic" style="--x:var(--lime)">◆</div><div><h3 class="cat-name">PLAYR EXCLUSIVE</h3><p class="cat-blurb">Genuinely PLAYR — designed, owned and shipped by us.</p></div>
      <button class="btn btn-ghost btn-sm" style="margin-left:auto;" onclick="PLAYR_SHOP.setCat('PLAYR EXCLUSIVE')">View all →</button></div>
    <div class="grid grid-4">${window.PLAYR_PRODUCTS.filter(p=>p.brand==="PLAYR").map(cardHTML).join("")}</div>
  </div>`;
  const inp=document.getElementById("shopSearch");
  if(inp){ let t; inp.addEventListener("input",()=>{ clearTimeout(t); t=setTimeout(()=>{ F.q=inp.value; render(); const i2=document.getElementById("shopSearch"); if(i2){i2.focus(); i2.setSelectionRange(i2.value.length,i2.value.length);} },160); }); }
}

/* ---------- detail modal ---------- */
function openDetail(id){
  const p=byId(id); if(!p) return;
  const concept=p.isConcept&&p.brand!=="PLAYR";
  const gal=galleryFor(p);
  const wished=inWish(id);
  const ov=document.createElement("div"); ov.id="shopModal"; ov.className="a-overlay";
  ov.addEventListener("click",e=>{ if(e.target===ov) PLAYR_SHOP.close(); });
  ov.innerHTML=`<div class="shop-modal card" role="dialog" aria-label="${p.brand} ${p.name}">
    <button class="a-close" aria-label="Close" onclick="PLAYR_SHOP.close()">✕</button>
    <div class="shm-grid">
      <div class="shm-media">
        <div class="shm-main" id="shmMain" style="background-image:${P.productBg(p.img,p.imgv,900,900)}"></div>
        <div class="shm-thumbs">${gal.map((g,i)=>`<button aria-label="View image ${i+1}" onclick="document.getElementById('shmMain').style.backgroundImage='url(\\'${g}\\')'"><img src="${g}" alt="${p.name} view ${i+1}" loading="lazy" onerror="this.parentElement.style.display='none'"></button>`).join("")}</div>
        ${concept?'<div class="shm-concept">× PLAYR — CONCEPT COLLABORATION · NOT AN OFFICIAL PARTNERSHIP</div>':""}
      </div>
      <div class="shm-body">
        <div class="shm-brand mono-num">${p.brand}${concept?' <em>× PLAYR — CONCEPT</em>':p.brand==="PLAYR"?' <em class="lime">EXCLUSIVE</em>':""}</div>
        <h3 class="shm-name">${p.name}</h3>
        <div class="shm-meta mono-num">${p.sport.toUpperCase()} · ${p.cat.toUpperCase()} · ${p.availability.toUpperCase()}</div>
        <p class="shm-desc">${p.desc}</p>
        <div class="shm-block"><label class="mono-num">SIZE</label><div class="shm-sizes" id="shmSizes">${p.sizes.map((s,i)=>`<button class="${i===0?"on":""}" onclick="PLAYR_SHOP.size(this)">${s}</button>`).join("")}</div></div>
        <div class="shm-block"><label class="mono-num">QUANTITY</label>
          <div class="shm-qty"><button aria-label="Decrease quantity" onclick="PLAYR_SHOP.qty(-1)">−</button><span id="shmQty">1</span><button aria-label="Increase quantity" onclick="PLAYR_SHOP.qty(1)">+</button></div></div>
        <div class="shm-playr mono-num">PLAYR BRANDING — ${p.playrBranding.toUpperCase()}</div>
        <div class="shm-actions">
          <span class="shm-price">${INR(p.price)}</span>
          <button class="btn btn-primary" id="shmAdd" onclick="PLAYR_SHOP.cart('${p.id}',this,true)">ADD TO CART</button>
          <button class="btn btn-ghost shm-wish ${wished?"on":""}" onclick="PLAYR_SHOP.wish('${p.id}',this,true)">${wished?"♥ WISHLISTED":"♡ WISHLIST"}</button>
        </div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(ov);
  PLAYR_SHOP._qty=1;
}
window.PLAYR_SHOP={
  render, open:openDetail,
  close(){ const m=document.getElementById("shopModal"); if(m) m.remove(); },
  setCat(c){ F.cat=c; render(); },
  setBrand(b){ F.brand=b; F.cat="ALL"; render(); },
  clearQ(){ F.q=""; render(); },
  size(btn){ btn.parentElement.querySelectorAll("button").forEach(b=>b.classList.remove("on")); btn.classList.add("on"); },
  qty(d){ this._qty=Math.max(1,Math.min(9,(this._qty||1)+d)); const el=document.getElementById("shmQty"); if(el) el.textContent=this._qty; },
  cart(id,btn,fromModal){
    const p=byId(id); if(!p) return;
    const c=read(LSK_C); if(!c.some(x=>x.id===id)) c.push({id,qty:this._qty||1,size:p.sizes[0],when:Date.now()});
    write(LSK_C,c);
    if(fromModal){ this.close(); this.render(); }
    showToast(`${p.name} added to cart 🛒`);
  },
  wish(id,btn,fromModal){
    const w=read(LSK_W); const i=w.indexOf(id);
    if(i>=0){ w.splice(i,1); showToast("Removed from wishlist"); }
    else { w.push(id); showToast("Saved to wishlist ♥"); }
    write(LSK_W,w);
    if(fromModal){ this.close(); } else { this.render(); }
  }
};
window.initShopSystem=render;
})();
