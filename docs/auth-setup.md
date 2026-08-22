# PLAYR — Authentication Setup

The complete auth + onboarding flow works **out of the box in local demo mode**
(accounts + sessions in `localStorage`, passwords hashed with SHA-256). No setup needed.

## Switching to Supabase Auth (zero code changes)

1. Create a project at [supabase.com](https://supabase.com/dashboard).
2. In the SQL editor, run the schema from `files.zip` (`sql/01_schema.sql` … `sql/04_seed.sql`)
   and make sure a `profiles` table exists with at least:

   ```sql
   create table if not exists profiles (
     user_id uuid primary key references auth.users(id) on delete cascade,
     full_name text,
     username text unique,
     email text,
     bio text,
     location text,
     profile_image text,
     sports text[] default '{}'
   );
   ```

3. **Authentication → URL Configuration**: set the Site URL to your deployment
   (`https://playrr.sport.community`) so confirmation/reset emails redirect correctly.
4. Copy **Project URL** + the **anon/public** key into `js/config.js`.
5. Done. `js/auth.js` auto-detects the config, lazily loads `supabase-js` from CDN, and routes
   **sign up / sign in / sign out / password reset / session persistence** through Supabase Auth.
   Profiles are upserted to the `profiles` table on every profile update.

> ⚠️ Only the **anon** key belongs in frontend code. The `service_role` key must never leave the server.

## Notes

- With email confirmation enabled in Supabase, sign-up shows
  *"check your email to confirm, then sign in"* instead of entering onboarding immediately.
- Local demo accounts live in `localStorage` (`playr_users_v2` / `playr_session_v2`) and never leave the browser.
- Sport picks during onboarding are written both to the profile and to the existing
  personalization engine (`playr_my_sports_v1`), so the For You feed, challenges and events
  react instantly — in both modes.
