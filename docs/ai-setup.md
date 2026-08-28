# PLAYR AI — Backend Setup

PLAYR AI is a **real** AI assistant architecture. The chat never fakes
answers: open sports questions go through a serverless proxy to an AI
provider, and until that's connected the assistant says exactly what's
missing. Platform-data questions (events, communities, sport
recommendations, SPCL PLAYERS) are answered locally from PLAYR's real
engines and labelled as such.

## Architecture
```
Browser (js/ai.js)
   ↓ POST {messages, context}          — no secrets in the browser
Serverless proxy (api/chat.js)
   ↓ adds AI_API_KEY + system prompt, rate limits (10/min/IP),
     caps input (1000 chars/turn, last 10 turns)
AI provider (OpenAI / Anthropic / Gemini / OpenRouter)
   ↓ { reply }
Browser renders the reply
```

## Environment variables (server-side ONLY)
| var | example | notes |
|---|---|---|
| `AI_API_KEY` | `sk-…` / `…` | provider key — never in frontend code |
| `AI_MODEL` | `gpt-4o-mini`, `claude-3-5-haiku`, `gemini-1.5-flash` | |
| `AI_PROVIDER` | `openai` (default) / `anthropic` / `gemini` / `openrouter` | |
| `PLAYR_ALLOWED_ORIGIN` | `https://playrr.sport.community` | CORS lock-down for production |

Local development: copy `.env.example` → `.env` (git-ignored) and fill in.

## Deploy
1. **Vercel** — this repo already matches the Vercel shape (`api/chat.js`
   becomes `/api/chat`). `vercel` → set env vars in the dashboard.
   **Netlify** — rename to `netlify/functions/chat.js` (same export).
2. In `js/config.js` set:
   `AI_CHAT_ENDPOINT: "https://<your-deployment>/api/chat"`
3. Deploy the site. PLAYR AI now answers open sports questions.

## Security notes
- Keys live only in the proxy's environment — grep the frontend: none.
- System prompt is prepended server-side; client messages are sanitized
  and role-limited (prompt-injection hardening).
- Per-IP rate limit (10 req/min) + client-side 1-msg/4s.
- No user PII is read or forwarded — only the current view/sport context.
