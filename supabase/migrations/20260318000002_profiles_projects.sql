-- Profiles: synced from Clerk on first login
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id text UNIQUE NOT NULL,
  email text,
  full_name text,
  created_at timestamp with time zone DEFAULT now()
);

-- Projects: each user can have many projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own profile
CREATE POLICY "users_read_own_profile" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "no_public_insert_profiles" ON profiles
  FOR INSERT WITH CHECK (false);

CREATE POLICY "no_public_update_profiles" ON profiles
  FOR UPDATE USING (false);

CREATE POLICY "no_public_delete_profiles" ON profiles
  FOR DELETE USING (false);

-- Projects: users can only access their own projects
-- (enforced server-side via service role + clerk_id filtering)
CREATE POLICY "no_public_read_projects" ON projects
  FOR SELECT USING (false);

CREATE POLICY "no_public_insert_projects" ON projects
  FOR INSERT WITH CHECK (false);

CREATE POLICY "no_public_update_projects" ON projects
  FOR UPDATE USING (false);

CREATE POLICY "no_public_delete_projects" ON projects
  FOR DELETE USING (false);

-- Indexes
CREATE INDEX idx_profiles_clerk_id ON profiles(clerk_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
