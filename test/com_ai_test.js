/* COMMUNITIES v2 + PLAYR AI QA */
const { JSDOM, VirtualConsole } = require("/home/user/node_modules/jsdom");
const fs = require("fs");
let html = fs.readFileSync("index.html","utf8");
const mods=["js/images.js","js/config.js","js/avatars.js","js/sports-data.js","js/sports-data-2.js","js/spcl-data.js","js/sports-app.js","js/sports-universe.js","js/spcl.js","js/about.js","js/events-data.js","js/events-app.js","js/events-app-2.js","js/challenges.js","js/shop.js","js/communities.js","js/auth.js","js/auth-ui.js","js/ai.js"];
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
const COM=w.PLAYR_COM, AI=w.PLAYR_AI;

/* ---------- COMMUNITIES ---------- */
await t("hero + copy + CTAs", ()=>{
  w.switchView("communities");
  const h=$("#communitiesRoot").innerHTML;
  for(const k of ["COMMUNITIES.","Your sport. Your people. Your community.","EXPLORE COMMUNITIES","CREATE COMMUNITY","TRENDING COMMUNITIES","DISCOVER COMMUNITIES"]) if(!h.includes(k)) throw new Error("missing "+k);
  return "✓";
});
await t("search works (running / cricket / mumbai)", async()=>{
  w.PLAYR_COM.setFilter("ALL");
  const inp=$("#comSearch");
  inp.value="running mumbai"; inp.dispatchEvent(new w.Event("input",{bubbles:true})); await wait(300);
  const n1=$$(".com-card").length;
  const names=$$("#communitiesRoot .coc-name").map(x=>x.textContent).join("|");
  inp.value=""; inp.dispatchEvent(new w.Event("input",{bubbles:true})); await wait(300);
  if(!n1||!names.includes("Mumbai Runners")) throw new Error(n1+" / "+names);
  return "running mumbai → "+n1+" ✓";
});
await t("6 quick filters + 17 sport categories", ()=>{
  const quick=$$("#communitiesRoot .chip-row")[0].querySelectorAll(".chip").length;
  const cats=$$("#communitiesRoot .chip-row")[1].querySelectorAll(".chip").length;
  if(quick!==6) throw new Error("quick "+quick);
  if(cats!==18) throw new Error("cats "+cats); // ALL + 17
  return "6 + 17(+ALL) ✓";
});
await t("PARA-SPORTS filter → SPCL-linked community", async()=>{
  w.PLAYR_COM.setCat("PARA-SPORTS");
  await wait(60);
  const cards=$$(".com-card");
  w.PLAYR_COM.setCat("ALL");
  if(cards.length!==1) throw new Error(cards.length+" cards");
  if(!cards[0].textContent.includes("SPCL PLAYERS")) throw new Error("naming");
  return "Para-Sports India ✓";
});
await t("community card anatomy (members/activity/location/join)", ()=>{
  const c=$$(".com-card")[0]; const x=c.textContent;
  if(!/MEMBERS/.test(x)) throw new Error("members");
  if(!/ACTIVE NOW/.test(x)) throw new Error("activity");
  if(!/JOIN COMMUNITY|JOINED/.test(x)) throw new Error("join");
  return "✓";
});
await t("unique sport-matched images (no duplicates in grid)", async()=>{
  w.PLAYR_COM.setCat("ALL"); await wait(60);
  const styles=$$("#communitiesRoot .com-card .coc-img").map(e=>e.style.background||e.className);
  const imgs=styles.filter(s=>String(s).includes("photo-"));
  const ids=imgs.map(s=>(String(s).match(/photo-[0-9a-z-]+/)||[])[0]);
  const uniq=new Set(ids);
  if(ids.length && uniq.size!==ids.length) throw new Error((ids.length-uniq.size)+" reused photos");
  return ids.length+" photo cards, all unique ✓";
});
await t("detail: tabs present, join works", async()=>{
  w.PLAYR_COM.open("mumbai-runners");
  const tabs=$$(".com-tabs .su-tab").map(x=>x.textContent);
  if(tabs.join(",")!=="FEED,DISCUSSIONS,EVENTS,CHALLENGES,MEMBERS,ABOUT") throw new Error(tabs.join(","));
  const jb=$(".com-dh-actions .btn");
  jb.click(); await wait(60);
  if(!w.localStorage.getItem("playr_com_joined_v1")) throw new Error("join not stored");
  const joined=[...w.document.querySelectorAll(".com-dh-actions .btn")].some(b=>b.textContent.includes("JOINED"));
  if(!joined) throw new Error("state not reflected");
  return "6 tabs + join persists ✓";
});
await t("feed: demo posts + user post (local)", async()=>{
  w.PLAYR_COM.setTab("feed"); await wait(40);
  if(!$("#comPanel").textContent.includes("first 10K")) throw new Error("no seeded posts");
  $("#comPostTxt").value="Testing the community feed!";
  w.PLAYR_COM.post(); await wait(60);
  if(!$("#comPanel").textContent.includes("Testing the community feed!")) throw new Error("post not shown");
  if($("#comPanel").textContent.includes("STORED LOCALLY")===false) throw new Error("not labelled");
  return "seeded + user post ✓";
});
await t("discussions: create + list", async()=>{
  w.PLAYR_COM.setTab("discussions"); await wait(40);
  const before=$$(".com-disc").length;
  $("#comDiscTitle").value="Best running tracks in Mumbai?";
  w.PLAYR_COM.newDiscussion(); await wait(60);
  const after=$$(".com-disc").length;
  if(after!==before+1) throw new Error(before+"→"+after);
  return "discussion created ✓";
});
await t("events tab: real PLAYR_EV data for running", async()=>{
  w.PLAYR_COM.setTab("events"); await wait(40);
  const x=$("#comPanel").textContent;
  if(!x.includes("Half Marathon")&&!x.includes("10K")&&!x.includes("Marine Drive")) throw new Error(x.slice(0,120));
  return "real events wired ✓";
});
await t("challenges tab: real catalog data", async()=>{
  w.PLAYR_COM.setTab("challenges"); await wait(40);
  const x=$("#comPanel").textContent;
  if(!x.includes("30 DAY RUNNING STREAK")&&!x.includes("RUN 50K")) throw new Error(x.slice(0,120));
  return "real challenges wired ✓";
});
await t("about tab: rules + moderation + guidelines", async()=>{
  w.PLAYR_COM.setTab("about"); await wait(40);
  const x=$("#comPanel").textContent;
  for(const k of ["Community rules","Report post","Mute user","Block user","Community guidelines","Admin controls"]) if(!x.includes(k)) throw new Error("missing "+k);
  w.PLAYR_COM.guidelines();
  if(!$("#comSheet").textContent.includes("Athlete-first")) throw new Error("guidelines content");
  $("#comSheet").remove();
  return "moderation suite ✓";
});
await t("create community: validation + honest persistence", async()=>{
  w.PLAYR_COM.create();
  w.PLAYR_COM.submitCreate({disabled:false,textContent:""});
  if(w.document.getElementById("cc-err").style.display==="none") throw new Error("no validation");
  w.document.getElementById("cc-name").value="Andheri Night Cyclists";
  w.document.getElementById("cc-desc").value="Night rides around Andheri";
  w.PLAYR_COM.submitCreate({disabled:false,textContent:""});
  await wait(700);
  if(w.document.getElementById("comCreateModal")) throw new Error("modal not closed");
  if(!w.localStorage.getItem("playr_com_created_v1")) throw new Error("not stored");
  if(!$("#communitiesRoot").textContent.includes("MY COMMUNITIES")) throw new Error("not in mine");
  if(!$("#communitiesRoot").textContent.includes("Andheri Night Cyclists")) throw new Error("not listed");
  return "created + listed + labelled ✓";
});

/* ---------- PLAYR AI ---------- */
await t("AI fab exists on every view", async()=>{
  for(const v of ["home","discover","spcl","challenges","communities","events","shop","about"]){ w.switchView(v); if(!$("#aiFab")) throw new Error("no fab on "+v); }
  return "8/8 views ✓";
});
await t("chat opens: welcome + 5 suggestions + input", async()=>{
  w.PLAYR_AI.open();
  const c=$("#aiChat"); if(!c) throw new Error("no chat");
  if(!$("#aiBody").textContent.includes("PLAYR AI")) throw new Error("welcome");
  if($$(".ai-suggest button").length!==5) throw new Error("suggestions");
  if($("#aiInput").getAttribute("placeholder")!=="Ask anything about sports...") throw new Error("placeholder");
  w.PLAYR_AI.close();
  return "✓";
});
await t("context-aware greeting (sport page)", async()=>{
  w.openSport("formula-1");
  w.PLAYR_AI.open();
  const ctx=$("#aiBody").querySelector(".ai-ctx");
  const ok=ctx&&/formula 1/i.test(ctx.textContent);
  w.PLAYR_AI.close(); w.PLAYR_COM.back(); w.switchView("home");
  if(!ok) throw new Error("no context line");
  return "Formula 1 context ✓";
});
await t("platform answer: events (real data, labelled)", async()=>{
  w.PLAYR_AI.open();
  w.PLAYR_AI.ask("What running events are coming up?");
  await wait(200);
  const last=[...$$("#aiBody .ai-msg")].pop();
  if(!last.textContent.includes("PLAYR")) throw new Error("no events");
  if(!$$("#aiBody .ai-src").length && !last.textContent.includes("EVENT ENGINE")) throw new Error("not labelled");
  if(!$$(".ai-actions button").some(b=>b.textContent==="EXPLORE EVENTS")) throw new Error("no action");
  w.PLAYR_AI.close();
  return "real events + EXPLORE action ✓";
});
await t("platform answer: SPCL PLAYERS + open action", async()=>{
  await wait(4200);
  w.PLAYR_AI.open();
  w.PLAYR_AI.ask("Tell me about SPCL PLAYERS");
  await wait(150);
  const txt=[...$$("#aiBody .ai-msg")].pop().textContent;
  if(!txt.includes("para-athletes")&&!txt.includes("SPCL PLAYERS")) throw new Error("content");
  if(!$$(".ai-actions button").some(b=>b.textContent.includes("SPCL PLAYERS"))) throw new Error("action");
  w.PLAYR_AI.close();
  return "✓";
});
await t("LLM question without endpoint → honest setup message", async()=>{
  await wait(4200);
  w.PLAYR_AI.open();
  w.PLAYR_AI.ask("Who are the greatest tennis players?");
  await wait(900);
  const txt=[...$$("#aiBody .ai-msg")].pop().textContent;
  if(!/AI service isn't connected|AI_CHAT_ENDPOINT|ai-setup/.test(txt)) throw new Error("not honest: "+txt.slice(0,80));
  if(!txt.includes("AI_API_KEY")) throw new Error("missing env names");
  w.PLAYR_AI.close();
  return "honest unconfigured message ✓";
});
await t("rate limit (1 msg / 4s)", async()=>{
  await wait(4200);
  w.PLAYR_AI.open();
  w.PLAYR_AI.ask("events question one"); 
  const before=$$("#aiBody .ai-msg").length;
  w.PLAYR_AI.ask("events question two");
  await wait(150);
  const after=$$("#aiBody .ai-msg").length;
  w.PLAYR_AI.close();
  if(after>before+1) throw new Error("no rate limit");
  return "throttled ✓";
});
await t("history saved locally", async()=>{
  const h=JSON.parse(w.localStorage.getItem("playr_ai_history_v1")||"[]");
  if(!h.length) throw new Error("no history");
  w.PLAYR_AI.open(); w.PLAYR_AI.showHistory();
  if(!$("#aiBody").textContent.includes("RECENT CHATS")) throw new Error("no history UI");
  w.PLAYR_AI.close();
  return h.length+" chats ✓";
});
await t("typing indicator appears during LLM call", async()=>{
  await wait(4200);
  w.fetch=()=>new Promise(res=>setTimeout(()=>res({ok:false,status:500,json:()=>({})}),400)); // slow failure → typing visible
  w.PLAYR_AI.open();
  w.PLAYR_AI.ask("Explain the offside rule");
  await wait(120);
  const typing=!!$("#aiTyping");
  await wait(900);
  if(!typing) throw new Error("no typing indicator");
  if($("#aiTyping")) throw new Error("indicator never removed");
  w.PLAYR_AI.close();
  return "✓";
});
await t("NO API KEYS / secrets in any client file", ()=>{
  const client=["js/ai.js","js/config.js","index.html"].map(f=>fs.readFileSync(f,"utf8")).join("");
  if(/(sk-[A-Za-z0-9]{20,}|AI_API_KEY\s*[:=]\s*["'][^"']{8,})/.test(client)) throw new Error("secret leak");
  const proxy=fs.readFileSync("api/chat.js","utf8");
  if(!proxy.includes("process.env.AI_API_KEY")) throw new Error("proxy not env-based");
  return "keys server-side only ✓";
});
await t("mobile: chat goes full-screen", ()=>{
  w.PLAYR_AI.open();
  const css=fs.readFileSync("index.html","utf8");
  if(!/\.ai-chat\{[^}]*@media\(max-width:640px\)/.test(css) && !css.includes(".ai-chat{right:0; bottom:0; width:100vw")) { /* check presence of the mobile rule */ }
  if(!css.includes("width:100vw")||!css.includes("height:100dvh")) throw new Error("no fullscreen rule");
  w.PLAYR_AI.close();
  return "100vw/100dvh rule ✓";
});
await t("regressions: all views + engines intact", ()=>{
  for(const v of ["home","discover","sports","spcl","challenges","communities","events","plus","shop","profile","about"]){ w.switchView(v); if(!w.document.getElementById("view-"+v).classList.contains("active")) throw new Error(v); }
  w.switchView("challenges"); if(!w.document.getElementById("challengesRoot").innerHTML.includes("COMPETE.")) throw new Error("challenges");
  w.switchView("shop"); if(!w.document.getElementById("shopRoot").innerHTML.includes("GEAR UP")) throw new Error("shop");
  w.switchView("spcl"); if(!w.document.getElementById("spclRoot").innerHTML.includes("SPORT WITHOUT")) throw new Error("spcl naming");
  return "✓";
});
console.log(`\n${pass} passed, ${fail} failed | Console errors: ${errors.length?errors:"none"}`);
})();
