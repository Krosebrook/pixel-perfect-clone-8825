-- Create profiles table
create table public.profiles (
  id uuid not null primary key references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  department text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
on public.profiles for select
using (true);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- Create function to handle new user profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

-- Trigger for new user profile creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create messages table
create table public.messages (
  id uuid not null default gen_random_uuid() primary key,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone not null default now()
);

-- Enable RLS on messages
alter table public.messages enable row level security;

-- Messages policies
create policy "Authenticated users can view messages"
on public.messages for select
to authenticated
using (true);

create policy "Users can insert their own messages"
on public.messages for insert
to authenticated
with check (auth.uid() = sender_id);

-- Create recognitions table
create table public.recognitions (
  id uuid not null default gen_random_uuid() primary key,
  giver_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  badge_type text not null default 'star',
  created_at timestamp with time zone not null default now()
);

-- Enable RLS on recognitions
alter table public.recognitions enable row level security;

-- Recognitions policies
create policy "Authenticated users can view recognitions"
on public.recognitions for select
to authenticated
using (true);

create policy "Users can give recognitions"
on public.recognitions for insert
to authenticated
with check (auth.uid() = giver_id);

-- Add realtime for messages and recognitions
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table recognitions;

-- Enable replica identity for realtime
alter table public.messages replica identity full;
alter table public.recognitions replica identity full;