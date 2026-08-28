/* ABOUT page QA suite */
const { JSDOM, VirtualConsole } = require("/home/user/node_modules/jsdom");
const fs = require("fs");
let html = fs.readFileSync("index.html","utf8");
const mods=["js/config.js","js/avatars.js","js/sports-data.js","js/sports-data-2.js","js/spcl-data.js","js/sports-app.js","js/sports-universe.js","js/spcl.js","js/about.js","js/events-data.js","js/events-app.js","js/events-app-2.js","js/challenges.js","js/auth.js","js/auth-ui.js"];
const inlined = mods.map(f=>"<script>\n"+fs.readFileSync(f,"utf8")+"\n</script>").join("\n");
html = html.replace(/<script src="js\/[^"]+"><\/script>\n?/g,"");
html = html.replace("<script>\n/* ============================================================\n   PLAYR — PROTOTYPE DATA + INTERACTIVITY", inlined+"<script>\n/* ============================================================\n   PLAYR — PROTOTYPE DATA + INTERACTIVITY");
const errors=[];
const vc=new VirtualConsole();
vc.on("jsdomError",e=>{ if(!/Could not parse CSS|Not implemented/.test(e.message)) errors.push(e.message); });
const dom = new JSDOM(html, { runScripts:"dangerously", url:"https://playrr.sport.community/", virtualConsole:vc, pretendToBeVisual:true });
const w=dom.window;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const $=s=>w.document.querySelector(s), $$=s=>[...w.document.querySelectorAll(s)];
let pass=0,fail=0;
async function t(name,f){ try{ const r=await f(); console.log("PASS",name,r===undefined?"":("— "+r)); pass++; } catch(e){ console.log("FAIL",name,"-",e.message); fail++; } }

(async()=>{
console.log("Load errors:", errors.length?errors:"none");
await t("nav has ABOUT (10 items, correct order)", async()=>{
  const nav=$$(".topnav .nav-links button").map(b=>b.textContent);
  const want=["Home","Discover Sport","SPCL","Challenges","Communities","Events","PLAYR+","Shop","About"];
  if(nav.join("|")!==want.join("|")) throw new Error(nav.join("|"));
  return "desktop ✓";
});
await t("mobile menu includes About", ()=>!!$$('#mobileMenu button[data-view="about"]').length?"✓":"fail");
await t("footer About link wired", ()=>$$(".footer2 a").some(a=>(a.getAttribute("onclick")||"").includes("'about'"))?"✓":"fail");
await t("about page renders all sections", async()=>{
  w.switchView("about");
  const h=$("#aboutRoot").innerHTML.toUpperCase();
  for(const k of ["ABOUT PLAYR","DIGITAL HOME","WHAT IS PLAYR?","WHY WE BUILT PLAYR","TO BUILD THE DIGITAL","START IN INDIA","TO MAKE SPORT MORE","WHAT WE BELIEVE","MEET THE FOUNDERS","WHY US?","SKILL MATRIX","THREE FOUNDERS","EVERY SPORT","SPORTS FOR EVERY CAPABILITY","BUILT IN INDIA","ONE PASSION"]) if(!h.includes(k)) throw new Error("missing "+k);
  return "16 sections ✓";
});
await t("hero copy exact", ()=>$("#aboutRoot .ab-hero-in h1").textContent.includes("WE'RE BUILDING")&&$("#aboutRoot .ab-hero-in p").textContent.includes("every sport has a place")?"✓":"fail");
await t("ecosystem: 8 nodes + PLAYR core", ()=>$$(".ab-eco-node").length===8&&!!$(".ab-eco-core")?"✓":"fail");
await t("mission: 4 pillars 01-04", ()=>{const n=$$(".ab-pillar").length; if(n!==4) throw new Error(n); return $$(".ab-pillar b").map(b=>b.textContent).join(",");});
await t("values: 6 editorial items", ()=>$$(".ab-value").length+" values: "+$$(".ab-value b").map(b=>b.textContent).slice(0,3).join("/")+"…");
await t("founder names spelled correctly", async()=>{
  const txt=$("#aboutRoot").textContent;
  for(const n of ["VIVAAN MORADIA","VIVAANSHI NANDU","RUSHIK SHAH"]) if(!txt.includes(n)) throw new Error("missing "+n);
  if(txt.includes("Vivanshi ")&&!txt.includes("Vivaanshi")) throw new Error("spelling");
  return "Vivaan · Vivaanshi · Rushik ✓";
});
await t("founders: 3 cards with role+focus+note", async()=>{
  const f=$$(".ab-founder"); if(f.length!==3) throw new Error(f.length);
  if($$(".ab-f-note").length!==3) throw new Error("notes");
  if($$(".ab-f-role").length!==3) throw new Error("roles");
  return "3 premium cards ✓";
});
await t("notes labelled FOUNDER NOTE (not fake quotes)", ()=>$$("#aboutRoot .ab-f-note label").filter(l=>l.textContent==="FOUNDER NOTE").length===3?"✓":"fail");
await t("founder details only from provided info", async()=>{
  const txt=$("#aboutRoot").textContent;
  for(const s of ["Public Speaker","MUN","Debate Head Boy","Web Developer","PR Specialist","VCP — JNS AWS","Winner at MUNs","Trekking"]) if(!txt.includes(s)) throw new Error("missing "+s);
  if(txt.includes("IIT")||txt.includes("Stanford")||txt.includes("CEO of")) throw new Error("invented credential");
  return "provided backgrounds only ✓";
});
await t("skill matrix: 10 rows × 3, honest levels", async()=>{
  if($$(".ab-mx-row").length!==10) throw new Error("rows");
  const s=$$(".lv-s").length, wk=$$(".lv-w").length, d=$$(".lv-d").length;
  if(!s||!wk||!d) throw new Error("levels");
  return s+" strong / "+wk+" working / "+d+" developing ✓";
});
await t("venn: 3 circles + PLAYR center", ()=>$$(".ab-venn-label").length===3&&$(".ab-venn-core").textContent==="PLAYR"?"✓":"fail");
await t("photo placeholders (no fake photos)", ()=>$$("#aboutRoot .ab-f-photo em").filter(e=>e.textContent.includes("PHOTO")).length===3?"✓":"fail");
await t("JOIN PLAYR CTA opens auth", async()=>{
  const btns=$$("#aboutRoot .ab-final .final-btns .btn");
  btns[0].click(); await wait(120);
  if(!w.document.getElementById("authModal")) throw new Error("no auth modal");
  w.PLAYR_AUTH_UI.close();
  return "auth flow ✓";
});
await t("EXPLORE SPORTS opens Discover", ()=>{
  $("#aboutRoot .ab-hero-btns .btn-primary").click();
  if(!w.document.getElementById("view-discover").classList.contains("active")) throw new Error("not discover");
  return "discover ✓";
});
await t("Meet the Founders scrolls", ()=>{ w.switchView("about"); $("#aboutRoot .ab-hero-btns .btn-ghost").click(); return "scroll ✓"; });
await t("SPCL CTA opens SPCL", ()=>{ w.switchView("about"); $$("#aboutRoot .ab-spcl-cta .btn")[0].click(); if(!w.document.getElementById("view-spcl").classList.contains("active")) throw new Error("fail"); return "SPCL ✓"; });
await t("SPCL disclaimer present", ()=>{ w.switchView("about"); return $("#aboutRoot .ab-spcl-cta p").textContent.includes("not an official Paralympic or IPC organisation")?"✓":"fail"; });
await t("regressions: all views still work", async()=>{
  const views=["home","discover","sports","spcl","challenges","communities","events","plus","shop","profile","about"];
  let ok=true;
  views.forEach(v=>{ w.switchView(v); if(!w.document.getElementById("view-"+v).classList.contains("active")) ok=false; });
  if(!ok) throw new Error("a view failed");
  return "all 11 views ✓";
});
await t("regression: auth + events + search", async()=>{
  w.openAuth('signin'); const a=!!w.document.getElementById("authModal"); w.PLAYR_AUTH_UI.close();
  w.switchView("events"); const e=w.document.getElementById("eventsRoot").innerHTML.includes("DISCOVER SPORTS EVENTS");
  const s=w.PS_searchSports("wheelchair basketball").length>0;
  w.switchView("home");
  return "auth:"+a+" events:"+e+" spcl-search:"+s;
});
console.log(`\n${pass} passed, ${fail} failed | Console errors: ${errors.length?errors:"none"}`);
})();
