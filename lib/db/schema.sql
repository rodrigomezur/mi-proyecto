-- ============================================================
-- Creatiq — Complete Database Schema
-- Multi-tenant SaaS scoped by org_id (Clerk organization ID)
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────────────────
-- 1. Ad Accounts
-- ────────────────────────────────────────────────────────────
create table ad_accounts (
  id uuid default gen_random_uuid() primary key,
  org_id text not null,
  meta_account_id text not null,
  name text,
  currency text,
  timezone text,
  is_active boolean default true,
  last_synced_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_ad_accounts_org_id on ad_accounts (org_id);
create unique index idx_ad_accounts_org_meta on ad_accounts (org_id, meta_account_id);

alter table ad_accounts enable row level security;

create policy "org_isolation" on ad_accounts
  using (org_id = current_setting('app.current_org_id', true));

create policy "org_insert" on ad_accounts
  for insert with check (org_id = current_setting('app.current_org_id', true));

create policy "org_update" on ad_accounts
  for update using (org_id = current_setting('app.current_org_id', true));

create policy "org_delete" on ad_accounts
  for delete using (org_id = current_setting('app.current_org_id', true));

-- ────────────────────────────────────────────────────────────
-- 2. Creatives
-- ────────────────────────────────────────────────────────────
create table creatives (
  id uuid default gen_random_uuid() primary key,
  org_id text not null,
  ad_account_id uuid references ad_accounts(id),
  meta_ad_id text not null unique,
  meta_adset_id text,
  meta_campaign_id text,
  name text,
  status text,
  thumbnail_url text,
  video_url text,
  ad_copy text,
  call_to_action text,
  spend numeric default 0,
  roas numeric default 0,
  ctr numeric default 0,
  cpa numeric default 0,
  hook_rate numeric default 0,
  hold_rate numeric default 0,
  impressions integer default 0,
  clicks integer default 0,
  purchases integer default 0,
  analysis_status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_creatives_org_id on creatives (org_id);
create index idx_creatives_ad_account_id on creatives (ad_account_id);
create index idx_creatives_meta_ad_id on creatives (meta_ad_id);
create index idx_creatives_analysis_status on creatives (analysis_status);
create index idx_creatives_org_status on creatives (org_id, analysis_status);

alter table creatives enable row level security;

create policy "org_isolation" on creatives
  using (org_id = current_setting('app.current_org_id', true));

create policy "org_insert" on creatives
  for insert with check (org_id = current_setting('app.current_org_id', true));

create policy "org_update" on creatives
  for update using (org_id = current_setting('app.current_org_id', true));

create policy "org_delete" on creatives
  for delete using (org_id = current_setting('app.current_org_id', true));

-- ────────────────────────────────────────────────────────────
-- 3. Creative Analysis
-- ────────────────────────────────────────────────────────────
create table creative_analysis (
  id uuid default gen_random_uuid() primary key,
  org_id text not null,
  creative_id uuid references creatives(id) on delete cascade,
  asset_type text,
  visual_format text,
  messaging_angle text,
  hook_tactic text,
  offer_type text,
  funnel_stage text,
  summary text,
  iteration_brief jsonb,
  analyzed_at timestamptz,
  model_used text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_creative_analysis_org_id on creative_analysis (org_id);
create unique index idx_creative_analysis_creative_id on creative_analysis (creative_id);

alter table creative_analysis enable row level security;

create policy "org_isolation" on creative_analysis
  using (org_id = current_setting('app.current_org_id', true));

create policy "org_insert" on creative_analysis
  for insert with check (org_id = current_setting('app.current_org_id', true));

create policy "org_update" on creative_analysis
  for update using (org_id = current_setting('app.current_org_id', true));

create policy "org_delete" on creative_analysis
  for delete using (org_id = current_setting('app.current_org_id', true));

-- ────────────────────────────────────────────────────────────
-- 4. Sync Jobs
-- ────────────────────────────────────────────────────────────
create table sync_jobs (
  id uuid default gen_random_uuid() primary key,
  org_id text not null,
  ad_account_id uuid references ad_accounts(id),
  status text default 'pending',
  type text default 'incremental',
  creatives_synced integer default 0,
  creatives_analyzed integer default 0,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create index idx_sync_jobs_org_id on sync_jobs (org_id);
create index idx_sync_jobs_ad_account_id on sync_jobs (ad_account_id);

alter table sync_jobs enable row level security;

create policy "org_isolation" on sync_jobs
  using (org_id = current_setting('app.current_org_id', true));

create policy "org_insert" on sync_jobs
  for insert with check (org_id = current_setting('app.current_org_id', true));

create policy "org_update" on sync_jobs
  for update using (org_id = current_setting('app.current_org_id', true));

-- ────────────────────────────────────────────────────────────
-- 5. Reports
-- ────────────────────────────────────────────────────────────
create table reports (
  id uuid default gen_random_uuid() primary key,
  org_id text not null,
  ad_account_id uuid,
  title text,
  date_from date,
  date_to date,
  total_spend numeric,
  avg_roas numeric,
  win_rate numeric,
  total_creatives integer,
  top_performers jsonb,
  bottom_performers jsonb,
  category_breakdown jsonb,
  ai_summary text,
  created_at timestamptz default now()
);

create index idx_reports_org_id on reports (org_id);

alter table reports enable row level security;

create policy "org_isolation" on reports
  using (org_id = current_setting('app.current_org_id', true));

create policy "org_insert" on reports
  for insert with check (org_id = current_setting('app.current_org_id', true));

create policy "org_update" on reports
  for update using (org_id = current_setting('app.current_org_id', true));

create policy "org_delete" on reports
  for delete using (org_id = current_setting('app.current_org_id', true));

-- ────────────────────────────────────────────────────────────
-- 6. Org Settings
-- ────────────────────────────────────────────────────────────
create table org_settings (
  id uuid default gen_random_uuid() primary key,
  org_id text not null unique,
  meta_access_token text,
  gemini_api_key text,
  roas_winner_threshold numeric default 2.0,
  min_spend_threshold numeric default 500,
  sync_frequency_hours integer default 24,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_org_settings_org_id on org_settings (org_id);

alter table org_settings enable row level security;

create policy "org_isolation" on org_settings
  using (org_id = current_setting('app.current_org_id', true));

create policy "org_insert" on org_settings
  for insert with check (org_id = current_setting('app.current_org_id', true));

create policy "org_update" on org_settings
  for update using (org_id = current_setting('app.current_org_id', true));

-- ────────────────────────────────────────────────────────────
-- 7. Updated_at trigger (auto-set on UPDATE)
-- ────────────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on ad_accounts
  for each row execute function update_updated_at();

create trigger set_updated_at before update on creatives
  for each row execute function update_updated_at();

create trigger set_updated_at before update on creative_analysis
  for each row execute function update_updated_at();

create trigger set_updated_at before update on org_settings
  for each row execute function update_updated_at();

-- ────────────────────────────────────────────────────────────
-- 8. Service role bypass (for server-side operations)
-- ────────────────────────────────────────────────────────────
-- The service_role key bypasses RLS by default in Supabase.
-- No extra policies needed for server-side admin operations.
