create extension postgis with schema "extensions";
create extension if not exists "uuid-ossp";
create extension if not exists "http" with schema "extensions";

-- profiles table 

create table if not exists "public"."profiles" (
  "id" "uuid" unique references auth.users on delete cascade not null primary key default "auth"."uid"(),
  "updated_at" timestamp with time zone,
  "username" text unique not null,
  "display_name" text,
  "avatar_url" text,
  "bio" text
  constraint "profiles_bio_check" check (("length"("bio") < 500)),
  constraint "profiles_username_check" check ((("length"("username") < 20) AND "regexp_like"("username", '^[A-Za-z0-9_]+$'::"text")))
);

alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
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

create or replace trigger before_profile_changes
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
  delete from public.game_requests where player_id = old.id;
  return old;
end;
$$;

create or replace trigger before_delete_user
  before delete on auth.users
  for each row execute function public.delete_old_profile();

-- sports table

create table sports (
  "id" "uuid" primary key unique not null default "gen_random_uuid"(),
  "user_id" "uuid" references "profiles" on delete cascade not null,
  "name" text not null,
  "skill_level" int not null,
  constraint skill_level_range check (skill_level >= 0 and skill_level <= 2)
);

alter table sports
  enable row level security;

-- create index for user_id column
create index userid
on sports
using btree (user_id);

create policy "Sports are viewable by everyone." on sports
  for select using (true);

create policy "Users can insert their own sports." on sports
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own sports." on sports
  for update using (auth.uid() = user_id);

create policy "Users can delete their own sports." on sports
  for delete using (auth.uid() = user_id);

-- games table

create table games (
  "id" "uuid" primary key unique not null default "gen_random_uuid"(),
  "organizer_id" "uuid" references "profiles" on delete cascade not null,
  "title" text not null,
  "description" text,
  "created_at" timestamp with time zone default "now"() not null,
  "datetime" timestamp with time zone not null,
  "sport" text not null,
  "skill_level" int not null, 
  "max_players" bigint not null,
  "current_players" bigint default '0'::bigint not null,
  "is_public" boolean default '1'::boolean not null,
  --"distance_away" "extensions"."geography"(Point,4326),
  constraint game_skill_level_range check (skill_level >= 0 and skill_level <= 2),
  constraint games_description_check check ((length(description) < 500)),
  constraint games_max_players_check check ((max_players >= 1))
);

-- create index for organizer_id column
create index organizerid
on games
using btree (organizer_id);

alter table games
  enable row level security;

create policy "Public games are viewable by everyone." on games
  for select using (
    is_public
  );

-- create policy "Friends-only games are viewable by the organizer's friends." on games
--   for select using (
--      (is not public) and (auth.id() is organizer's friend)
--   );

create policy "Users can insert their own games." on games
  for insert with check (auth.uid() = organizer_id);

create policy "Users can update their own games." on games
  for update using (auth.uid() = organizer_id);

create policy "Users can delete their own games." on games
  for delete using (auth.uid() = organizer_id);

-- joined games table

create table joined_game (
  "id" "uuid" primary key unique not null default "gen_random_uuid"(),
  "player_id" "uuid" references "profiles" not null,
  "game_id" "uuid" references "games" on delete cascade not null
);

alter table joined_game
  enable row level security;

-- create index for game_id column
create index gameid_jg
on joined_game
using btree (game_id);

-- create index for player_id column
create index playerid_jg
on joined_game
using btree (player_id);

create policy "Joined games are viewable by everyone." on joined_game
  for select using (true);

create or replace function can_user_join_game(game_id "uuid")
returns boolean AS $$
declare
  is_allowed boolean;
begin
  select
    (g.organizer_id = auth.uid() and (g.current_players + 1) <= g.max_players)
  into is_allowed
  from games g
  where g.id = game_id;
  return is_allowed;
end;
$$ language plpgsql;

create policy "Only organizers can accept a user's join request." on joined_game
  for insert with check (can_user_join_game(game_id));

create or replace function can_user_leave_game(player_id "uuid", game_id "uuid")
returns boolean AS $$
declare
  is_allowed boolean;
begin
  select
    ((g.organizer_id = auth.uid() and g.organizer_id != player_id) or (g.organizer_id != auth.uid() and player_id = auth.uid()))
  into is_allowed
  from games g
  where g.id = game_id;
  return is_allowed;
end;
$$ language plpgsql;

create policy "Players can leave a game themselves, or they can be removed by the organizer. Organizers cannot remove themselves." on joined_game
  for delete using (can_user_leave_game(player_id, game_id));

-- create or replace function add_organizer_id_to_game()
-- returns trigger
-- language 'plpgsql'
-- security definer
-- as $$
-- begin
--   insert into "public"."joined_game" (id, player_id, game_id)
--   values (uuid_generate_v4(), new.organizer_id, new.id);
--   return new;
-- end;
-- $$;

-- -- when creating a game, add organizer_id to joined_game 
-- create trigger after_add_game
--   after insert on "public"."games"
--   for each row execute function public.add_organizer_id_to_game();

-- game locations table

create table game_locations (
  "id" "uuid" primary key unique not null default "gen_random_uuid"(),
  "game_id" "uuid" references "games" on delete cascade unique not null,
  "street" text not null,
  "city" text not null,
  "state" text not null,
  "zip" text not null,
  "loc" "extensions"."geography"(Point,4326)
);

create index gameloc
  on "public"."game_locations"
  using GIST (loc);

create index gameid_gl
  on "public"."game_locations"
  using btree (game_id);

alter table game_locations
  enable row level security;
  
create policy "Users can access location if they've joined the game." on game_locations
  for select using (
    auth.uid() in (
      select player_id from joined_game
      where joined_game.game_id = game_locations.game_id
    )
);

-- create or replace function add_location()
-- returns trigger
-- language 'plpgsql'
-- security definer
-- as $$
-- declare
--   status int;
--   content jsonb;
--   lat text;
--   long text;
--   newlat double precision;
--   newlong double precision;
--   coords "extensions"."geography"(Point,4326);
-- begin
--   select
--     into status, content
--     result.status, result.content
--     from public.get_location(new.street, new.city, new.state, new.zip) as result;
--   if status <> 200 then
--     raise EXCEPTION 'Could not get geolocation: % %', status, content;
--   end if;

--   select content->0->>'lat', content->0->>'lon'
--   into lat, long
--   from jsonb_array_elements(content);

--   if lat is null or long is null then
--     raise EXCEPTION 'Could not get geolocation: % %', status, content;
--   end if;

--   newlat := cast(lat as double precision);
--   newlong := cast(long as double precision);
--   coords := st_point(newlat, newlong)::geography;

--   update public.game_locations
--   set loc = coords
--   where id = new.id;
--   return new;
-- end;
-- $$;

-- -- on insert to game_locations, query lat/long from API and add point to loc column
-- create or replace trigger on_game_address_created
--   after insert on game_locations
--   for each row execute procedure public.add_location();

-- -- on update to game_locations, query lat/long from API and add point to loc column
-- create or replace trigger on_game_address_updated
--   after update of street, city, state, zip on game_locations
--   for each row execute procedure public.add_location();

-- game join requests table

create table game_requests (
  "id" "uuid" primary key unique not null default "gen_random_uuid"(),
  "created_at" timestamp with time zone default "now"() not null,
  "game_id" "uuid" references "games" on delete cascade not null,
  "player_id" "uuid" references "profiles" not null
);

create index gameid_gr
  on "public"."game_requests"
  using btree (game_id);

create index playerid_gr
  on "public"."game_requests"
  using btree (player_id);

alter table game_requests
  enable row level security;

create or replace function can_user_select_or_delete_requests(game_id "uuid")
returns boolean AS $$
declare
  is_allowed boolean;
begin
  select
    (g.organizer_id = auth.uid())
  into is_allowed
  from games g
  where g.id = game_id;
  return is_allowed;
end;
$$ language plpgsql;
  
create policy "Organizers of a game can access that game's join requests." on game_requests
  for select using (can_user_select_or_delete_requests(game_id));

create policy "Players cannot add multiple pending join requests for the same game." on game_requests
  for insert with check (
    not exists (
      select player_id from game_requests
      where game_requests.game_id = game_id and game_requests.player_id = auth.uid()
    )
  );

create policy "Users cannot update existing join requests." on game_requests
  for update with check (false);

create policy "Organizers of a game can remove join requests for that game." on game_requests
  for delete using (can_user_select_or_delete_requests(game_id));

-- helper functions and types

-- from https://stackoverflow.com/questions/10318014/javascript-encodeuri-like-function-in-postgresql
CREATE OR REPLACE FUNCTION urlencode(in_str text, OUT _result text)
    STRICT IMMUTABLE AS $urlencode$
DECLARE
    _i      int4;
    _temp   varchar;
    _ascii  int4;
BEGIN
    _result = '';
    FOR _i IN 1 .. length(in_str) LOOP
        _temp := substr(in_str, _i, 1);
        IF _temp ~ '[0-9a-zA-Z:/@._?#-]+' THEN
            _result := _result || _temp;
        ELSE
            _ascii := ascii(_temp);
            IF _ascii > x'07ff'::int4 THEN
                RAISE EXCEPTION 'Won''t deal with 3 (or more) byte sequences.';
            END IF;
            IF _ascii <= x'07f'::int4 THEN
                _temp := '%'||to_hex(_ascii);
            ELSE
                _temp := '%'||to_hex((_ascii & x'03f'::int4)+x'80'::int4);
                _ascii := _ascii >> 6;
                _temp := '%'||to_hex((_ascii & x'01f'::int4)+x'c0'::int4)
                            ||_temp;
            END IF;
            _result := _result || upper(_temp);
        END IF;
    END LOOP;
    RETURN ;
END;
$urlencode$ LANGUAGE plpgsql;

-- query long and lat from API
create or replace function get_location(in street text, in city text, in state text, in zip text, out status int, out content text)
returns record
language 'plpgsql'
security definer
as $$
declare
  api_key text := '65e0f4e8bc79e688163432osme79a3d';
  full_address text;
  encoded_address text; 
  api_url text; 
begin
  full_address := street || ' ' || city || ' ' || state || ' ' || zip;
  encoded_address := urlencode(full_address);
  api_url := 'https://geocode.maps.co/search?q=' || encoded_address || '&api_key=' || api_key;

  select
      into status, content
           result.status::int, result.content::text
      FROM extensions.http((
    'DELETE',
    api_url,
    ARRAY[extensions.http_header('authorization','Bearer '||api_key)],
    NULL,
    NULL)::extensions.http_request) as result;
end;
$$;

create or replace function get_coordinates(in street text, in city text, in state text, in zip text)
returns "extensions"."geography"(Point,4326)
language 'plpgsql'
security definer
as $$
declare
  status int;
  content jsonb;
  lat text;
  long text;
  newlat double precision;
  newlong double precision;
  coords "extensions"."geography"(Point,4326);
begin
  select
    into status, content
    result.status, result.content
    from public.get_location(street, city, state, zip) as result;
  if status <> 200 then
    raise EXCEPTION 'Could not get geolocation: % %', status, content;
  end if;

  select content->0->>'lat', content->0->>'lon'
  into lat, long
  from jsonb_array_elements(content);

  if lat is null or long is null then
    raise EXCEPTION 'Could not get geolocation: % %', status, content;
  end if;

  newlat := cast(lat as double precision);
  newlong := cast(long as double precision);
  coords := st_point(newlat, newlong)::geography;
  return coords;
end;
$$;

-- custom type for creating or editing game
create type game as (
  title text,
  description text,
  datetime timestamp with time zone,
  street text,
  city text,
  state text,
  zip text,
  sport text,
  skillLevel int,
  maxPlayers bigint, 
  isPublic boolean
);

-- custom type for returning game with address
create type game_with_address as (
  id "uuid",
  organizerId "uuid",
  title text,
  description text,
  datetime timestamp with time zone,
  street text,
  city text,
  state text,
  zip text,
  sport text,
  skillLevel int,
  maxPlayers bigint, 
  currentPlayers bigint,
  --distanceAway double precision,
  isPublic boolean
);

-- custom type for returning game without address
create type game_without_address as (
  id "uuid",
  organizerId "uuid",
  title text,
  description text,
  datetime timestamp with time zone,
  sport text,
  skillLevel int,
  maxPlayers bigint, 
  currentPlayers bigint,
  --distanceAway double precision,
  isPublic boolean
);

-- miscellaneous functions

create or replace function create_game(data game)
returns record as $$
declare
  coords "extensions"."geography"(Point,4326);
  game_id "uuid";
  inserted_data game_with_address;
begin
  -- get location
  select public.get_coordinates(data.street, data.city, data.state, data.zip) into coords;

  -- insert row to games
  game_id := uuid_generate_v4();
  insert into games (id, organizer_id, title, description, datetime, sport, skill_level, max_players, current_players, is_public)
  values (game_id, auth.uid(), data.title, data.description, data.datetime, data.sport, data.skillLevel, data.maxPlayers, 1, data.isPublic);

  -- insert row to game_locations
  insert into game_locations (id, game_id, street, city, state, zip, loc)
  values (uuid_generate_v4(), game_id, data.street, data.city, data.state, data.zip, coords);

  -- add organizer to joined_game
  insert into joined_game (id, player_id, game_id)
  values (uuid_generate_v4(), auth.uid(), game_id);

  commit;

  -- return added data
  select (
    game_id, -- as id, 
    auth.uid(), -- as organizerId, 
    data.title, -- as title, 
    data.description, -- as description, 
    data.datetime, -- as datetime, 
    data.street, -- as street, 
    data.city, -- as city, 
    data.zip, -- as zip, 
    data.sport, -- as sport, 
    data.skillLevel, -- as skillLevel, 
    data.maxPlayers, -- as maxPlayers, 
    1, -- as currentPlayers, 
    --st_distance(coords, st_point(long, lat)::geography) as distanceAway,
    data.isPublic -- as isPublic
  ) into inserted_data;
  return inserted_data;
end;
$$ language plpgsql security definer;

create or replace function get_game_with_address(game_id "uuid") --"lat" double precision, "long" double precision)
returns record as $$
declare
  --coords "extensions"."geography"(Point,4326);
  data game_with_address;
begin
  -- get location
  -- select public.get_coordinates(data.street, data.city, data.state, data.zip) into coords;

  -- get games and game_locations rows by joining tables
  select (
    g.id, -- as id,
    g.organizer_id, -- as organizerId, 
    g.title, -- as title,
    g.description, -- as description,
    g.datetime, -- as datetime,
    gl.street, -- as street,
    gl.city, -- as city,
    gl.state, -- as state,
    gl.zip, -- as zip,
    g.sport, -- as sport,
    g.skill_level, -- as skillLevel,
    g.max_players, -- as maxPlayers,
    g.current_players, -- as currentPlayers,
    g.is_public-- as isPublic
    --st_distance(coords, st_point(long, lat)::geography) as distanceAway
  )
  from public.games as g
  join public.game_locations as gl on g.id = gl.id
  into data;
  return data;
end;
$$ language plpgsql;

create or replace function get_game_without_address(game_id "uuid") --"lat" double precision, "long" double precision)
returns record as $$
declare
  --coords "extensions"."geography"(Point,4326);
  data game_without_address;
begin
  -- get location
  -- select public.get_coordinates(data.street, data.city, data.state, data.zip) into coords;

  select (
    g.id, -- as id,
    g.organizer_id, -- as organizerId, 
    g.title, -- as title,
    g.description, -- as description,
    g.datetime, -- as datetime,
    g.sport, -- as sport,
    g.skill_level, -- as skillLevel,
    g.max_players, -- as maxPlayers,
    g.current_players, -- as currentPlayers,
    g.is_public -- as isPublic
    --st_distance(coords, st_point(long, lat)::geography) as distanceAway
  )
  from public.games as g
  into data;
  return data;
end;
$$ language plpgsql;

-- edit game by getting location, updating games and game_locations tables
create or replace function edit_game(game_id "uuid", data game)
returns record as $$
declare
  coords "extensions"."geography"(Point,4326);
  updated_data game_with_address;
begin
   -- get location
  select
    public.get_coordinates(data.street, data.city, data.state, data.zip)
  into coords;

  -- update row in games
  update games
  set 
    title = data.title,
    description = data.description,
    datetime = data.datetime,
    sport = data.sport,
    skill_level = data.skillLevel,
    max_players = data.maxPlayers,
    is_public = data.isPublic
  where game.id = game_id;

  -- update row in game_locations
  update game_locations
  set
    street = data.street,
    city = data.city,
    state = data.state,
    zip = data.zip,
    loc = coords
  where game_id = game_id;

  commit;

  -- return updated data
  select (
    game_id, -- as id, 
    auth.uid(), -- as organizerId, 
    data.title, -- as title, 
    data.description, -- as description, 
    data.datetime, -- as datetime, 
    data.street, -- as street, 
    data.city, -- as city, 
    data.zip, -- as zip, 
    data.sport, -- as sport, 
    data.skillLevel, -- as skillLevel, 
    data.maxPlayers, -- as maxPlayers, 
    1, -- as currentPlayers, 
    --st_distance(coords, st_point(long, lat)::geography) as distanceAway,
    data.isPublic -- as isPublic
  )
  into updated_data;
  return updated_data;
end;
$$ language plpgsql;

-- sort games from closest to farthest given lat, long
-- TODO: table returned should include all remaining game fields in type game_without_address
create or replace function nearby_games("lat" double precision, "long" double precision) 
returns table("id" "uuid", "title" "text", "lat" double precision, "long" double precision, "dist_meters" double precision)
    LANGUAGE "sql"
    AS $$
  select g.id, g.title, st_y(gl.loc::geometry) as lat, st_x(gl.loc::geometry) as long, st_distance(gl.loc, st_point(long, lat)::geography) as dist_meters
  FROM public.games AS g
  JOIN public.game_locations AS gl ON g.id = gl.id
  order by gl.loc <-> st_point(long, lat)::geography;
$$;

-- accept player join request
create or replace function accept_join_request(game_id "uuid", player_id "uuid")
returns void as $$
begin
  -- remove join request from game_requests table
  delete from game_requests
  where player_id = player_id and game_id = game_id;

  -- add entry to joined_game table
  insert into joined_game (player_id, game_id)
  values (player_id, game_id);

  -- increment current players in games table
  update games 
  set current_players = current_players + 1
  where id = game_id;

  commit;
end;
$$ language plpgsql;

-- reject player join request
create or replace function reject_join_request(game_id "uuid", player_id "uuid")
returns void as $$
begin
  -- remove join request from game_requests table
  delete from game_requests
  where player_id = player_id and game_id = game_id;

  commit;
end;
$$ language plpgsql;

-- remove player from game
create or replace function remove_player(game_id "uuid", player_id "uuid")
returns void as $$
begin
  -- remove entry from joined_game table
  delete from joined_game
  where player_id = player_id and game_id = game_id;

  -- decrement current players in games table
  update games 
  set current_players = current_players - 1
  where id = game_id;

  commit;
end;
$$ language plpgsql;