create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  created_at timestamp with time zone default now()
);