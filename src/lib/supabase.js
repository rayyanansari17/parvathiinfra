import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client used by API route handlers (never imported by
// client components). Uses the anon key — RLS policies on `leads`,
// `brochure_requests` and `chat_messages` are scoped to allow exactly the
// insert/select operations these routes perform.
let cached;

export function getSupabase() {
        if (cached) return cached;

        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_ANON_KEY;

        if (!url || !key) {
                throw new Error(
                        'Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.',
                );
        }

        cached = createClient(url, key, {
                auth: { persistSession: false },
        });
        return cached;
}
