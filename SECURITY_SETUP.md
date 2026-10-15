# Protected code generation

Apply `supabase/migrations/20261015000000_codegen_quota.sql` before deploying the
updated `generate-code` function. Keep `OPENAI_API_KEY` server-side and the normal
Supabase URL/anon configuration present. The function verifies a real signed-in
user, checks `projects.user_id`, and reserves a daily quota before provider use.
Missing quota infrastructure fails closed with 503. Each account gets 20 generation
attempts per UTC day; failed provider attempts also consume quota.

New projects are assigned to their authenticated creator. Existing projects with
null or incorrect `user_id` must be reconciled by an administrator from trusted
ownership records; they cannot be claimed by submitting an ID to this endpoint.
Verify and retain project RLS policies in the deployed database. This patch does
not infer ownership for legacy data or bypass RLS.

The enhanced generator now calls the actual Supabase edge function with the
Supabase client's session. Signed-out users must sign in first. The public anon
key alone, anonymous-auth users, another user's project, and exhausted quota are
rejected before OpenAI calls.

Offline mocked-handler tests: `node --experimental-vm-modules --test tests/generate-code.test.mjs`.
Database migration execution/concurrency and deployed session flows require a
staging Supabase instance and were not run against production.
