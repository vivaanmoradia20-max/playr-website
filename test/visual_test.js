/* VISUAL SYSTEM AUDIT — zero photography, correct glyphs, uniqueness */
const fs=require("fs");
const path=require("path");
let pass=0,fail=0;
const t=(n,c)=>{ if(c){pass++;console.log("PASS",n);} else {fail++;console.log("FAIL",n);} };

/* 1. zero photographic references in runtime code */
const runtime=["index.html",...fs.readdirSync("js").filter(f=>f.endsWith(".js")).map(f=>"js/"+f)];
const hits=runtime.filter(f=>fs.readFileSync(f,"utf8").includes("images.unsplash"));
t("zero unsplash references in runtime files ("+runtime.length+" files)", hits.length===0);

/* 2. library-level checks (node) */
global.window=global; require(require("path").join(__dirname,"..","js","images.js"));
const P=window.PLAYR_IMG, dec=u=>decodeURIComponent(u);
const f1=dec(P.sport("formula-1")), bx=dec(P.sport("boxing"));
t("Formula 1 tile = 🏎️ (never 🥊)", f1.includes("🏎️")&&!f1.includes("🥊"));
t("Boxing tile = 🥊", bx.includes("🥊"));
t("F1 ≠ boxing tiles", P.sport("formula-1")!==P.sport("boxing"));
["running","cricket","football","swimming","cycling"].forEach(k=>{
  t(k+" variants distinct (v0/v1/v2/v3)", new Set([0,1,2,3].map(v=>P.sport(k,v))).size===4);
});
["runShoe","tee","jersey","cap","bottle","bag","tennisRacket","badmintonRacket","dumbbell","cricketBat"].forEach(p=>{
  t("product '"+p+"' = svg line-art", P.product(p).startsWith("data:image/svg+xml")&&dec(P.product(p)).includes("<svg"));
});
t("products visually distinct", new Set(["runShoe","courtShoe","tee","jersey"].map(p=>P.product(p))).size>=3);
["NIKE","ON","ONE8","ADIDAS","PUMA","ASICS","UNDER ARMOUR","WILSON","HEAD","YONEX","PLAYR"].forEach(b=>{
  const g=dec(P.brandLogo(b));
  t("brand monogram "+b+" (wordmark + CONCEPT)", g.includes(b)&&g.includes("CONCEPT"));
});
t("cover = pure CSS gradient", !P.cover("cricket").includes("url("));

/* 4. DOM pass: rendered surfaces use generated visuals */
const { JSDOM, VirtualConsole }=require("/home/user/node_modules/jsdom");
let html=fs.readFileSync("index.html","utf8");
const mods=["js/images.js","js/config.js","js/avatars.js","js/sports-data.js","js/sports-data-2.js","js/spcl-data.js","js/sports-app.js","js/sports-universe.js","js/spcl.js","js/about.js","js/events-data.js","js/events-app.js","js/events-app-2.js","js/challenges.js","js/shop.js","js/communities.js","js/auth.js","js/auth-ui.js","js/ai.js"];
const inlined=mods.map(f=>"<script>\n"+fs.readFileSync(f,"utf8")+"\n</script>").join("\n");
html=html.replace(/<script src="js\/[^"]+"><\/script>\n?/g,"");
html=html.replace("<script>\n/* ============================================================\n   PLAYR — PROTOTYPE DATA + INTERACTIVITY", inlined+"<script>\n/* ============================================================\n   PLAYR — PROTOTYPE DATA + INTERACTIVITY");
const vc=new VirtualConsole(); const errs=[];
vc.on("jsdomError",e=>{ if(!/Could not parse CSS|Not implemented/.test(e.message)) errs.push(e.message.slice(0,120)); });
(async()=>{
  const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://playrr.sport.community/",virtualConsole:vc,pretendToBeVisual:true});
  const w=dom.window; await new Promise(r=>setTimeout(r,900));
  const $=s=>w.document.querySelector(s), $$=s=>[...w.document.querySelectorAll(s)];
  /* catalogue-level checks in the real global environment */
  const PI=w.PLAYR_IMG, sports=w.PLAYR_SPORTS;
  const tiles=sports.map(x=>PI.sport(x.id,0));
  t("every sport tile unique ("+sports.length+" sports)", new Set(tiles).size===sports.length);
  const iconOK=sports.filter(x=>decodeURIComponent(PI.sport(x.id,0)).includes(x.icon)).length;
  t("every tile embeds its own catalogue icon ("+iconOK+"/"+sports.length+")", iconOK===sports.length);
  const para=sports.filter(x=>x.category==="spcl");
  t("SPCL PLAYERS glyphs respectful ("+para.length+" sports)", para.every(x=>/[\\u{1F3C0}\\u{1F3C6}\\u26BD\\u{1F3CF}\\u{1F6F9}]/u.test(x.icon) || ["🔷","♿","🥇","🏃","🏊","🏓","🏹","🏀","🎾","⚪","🥌","🏒","🎿","⛷","🎯","🥋","🤺","🛶","🚣","🏇","🤸","🏋️","🦶","🔱","🏉","🥅","🏐","💪","🧗","🐎","🏸","⚽","🚴","🏂"].some(e=>x.icon.includes(e))));
  // shop: product imgs are SVG data URIs
  w.switchView("shop");
  const imgs=$$("#shopGrid .shc-media img");
  t("shop product images = generated SVG ("+imgs.length+")", imgs.length>20&&imgs.every(i=>i.src.startsWith("data:image/svg+xml")));
  t("shop imgs carry alt text", imgs.every(i=>(i.alt||"").length>5));
  // communities: backgrounds are svg/gradient, no photos
  w.switchView("communities");
  const cimgs=$$("#communitiesRoot .coc-img");
  const bgOK=cimgs.every(e=>{ const b=e.getAttribute("style")||""; return b.includes("data:image/svg+xml")||b.includes("gradient")||e.classList.contains("icon"); });
  t("community covers = generated visuals ("+cimgs.length+" cards)", cimgs.length>=15&&bgOK);
  const cbgs=cimgs.map(e=>e.getAttribute("style")||"").filter(Boolean);
  t("community visuals unique per card", new Set(cbgs).size===cbgs.length);
  // discover: sport cards gradient tiles
  w.switchView("discover");
  const mosaic=$$("#mosaicGrid .mo-img");
  const moOK=mosaic.length>=6&&mosaic.every(e=>(e.getAttribute("style")||"").includes("data:image/svg+xml"));
  t("mosaic tiles generated ("+mosaic.length+")", moOK);
  // challenges leaderboard avatars = AV svg
  w.switchView("challenges");
  const avs=$$("#challengesRoot .playr-av svg");
  t("leaderboard avatars generated ("+avs.length+")", avs.length>=6);
  // home: no photo URLs anywhere in served DOM
  w.switchView("home");
  const photoURLs=(w.document.body.innerHTML.match(/images\.unsplash/g)||[]).length;
  t("zero photo URLs in rendered DOM", photoURLs===0);
  t("zero console errors", errs.length===0);
  console.log(`\n${pass} passed, ${fail} failed`+(errs.length?(" | errors: "+errs[0]):""));
  process.exit(fail?1:0);
})();
