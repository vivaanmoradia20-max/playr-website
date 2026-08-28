/* ============================================================
   PLAYR AI — serverless chat proxy  (deploy: Vercel / Netlify /
   Netlify Functions / any Node host)
   ------------------------------------------------------------
   Keeps EVERYTHING sensitive server-side:
     • AI_API_KEY      — provider key (NEVER in frontend code)
     • AI_MODEL        — e.g. gpt-4o-mini / claude-3-5-haiku / gemini-1.5-flash
     • AI_PROVIDER     — "openai" (default) | "anthropic" | "gemini" | "openrouter"

   Frontend → POST /api/chat { messages:[{role,content}], context:{view,sport} }
   This function → provider (with the PLAYR AI system prompt) → { reply }

   Protections: per-IP rate limit, input length caps, prompt-injection
   hardening (system prompt is prepended server-side and never accepted
   from the client), and no user PII is read or forwarded.
   ============================================================ */

const SYSTEM_PROMPT = `You are PLAYR AI, the sports intelligence assistant inside PLAYR — an all-sports social platform.
Your role is to help users understand and explore the world of sport.
Answer sports questions clearly and accurately: rules, history, major competitions, athletes, teams, terminology, training, equipment and facts.
Cover mainstream, niche, emerging, Olympic and para-sports with equal respect.
Do NOT fabricate scores, standings, rankings, news, statistics or event information. If information may be outdated (anything time-sensitive), say so clearly.
When relevant, encourage exploring PLAYR communities, sports pages or events — but answer the user's actual question first. Do not be excessively promotional.
Keep answers useful, concise and engaging.`;

const RATE = { windowMs: 60_000, max: 10 };
const buckets = new Map(); // ip → {count, reset}

function rateLimited(ip) {
  const now = Date.now();
  let b = buckets.get(ip);
  if (!b || now > b.reset) { b = { count: 0, reset: now + RATE.windowMs }; buckets.set(ip, b); }
  return ++b.count > RATE.max;
}

function sanitize(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-10)                                   // short history only
    .map(m => ({ role: m.role, content: m.content.slice(0, 1000) })); // cap each turn
}

async function callProvider(messages) {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  const key = process.env.AI_API_KEY;
  if (!key) throw Object.assign(new Error("AI_API_KEY not set"), { status: 500 });

  const sys = { role: "system", content: SYSTEM_PROMPT };

  if (provider === "anthropic") {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: 600, system: SYSTEM_PROMPT,
        messages: messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })) })
    });
    if (!r.ok) throw Object.assign(new Error("provider " + r.status), { status: 502 });
    const d = await r.json();
    return (d.content && d.content[0] && d.content[0].text) || "";
  }

  if (provider === "gemini") {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })) })
    });
    if (!r.ok) throw Object.assign(new Error("provider " + r.status), { status: 502 });
    const d = await r.json();
    return (d.candidates && d.candidates[0] && d.candidates[0].content.parts[0].text) || "";
  }

  /* openai + openrouter share the chat-completions shape */
  const base = provider === "openrouter" ? "https://openrouter.ai/api/v1" : "https://api.openai.com/v1";
  const r = await fetch(base + "/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
    body: JSON.stringify({ model, max_tokens: 600, messages: [sys, ...messages] })
  });
  if (!r.ok) throw Object.assign(new Error("provider " + r.status), { status: 502 });
  const d = await r.json();
  return (d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content) || "";
}

/* Vercel-style export; also works as a plain Node handler */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.PLAYR_ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0] || "local";
  if (rateLimited(ip)) return res.status(429).json({ error: "busy" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const messages = sanitize(body.messages);
    if (!messages.length || !messages.some(m => m.role === "user")) {
      return res.status(400).json({ error: "no user message" });
    }
    const reply = await callProvider(messages);
    if (!reply.trim()) throw new Error("empty reply");
    return res.status(200).json({ reply });
  } catch (e) {
    const status = e.status || 500;
    const msg = status === 429 ? "PLAYR AI is currently busy. Please try again shortly."
              : status === 500 ? "PLAYR AI is not configured (AI_API_KEY missing on the server)."
              : "PLAYR AI is temporarily unavailable. Please try again.";
    return res.status(status).json({ error: msg });
  }
}
