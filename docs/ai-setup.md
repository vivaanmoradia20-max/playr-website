# PLAYR AI — Backend Setup (2 minutes)

PLAYR AI is a **real** assistant: the chat sends your question to a
serverless proxy which calls an AI provider and streams the reply back.
No canned answers anywhere. Until the proxy is deployed with a key, the
chat honestly says the service isn't connected.

## Quick start (recommended: Groq free tier)
1. **Key**: console.groq.com → API Keys → create (free) → copy.
2. **Deploy**: push this repo to GitHub → import in Vercel → Deploy
   (zero config; `api/chat.js` becomes `/api/chat` automatically).
3. **Env**: in Vercel → Settings → Environment Variables add:
   `AI_API_KEY = gsk_...`
   `AI_MODEL = llama-3.3-70b-versatile`
4. **Connect**: copy `https://<your-app>.vercel.app/api/chat` into
   `js/config.js` → `AI_CHAT_ENDPOINT` → commit. Done — PLAYR AI answers.

## Environment variables (server-side ONLY)
| var | example | notes |
|---|---|---|
| `AI_API_KEY` | `gsk_…` / `sk-…` | required — never in frontend code |
| `AI_PROVIDER` | `openai-compat` (default) / `anthropic` / `gemini` | |
| `AI_BASE_URL` | `https://api.groq.com/openai/v1` | any OpenAI-compatible: Groq, OpenRouter, Together… |
| `AI_MODEL` | `llama-3.3-70b-versatile`, `gpt-4o-mini`, `claude-3-5-haiku-latest` | |
| `PLAYR_ALLOWED_ORIGIN` | `https://playrr.sport.community` | CORS lock for production |

Local dev: copy `.env.example` → `.env` (git-ignored).

## Verified behaviour (test/ai_e2e_test.js)
Real chain tested end-to-end — chat UI → HTTP → proxy → provider
(the provider hop stubbed only where your key goes):
conversation memory (follow-ups carry history), system prompt injection,
Bearer auth server-side, 400/401/429/502 mapping, empty-reply guard,
45s timeout, loading indicator, RETRY, clear chat, Enter-to-send,
platform answers from PLAYR's real engines, and app isolation.

## Security
Keys live only in the proxy env. Inputs are sanitized (role whitelist,
10-turn / 1200-char caps), system prompt is server-side (injection
hardening), per-IP rate limit 12/min, no user PII forwarded.
