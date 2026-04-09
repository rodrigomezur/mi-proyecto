-- Ad accounts linked to a user
CREATE TABLE IF NOT EXISTS ad_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ad_account_id text NOT NULL,
  account_name text NOT NULL,
  active boolean DEFAULT true,
  last_synced timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, ad_account_id)
);

ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "no_public_access" ON ad_accounts FOR ALL USING (false);

CREATE INDEX idx_ad_accounts_user_id ON ad_accounts(user_id);
