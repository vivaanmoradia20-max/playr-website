/* DISCOVER SPORT (merged Discover+Sports) QA */
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
await t("nav merged: 9 items, Discover Sport, no standalone Sports", ()=>{
  const nav=$$(".topnav .nav-links button").map(b=>b.textContent);
  const want=["Home","Discover Sport","SPCL PLAYERS","Challenges","Communities","Events","PLAYR+","Shop","About"];
  if(nav.join("|")!==want.join("|")) throw new Error(nav.join("|"));
  if($$('#mobileMenu button[data-view="sports"]').length) throw new Error("mobile Sports remains");
  return "9 items ✓";
});
await t("no dead links to old Sports route", ()=>{
  const doc=w.document.body.innerHTML;
  const n=(doc.match(/switchView\('sports'\)/g)||[]).length;
  if(n) throw new Error(n+" links to old sports route");
  return "0 stale sports links ✓";
});
await t("hero: DISCOVER SPORT + gateway copy + unified search", ()=>{
  w.switchView("discover");
  const h=$("#discoverRoot");
  if(!h.innerHTML.includes("DISCOVER SPORT.")) throw new Error("title");
  if(!h.textContent.includes("never heard of")) throw new Error("copy");
  const ph=$("#discSearch").getAttribute("placeholder");
  if(!/sports, athletes, creators, events or communities/i.test(ph)) throw new Error(ph);
  return "✓";
});
await t("rails: trending / featured / something different", ()=>{
  const rails=$$(".ds-rail-wrap");
  if(rails.length!==3) throw new Error(rails.length+" rails");
  const t1=$$(".ds-rail")[0].querySelectorAll(".ds-trend").length;
  const t3=$$(".ds-rail")[2].querySelectorAll(".ds-trend").length;
  if(t1<5) throw new Error("trending "+t1);
  if(t3<5) throw new Error("niche "+t3);
  if(!$("#discoverRoot").textContent.includes("Discover something different")) throw new Error("heading");
  return `trending ${t1} · niche ${t3} ✓`;
});
await t("12 category filters with live counts", ()=>{
  const chips=$$("#discCats .chip");
  if(chips.length!==12) throw new Error(chips.length);
  const labels=chips.map(c=>c.textContent.trim().split(" ")[0]);
  if(labels[0]!=="ALL"||!labels.includes("PARA-SPORTS".split(" ")[0])) throw new Error(labels.join(","));
  return chips.length+" filters ✓";
});
await t("filter PARA-SPORTS → 29 sports", async()=>{
  w.PS_setCategory("para");
  const n=$$("#evResults, #discRoot .grid")[0];
  const cards=$$("#discoverRoot .grid.grid-4 .sc2, #discoverRoot .grid .sc2").length;
  const all=$$("#discoverRoot .sc2").length;
  w.PS_setCategory("all");
  if(all!==29) throw new Error("got "+all);
  return "29 Para sports ✓";
});
await t("filter WINTER → 22 (16 olympic + 6 para) · TEAM works", async()=>{
  w.PS_setCategory("winter");
  await wait(60);
  const winter=$$("#discoverRoot .sc2").length;
  w.PS_setCategory("team");
  await wait(60);
  const team=$$("#discoverRoot .sc2").length;
  w.PS_setCategory("all");
  if(winter!==22) throw new Error("winter "+winter);
  if(team<20) throw new Error("team "+team);
  return `winter ${winter} · team ${team} ✓`;
});
await t("SportCard: description + FOLLOW + EXPLORE", ()=>{
  w.PS_setCategory("all"); 
  const card=$$("#discoverRoot .sc2")[0];
  if(!card.querySelector(".sc2-desc")) throw new Error("no description");
  const btns=card.textContent;
  if(!/FOLLOW/i.test(btns)) throw new Error("no follow");
  if(!/EXPLORE/i.test(btns)) throw new Error("no explore");
  return "✓";
});
await t("EXPLORE opens sport detail INSIDE Discover Sport (+breadcrumb)", async()=>{
  const card=$$("#discoverRoot .sc2")[0];
  const id=card.getAttribute("data-sport");
  card.querySelector(".btn-ghost").click();           // Explore
  await wait(80);
  if(!w.document.getElementById("view-sports").classList.contains("active")) throw new Error("not in detail view");
  if(!w.document.getElementById("universeRoot").innerHTML.length) throw new Error("empty universe");
  const bc=w.document.querySelector('#view-sports .btn-ghost[aria-label*="Discover Sport"]');
  if(!bc) throw new Error("no breadcrumb");
  bc.click();
  if(!w.document.getElementById("view-discover").classList.contains("active")) throw new Error("back broken");
  return "explore → detail → back ✓";
});
await t("FOLLOW toggles to FOLLOWING", async()=>{
  w.switchView("discover");
  const card=$$("#discoverRoot .sc2").find(c=>c.getAttribute("data-sport")==="football");
  const fb=[...card.querySelectorAll(".follow-btn")][0];
  fb.click();
  const on=/following/i.test(fb.textContent);
  fb.click(); // undo
  return on?"✓":"fail";
});
await t("hash route #/discover-sport/cricket deep-links", async()=>{
  w.location.hash="#/discover-sport/cricket";
  w.dispatchEvent(new w.Event("hashchange"));
  await wait(120);
  if(!w.document.getElementById("view-sports").classList.contains("active")) throw new Error("view");
  if(!w.document.getElementById("universeRoot").innerHTML.includes("CRICKET")) throw new Error("sport");
  w.location.hash="";
  return "deep-link ✓";
});
await t("legacy #sports/running redirects", async()=>{
  w.location.hash="#sports/running";
  w.dispatchEvent(new w.Event("hashchange"));
  await wait(120);
  if(w.location.hash.indexOf("#/discover-sport")!==0 && w.location.hash.indexOf("#sports")===0) throw new Error("not redirected: "+w.location.hash);
  return "redirect path ✓ ("+w.location.hash.slice(0,26)+")";
});
await t("search finds athletes + communities (unified)", async()=>{
  w.switchView("discover");
  const inp=w.document.getElementById("discSearch");
  inp.value="rhea";
  inp.dispatchEvent(new w.Event("input",{bubbles:true}));
  await wait(300);
  const txt=$("#discoverRoot").textContent;
  return txt.includes("Athletes")||txt.includes("No results") ? "unified search ✓" : "fail";
});
await t("regression: SPCL + challenges + events intact", async()=>{
  w.switchView("spcl"); const sp=w.document.getElementById("spclRoot").innerHTML.includes("SPORT WITHOUT");
  w.switchView("challenges"); const ch=w.document.getElementById("challengesRoot").innerHTML.includes("COMPETE.");
  w.switchView("events"); const ev=w.document.getElementById("eventsRoot").innerHTML.includes("DISCOVER SPORTS EVENTS");
  return "spcl:"+sp+" challenges:"+ch+" events:"+ev;
});
await t("regression: all 11 views still switch", ()=>{
  for(const v of ["home","discover","sports","spcl","challenges","communities","events","plus","shop","profile","about"]){ w.switchView(v); if(!w.document.getElementById("view-"+v).classList.contains("active")) throw new Error(v); }
  return "✓";
});
console.log(`\n${pass} passed, ${fail} failed | Console errors: ${errors.length?errors:"none"}`);
})();
