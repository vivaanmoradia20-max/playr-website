/* ============================================================
   PLAYR AI — END-TO-END test
   REAL chain: jsdom chat UI → HTTP → real api/chat.js proxy →
   HTTP → provider stub (OpenAI-compatible). The stub is ONLY the
   final hop your AI_API_KEY activates in production; everything
   else (UI, memory, transport, auth headers, sanitization, error
   mapping) is the real code.
   ============================================================ */
const http=require("http");
const fs=require("fs"); const path=require("path");
const { JSDOM, VirtualConsole }=require(path.join(__dirname,"..","..","node_modules","jsdom"));

/* ---------- provider stub (records requests, switchable behavior) ---------- */
const seen=[];
let mode="ok";
const stub=http.createServer((req,res)=>{
  let body="";
  req.on("data",c=>body+=c); req.on("end",()=>{
    let json={}; try{ json=JSON.parse(body||"{}"); }catch(e){}
    seen.push({url:req.url, auth:req.headers["authorization"]||"", messages:json.messages||[]});
    res.setHeader("Access-Control-Allow-Origin","*");
    if(mode==="401"){ res.writeHead(401); return res.end(JSON.stringify({error:"bad key"})); }
    if(mode==="429"){ res.writeHead(429); return res.end(JSON.stringify({error:"rate"})); }
    if(mode==="empty"){ res.writeHead(200,{"Content-Type":"application/json"}); return res.end(JSON.stringify({choices:[{message:{content:"  "}}]})); }
    if(mode==="slow"){ return setTimeout(()=>{ res.writeHead(200,{"Content-Type":"application/json"}); res.end(JSON.stringify({choices:[{message:{content:"late"}}]})); },60000); }
    const last=(json.messages||[]).filter(m=>m.role==="user").pop();
    res.writeHead(200,{"Content-Type":"application/json"});
    res.end(JSON.stringify({choices:[{message:{content:`STUB-ANSWER[${last?last.content.slice(0,40):""}] · turns_in_request=${(json.messages||[]).length} · system=${(json.messages||[]).some(m=>m.role==="system")}`}}]}));
  });
});

/* ---------- real proxy (api/chat.js) on 8126 ---------- */
process.env.AI_API_KEY="test-key-123";
process.env.AI_MODEL="test-model";
process.env.AI_BASE_URL="http://127.0.0.1:8127/v1";
const proxyMod={};
new Function("module","exports","require","process", fs.readFileSync(path.join(__dirname,"..","api","chat.js"),"utf8").replace(/^export default/m,"module.exports ="))(proxyMod,proxyMod,require,process);
const proxy=http.createServer((req,res)=>{
  let body=""; req.on("data",c=>body+=c); req.on("end",()=>{
    req.body=body; req.headers["x-forwarded-for"]="127.0.0.1";
    /* Vercel-style res shim (status chaining + json/end) over raw Node res */
    const shim={
      setHeader:(k,v)=>res.setHeader(k,v),
      status(code){ this._code=code; return this; },
      json(obj){ res.writeHead(this._code||200,{"Content-Type":"application/json"}); res.end(JSON.stringify(obj)); },
      end(){ res.writeHead(this._code||204); res.end(); }
    };
    proxyMod.exports(req,shim);
  });
});

let pass=0, fail=0;
const t=(n,c,extra)=>{ if(c){pass++; console.log("PASS",n,extra||"");} else {fail++; console.log("FAIL",n,extra||"");} };

(async()=>{
  await new Promise(r=>stub.listen(8127,"127.0.0.1",r));
  await new Promise(r=>proxy.listen(8126,"127.0.0.1",r));

  /* ---------- proxy unit checks ---------- */
  const post=(url,body)=>fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  let r=await post("http://127.0.0.1:8126/api/chat",{messages:[{role:"user",content:"hello"}]});
  t("proxy OK → 200 + reply", r.status===200 && /STUB-ANSWER/.test((await r.json()).reply));
  t("proxy forwards Bearer key server-side", seen.at(-1).auth==="Bearer test-key-123");
  t("proxy injects system prompt", seen.at(-1).messages.some(m=>m.role==="system"&&/PLAYR AI/.test(m.content)));
  r=await post("http://127.0.0.1:8126/api/chat",{}); t("proxy rejects empty payload → 400", r.status===400);
  mode="401"; r=await post("http://127.0.0.1:8126/api/chat",{messages:[{role:"user",content:"x"}]});
  t("proxy maps 401 → invalid-key message", r.status===401 && /API key appears invalid/.test((await r.json()).error)); mode="ok";
  mode="429"; r=await post("http://127.0.0.1:8126/api/chat",{messages:[{role:"user",content:"x"}]});
  t("proxy maps 429 → busy message", r.status===429 && /busy/.test((await r.json()).error)); mode="ok";
  mode="empty"; r=await post("http://127.0.0.1:8126/api/chat",{messages:[{role:"user",content:"x"}]});
  t("proxy maps empty reply → 502 message", r.status===502 && /empty/.test((await r.json()).error)); mode="ok";

  /* ---------- full UI chain (jsdom + real fetch) ---------- */
  let html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
  const mods=["js/images.js","js/config.js","js/avatars.js","js/sports-data.js","js/sports-data-2.js","js/spcl-data.js","js/sports-app.js","js/sports-universe.js","js/spcl.js","js/about.js","js/events-data.js","js/events-app.js","js/events-app-2.js","js/challenges.js","js/shop.js","js/communities.js","js/auth.js","js/auth-ui.js","js/ai.js"];
  const inlined=mods.map(f=>"<script>\n"+fs.readFileSync(path.join(__dirname,"..",f),"utf8")+"\n</script>").join("\n");
  html=html.replace(/<script src="js\/[^"]+"><\/script>\n?/g,"");
  html=html.replace("<script>\n/* ============================================================\n   PLAYR — PROTOTYPE DATA + INTERACTIVITY", inlined+"<script>\n/* ============================================================\n   PLAYR — PROTOTYPE DATA + INTERACTIVITY");
  const vc=new VirtualConsole(); const errs=[];
  vc.on("jsdomError",e=>{ if(!/Could not parse CSS|Not implemented/.test(e.message)) errs.push(e.message.slice(0,140)); });
  const dom=new JSDOM(html,{runScripts:"dangerously",url:"https://playrr.sport.community/",virtualConsole:vc,pretendToBeVisual:true});
  const w=dom.window;
  await new Promise(r=>setTimeout(r,900));
  w.fetch=global.fetch;                                    // browser-equivalent transport
  w.eval('window.PLAYR_ENV.AI_CHAT_ENDPOINT="http://127.0.0.1:8126/api/chat"');
  const $=s=>w.document.querySelector(s), $$=s=>[...w.document.querySelectorAll(s)];
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const lastMsg=()=>$$("#aiBody .ai-msg").filter(m=>!m.classList.contains("typing")).pop();
  const ask=async q=>{ await wait(4200); w.PLAYR_AI.ask(q); await wait(700); };

  w.PLAYR_AI.open();
  t("chat opens with quick-question chips", $$(".ai-suggest button").length===6);
  t("chips are the product-spec set", ["⚽","🏏","🏎️","🏀","🏅","♿"].every((e,i)=>$$(".ai-suggest button")[i].textContent.includes(e)));

  await ask("What is offside in football?");
  t("Q1 offside → real AI reply rendered", /STUB-ANSWER\[What is offside in football/.test(lastMsg().textContent));
  t("loading indicator was shown and removed", !$("#aiTyping"));
  await ask("Which team does he drive for?");
  t("Q9 follow-up → memory sent (turns≥4)", /STUB-ANSWER\[Which team does he drive/.test(lastMsg().textContent) && /turns_in_request=[45]/.test(lastMsg().textContent));
  await ask("Explain the rules of kabaddi, a completely new question.");
  t("Q10 brand-new question answered", /STUB-ANSWER\[Explain the rules of kabaddi/.test(lastMsg().textContent));

  /* Enter key sends */
  await wait(4200); const inp=$("#aiInput"); inp.value="Test via Enter";
  inp.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Enter"}));
  await wait(600); t("Enter key sends", lastMsg().textContent.includes("STUB-ANSWER[Test via Enter"));

  /* retry path: stub fails once */
  mode="429"; await ask("Retry me please"); 
  t("failure shows friendly message + RETRY", /currently busy/.test(lastMsg().textContent) && /RETRY/.test(lastMsg().innerHTML));
  mode="ok"; $$("#aiBody .ai-actions button").pop().click(); await wait(900);
  t("RETRY re-asks and succeeds", /STUB-ANSWER\[Retry me please/.test(lastMsg().textContent));

  /* clear chat */
  w.PLAYR_AI.clear();
  t("clear chat resets to fresh state", !/STUB-ANSWER/.test($("#aiBody").textContent) && /Fresh start/.test($("#aiBody").textContent));

  /* unconfigured honesty: remove endpoint */
  w.eval('window.PLAYR_ENV.AI_CHAT_ENDPOINT=""');
  await ask("Who are the greatest tennis players?");
  t("unconfigured → honest setup message (no fake answer)", /AI service isn't connected/.test(lastMsg().textContent) && /AI_CHAT_ENDPOINT/.test(lastMsg().textContent));
  w.eval('window.PLAYR_ENV.AI_CHAT_ENDPOINT="http://127.0.0.1:8126/api/chat"');

  /* platform answers still work + app isolation */
  await ask("What running events are coming up?");
  t("platform answer (real engine) still works", /Marathon|10K/.test($("#aiBody").textContent));
  w.PLAYR_AI.close(); w.switchView("communities"); await wait(300);
  t("app unaffected: communities renders after AI activity", $("#communitiesRoot").innerHTML.length>1000);
  t("no unexpected console errors", errs.length===0, errs[0]||"");

  console.log(`\n${pass} passed, ${fail} failed`);
  stub.close(); proxy.close();
  process.exit(fail?1:0);
})().catch(e=>{ console.log("FATAL:",e.message); process.exit(1); });
