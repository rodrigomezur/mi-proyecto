-- Drop old creatives table if exists (from previous schema with org_id)
DROP TABLE IF EXISTS creative_analysis CASCADE;
DROP TABLE IF EXISTS creatives CASCADE;

-- Creatives table: synced ad data with metrics and AI analysis
CREATE TABLE creatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ad_account_id text NOT NULL,
  ad_id text NOT NULL,
  ad_name text,
  campaign text,
  ad_set text,
  ad_status text,
  ad_type text,

  -- Asset URLs
  video_url text,
  image_url text,
  video_thumbnail_url text,

  -- Performance metrics
  spend numeric DEFAULT 0,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  ctr numeric DEFAULT 0,
  conversions integer DEFAULT 0,
  cpa numeric DEFAULT 0,
  roas numeric DEFAULT 0,
  cpm numeric DEFAULT 0,
  link_clicks integer DEFAULT 0,

  -- Video metrics
  video_views_3s integer DEFAULT 0,
  hook_rate numeric DEFAULT 0,
  hold_rate numeric DEFAULT 0,
  video_25 integer DEFAULT 0,
  video_50 integer DEFAULT 0,
  video_75 integer DEFAULT 0,
  video_100 integer DEFAULT 0,
  cost_per_video_view numeric DEFAULT 0,

  -- Ad copy
  ad_headline text,
  ad_description text,
  ad_cta text,

  -- AI analysis (6-category framework)
  asset_type text,
  visual_format text,
  messaging_angle text,
  hook_tactic text,
  offer_type text,
  funnel_stage text,
  ai_summary text,
  analysis_status text DEFAULT 'pending',
  analyzed_at timestamp with time zone,

  -- System
  last_synced timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),

  UNIQUE(user_id, ad_id)
);

ALTER TABLE creatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "no_public_access" ON creatives FOR ALL USING (false);

CREATE INDEX idx_creatives_user_id ON creatives(user_id);
CREATE INDEX idx_creatives_ad_account_id ON creatives(ad_account_id);
CREATE INDEX idx_creatives_analysis_status ON creatives(analysis_status);
