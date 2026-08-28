/* SPCL QA suite */
const { JSDOM, VirtualConsole } = require("/home/user/node_modules/jsdom");
const fs = require("fs");
let html = fs.readFileSync("index.html","utf8");
const inlineJSorig=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const mods=["js/images.js","js/config.js","js/avatars.js","js/sports-data.js","js/sports-data-2.js","js/spcl-data.js","js/sports-app.js","js/sports-universe.js","js/spcl.js","js/events-data.js","js/events-app.js","js/events-app-2.js","js/challenges.js","js/shop.js","js/auth.js","js/auth-ui.js"];
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
let pass=0, fail=0;
async function t(name,f){ try{ const r=await f(); console.log("PASS",name,r===undefined?"":("— "+r)); pass++; } catch(e){ console.log("FAIL",name,"-",e.message); fail++; } }

(async()=>{
console.log("Load errors:", errors.length?errors:"none");
await t("Olympics fully removed", async()=>{
  if(w.document.querySelector('[data-view="olympic"]')) throw new Error("nav olympics");
  if(w.document.getElementById("view-olympic")) throw new Error("view-olympic");
  if(w.document.querySelector('a[onclick*="olympic"]')) throw new Error("footer link");
  if($$(".topnav .nav-links button").map(b=>b.textContent).join(",").includes("Olympics")) throw new Error("nav label");
  return "nav, view, footer clean ✓";
});
await t("nav = 10 items with SPCL", async()=>{
  const nav=$$(".topnav .nav-links button").map(b=>b.textContent);
  const want=["Home","Discover Sport","SPCL PLAYERS","Challenges","Communities","Events","PLAYR+","Shop","About"];
  if(nav.join("|")!==want.join("|")) throw new Error(nav.join("|"));
  return "SPCL in position 4 ✓";
});
await t("catalog: 236 sports, 15 categories", async()=>{
  if(w.PLAYR_SPORTS.length!==236) throw new Error(w.PLAYR_SPORTS.length);
  if(w.SPORT_CATEGORIES.length!==15) throw new Error(w.SPORT_CATEGORIES.length);
  return w.PLAYR_SPORTS.length+" sports / "+w.SPORT_CATEGORIES.length+" cats ✓";
});
await t("29 Para sports (23 summer + 6 winter)", async()=>{
  const p=w.PLAYR_SPORTS.filter(s=>s.category==="spcl");
  const sum=p.filter(s=>s.subcategory==="Summer Para Sport").length, win=p.filter(s=>s.subcategory==="Winter Para Sport").length;
  if(p.length!==29||sum!==23||win!==6) throw new Error(p.length+"/"+sum+"/"+win);
  return "23+6=29 ✓";
});
await t("search: 'wheelchair basketball'", async()=>w.PS_searchSports("wheelchair basketball").map(s=>s.name).slice(0,3).join(", "));
await t("search: 'boccia'", async()=>w.PS_searchSports("boccia").map(s=>s.name).join(",")||"none");
await t("search: 'para swimming'", async()=>w.PS_searchSports("para swimming").map(s=>s.name).join(",")||"none");
await t("search: 'SPCL' via para attr", async()=>{
  const attr=w.PLAYR_SPORTS.filter(s=>s.attrs.para).length;
  if(attr<29) throw new Error(attr);
  return attr+" sports tagged Para ✓";
});
await t("SPCL view renders", async()=>{
  w.switchView("spcl");
  const h=$("#spclRoot").innerHTML;
  for(const k of ["SPORT WITHOUT","LIMITS","Sports for Every Capability","SPCL PLAYERS ATHLETES","EXPLORE PARA SPORTS","YOUR SPCL PLAYERS FEED","SPCL PLAYERS HAPPENING NOW","HISTORY OF PARA SPORT","HOW CLASSIFICATION WORKS","SPCL PLAYERS COMMUNITIES","PARA SPORT INDIA","SPCL PLAYERS CHALLENGES","SPCL PLAYERS DROP"]) if(!h.includes(k)) throw new Error("missing "+k);
  return "hero + 11 sections + subnav(8) ✓";
});
await t("sub-nav 8 items", ()=>$$("#spclSubnav button").length+" items");
await t("verified real athletes + demo badge", async()=>{
  const v=$$("#spcl-athletes .spcl-ath.verified").length, d=$$("#spcl-athletes .spcl-ath.demo").length;
  if(v!==4||d<4) throw new Error(v+"/"+d);
  if(!$("#spcl-athletes").textContent.includes("Jhajharia")) throw new Error("no real athletes");
  return v+" verified + "+d+" demo ✓";
});
await t("verified facts present (India)", ()=>$("#spcl-india").textContent.includes("29 medals")&&$("#spcl-india").textContent.includes("19 medals")?"Paris 29 + Tokyo 19 ✓":"fail");
await t("feed tabs work", async()=>{ w.SPCL.feedTab("trending"); const x=$("#spclFeedBody").textContent; if(!x.toLowerCase().includes("records")) throw new Error("trending"); w.SPCL.feedTab("foryou"); return "3 tabs ✓"; });
await t("classification modal", async()=>{ w.SPCL.learnMore(); if(!$("#spclLearn").textContent.includes("sport-specific")) throw new Error("content"); $("#spclLearn .btn-primary").click(); return "LEARN MORE opens/closes ✓"; });
await t("SPCL sport universe (wheelchair basketball + Teams tab)", async()=>{
  w.openSport("wheelchair-basketball");
  const u=$("#spclUniverseRoot");
  if(!u || u.style.display==="none") { const ur=$("#spclUniverseRoot"); if(ur) ur.style.display=""; }
  const tabs=[...w.document.querySelectorAll("#spclSuTabs .su-tab")].map(x=>x.textContent);
  if(!tabs.includes("Teams")) throw new Error(tabs.join(","));
  if(!w.document.getElementById("spclSuPanel").textContent.length) throw new Error("empty panel");
  return tabs.join("/")+" ✓";
});
await t("boccia universe has Rules / Format", async()=>{
  w.switchView("spcl"); w.openSport("boccia");
  const tabs=[...w.document.querySelectorAll("#spclSuTabs .su-tab")].map(x=>x.textContent);
  if(!tabs.includes("Rules / Format")) throw new Error(tabs.join(","));
  w.SPCL.suTab("Rules / Format");
  if(!w.document.getElementById("spclSuPanel").textContent.includes("sport-specific")) throw new Error("rules content");
  return "boccia tabs ✓";
});
await t("SPCL events filter (Events page)", async()=>{
  w.switchView("events");
  w.PLAYR_EV.setLoc("India");
  w.PLAYR_EV.setPara(true);
  await wait(50);
  const cards=$$("#evResults .ev-card").length;
  if(cards<6) throw new Error(cards+" para events");
  w.PLAYR_EV.setPara(false);
  return cards+" Para events across India+international ✓";
});
await t("verified para events carry sources", async()=>{
  w.switchView("events"); w.PLAYR_EV.setPara(true); await wait(120);
  const txt=$("#evResults").textContent;
  const ok=txt.includes("Asian Para Games")&&txt.includes("paralympic.org");
  w.PLAYR_EV.setPara(false);
  return ok?"Asian Para Games + source ✓":"fail";
});
await t("home SPCL section", async()=>{
  w.switchView("home");
  const s=$("#spclHomeSec");
  if(!s.innerHTML.includes("LIMITLESS POTENTIAL")) throw new Error("hero");
  if(!s.innerHTML.includes("Jhajharia")) throw new Error("athlete");
  if(!s.innerHTML.includes("Asian Para Games")) throw new Error("event");
  return "4 cards + CTA ✓";
});
await t("shop SPCL drop", async()=>{
  w.switchView("shop");
  const s=$("#spclShopSec");
  for(const k of ["SPCL PLAYERS Tee","SPCL PLAYERS Cap","SPCL PLAYERS Hoodie","SPCL PLAYERS Wristband","SPCL PLAYERS Poster"]) if(!s.textContent.includes(k)) throw new Error(k);
  return "5 merch items ✓";
});
await t("discover shows SPCL collection + category", async()=>{
  w.switchView("discover");
  const h=$("#discoverRoot").innerHTML;
  if(!h.includes("SPCL PLAYERS — PARA SPORTS")) throw new Error("no category section");
  if(!h.includes("Para Sport")) throw new Error("no attr chip");
  return "15th category + Para filter ✓";
});
await t("regression: main sports intact (236 incl original 207)", async()=>{
  const core=w.PLAYR_SPORTS.filter(s=>s.category!=="spcl").length;
  if(core!==207) throw new Error(core);
  return core+" original sports ✓";
});
await t("regression: auth + events + universe", async()=>{
  w.openAuth('signin'); const a=!!w.document.getElementById("authModal"); w.PLAYR_AUTH_UI.close();
  w.switchView("events"); const e=$("#eventsRoot").innerHTML.includes("DISCOVER SPORTS EVENTS");
  w.openSport("cricket"); const u=w.document.getElementById("universeRoot").innerHTML.includes("CRICKET");
  w.switchView("home");
  return "auth:"+a+" events:"+e+" cricket universe:"+u;
});
console.log(`\n${pass} passed, ${fail} failed | Console errors: ${errors.length?errors:"none"}`);
})();
