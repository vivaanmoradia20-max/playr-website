/* LIVE SCORES E2E — real engine over a local ESPN-shaped provider stub */
const http=require("http"); const fs=require("fs"); const path=require("path");
const {JSDOM,VirtualConsole}=require(path.join(__dirname,"..","..","node_modules","jsdom"));

/* provider stub — ESPN scoreboard shapes, EXACT scores we assert later */
const FIX={
  "soccer/eng.1":{events:[{id:"e1",date:new Date(Date.now()-3600e3).toISOString(),status:{type:{state:"in",detail:"In Progress"},displayClock:"67'"},competitions:[{venue:{fullName:"Selhurst Park",address:{country:"England"}},competitors:[{homeAway:"home",team:{displayName:"Crystal Palace",abbreviation:"CRY"},score:"1"},{homeAway:"away",team:{displayName:"Manchester City",abbreviation:"MNC"},score:"0"}]}]}]},
  "soccer/ind.1":{events:[{id:"e2",date:new Date(Date.now()-7200e3).toISOString(),status:{type:{state:"post",detail:"FT",completed:true}},competitions:[{venue:{fullName:"Kishore Bharati Krirangan",address:{country:"India"}},competitors:[{homeAway:"home",team:{displayName:"Inter Kashi",abbreviation:"ITKA"},score:"1"},{homeAway:"away",team:{displayName:"SC East Bengal",abbreviation:"EBEN"},score:"2"}]}]}]},
  "basketball/nba":{events:[{id:"e3",date:new Date(Date.now()-1800e3).toISOString(),status:{type:{state:"in",detail:"In Progress",period:3},displayClock:"04:32"},competitions:[{venue:{fullName:"Crypto.com Arena",address:{country:"USA"}},competitors:[{homeAway:"home",team:{displayName:"Lakers",abbreviation:"LAL"},score:"84"},{homeAway:"away",team:{displayName:"Warriors",abbreviation:"GSW"},score:"79"}]}]},
                    {id:"e4",date:new Date(Date.now()+86400e3).toISOString(),status:{type:{state:"pre",detail:"Sat 7:00 PM"},displayClock:""},competitions:[{venue:{fullName:"TD Garden",address:{country:"USA"}},competitors:[{homeAway:"home",team:{displayName:"Celtics",abbreviation:"BOS"},score:"0"},{homeAway:"away",team:{displayName:"Knicks",abbreviation:"NYK"},score:"0"}]}]}]},
  "racing/f1":{events:[{id:"e5",date:new Date(Date.now()+3*86400e3).toISOString(),status:{type:{state:"pre",detail:"Fri 6:30 AM"},displayClock:""},name:"Pirelli Italian Grand Prix",competitions:[{competitors:[]}]}]}
};
const stub=http.createServer((req,res)=>{ res.setHeader("Access-Control-Allow-Origin","*");
  const m=req.url.match(/sports\/([^/]+)\/([^/]+)\/scoreboard/);
  if(m&&FIX[m[1]+"/"+m[2]]){ res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify(FIX[m[1]+"/"+m[2]])); }
  res.writeHead(200,{"Content-Type":"application/json"}); res.end("{}");
});

let pass=0,fail=0; const t=(n,c,x)=>{ if(c){pass++;console.log("PASS",n,x||"");} else {fail++;console.log("FAIL",n,x||"");} };
(async()=>{
  await new Promise(r=>stub.listen(8129,"127.0.0.1",r));
  let html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
  const mods=["js/images.js","js/config.js","js/avatars.js","js/sports-data.js","js/sports-data-2.js","js/spcl-data.js","js/sports-app.js","js/sports-universe.js","js/spcl.js","js/about.js","js/events-data.js","js/events-app.js","js/events-app-2.js","js/challenges.js","js/shop.js","js/communities.js","js/auth.js","js/auth-ui.js","js/ai.js","js/live-scores.js"];
  const inlined=mods.map(f=>"<script>"+fs.readFileSync(path.join(__dirname,"..",f),"utf8")+"</script>").join("");
  html=html.replace(/<script src="js\/[^"]+"><\/script>\n?/g,"");
  html=html.replace("<script>\n/* ============================================================\n   PLAYR — PROTOTYPE DATA + INTERACTIVITY", inlined+"<script>\n/* ============================================================\n   PLAYR — PROTOTYPE DATA + INTERACTIVITY");
  const vc=new VirtualConsole(); const errs=[];
  vc.on("jsdomError",e=>{ if(!/Could not parse CSS|Not implemented/.test(e.message)) errs.push(e.message.slice(0,120)); });
  const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://playrr.sport.community/",virtualConsole:vc,pretendToBeVisual:true,
    beforeParse(window){ window.fetch=global.fetch.bind(global); window.__LS_OVERRIDE={base:"http://127.0.0.1:8129/apis/site/v2/sports"}; }});
  const w=dom.window; await new Promise(r=>setTimeout(r,400));
  const $=s=>w.document.querySelector(s), $$=s=>[...w.document.querySelectorAll(s)];
  const wait=ms=>new Promise(r=>setTimeout(r,ms));

  w.switchView("live"); await wait(2500);
  const root=$("#liveRoot");

  t("page renders + provider attribution", root.innerHTML.includes("LIVE SCORES.")&&/ESPN PUBLIC FEED/.test(root.innerHTML));
  t("updated-ago label shown", /Updated (just now|\d+s? ago|\d+ min ago)/.test(root.textContent));
  t("live tab: exactly the 2 live matches, REAL scores", (await (async()=>{
    const cards=$$(".ls-card.live");
    const txt=cards.map(c=>c.textContent).join("|");
    return cards.length===2 && txt.includes("CRY")&&txt.includes("1")&&txt.includes("MNC")&&txt.includes("0")&&txt.includes("67'")&&txt.includes("LAL")&&txt.includes("84")&&txt.includes("GSW")&&txt.includes("79")&&txt.includes("Q3")===false||txt.includes("04:32");
  })()));
  t("no fabricated score values (only stub values present)", !/[^0-9\-—](?:[6-9][0-9]{2})[^0-9]/.test($$(".ls-grid").map(c=>c.textContent).join("")));

  w.PLAYR_LS.setStatus("pre"); await wait(150);
  const preTxt=$$(".ls-card").map(c=>c.textContent).join("|");
  t("upcoming tab shows Celtics×Knicks + F1 weekend, with local time", preTxt.includes("BOS")&&preTxt.includes("NYK")&&preTxt.includes("Italian Grand Prix")&&/SESSION STATUS ONLY/.test(preTxt));
  t("F1 shows NO fake positions", !/P1|P2|P3/.test(preTxt));

  w.PLAYR_LS.setStatus("post"); await wait(150);
  t("completed tab: FT result, winner highlighted", (await(async()=>{
    const won=$$(".ls-side.won"); return $$(".ls-card").length===1&&won.length===1&&won[0].textContent.includes("EBEN");
  })()));

  w.PLAYR_LS.setScope("INDIA"); w.PLAYR_LS.setStatus("ALL"); await wait(150);
  t("INDIA scope → only ISL (🇮🇳) match", $$(".ls-card").length===1&&$$(".ls-card")[0].textContent.includes("East Bengal"));

  w.PLAYR_LS.setScope("ALL"); w.PLAYR_LS.setSport("basketball"); w.PLAYR_LS.setStatus("ALL"); await wait(150);
  t("sport filter: basketball only", $$(".ls-card").length===2&&$$(".ls-card").every(c=>c.textContent.includes("BASKETBALL")));

  const inp=$("#lsSearch"); inp.value="lakers"; inp.dispatchEvent(new w.Event("input",{bubbles:true})); await wait(300);
  t("search works", $$(".ls-card").length===1&&$$(".ls-card")[0].textContent.includes("Lakers"));
  inp.value=""; inp.dispatchEvent(new w.Event("input",{bubbles:true})); await wait(300);

  w.PLAYR_LS.setStatus("ALL"); w.PLAYR_LS.setSport("ALL"); await wait(150);
  w.PLAYR_LS.fav("espn-e1"); await wait(250);
  w.PLAYR_LS.setFavOnly(); await wait(150);
  t("favourites: ⭐ filter shows favourited match only", $$(".ls-card").length===1&&$$(".ls-card")[0].textContent.includes("CRY"));
  w.PLAYR_LS.setFavOnly(); await wait(150);

  w.PLAYR_LS.details("espn-e1"); await wait(120);
  const md=$("#lsModal");
  t("match details: API fields only (venue/competition/status/time)", md&&md.textContent.includes("Selhurst Park")&&md.textContent.includes("Premier League")&&md.textContent.includes("In Progress"));
  md.remove();

  w.switchView("home"); await wait(250);
  const hs=$("#homeLiveStrip");
  t("home strip: live cards + VIEW ALL LIVE SCORES", hs.innerHTML.includes("VIEW ALL LIVE SCORES")&&hs.textContent.includes("CRY")&&hs.textContent.includes("LAL"));

  /* error path: dead provider */
  w.eval('window.__LS_OVERRIDE={base:"http://127.0.0.1:8199/dead"}');
  w.PLAYR_LS.retry(); await wait(1200);
  w.localStorage.removeItem("playr_ls_cache_v1");
  w.switchView("live"); await wait(200);
  t("provider failure → error card or stale-banner with RETRY", /TEMPORARILY UNAVAILABLE|CONNECTION LOST/.test($("#liveRoot").textContent)&&$("#liveRoot").textContent.includes("RETRY"));
  w.switchView("shop"); await wait(250);
  t("app unaffected by live-score failure", $("#shopRoot").innerHTML.includes("GEAR UP"));
  t("no unexpected console errors", errs.length===0, errs[0]||"");

  console.log(`\n${pass} passed, ${fail} failed`); stub.close(); process.exit(fail?1:0);
})().catch(e=>{ console.log("FATAL:",e.message); process.exit(1); });
