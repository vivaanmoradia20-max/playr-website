/* ============================================================
   PLAYR AI — serverless chat proxy (Vercel-ready; also runs on
   Netlify Functions / any Node host with a thin adapter)
   ------------------------------------------------------------
   ENV VARS (server-side ONLY — never in frontend code):
     AI_API_KEY     required  provider key (Groq free tier works great)
     AI_PROVIDER    openai-compat (default) | anthropic | gemini
     AI_MODEL       e.g. llama-3.3-70b-versatile (Groq),
                   gpt-4o-mini, claude-3-5-haiku-latest, gemini-1.5-flash
     AI_BASE_URL    optional — any OpenAI-compatible base
                   (Groq: https://api.groq.com/openai/v1,
                    OpenRouter: https://openrouter.ai/api/v1,
                    OpenAI: default)
     PLAYR_ALLOWED_ORIGIN  lock CORS in production
                     (e.g. https://playrr.sport.community)

   Frontend → POST { messages:[{role,content}], context? }
   Proxy    → provider (adds system prompt, key, limits, 45s timeout)
   Proxy    → { reply } | 429 busy | 502 unavailable | 401 bad key
   ============================================================ */

const SYSTEM_PROMPT = `You are PLAYR AI — the intelligent sports assistant inside PLAYR, an all-sports social platform.
Answer sports questions clearly and concisely: rules, history, athletes, competitions, training and general fitness, Olympic and para-sports (always respectful, athlete-first language), and questions about the PLAYR platform itself.
PLAYR platform facts you may use: personalized sports feed; Discover Sport hub with 230+ sports; Challenges (recreational); Communities; Events (India/Mumbai-first); SPCL PLAYERS (PLAYR's dedicated para-sports space); PLAYR Shop (concept collaborations); PLAYR AI (you). PLAYR's tagline: "One Passion. One Community."
Style: short friendly paragraphs and bullets where helpful. End with a brief follow-up offer only when it adds value.
Honesty: never invent live scores, standings, fixtures, transfers or rankings. If a question needs current data, answer generally and note it may not reflect the latest results.
Safety: general fitness guidance only; for injuries or medical concerns, advise consulting a qualified professional. Refuse harmful instruction requests.`;

const RATE = { windowMs: 60_000, max: 12 };
const buckets = new Map();

function rateLimited(ip) {
  const now = Date.now();
  let b = buckets.get(ip);
  if (!b || now > b.reset) { b = { count: 0, reset: now + RATE.windowMs }; buckets.set(ip, b); }
  b.count++;
  if (buckets.size > 5000) buckets.clear(); // bound memory
  return b.count > RATE.max;
}

function sanitize(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-10)
    .map(m => ({ role: m.role, content: m.content.slice(0, 1200) }));
}

async function callProvider(messages, signal) {
  const provider = (process.env.AI_PROVIDER || "openai-compat").toLowerCase();
  const model = process.env.AI_MODEL || "llama-3.3-70b-versatile";
  const key = process.env.AI_API_KEY;
  if (!key) { const e = new Error("AI_API_KEY not set"); e.status = 500; e.code = "NO_KEY"; throw e; }

  if (provider === "anthropic") {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", signal,
      headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: 700, system: SYSTEM_PROMPT,
        messages: messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })) })
    });
    if (r.status === 401) { const e = new Error("bad key"); e.status = 401; throw e; }
    if (!r.ok) { const e = new Error("provider " + r.status); e.status = 502; throw e; }
    const d = await r.json();
    return (d.content && d.content[0] && d.content[0].text) || "";
  }

  if (provider === "gemini") {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
      method: "POST", signal, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })) })
    });
    if (r.status === 401 || r.status === 403) { const e = new Error("bad key"); e.status = 401; throw e; }
    if (!r.ok) { const e = new Error("provider " + r.status); e.status = 502; throw e; }
    const d = await r.json();
    return (d.candidates && d.candidates[0] && d.candidates[0].content.parts[0].text) || "";
  }

  /* OpenAI-compatible: OpenAI / Groq / OpenRouter / Together / any */
  const base = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
  const r = await fetch(base + "/chat/completions", {
    method: "POST", signal,
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
    body: JSON.stringify({ model, max_tokens: 700, messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages] })
  });
  if (r.status === 401) { const e = new Error("bad key"); e.status = 401; throw e; }
  if (r.status === 429) { const e = new Error("provider busy"); e.status = 429; throw e; }
  if (!r.ok) { const e = new Error("provider " + r.status); e.status = 502; throw e; }
  const d = await r.json();
  return (d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content) || "";
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.PLAYR_ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const ip = String((req.headers && req.headers["x-forwarded-for"]) || "").split(",")[0] || "local";
  if (rateLimited(ip)) return res.status(429).json({ error: "PLAYR AI is currently busy. Please try again shortly." });

  const timeout = setTimeout(() => {}, 45000); // keep event loop alive during fetch
  const controller = new AbortController();
  const killer = setTimeout(() => controller.abort(), 45000);
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const messages = sanitize(body.messages);
    if (!messages.length || !messages.some(m => m.role === "user")) {
      clearTimeout(killer); clearTimeout(timeout);
      return res.status(400).json({ error: "no user message" });
    }
    const reply = await callProvider(messages, controller.signal);
    clearTimeout(killer); clearTimeout(timeout);
    if (!reply || !String(reply).trim()) return res.status(502).json({ error: "PLAYR AI returned an empty response. Please try again." });
    return res.status(200).json({ reply: String(reply) });
  } catch (e) {
    clearTimeout(killer); clearTimeout(timeout);
    const aborted = e && (e.name === "AbortError" || /abort/i.test(e.message || ""));
    const status = aborted ? 504 : (e && e.status) || 500;
    const msg = status === 429 ? "PLAYR AI is currently busy. Please try again shortly."
              : status === 401 ? "PLAYR AI's API key appears invalid. Check AI_API_KEY on the server."
              : status === 500 && e && e.code === "NO_KEY" ? "PLAYR AI is not configured yet — set AI_API_KEY on the server."
              : status === 504 ? "PLAYR AI took too long to respond. Please try again."
              : "PLAYR AI is temporarily unavailable. Please try again.";
    return res.status(status).json({ error: msg });
  }
}
