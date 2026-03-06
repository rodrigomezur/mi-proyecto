import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client — uses anon key, respects RLS
// Before each request, call setOrgContext() to set the org_id for RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client — uses service role key, bypasses RLS
// Only use in server actions, API routes, and cron jobs
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  return createClient(supabaseUrl, serviceRoleKey)
}

// Set the org context for RLS policies on the anon client
// Call this before any query that touches org-scoped tables
export async function setOrgContext(orgId: string) {
  await supabase.rpc('set_config', {
    setting: 'app.current_org_id',
    value: orgId,
  })
}
