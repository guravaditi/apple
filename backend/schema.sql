-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER QUOTAS
create table public.user_quotas (
  user_id uuid references public.profiles(id) primary key,
  generation_count integer default 0,
  last_reset timestamp with time zone default timezone('utc'::text, now())
);

-- DOCUMENTS
-- Stores either raw text content OR a reference to a file in reference_url
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text,
  content text, 
  file_path text, -- Path in Supabase Storage if file upload
  file_type text, -- 'text', 'pdf', 'image'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- GENERATED CONTENT
create table public.generated_content (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents(id) not null,
  user_id uuid references public.profiles(id) not null,
  generation_type text not null, -- 'flashcards', 'quiz', 'deep-dive'
  content jsonb not null, -- Structured result from Gemini
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Simple version for Hackathon)
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.generated_content enable row level security;
alter table public.user_quotas enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own documents" on public.documents for select using (auth.uid() = user_id);
create policy "Users can insert own documents" on public.documents for insert with check (auth.uid() = user_id);

create policy "Users can view own generations" on public.generated_content for select using (auth.uid() = user_id);
create policy "Users can insert own generations" on public.generated_content for insert with check (auth.uid() = user_id);

create policy "Users can view own quotas" on public.user_quotas for select using (auth.uid() = user_id);
