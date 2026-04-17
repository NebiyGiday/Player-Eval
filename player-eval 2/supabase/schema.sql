-- PlayerEval Database Schema
-- Run this entire file in your Supabase SQL editor (project > SQL Editor > New query)

create extension if not exists "uuid-ossp";

-- Players
create table if not exists players (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  position text not null default 'Unknown',
  age_group text not null default 'U14',
  jersey_number int,
  team_id text not null,
  coach_user_id text not null,
  parent_user_id text,
  created_at timestamptz default now()
);

-- Evaluations
create table if not exists evaluations (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid references players(id) on delete cascade,
  coach_user_id text not null,
  technical int not null check (technical between 1 and 10),
  game_iq int not null check (game_iq between 1 and 10),
  physical int not null check (physical between 1 and 10),
  mental int not null check (mental between 1 and 10),
  overall numeric(4,2) not null,
  coach_note text,
  strengths text[] default '{}',
  focus_areas text[] default '{}',
  created_at timestamptz default now()
);

-- Row Level Security
alter table players enable row level security;
alter table evaluations enable row level security;

-- Coaches manage their own players
create policy "coaches_own_players" on players for all
  using (coach_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Parents read their child's record
create policy "parents_read_child" on players for select
  using (parent_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Coaches manage evaluations they created
create policy "coaches_own_evals" on evaluations for all
  using (coach_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Parents read evals for their child
create policy "parents_read_evals" on evaluations for select
  using (
    player_id in (
      select id from players
      where parent_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- Indexes
create index if not exists idx_players_coach on players(coach_user_id);
create index if not exists idx_evals_player on evaluations(player_id);
create index if not exists idx_evals_created on evaluations(created_at desc);
