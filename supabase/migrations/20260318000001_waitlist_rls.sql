-- Enable Row Level Security on waitlist table
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for the public signup form)
CREATE POLICY "anyone_can_insert" ON waitlist
  FOR INSERT WITH CHECK (true);

-- Block all reads/updates/deletes via anon key
-- Admin access uses service_role key which bypasses RLS
CREATE POLICY "no_public_read" ON waitlist
  FOR SELECT USING (false);

CREATE POLICY "no_public_update" ON waitlist
  FOR UPDATE USING (false);

CREATE POLICY "no_public_delete" ON waitlist
  FOR DELETE USING (false);
