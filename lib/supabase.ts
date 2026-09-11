import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Server-side client uses the service role key so API routes can
// bypass row-level security for cross-account admin queries.
// NEVER expose SUPABASE_SERVICE_ROLE_KEY to the browser.
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabase = createClient<Database>(url, anonKey);

export const supabaseAdmin = createClient<Database>(
  url,
  serviceKey || anonKey
);
