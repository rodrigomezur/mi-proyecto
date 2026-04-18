CREATE TABLE IF NOT EXISTS sync_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ad_account_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total_ads integer DEFAULT 0,
  processed_ads integer DEFAULT 0,
  analyzed_ads integer DEFAULT 0,
  error_message text,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE sync_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "no_public_access" ON sync_jobs FOR ALL USING (false);
CREATE INDEX idx_sync_jobs_user_id ON sync_jobs(user_id);
CREATE INDEX idx_sync_jobs_status ON sync_jobs(status);
