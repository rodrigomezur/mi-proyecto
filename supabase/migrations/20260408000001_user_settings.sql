-- User settings for API keys and sync configuration
-- Each user gets one settings row (1:1 with profiles)
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  meta_access_token text,
  meta_token_created_at timestamp with time zone,
  gemini_api_key text,
  roas_winner_threshold numeric DEFAULT 1.0,
  min_spend_threshold numeric DEFAULT 0,
  sync_frequency text DEFAULT 'manual',
  date_range_days integer DEFAULT 30,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS: block all public access, service role only
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "no_public_access" ON user_settings FOR ALL USING (false);

-- Index
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
