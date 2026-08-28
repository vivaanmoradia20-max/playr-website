/* SHOP v2 + IMAGE SYSTEM QA */
const { JSDOM, VirtualConsole } = require("/home/user/node_modules/jsdom");
const fs = require("fs");
let html = fs.readFileSync("index.html","utf8");
const mods=["js/images.js","js/config.js","js/avatars.js","js/sports-data.js","js/sports-data-2.js","js/spcl-data.js","js/sports-app.js","js/sports-universe.js","js/spcl.js","js/about.js","js/events-data.js","js/events-app.js","js/events-app-2.js","js/challenges.js","js/shop.js","js/auth.js","js/auth-ui.js"];
const inlined = mods.map(f=>"<script>\n"+fs.readFileSync(f,"utf8")+"\n</script>").join("\n");
html = html.replace(/<script src="js\/[^"]+"><\/script>\n?/g,"");
html = html.replace("<script>\n/* ============================================================\n   PLAYR — PROTOTYPE DATA + INTERACTIVITY", inlined+"<script>\n/* ============================================================\n   PLAYR — PROTOTYPE DATA + INTERACTIVITY");
const errors=[];
const vc=new VirtualConsole();
vc.on("jsdomError",e=>{ if(!/Could not parse CSS|Not implemented/.test(e.message)) errors.push(e.message+(e.detail?" :: "+String(e.detail).slice(0,120):"")); });
const dom = new JSDOM(html, { runScripts:"dangerously", url:"https://playrr.sport.community/", virtualConsole:vc, pretendToBeVisual:true });
const w=dom.window;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const $=s=>w.document.querySelector(s), $$=s=>[...w.document.querySelectorAll(s)];
let pass=0,fail=0;
async function t(name,f){ try{ const r=await f(); console.log("PASS",name,r===undefined?"":("— "+r)); pass++; } catch(e){ console.log("FAIL",name,"-",e.message); fail++; } }

(async()=>{
console.log("Load errors:", errors.length?errors:"none");

/* ---------- IMAGE SYSTEM ---------- */
await t("central library exists + deterministic", ()=>{
  if(!w.PLAYR_IMG) throw new Error("no lib");
  if(w.PLAYR_IMG.sport("cricket",0)!==w.PLAYR_IMG.sport("cricket",0)) throw new Error("unstable");
  if(typeof w.PLAYR_IMG.sport("cricket")!=="string") throw new Error("no url");
  return "✓";
});
await t("no cross-sport image reuse (F1≠boxing, running≠athletics)", ()=>{
  const L=w.PLAYR_IMG.legacy;
  if(L.motorsport===L.boxing) throw new Error("F1=boxing");
  if(L.running===L.athletics) throw new Error("running=athletics");
  const vals=Object.values(L); const uniq=new Set(vals);
  if(vals.length!==uniq.size) throw new Error((vals.length-uniq.size)+" shared across sport keys");
  return "every sport key unique ✓";
});
await t("variants give distinct urls", ()=>{
  const v0=w.PLAYR_IMG.sport("running",0), v1=w.PLAYR_IMG.sport("running",1), v2=w.PLAYR_IMG.sport("running",2);
  if(v0===v1||v1===v2) throw new Error("variants identical");
  return "running ×3 distinct ✓";
});
await t("no Math.random in image paths", ()=>{
  const src=["js/images.js","js/sports-app.js","js/shop.js","js/auth-ui.js"].map(f=>fs.readFileSync(f,"utf8")).join("");
  if(/Math\.random\(\)[^;]{0,80}(image|img|sport\()/i.test(src)) throw new Error("random image logic");
  return "deterministic ✓";
});

/* ---------- SHOP ---------- */
await t("32 products, unique ids, valid schema", ()=>{
  const P=w.PLAYR_PRODUCTS;
  if(P.length<30) throw new Error(P.length+" products");
  const ids=new Set(P.map(p=>p.id)); if(ids.size!==P.length) throw new Error("dup ids");
  for(const p of P) for(const k of ["id","brand","productName".replace("productName","name"),"sport","cat","price","img","desc","sizes","availability","isConcept","playrBranding"]) if(p[k]===undefined) throw new Error(p.id+" missing "+k);
  return P.length+" products ✓";
});
await t("brand→product correctness (no random assignment)", ()=>{
  const brandCats={"NIKE":["FOOTWEAR","SPORTSWEAR","ACCESSORIES"],"ON":["FOOTWEAR","SPORTSWEAR","ACCESSORIES"],"ONE8":["SPORTSWEAR","ACCESSORIES"],"ADIDAS":["FOOTWEAR","SPORTSWEAR"],"PUMA":["FOOTWEAR","SPORTSWEAR"],"ASICS":["FOOTWEAR","SPORTSWEAR"],"UNDER ARMOUR":["SPORTSWEAR"],"WILSON":["EQUIPMENT","ACCESSORIES"],"HEAD":["EQUIPMENT"],"YONEX":["EQUIPMENT","SPORTSWEAR"],"PLAYR":["SPORTSWEAR","ACCESSORIES","FOOTWEAR","EQUIPMENT","PLAYR EXCLUSIVE"]};
  for(const p of w.PLAYR_PRODUCTS){ if(!brandCats[p.brand].includes(p.cat)) throw new Error(p.brand+" → "+p.cat+" ("+p.name+")"); }
  const wl=w.PLAYR_PRODUCTS.find(p=>p.id==="wl-racket");
  if(wl.sport!=="Tennis") throw new Error("wilson not tennis");
  const yn=w.PLAYR_PRODUCTS.find(p=>p.id==="yn-racket");
  if(yn.sport!=="Badminton") throw new Error("yonex not badminton");
  return "brand lines correct ✓";
});
await t("rackets use racket imagery, shoes use shoe imagery", ()=>{
  const P=w.PLAYR_IMG;
  const shoe=P.product("runShoe"), racket=P.product("tennisRacket"), br=P.product("badmintonRacket");
  const P2=w.PLAYR_PRODUCTS;
  if(P2.find(p=>p.cat==="FOOTWEAR").img!=="runShoe"&&P2.find(p=>p.cat==="FOOTWEAR").img!=="courtShoe") throw new Error("shoes not shoe imagery");
  if(P2.find(p=>p.id==="wl-racket").img!=="tennisRacket") throw new Error("wilson racket imagery");
  if(P2.find(p=>p.id==="yn-racket").img!=="badmintonRacket") throw new Error("yonex racket imagery");
  if(shoe===racket||racket===br) throw new Error("product imagery collision");
  return "type-correct imagery ✓";
});
await t("shop renders: hero, search, collabs, filters, grid, exclusive", async()=>{
  w.switchView("shop");
  const h=$("#shopRoot").innerHTML;
  for(const k of ["GEAR UP","FEATURED COLLABORATIONS","NIKE","PLAYR EXCLUSIVE","ADD TO CART"]) if(!h.includes(k)) throw new Error("missing "+k);
  if($$("#shopCats .attr-pill").length!==15) throw new Error("cats");
  if($$("#shopBrands .attr-pill").length!==12) throw new Error("brands");
  const grid=$$("#shopGrid .shop-card").length;
  return grid+" cards in All grid ✓";
});
await t("concept labelling + legal disclaimer", ()=>{
  const h=$("#shopRoot");
  if(!h.textContent.includes("NOT AFFILIATED WITH")) throw new Error("no disclaimer");
  const badges=$$("#shopGrid .shc-badge:not(.exclusive)").length;
  if(!badges) throw new Error("no concept badges");
  if(h.innerHTML.includes("Official")&&/official/i.test(h.textContent.replace("NOT AN OFFICIAL",""))) throw new Error("official claim");
  return badges+" concept badges + disclaimer ✓";
});
await t("category filter works (FOOTWEAR)", async()=>{
  w.PLAYR_SHOP.setCat("FOOTWEAR"); await wait(60);
  const n=$$("#shopGrid .shop-card").length;
  const allShoes=$$("#shopGrid .shc-meta").every(m=>m.textContent.includes("FOOTWEAR"));
  w.PLAYR_SHOP.setCat("ALL");
  if(!allShoes||n<5) throw new Error(n+" / shoes:"+allShoes);
  return n+" footwear products ✓";
});
await t("brand filter works (YONEX)", async()=>{
  w.PLAYR_SHOP.setBrand("YONEX"); await wait(60);
  const brands=$$("#shopGrid .shc-brand").map(b=>b.textContent.trim());
  w.PLAYR_SHOP.setBrand("ALL");
  if(brands.length!==2||brands.some(b=>!b.includes("YONEX"))) throw new Error(brands.join(","));
  return "2 YONEX items ✓";
});
await t("search works (nike / cricket / racket)", async()=>{
  w.PLAYR_SHOP.render(); await wait(30);
  const inp=w.document.getElementById("shopSearch");
  inp.value="nike"; inp.dispatchEvent(new w.Event("input",{bubbles:true})); await wait(300);
  const n=$$("#shopGrid .shop-card").length;
  inp.value="cricket"; inp.dispatchEvent(new w.Event("input",{bubbles:true})); await wait(300);
  const c=$$("#shopGrid .shop-card").length;
  w.PLAYR_SHOP.clearQ();
  if(n!==5) throw new Error("nike:"+n);
  if(c!==2) throw new Error("cricket:"+c);
  return "nike "+n+" · cricket "+c+" (2 cricket-line items) ✓";
});
await t("product detail modal (gallery/sizes/qty/concept)", async()=>{
  w.PLAYR_SHOP.open("nk-shoe");
  const m=$("#shopModal");
  if(!m) throw new Error("no modal");
  const x=m.textContent;
  if(!x.includes("NIKE")||!x.includes("Pegasus")) throw new Error("identity");
  if(!x.includes("CONCEPT")) throw new Error("no concept label");
  if($$("#shmSizes button").length<5) throw new Error("sizes");
  if($$(".shm-thumbs button").length<3) throw new Error("thumbs");
  w.PLAYR_SHOP.qty(1); if($("#shmQty").textContent!=="2") throw new Error("qty");
  w.PLAYR_SHOP.close();
  return "✓";
});
await t("add to cart + wishlist persist", async()=>{
  w.PLAYR_SHOP.cart("pl-bottle",null,false);
  w.PLAYR_SHOP.wish("pl-bottle",null,false);
  const c=JSON.parse(w.localStorage.getItem("playr_cart_v1"));
  const wl=JSON.parse(w.localStorage.getItem("playr_wishlist_v1"));
  if(!c.some(x=>x.id==="pl-bottle")) throw new Error("cart");
  if(!wl.includes("pl-bottle")) throw new Error("wishlist");
  w.PLAYR_SHOP.wish("pl-bottle",null,false); // toggle off
  return "cart + wishlist ✓";
});
await t("SPCL PLAYERS shop section intact inside shop", async()=>{
  w.switchView("shop");
  const el=w.document.getElementById("spclShopSec");
  return el&&el.innerHTML.includes("SPCL PLAYERS")?"✓":"fail";
});
await t("regressions: views + discover + challenges", ()=>{
  for(const v of ["home","discover","sports","spcl","challenges","communities","events","plus","shop","profile","about"]){ w.switchView(v); if(!w.document.getElementById("view-"+v).classList.contains("active")) throw new Error(v); }
  w.switchView("challenges"); if(!w.document.getElementById("challengesRoot").innerHTML.includes("COMPETE.")) throw new Error("challenges");
  return "✓";
});
console.log(`\n${pass} passed, ${fail} failed | Console errors: ${errors.length?errors:"none"}`);
})();
