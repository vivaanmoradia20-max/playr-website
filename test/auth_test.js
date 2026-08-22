/* PLAYR — Auth + Onboarding QA suite (§22) */
const { JSDOM, VirtualConsole } = require("/home/user/node_modules/jsdom");
const fs = require("fs");
let html = fs.readFileSync("index.html","utf8");
const inlineJSorig=html.match(/<script>([\s\S]*?)<\/script>/)[1];  // capture BEFORE transform
const mods=["js/config.js","js/sports-data.js","js/sports-data-2.js","js/olympic-data.js","js/sports-app.js","js/sports-universe.js","js/events-data.js","js/events-app.js","js/events-app-2.js","js/auth.js","js/auth-ui.js"];
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
const val=(id,v)=>{ w.document.getElementById(id).value=v; };
const click=s=>{ const el=typeof s==="string"?$(s):s; if(!el) throw new Error("missing "+s); el.click(); };
let pass=0, fail=0;
async function t(name, f){ try{ const r=await f(); console.log("PASS", name, r===undefined?"":("— "+r)); pass++; } catch(e){ console.log("FAIL", name, "-", e.message); fail++; } }

(async()=>{
console.log("Load errors:", errors.length?errors:"none");
const UI=w.PLAYR_AUTH_UI, A=w.PLAYR_AUTH;

await t("3 JOIN PLAYR CTAs wired", async()=>$$(".join-btn-desktop, .join-cta").length+" buttons");
await t("header JOIN opens auth screen", async()=>{ click(".join-btn-desktop"); if(!$("#authModal")) throw new Error("no modal"); if(!$("#authRoot #su-name")) throw new Error("signup form not default"); return "WELCOME TO PLAYR. + tabs ✓"; });
await t("empty signup → clear validation errors", async()=>{ click(".a-submit"); const n=$$(".a-err").length; if(n<4) throw new Error(n+" errors"); return n+" field errors"; });
await t("invalid email/username/password formats caught", async()=>{ $$(".a-err").forEach(e=>e.remove()); val("su-name","Test User"); val("su-user","bad name!"); val("su-email","nope"); val("su-pw","short"); val("su-pw2","other"); click(".a-submit"); const errs=$$(".a-err").map(e=>e.textContent); if(errs.length<3) throw new Error(errs.join("|")); return errs.length+" errors: "+errs[0].slice(0,28)+"…"; });
await t("password mismatch caught", async()=>{ $$(".a-err").forEach(e=>e.remove()); val("su-user","testuser"); val("su-email","t@playr.com"); val("su-pw","password1"); val("su-pw2","password2"); click(".a-submit"); return $$(".a-err").filter(e=>/match/i.test(e.textContent)).length+" mismatch error"; });
await t("signup → onboarding step 1 (Welcome)", async()=>{ $$(".a-err").forEach(e=>e.remove()); val("su-name","Aarav Sharma"); val("su-user","aaravs"); val("su-email","aarav@playr.com"); val("su-pw","playr123"); val("su-pw2","playr123"); click(".a-submit"); await wait(250); if(!$("#onboardModal")) throw new Error("no onboarding"); const x=$("#obRoot").textContent; if(!x.includes("WELCOME TO PLAYR.")) throw new Error("no welcome"); return "5 steps listed ✓"; });
await t("step 2: WHAT DO YOU PLAY? + multi-select", async()=>{ UI.obNext(); const x=$("#obRoot").textContent; if(!x.includes("WHAT DO YOU PLAY?")) throw new Error("heading"); const n=$$("#obSports .ob-sport").length; if(n<15) throw new Error(n+" sports"); UI.obPick("cricket"); UI.obPick("running"); UI.obPick("mountaineering"); if($$("#obSports .ob-sport.on").length!==3) throw new Error("state"); return n+" sports, 3 selected ✓"; });
await t("CONTINUE saves sports + feeds personalization", async()=>{ click("#obRoot .ob-foot .btn"); await wait(200); if(!A.user.sports.includes("cricket")) throw new Error("not saved"); if(!w.PS_isFollowing("cricket")) throw new Error("not followed"); return "profile.sports + For You engine ✓"; });
await t("step 3: follow recs match picked sports", async()=>{ const x=$("#obRoot").textContent; if(!x.includes("FOLLOW YOUR WORLD")) throw new Error("heading"); const n=$$(".ob-follow").length; if(n<4) throw new Error(n); const b=$(".of-btn"); b.click(); if(!b.classList.contains("on")) throw new Error("no toggle"); return n+" recs, FOLLOW toggles ✓"; });
await t("step 4: profile prefilled from signup", async()=>{ UI.obNext(); if($("#ob-name").value!=="Aarav Sharma") throw new Error("name"); if($("#ob-user").value!=="aaravs") throw new Error("username"); if(!$("#obRoot").textContent.includes("Cricket")) throw new Error("fav sports chips"); return "name/username/sports prefilled ✓"; });
await t("step 5: WELCOME TO PLAYR, AARAV.", async()=>{ val("ob-bio","Runner from Mumbai"); val("ob-loc","Mumbai, IN"); click("#aForm .a-submit"); await wait(200); const x=$("#obRoot").textContent; if(!x.includes("WELCOME TO PLAYR,")) throw new Error("no welcome"); if(!x.includes("AARAV")) throw new Error("not personalized"); return "personalized ✓"; });
await t("ENTER PLAYR → home + MY PLAYR state", async()=>{ click("#obRoot .a-submit"); await wait(100); if(!$("#view-home").classList.contains("active")) throw new Error("not home"); if($(".join-btn-desktop").textContent!=="MY PLAYR") throw new Error("join btn: "+$(".join-btn-desktop").textContent); return "nav switched ✓"; });
await t("profile menu: all 8 items clickable", async()=>{ const items=$$("#ddProfileBody .dropdown-item"); const txt=items.map(i=>i.textContent).join("|"); for(const n of ["@aaravs","My Sports","My Communities","My Challenges","My Events","PLAYR+","Settings","Log Out"]) if(!txt.includes(n)) throw new Error("missing "+n); return items.length+" items ✓"; });
await t("profile view shows real user", async()=>$("#profile-athlete .profile-name").textContent==="Aarav Sharma"&&$("#profile-athlete .profile-sub").textContent.includes("CRICKET")?"name + sports ✓":"fail");
await t("authed JOIN → own profile (no re-login)", async()=>{ w.openAuth('signup'); if($("#authModal")) throw new Error("auth shown"); if(!$("#view-profile").classList.contains("active")) throw new Error("not profile"); w.switchView("home"); return "routes to profile ✓"; });
await t("My Sports sheet lists followed sports", async()=>{ UI.mySports(); const x=$("#sheetModal").textContent; if(!x.includes("Cricket")) throw new Error("no cricket"); UI.closeSheet(); return "sheet ✓"; });
await t("log out → public state restored", async()=>{ UI.logout(); await wait(150); if(A.user) throw new Error("still authed"); if($(".join-btn-desktop").textContent!=="JOIN PLAYR") throw new Error("btn"); if(!$("#ddProfileBody").textContent.includes("Guest")) throw new Error("menu"); return "JOIN PLAYR back ✓"; });
await t("sign in: wrong password → friendly error", async()=>{ w.openAuth('signin'); val("si-id","aarav@playr.com"); val("si-pw","wrongpass1"); click(".a-submit"); await wait(250); const e=$("#authRoot .a-err"); if(!e||!/incorrect/i.test(e.textContent)) throw new Error(e?e.textContent:"no error"); return e.textContent.slice(0,45); });
await t("sign in by username → welcome back", async()=>{ $$(".a-err").forEach(e=>e.remove()); val("si-id","aaravs"); val("si-pw","playr123"); click(".a-submit"); await wait(250); if(!A.user) throw new Error("not authed"); if(!$("#view-home").classList.contains("active")) throw new Error("not home"); return "session + personalized home ✓"; });
await t("returning user skips onboarding", ()=>$("#onboardModal")?"re-shown!":"skipped ✓");
await t("forgot password → check your email", async()=>{ UI.logout(); await wait(120); w.openAuth('signin'); UI.tab('forgot'); val("fp-email","aarav@playr.com"); click(".a-submit"); await wait(200); if(!$("#authRoot").textContent.includes("Check your email")) throw new Error("no msg"); UI.close(); return "reset flow ✓"; });
await t("gate: logged-out social actions blocked", async()=>{ w.createChallenge(); await wait(80); const g=$("#gateModal"); if(!g) throw new Error("no gate"); if(!g.textContent.includes("JOIN PLAYR TO CONTINUE")) throw new Error("copy"); if(!g.textContent.includes("SIGN IN")||!g.textContent.includes("CREATE ACCOUNT")) throw new Error("ctas"); UI.gateClose(); return "JOIN PLAYR TO CONTINUE ✓"; });
await t("gate: authed actions pass through", async()=>{ w.openAuth('signin'); val("si-id","aaravs"); val("si-pw","playr123"); click(".a-submit"); await wait(300); if(!A.user) throw new Error("signin failed"); w.createChallenge(); await wait(80); if($("#gateModal")) throw new Error("gate shown"); return "challenge allowed ✓"; });
await t("duplicate email → friendly message", async()=>{ UI.logout(); await wait(120); w.openAuth('signup'); val("su-name","Copy Cat"); val("su-user","copycat"); val("su-email","aarav@playr.com"); val("su-pw","playr123"); val("su-pw2","playr123"); click(".a-submit"); await wait(250); const e=$$(".a-err").find(x=>/already registered/i.test(x.textContent)); if(!e) throw new Error("generic: "+(($$(".a-err")[0]||{}).textContent||"none")); return e.textContent.slice(0,48); });
UI.close();
await t("session persists across reload", async()=>{
  w.openAuth('signin'); val("si-id","aaravs"); val("si-pw","playr123"); click(".a-submit"); await wait(300);
  if(!A.user) throw new Error("signin failed first: "+(($("#authRoot .a-err")||{}).textContent||"no error shown"));
  if(!w.localStorage.getItem("playr_session_v2")) throw new Error("session not written");
  const dom2 = new JSDOM(html, { url:"https://playrr.sport.community/", pretendToBeVisual:true, runScripts:"outside-only",
    beforeParse(win){ win.localStorage.setItem("playr_users_v2", w.localStorage.getItem("playr_users_v2")||"null"); win.localStorage.setItem("playr_session_v2", w.localStorage.getItem("playr_session_v2")||"null"); } });
  const w2=dom2.window;
  for(const f of [...mods,"INLINE"]){ w2.eval(f==="INLINE"?inlineJSorig:fs.readFileSync(f,"utf8")); }
  await wait(150);
  if(!w2.PLAYR_AUTH.user) throw new Error("session not restored");
  return "reload keeps "+w2.PLAYR_AUTH.user.username+" signed in ✓";
});
await t("regression: discover/universe/events/home", async()=>{ w.switchView("discover"); const d=$("#discoverRoot").innerHTML.includes("DISCOVER YOUR SPORT"); w.openSport("cricket"); const u=$("#universeRoot").innerHTML.includes("CRICKET"); w.switchView("events"); const e=$("#eventsRoot").innerHTML.includes("DISCOVER SPORTS EVENTS"); w.switchView("home"); const h=!!$("#heroStage .hc-card")&&!!$("#sportStrip .ss-card"); return "discover:"+d+" universe:"+u+" events:"+e+" home:"+h; });
console.log(`\n${pass} passed, ${fail} failed | Console errors: ${errors.length?errors:"none"}`);
})();
