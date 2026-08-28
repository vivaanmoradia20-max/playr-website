# PLAYR — Live Scores

**Default mode works with zero setup**: the browser calls ESPN's keyless
public scoreboard feed directly (verified: CORS `*`, real live data).
Supported by this feed — Football (Premier League, LaLiga, Bundesliga,
Serie A, Ligue 1, ISL 🇮🇳, MLS, UCL/UEL, World Cup + qualifiers, Asian
Cup…), Basketball (NBA/WNBA), Ice Hockey (NHL), American Football
(NFL/NCAA), Baseball (MLB), and F1 race weekends (session status only —
the feed carries no live positions, so none are shown).

**Not covered by the keyless feed** (and therefore never shown from it):
cricket, tennis, badminton, volleyball, combat sports, etc.

## Adding cricket / more sports (optional server proxy)
1. Key from cricapi.com (free tier: 100 requests/day).
2. Deploy this repo on Vercel (`api/live-scores.js` → `/api/live-scores`).
3. Env vars: `SPORTS_API_PROVIDER=cricapi`, `SPORTS_API_KEY=…`
   (30s server-side cache shared by all users).
4. In `js/config.js` set `LIVE_SCORES_ENDPOINT` to
   `https://<app>.vercel.app/api/live-scores` — the frontend switches
   to the proxy provider automatically (custom providers: return
   normalized `{matches:[…]}` per js/live-scores.js header).

## Data integrity
No fabricated scores/matches anywhere. Engine normalizes provider data;
missing fields render "Data unavailable"; provider failures show a
retryable error and never affect the rest of PLAYR. Polling: 60s while
live matches are visible, 5min otherwise, paused when the tab is hidden.
