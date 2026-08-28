const { JSDOM, VirtualConsole } = require("/home/user/node_modules/jsdom");
const fs = require("fs");
let html = fs.readFileSync("index.html","utf8");
const inlined = ["js/config.js","js/avatars.js","js/auth.js","js/auth-ui.js","js/sports-data.js","js/sports-data-2.js","js/spcl-data.js","js/sports-app.js","js/sports-universe.js","js/events-data.js","js/spcl.js","js/events-app.js","js/events-app-2.js","js/challenges.js"]
  .map(f=>"<script>\n"+fs.readFileSync(f,"utf8")+"\n</script>").join("\n");
html = html.replace(/<script src="js\/[^"]+"><\/script>\n?/g,"");
html = html.replace("<script>\n/* ============================================================\n   PLAYR — PROTOTYPE DATA + INTERACTIVITY", inlined+"<script>\n/* ============================================================\n   PLAYR — PROTOTYPE DATA + INTERACTIVITY");
const errors=[];
const vc=new VirtualConsole();
vc.on("jsdomError",e=>{ if(!/Could not parse CSS|Not implemented/.test(e.message)) errors.push(e.message+(e.detail?" :: "+String(e.detail).slice(0,140):"")); });
const dom = new JSDOM(html, { runScripts:"dangerously", url:"https://playrr.sport.community/", virtualConsole:vc, pretendToBeVisual:true });
const w=dom.window;
setTimeout(()=>{
  const t=(n,f)=>{try{const r=f();console.log("PASS",n,r===undefined?"":("— "+r));}catch(e){console.log("FAIL",n,"-",e.message);}};
  const $=s=>w.document.querySelector(s), $$=s=>[...w.document.querySelectorAll(s)];
  console.log("Load errors:", errors.length?errors:"none");
  // BRAND
  t("nav logo = official image", ()=>!!$(".topnav .logo-img")?"ok":"fail");
  t("nav logo src", ()=>$(".topnav .logo-img").getAttribute("src"));
  t("mobile menu logo", ()=>!!$("#mobileMenu .mm-brand img"));
  t("footer official lockup", ()=>!!($(".footer2 .f2-logo-img")?.getAttribute("src").includes("lockup")));
  t("favicon + apple icon links", ()=>!!$('link[rel="icon"]')&&!!$('link[rel="apple-touch-icon"]'));
  t("flywheel core = brand mark", ()=>!!$(".fly-core img"));
  t("onboarding has wordmark + tagline", ()=>{ w.PS_openOnboardingForce(); const m=$("#onboardingModal"); const ok=m.innerHTML.includes("playr-wordmark.png")&&m.innerHTML.toUpperCase().includes("ONE PASSION. ONE COMMUNITY."); m.remove(); return ok?"ok":"fail"; });
  t("fonts: Archivo loaded, Bebas gone", ()=>{ const h=$("head").innerHTML; return h.includes("Archivo")&&!h.includes("Bebas")?"ok":"fail"; });
  t("brand lime in CSS", ()=>{ const st=$("style").textContent; return st.includes("#E0F808")&&!st.includes("#C6FF3D")?"ok":"fail"; });
  t("hero lime highlight intact", ()=>!!$(".hero2-title span"));
  // FUNCTIONALITY
  t("home v2 renders", ()=>$("#eventsRoot")&&$("#heroStage .hc-card")?"ok":"fail");
  t("live/trending strip (LIVE default + chips)", ()=>{
    const live=w.document.querySelectorAll("#sportStrip .ss-live").length;
    const chips=w.document.querySelectorAll("#ltChips .lt-chip").length;
    w.HOME_LT.set("new"); const newN=w.document.querySelectorAll("#sportStrip .ss-new").length;
    w.HOME_LT.set("challenge"); const chal=w.document.querySelectorAll("#sportStrip .ss-chal").length;
    w.HOME_LT.set("live");
    if(chips!==4||live<3||newN<3||chal<3) throw new Error(`live:${live} new:${newN} chal:${chal} chips:${chips}`);
    return "4 chips × live/new/challenge filters ✓";
  });
  t("communities section (YOUR PEOPLE)", ()=>{
    const el=w.document.getElementById("homeCommunitiesSec");
    if(!el||!el.innerHTML.includes("YOUR PEOPLE")) throw new Error("missing");
    const n=el.querySelectorAll(".hc-com").length; if(n<4) throw new Error(n+" communities");
    return n+" community previews ✓";
  });
  t("PLAYR+ compact teaser", ()=>{
    const el=w.document.getElementById("plusTeaserSec");
    if(!el||!el.innerHTML.includes("TAKE YOUR SPORTS WORLD FURTHER")||!el.innerHTML.includes("₹365")) throw new Error("content");
    if(!el.innerHTML.includes("EXPLORE PLAYR+")) throw new Error("cta");
    return "₹365/year + features + CTA ✓";
  });
  t("events = HAPPENING NEAR YOU", ()=>{
    if(w.renderHomeNearYou) w.renderHomeNearYou();
    const el=w.document.getElementById("homeNearYou");
    return el&&el.innerHTML.includes("HAPPENING NEAR YOU")?"retitled ✓":"fail";
  });
  t("feed + rail", ()=>$$("#homeFeed .post").length+" posts, "+$$("#homeRail .rail-card").length+" rail cards");
  t("happening now", ()=>$$("#liveStrip .lc-card").length);
  t("mosaic", ()=>$$("#mosaicGrid .mo-card").length);
  t("flywheel REMOVED", ()=>!$$("#view-home .fly-node").length?"removed ✓":"still there");
  t("globe REMOVED + biz REMOVED", ()=>!$$("#view-home .globe-svg").length&&!$$("#view-home .biz-node").length?"removed ✓":"still there");
  t("cta collage", ()=>$$("#ctaCollage div").length);
  t("nav items (9)", ()=>$$(".nav-links button").length);
  t("switchView all", ()=>{ ["discover","sports","spcl","challenges","communities","events","plus","shop","profile","home"].forEach(v=>w.switchView(v)); return $("#view-home").classList.contains("active")?"all 10 views ok":"fail"; });
  t("discover renders", ()=>$("#discoverRoot").innerHTML.includes("DISCOVER YOUR SPORT")?"ok":"fail");
  t("universe opens", ()=>{ w.openSport("cricket"); const ok=$("#universeRoot").innerHTML.includes("CRICKET"); w.switchView("home"); return ok?"ok":"fail"; });
  t("spcl view", ()=>{ w.switchView("spcl"); const ok=$("#spclRoot").innerHTML.includes("SPORT WITHOUT"); w.switchView("home"); return ok?"ok":"fail"; });
  t("events page", ()=>{ w.switchView("events"); const ok=$("#eventsRoot").innerHTML.includes("DISCOVER SPORTS EVENTS"); w.switchView("home"); return ok?"ok":"fail"; });
  t("event detail + registration", ()=>{ w.openEventDetail("bkc-padel-open-demo"); w.openEventRegistration("bkc-padel-open-demo"); $("#regCat").value="Mixed Doubles"; w.PLAYR_EV.confirmReg("bkc-padel-open-demo"); return w.PLAYR_EV.isRegistered("bkc-padel-open-demo")?"ok":"fail"; });
  t("mobile menu opens", ()=>{ w.toggleMobileMenu(true); const ok=$("#mobileMenu").classList.contains("open"); w.toggleMobileMenu(false); return ok?"ok":"fail"; });
  console.log("Final errors:", errors.length?errors:"none");
}, 700);
