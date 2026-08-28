/* ============================================================
   PLAYR — LIVE SCORES server proxy (OPTIONAL server provider)
   ------------------------------------------------------------
   Default mode needs NO server (browser calls ESPN's keyless
   public feed directly, verified CORS *). Activate THIS proxy
   only to add key-based providers (cricket via CricAPI, broader
   soccer via API-Football, etc.) behind one endpoint:

     browser → /api/live-scores → provider (key server-side) →
     browser, normalized {matches:[…]}

   ENV (server-side only):
     SPORTS_API_PROVIDER  cricapi | api-football | custom
     SPORTS_API_KEY       provider key (never in frontend code)
     SPORTS_API_URL       custom passthrough target (JSON)
     PLAYR_ALLOWED_ORIGIN CORS lockdown for production

   30-second server cache shared across users; provider errors →
   502 friendly message; the frontend never invents data.
   ============================================================ */
const CACHE_TTL=30_000;
let cache={at:0,data:null};

async function fromCricAPI(){
  const key=process.env.SPORTS_API_KEY;
  const r=await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${key}&offset=0`,{headers:{Accept:"application/json"}});
  if(!r.ok) throw new Error("cricapi "+r.status);
  const j=await r.json();
  return (j.data||[]).map(m=>({
    id:"cricapi-"+m.id, provider:"cricapi", sport:"cricket", sportLabel:"CRICKET", icon:"🏏",
    competition:m.series||"", status:m.matchFinished?"post":(m.matchStarted?"live":"pre"),
    statusDetail:m.status||"", clock:"", startTime:m.dateTimeGMT?new Date(m.dateTimeGMT).toISOString():null,
    homeTeam:(m.teams&&m.teams[0])||"—", awayTeam:(m.teams&&m.teams[1])||"—",
    homeAb:"",awayAb:"", homeScore:(m.score&&m.score[0]&&m.score[0].r!=null)?String(m.score[0].r):null,
    awayScore:(m.score&&m.score[1]&&m.score[1].r!=null)?String(m.score[1].r):null,
    period:null, venue:m.venue||"", country:"India", india:true, lastUpdated:Date.now()
  }));
}
async function fromCustom(){
  const r=await fetch(process.env.SPORTS_API_URL,{headers:{Accept:"application/json","X-Auth-Token":process.env.SPORTS_API_KEY||""}});
  if(!r.ok) throw new Error("custom "+r.status);
  const j=await r.json();
  return (j.matches||[]).map(m=>Object.assign({lastUpdated:Date.now()},m)); // expect normalized shape
}

export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin",process.env.PLAYR_ALLOWED_ORIGIN||"*");
  res.setHeader("Access-Control-Allow-Methods","GET, OPTIONS");
  if(req.method==="OPTIONS") return res.status(204).end();
  if(req.method!=="GET") return res.status(405).json({error:"GET only"});
  if(cache.data&&Date.now()-cache.at<CACHE_TTL) return res.status(200).json({matches:cache.data,cached:true});
  try{
    const p=(process.env.SPORTS_API_PROVIDER||"").toLowerCase();
    const matches=p==="cricapi"?await fromCricAPI():await fromCustom();
    cache={at:Date.now(),data:matches};
    return res.status(200).json({matches});
  }catch(e){
    return res.status(502).json({error:"Live scores are temporarily unavailable. Please try again shortly."});
  }
}
