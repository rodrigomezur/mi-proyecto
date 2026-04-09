CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ad_account_id text NOT NULL,
  account_name text NOT NULL,
  report_date text NOT NULL,
  total_spend numeric DEFAULT 0,
  avg_roas numeric DEFAULT 0,
  avg_cpa numeric DEFAULT 0,
  avg_hook_rate numeric DEFAULT 0,
  avg_hold_rate numeric DEFAULT 0,
  total_creatives integer DEFAULT 0,
  top_performers jsonb,
  bottom_performers jsonb,
  best_categories jsonb,
  ai_insights text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, ad_account_id, report_date)
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "no_public_access" ON reports FOR ALL USING (false);
CREATE INDEX idx_reports_user_id ON reports(user_id);
