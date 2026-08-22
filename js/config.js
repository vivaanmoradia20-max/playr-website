/* ============================================================
   PLAYR — Supabase configuration (AUTH-READY)
   ------------------------------------------------------------
   The site works fully in LOCAL DEMO MODE with these
   placeholders. To switch all authentication to Supabase Auth:

   1. Create a project at https://supabase.com/dashboard
   2. Run the SQL from files.zip (sql/01_schema.sql etc.) or
      docs/auth-setup.md
   3. Paste your Project URL + anon (public) key below.

   NEVER put the service_role key in frontend code.
   ============================================================ */
window.PLAYR_ENV = {
  SUPABASE_URL: "https://YOUR-PROJECT-REF.supabase.co",
  SUPABASE_ANON_KEY: "YOUR-PUBLIC-ANON-KEY"
};
