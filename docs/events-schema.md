# PLAYR — Events Schema (Supabase-ready)

The Events engine (`js/events-data.js` + `js/events-app.js` + `js/events-app-2.js`) currently runs on a
client-side catalogue. When the platform moves to Supabase (see the `playr-supabase-mvp` in `files.zip`),
migrate to the structure below. Field names map 1:1 to the JS objects already in use.

## Core table: `events`

| column | type | notes |
|---|---|---|
| id | uuid / text pk | currently kebab-case string ids |
| name | text | |
| sport_id | text | FK → sports catalogue (`PLAYR_SPORTS.id`) |
| category | text | race / tournament / league / ride / trek / meetup / festival |
| competition_level | text | WORLD, INTERNATIONAL, NATIONAL, STATE, CITY, COLLEGE, SCHOOL, CLUB, COMMUNITY, AMATEUR |
| description | text | |
| organizer_id | uuid / text | FK → event_organizers |
| venue | text | venue display name (real venues only) |
| address | text nullable | only when published by organizer |
| city / state / country | text | |
| latitude / longitude | numeric nullable | approximate venue coords for distance |
| start_datetime / end_datetime | timestamptz | |
| registration_deadline | timestamptz nullable | |
| registration_url | text nullable | organizer/official page — PLAYR never proxies third-party payment |
| price | numeric nullable | null = free |
| currency | text | default `INR` |
| age_group | text | |
| gender_category | text | Open / Men's / Women's / Mixed |
| team_or_individual | text | |
| status | text | UPCOMING / LIVE / COMPLETED (derived or set) |
| registration_status | text | OPEN / CLOSED / SOLD OUT |
| verification_status | text | VERIFIED / OFFICIAL / COMMUNITY / DEMO — **never blanket-verify** |
| image_url | text nullable | |
| source | text nullable | required for VERIFIED/OFFICIAL rows |
| last_updated | timestamptz | shown on event pages |
| created_at / updated_at | timestamptz | |

## Supporting tables

```sql
create table event_followers (
  event_id references events(id) on delete cascade,
  user_id references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (event_id, user_id)
);

create table event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id references events(id),
  user_id references auth.users(id),
  category text,
  age_group text,
  team_name text,
  status text default 'confirmed',   -- confirmed / cancelled
  created_at timestamptz default now()
);
-- Demo note: no payment or sensitive personal data is stored.

create table event_results (
  id uuid primary key default gen_random_uuid(),
  event_id references events(id) on delete cascade,
  category text,
  position int,
  holder text,                        -- athlete / team name
  detail text,                        -- time / score
  verified boolean default false
);

create table event_updates (
  id uuid primary key default gen_random_uuid(),
  event_id references events(id) on delete cascade,
  kind text,                          -- schedule_change / reg_closing / results / general
  message text,
  created_at timestamptz default now()
);
-- Notify followers: "Your followed event has an update."

create table event_comments (
  id uuid primary key default gen_random_uuid(),
  event_id references events(id) on delete cascade,
  user_id references auth.users(id),
  body text,
  created_at timestamptz default now()
);

create table event_organizers (
  id text primary key,
  name text,
  type text,                          -- Sports club / College / Academy / League / Event company / Federation / Community organizer / Listing platform
  verified boolean default false,
  description text,
  sports text[],
  followers int default 0
);
```

## Editorial rules enforced by the current UI (keep them in the migration)

1. **No invented real events.** `verification_status = 'DEMO'` rows are prototype samples and must render the DEMO badge.
2. Real rows require `source` + `last_updated`; schedules only when published by the organizer.
3. High-risk adventure/combat events: informational + sanctioned competition listings only — no challenge mechanics.
4. Third-party events register via `registration_url` ("Register on organizer site"), never through PLAYR payments.
