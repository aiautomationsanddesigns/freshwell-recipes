-- Freshwell Database Schema
-- Run this in your Supabase SQL editor

-- Saved recipes
create table if not exists saved_recipes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  recipe_data jsonb not null,
  created_at timestamptz default now()
);

create index idx_saved_recipes_user_id on saved_recipes(user_id);

-- Meal plans
create table if not exists meal_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text default 'My Meal Plan',
  plan_data jsonb not null,
  created_at timestamptz default now()
);

create index idx_meal_plans_user_id on meal_plans(user_id);

-- Shared recipes (public links)
create table if not exists shared_recipes (
  id uuid default gen_random_uuid() primary key,
  share_code text unique not null,
  recipe_data jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create index idx_shared_recipes_code on shared_recipes(share_code);

-- RLS policies
alter table saved_recipes enable row level security;
alter table meal_plans enable row level security;
alter table shared_recipes enable row level security;

-- Users can only manage their own saved recipes
create policy "Users can manage own recipes" on saved_recipes
  for all using (auth.uid() = user_id);

-- Users can only manage their own meal plans
create policy "Users can manage own meal plans" on meal_plans
  for all using (auth.uid() = user_id);

-- Anyone can view shared recipes
create policy "Anyone can view shared recipes" on shared_recipes
  for select using (true);

-- Authenticated users can create shared recipes
create policy "Auth users can share" on shared_recipes
  for insert with check (auth.uid() = created_by);

-- Allow unauthenticated sharing too (created_by can be null)
create policy "Anyone can share recipes" on shared_recipes
  for insert with check (created_by is null);
