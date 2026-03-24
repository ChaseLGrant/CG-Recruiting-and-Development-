-- ============================================================
-- Run It — Supabase Schema
-- Tournament platform for baseball & softball teams
-- ============================================================

-- 0. Extensions
create extension if not exists "uuid-ossp";

-- 1. Custom types
do $$ begin
  create type user_role as enum ('player', 'coach', 'team', 'host');
exception when duplicate_object then null;
end $$;

-- If enum already exists from old schema, add 'host' value safely
do $$ begin
  alter type user_role add value if not exists 'host';
exception when others then null;
end $$;

do $$ begin
  create type housing_option as enum ('yes', 'no', 'unknown');
exception when duplicate_object then null;
end $$;

-- 2. Profiles table (extends Supabase auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role user_role not null,
  full_name text,
  created_at timestamptz default now()
);

-- 3. Programs (college programs managed by coaches)
create table if not exists programs (
  id uuid primary key default uuid_generate_v4(),
  created_by uuid not null references profiles(id) on delete cascade,
  college_name text not null,
  location_city text,
  location_state text,
  coach_name text,
  coach_email text,
  coach_phone text,
  logo_url text,
  created_at timestamptz default now()
);

-- 4. Players
create table if not exists players (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete set null,
  program_id uuid references programs(id) on delete set null,
  created_by_coach_id uuid references profiles(id) on delete set null,
  name text not null,
  position_primary text,
  position_secondary text,
  grad_year int,
  height text,
  weight text,
  bats text,
  throws text,
  stats_text text,
  bio text,
  video_url text,
  availability_start date,
  availability_end date,
  availability_notes text,
  contact_email text,
  contact_phone text,
  created_at timestamptz default now()
);

-- 5. Teams
create table if not exists teams (
  id uuid primary key default uuid_generate_v4(),
  created_by uuid not null references profiles(id) on delete cascade,
  team_name text not null,
  league_name text,
  location_city text,
  location_state text,
  website_url text,
  contact_email text,
  logo_url text,
  description text,
  created_at timestamptz default now()
);

-- 6. Listings
create table if not exists listings (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  listing_title text not null,
  season_start date,
  season_end date,
  positions_needed text[] default '{}',
  roster_spots_open int,
  housing_provided housing_option default 'unknown',
  stipend_text text,
  requirements_text text,
  notes text,
  contact_email text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 7. Inquiries
create table if not exists inquiries (
  id uuid primary key default uuid_generate_v4(),
  from_user_id uuid references profiles(id) on delete set null,
  from_name text,
  from_email text,
  to_team_id uuid references teams(id) on delete set null,
  to_listing_id uuid references listings(id) on delete set null,
  to_player_id uuid references players(id) on delete set null,
  message text,
  created_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_players_program on players(program_id);
create index if not exists idx_players_position on players(position_primary);
create index if not exists idx_players_grad_year on players(grad_year);
create index if not exists idx_players_availability on players(availability_start, availability_end);
create index if not exists idx_players_coach on players(created_by_coach_id);
create index if not exists idx_listings_team on listings(team_id);
create index if not exists idx_listings_season on listings(season_start, season_end);
create index if not exists idx_inquiries_listing on inquiries(to_listing_id);
create index if not exists idx_inquiries_player on inquiries(to_player_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles
alter table profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Programs
alter table programs enable row level security;

drop policy if exists "Programs are viewable by everyone" on programs;
create policy "Programs are viewable by everyone"
  on programs for select using (true);

drop policy if exists "Coaches can insert programs" on programs;
create policy "Coaches can insert programs"
  on programs for insert with check (auth.uid() = created_by);

drop policy if exists "Coaches can update own programs" on programs;
create policy "Coaches can update own programs"
  on programs for update using (auth.uid() = created_by);

drop policy if exists "Coaches can delete own programs" on programs;
create policy "Coaches can delete own programs"
  on programs for delete using (auth.uid() = created_by);

-- Players
alter table players enable row level security;

drop policy if exists "Players are viewable by everyone" on players;
create policy "Players are viewable by everyone"
  on players for select using (true);

drop policy if exists "Coaches can insert players for their program" on players;
create policy "Coaches can insert players for their program"
  on players for insert with check (
    auth.uid() = created_by_coach_id
    or auth.uid() = user_id
  );

drop policy if exists "Coaches can update players they created" on players;
create policy "Coaches can update players they created"
  on players for update using (
    auth.uid() = created_by_coach_id
    or auth.uid() = user_id
  );

drop policy if exists "Coaches can delete players they created" on players;
create policy "Coaches can delete players they created"
  on players for delete using (
    auth.uid() = created_by_coach_id
    or auth.uid() = user_id
  );

-- Teams
alter table teams enable row level security;

drop policy if exists "Teams are viewable by everyone" on teams;
create policy "Teams are viewable by everyone"
  on teams for select using (true);

drop policy if exists "Team admins can insert teams" on teams;
create policy "Team admins can insert teams"
  on teams for insert with check (auth.uid() = created_by);

drop policy if exists "Team admins can update own teams" on teams;
create policy "Team admins can update own teams"
  on teams for update using (auth.uid() = created_by);

drop policy if exists "Team admins can delete own teams" on teams;
create policy "Team admins can delete own teams"
  on teams for delete using (auth.uid() = created_by);

-- Listings
alter table listings enable row level security;

drop policy if exists "Active listings are viewable by everyone" on listings;
create policy "Active listings are viewable by everyone"
  on listings for select using (true);

drop policy if exists "Team admins can insert listings" on listings;
create policy "Team admins can insert listings"
  on listings for insert with check (
    exists (
      select 1 from teams where teams.id = team_id and teams.created_by = auth.uid()
    )
  );

drop policy if exists "Team admins can update own listings" on listings;
create policy "Team admins can update own listings"
  on listings for update using (
    exists (
      select 1 from teams where teams.id = team_id and teams.created_by = auth.uid()
    )
  );

drop policy if exists "Team admins can delete own listings" on listings;
create policy "Team admins can delete own listings"
  on listings for delete using (
    exists (
      select 1 from teams where teams.id = team_id and teams.created_by = auth.uid()
    )
  );

-- Inquiries
alter table inquiries enable row level security;

drop policy if exists "Users can view inquiries they sent or received" on inquiries;
create policy "Users can view inquiries they sent or received"
  on inquiries for select using (
    auth.uid() = from_user_id
    or exists (
      select 1 from teams where teams.id = to_team_id and teams.created_by = auth.uid()
    )
    or exists (
      select 1 from players where players.id = to_player_id
        and (players.created_by_coach_id = auth.uid() or players.user_id = auth.uid())
    )
  );

drop policy if exists "Authenticated users can create inquiries" on inquiries;
create policy "Authenticated users can create inquiries"
  on inquiries for insert with check (auth.uid() = from_user_id);

-- ============================================================
-- FUNCTION: Handle new user signup → auto-create profile
-- ============================================================
-- The function uses security definer so it runs with the
-- privileges of the function owner (postgres) and can bypass RLS.
-- The exception block ensures that a trigger failure never
-- prevents the auth.users row from being created — the app
-- will create the profile as a fallback on first login.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'player')::user_role,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
exception when others then
  raise warning 'handle_new_user failed for user %: %', new.id, sqlerrm;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- RUN IT — TOURNAMENT TABLES
-- ============================================================

-- Tournaments
create table if not exists tournaments (
  id uuid primary key default uuid_generate_v4(),
  host_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  location text not null,
  date date not null,
  max_teams int not null default 8,
  entry_fee numeric(10,2) not null default 0,
  description text,
  format text not null default 'bracket', -- 'bracket' | 'round_robin'
  sport text not null default 'baseball',  -- 'baseball' | 'softball'
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Tournament Registrations
create table if not exists tournament_registrations (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  team_name text not null,
  payment_status text not null default 'pending', -- 'pending' | 'paid' | 'free'
  stripe_session_id text,
  amount_paid numeric(10,2),
  created_at timestamptz default now(),
  unique(tournament_id, user_id)
);

-- ============================================================
-- INDEXES for tournaments
-- ============================================================
create index if not exists idx_tournaments_host on tournaments(host_id);
create index if not exists idx_tournaments_date on tournaments(date);
create index if not exists idx_registrations_tournament on tournament_registrations(tournament_id);
create index if not exists idx_registrations_user on tournament_registrations(user_id);

-- ============================================================
-- RLS for tournaments
-- ============================================================

alter table tournaments enable row level security;

drop policy if exists "Tournaments are viewable by everyone" on tournaments;
create policy "Tournaments are viewable by everyone"
  on tournaments for select using (true);

drop policy if exists "Hosts can create tournaments" on tournaments;
create policy "Hosts can create tournaments"
  on tournaments for insert with check (auth.uid() = host_id);

drop policy if exists "Hosts can update own tournaments" on tournaments;
create policy "Hosts can update own tournaments"
  on tournaments for update using (auth.uid() = host_id);

drop policy if exists "Hosts can delete own tournaments" on tournaments;
create policy "Hosts can delete own tournaments"
  on tournaments for delete using (auth.uid() = host_id);

-- RLS for tournament_registrations
alter table tournament_registrations enable row level security;

drop policy if exists "Registrations are viewable by everyone" on tournament_registrations;
create policy "Registrations are viewable by everyone"
  on tournament_registrations for select using (true);

drop policy if exists "Authenticated users can register" on tournament_registrations;
create policy "Authenticated users can register"
  on tournament_registrations for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own registrations" on tournament_registrations;
create policy "Users can update own registrations"
  on tournament_registrations for update using (
    auth.uid() = user_id
    or exists (
      select 1 from tournaments t where t.id = tournament_id and t.host_id = auth.uid()
    )
  );

drop policy if exists "Service role can update registrations" on tournament_registrations;
create policy "Service role can update registrations"
  on tournament_registrations for update using (true)
  with check (true);
