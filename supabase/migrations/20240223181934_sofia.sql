create extension postgis with schema "extensions";
create extension if not exists "uuid-ossp";
create extension if not exists "http" with schema "extensions";

-- profiles table 

CREATE TABLE IF NOT EXISTS "public"."profiles" (
  "id" "uuid" unique references auth.users on delete cascade not null primary key,
  "updated_at" timestamp with time zone,
  "username" "text" unique, --not null,
  "display_name" "text",
  "avatar_url" "text",
  "bio" "text",
  CONSTRAINT "profiles_bio_check" CHECK (("length"("bio") < 500)),
  CONSTRAINT "profiles_username_check" CHECK (("length"("username") < 20))
);

alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- avatar storage bucket

insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create or replace function delete_storage_object(bucket text, object text, out status int, out content text)
returns record
language 'plpgsql'
security definer
as $$
declare
  project_url text := 'https://zjtlbrgdqcbazdasfuzk.supabase.co';
  service_role_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqdGxicmdkcWNiYXpkYXNmdXprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNzQ5OTU4MywiZXhwIjoyMDIzMDc1NTgzfQ.V1DWjkgPD0LwymrwEHX1DPQm8Y3drgLsTXv0adW8wM8';
  url text := project_url||'/storage/v1/object/'||bucket||'/'||object;
begin
  select
      into status, content
           result.status::int, result.content::text
      FROM extensions.http((
    'DELETE',
    url,
    ARRAY[extensions.http_header('authorization','Bearer '||service_role_key)],
    NULL,
    NULL)::extensions.http_request) as result;
end;
$$;

create or replace function delete_avatar(avatar_url text, out status int, out content text)
returns record
language 'plpgsql'
security definer
as $$
begin
  select
      into status, content
           result.status, result.content
      from public.delete_storage_object('avatars', avatar_url) as result;
end;
$$;

create or replace function delete_old_avatar()
returns trigger
language 'plpgsql'
security definer
as $$
declare
  status int;
  content text;
  avatar_name text;
begin
  if coalesce(old.avatar_url, '') <> ''
      and (tg_op = 'DELETE' or (old.avatar_url <> coalesce(new.avatar_url, ''))) then
    avatar_name := old.avatar_url;
    select
      into status, content
      result.status, result.content
      from public.delete_avatar(avatar_name) as result;
    if status <> 200 then
      raise warning 'Could not delete avatar: % %', status, content;
    end if;
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger before_profile_changes
  before update of avatar_url or delete on public.profiles
  for each row execute function public.delete_old_avatar();

create or replace function delete_old_profile()
returns trigger
language 'plpgsql'
security definer
as $$
begin
  delete from public.joined_game where player_id = old.id;
  delete from public.games where organizer_id = old.id;
  delete from public.profiles where id = old.id;
  return old;
end;
$$;

create trigger before_delete_user
  before delete on auth.users
  for each row execute function public.delete_old_profile();

-- sports table

create table sports (
  "id" "uuid" primary key unique not null,
  "user_id" "uuid" references "profiles" on delete cascade not null,
  "name" text not null,
  "skill_level" int not null,

  constraint skill_level_range check (skill_level >= 0 and skill_level <= 2)
);

alter table sports
  enable row level security;

create policy "Sports are viewable by everyone." on sports
  for select using (true);

create policy "Users can insert their own sports." on sports
  for insert with check (auth.uid() = id);

create policy "Users can update their own sports." on sports
  for update using (auth.uid() = id);

create policy "Users can delete their own sports." on sports
  for delete using (auth.uid() = id);

-- games table

create table games (
  "id" "uuid" primary key unique not null,
  "organizer_id" "uuid" references "profiles" on delete cascade not null,
  "title" text not null,
  "description" text,
  "created_at" timestamp with time zone default "now"() not null,
  "datetime" timestamp with time zone not null,
  "sport" text not null,
  "skill_level" int not null, 
  "address" text not null,
  "location" geography(POINT) not null,
  "max_players" bigint not null,
  "current_players" bigint DEFAULT '1'::bigint not null,
  constraint game_skill_level_range check (skill_level >= 0 and skill_level <= 2)
);

create index games_geo_index
  on "public"."games"
  using GIST (location);

alter table games
  enable row level security;

create policy "Games are viewable by everyone." on games
  for select using (true);

create policy "Users can insert their own games." on games
  for insert with check (auth.uid() = organizer_id);

create policy "Users can update their own games." on games
  for update using (auth.uid() = organizer_id);

create policy "Users can delete their own games." on games
  for delete using (auth.uid() = organizer_id);

-- sort games from closest to farthest given lat, long
create or replace function nearby_games(lat float, long float)
returns table (id public.games.id%TYPE, title public.games.title%TYPE, lat float, long float, dist_meters float)
language sql
as $$
  select id, title, st_y(location::geometry) as lat, st_x(location::geometry) as long, st_distance(location, st_point(long, lat)::geography) as dist_meters
  from public.games
  order by location <-> st_point(long, lat)::geography;
$$;

-- joined games table

create table joined_game (
  "id" "uuid" primary key unique not null,
  "player_id" "uuid" references "profiles" not null,
  "game_id" "uuid" references "games" on delete cascade not null
);

alter table joined_game
  enable row level security;

create policy "Joined games are viewable by everyone." on joined_game
  for select using (true);

-- TODO: how to check that auth.uid() = game organizer id??
-- and how to check that adding this player won't exceed the game's max_players?
-- create policy "Organizers can insert other users' membership." on joined_game
--  for insert with check (); 

-- TODO: how to check that auth.uid() = game organizer id OR auth.uid() = player_id??
-- and if the row deleted is the game's organizer, need to also delete the game itself (or block this action altogether)
-- create policy "Players (and the game's organizer) can delete their own membership." on joined_game
--  for delete using (auth.uid() = player_id);

-- TODO: add trigger that increments/decrements current_players count in games table 
-- whenever a row is added to / removed from joined_game

-- when creating a game, add organizer_id to joined_game 
create or replace function add_organizer_id_to_game()
returns trigger
language 'plpgsql'
security definer
as $$
begin
  insert into "public"."joined_game" (id, player_id, game_id)
  values (uuid_generate_v4(), new.organizer_id, new.id);
  return new;
end;
$$;
create trigger after_add_game
  after insert on "public"."games"
  for each row execute function public.add_organizer_id_to_game();