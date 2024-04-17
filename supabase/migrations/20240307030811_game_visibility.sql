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

-- get the user id from a string or partial string!
create or replace function username_search(username_param text)
returns jsonb as $$
declare
  data jsonb;
begin
  SELECT jsonb_agg(
    jsonb_build_object (
    'id', p.id,
    'username',p.username,
    'displayName', p.display_name,
    'bio', p.bio,
    'avatarUrl',p.avatar_url
    )
  )
  from public.profiles as p
  where p.username like '%' || username_param || '%'
  into data;
  return data;
end;
$$ language plpgsql;

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
  "game_id" "uuid" references "games" on delete cascade not null,
  "plus_one" boolean not null
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

create or replace function can_user_join_game(game_id "uuid", player_id "uuid")
returns boolean AS $$
declare
  is_allowed boolean;
begin
  select
    (g.organizer_id = auth.uid() and player_id = auth.uid()) or (g.organizer_id = auth.uid() and (g.current_players + 1) <= g.max_players)
  into is_allowed
  from games g
  where g.id = game_id;
  return is_allowed;
end;
$$ language plpgsql;

create policy "Only organizers can accept a user's join request." on joined_game
  for insert with check (can_user_join_game(game_id, player_id));

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
  for select using (true);

create or replace function can_user_insert_and_update_location(game_id "uuid")
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

create policy "Organizers can update the location for their game." on game_locations
  for update with check (can_user_insert_and_update_location(game_id));

create policy "Organizers can insert the location for their game." on game_locations
  for insert with check (can_user_insert_and_update_location(game_id));

-- game join requests table

create table game_requests (
  "id" "uuid" primary key unique not null default "gen_random_uuid"(),
  "created_at" timestamp with time zone default "now"() not null,
  "game_id" "uuid" references "games" on delete cascade not null,
  "player_id" "uuid" references "profiles" not null,
  "plus_one" boolean not null
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

create policy "Players can request to join a game." on game_requests
  for insert with check (player_id = auth.uid());

create policy "Users cannot update existing join requests." on game_requests
  for update with check (false);

create policy "Organizers of a game can remove join requests for that game." on game_requests
  for delete using (can_user_select_or_delete_requests(game_id));

-- friend requests table

create table friend_requests (
  "id" "uuid" primary key unique not null default "gen_random_uuid"(),
  "created_at" timestamp with time zone default "now"() not null,
  "request_sent_by" "uuid" references "profiles" on delete cascade not null,
  "request_sent_to" "uuid" references "profiles" on delete cascade not null
);

create index sentbyid_fr
  on "public"."friend_requests"
  using btree (request_sent_by);

create index senttoid_fr
  on "public"."friend_requests"
  using btree (request_sent_to);

alter table friend_requests
  enable row level security;

create policy "Players can see their own friend requests." on friend_requests
  for select using (request_sent_by = auth.uid() or request_sent_to = auth.uid());

create policy "Players can send a friend request to other players." on friend_requests
  for insert with check (request_sent_by = auth.uid() and request_sent_to != auth.uid());

create policy "Players cannot update existing friend requests." on friend_requests
  for update with check (false);

create policy "Players can remove their own friend requests" on friend_requests
  for delete using (request_sent_by = auth.uid() or request_sent_to = auth.uid());

-- friends table

create table friends (
  "id" "uuid" primary key unique not null default "gen_random_uuid"(),
  "created_at" timestamp with time zone default "now"() not null,
  "player1_id" "uuid" references "profiles" on delete cascade not null,
  "player2_id" "uuid" references "profiles" on delete cascade not null
);

create index player1id_f
  on "public"."friends"
  using btree (player1_id);

create index player2id_f
  on "public"."friends"
  using btree (player2_id);

alter table friends
  enable row level security;

create policy "Players can see their own friends." on friends
  for select using (player1_id = auth.uid() or player2_id = auth.uid());

create policy "Players can add their own friends." on friends
  for insert with check (player1_id = auth.uid() or player2_id = auth.uid());

create policy "Players cannot update existing friends." on friends
  for update with check (false);

create policy "Players can remove their own friends" on friends
  for delete using (player1_id = auth.uid() or player2_id = auth.uid());

create policy "Public games are viewable by everyone; friends-only games are viewable by the organizer's friends." on games
  for select using (is_public or ((not is_public) and exists (
    select 1
    from friends as f
    where (f.player1_id = auth.uid() and f.player2_id = organizer_id)
      or (f.player1_id = organizer_id and f.player2_id = auth.uid())
  )));

-- messages table
create table messages (
  "id" "uuid" primary key unique not null default "gen_random_uuid"(),
  "sent_at" timestamp with time zone default "now"() not null,
  "game_id" "uuid" references "games" on delete cascade not null,
  "player_id" "uuid" references "profiles" on delete cascade not null,
  "content" text not null
);

alter table messages
  enable row level security;

create policy "Players can see messages for a game if they've joined the game." on messages
  for select using (
    exists (
      select 1
      from joined_game AS jg
      where jg.game_id = game_id and jg.player_id = auth.uid()
    )
  );

create policy "Players can send messages for a game if they've joined the game." on messages
  for insert with check (
    exists (
        select 1
        from joined_game AS jg
        where jg.game_id = game_id and jg.player_id = auth.uid()
    )
  );

create policy "Players cannot edit existing messages." on messages
  for update with check (false);

create policy "Players cannot delete messages" on messages
  for delete using (false);

-- helper functions

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
  coords := st_point(newlong, newlat)::geography;
  return coords;
end;
$$;

-- miscellaneous functions

create or replace function create_game(
  city text,
  datetime timestamp with time zone,
  description text,
  is_public boolean,
  max_players bigint, 
  skill_level int,
  sport text,
  street text,
  state text,
  title text,
  zip text,
  "lat" double precision, 
  "long" double precision
) returns record as $$
declare
  coords "extensions"."geography"(Point,4326);
  game_id "uuid";
  inserted_data record;
begin
  -- get location
  select public.get_coordinates(street, city, state, zip) into coords;

  -- insert row to games
  game_id := uuid_generate_v4();
  insert into games (id, organizer_id, title, description, datetime, sport, skill_level, max_players, current_players, is_public)
  values (game_id, auth.uid(), title, description, datetime, sport, skill_level, max_players, 1, is_public);

  -- insert row to game_locations
  insert into game_locations (id, game_id, street, city, state, zip, loc)
  values (uuid_generate_v4(), game_id, street, city, state, zip, coords);

  -- add organizer to joined_game
  insert into joined_game (id, player_id, game_id)
  values (uuid_generate_v4(), auth.uid(), game_id);

  -- return added data
  select (
    game_id,
    auth.uid(), 
    title,
    description,
    datetime,
    street,
    state,
    city,
    zip,
    sport, 
    skill_level,
    max_players,
    1::bigint,
    is_public,
    st_distance(coords, st_point(long, lat)::geography)
  ) into inserted_data;
  return inserted_data;
end;
$$ language plpgsql; 

create or replace function get_game_with_address(game_id "uuid", "lat" double precision, "long" double precision)
returns record as $$
declare
  coords "extensions"."geography"(Point,4326);
  street text;
  city text;
  state text;
  zip text;
  data record; 
begin
  -- get location
  select gl.street, gl.city, gl.state, gl.zip 
  into street, city, state, zip
  from game_locations as gl
  where gl.game_id = get_game_with_address.game_id; 
  select public.get_coordinates(street, city, state, zip) into coords;

  -- get game data
  select (
    g.id,
    g.organizer_id, 
    g.title,
    g.description, 
    g.datetime,
    gl.street,
    gl.city,
    gl.state,
    gl.zip,
    g.sport,
    g.skill_level, 
    g.max_players, 
    g.current_players, 
    g.is_public,
    st_distance(coords, st_point(long, lat)::geography)
  )
  from public.games as g
  join public.game_locations as gl on g.id = gl.game_id
  where g.id = get_game_with_address.game_id
  into data;
  return data;
end;
$$ language plpgsql;

create or replace function get_game_without_address(game_id "uuid", "lat" double precision, "long" double precision)
returns record as $$
declare
  coords "extensions"."geography"(Point,4326);
  street text;
  city text;
  state text;
  zip text;
  data record;
begin
  -- get location
  select gl.street, gl.city, gl.state, gl.zip 
  into street, city, state, zip
  from game_locations as gl
  where gl.game_id = get_game_with_address.game_id; 
  select public.get_coordinates(street, city, state, zip) into coords;

  -- get game data
  select (
    g.id,
    g.organizer_id, 
    g.title,
    g.description, 
    g.datetime,
    g.sport,
    g.skill_level,
    g.max_players,
    g.current_players, 
    g.is_public,
    st_distance(coords, st_point(long, lat)::geography) 
  )
  from public.games as g
  where g.id = get_game_without_address.game_id
  into data;
  return data;
end;
$$ language plpgsql;

-- edit game by getting location, updating games and game_locations tables
create or replace function edit_game(
  game_id "uuid", 
  city text,
  datetime timestamp with time zone,
  description text,
  is_public boolean,
  max_players bigint, 
  skill_level int,
  sport text,
  street text,
  state text,
  title text,
  zip text,
  "lat" double precision, 
  "long" double precision
) returns record as $$
declare
  current_players bigint;
  coords "extensions"."geography"(Point,4326);
  updated_data record;
begin
   -- get location
  select
    public.get_coordinates(street, city, state, zip)
  into coords;

  -- update row in games
  update games
  set 
    title = edit_game.title,
    description = edit_game.description,
    datetime = edit_game.datetime,
    sport = edit_game.sport,
    skill_level = edit_game.skill_level,
    max_players = edit_game.max_players,
    is_public = edit_game.is_public
  where games.id = edit_game.game_id;

  -- update row in game_locations
  update game_locations
  set
    street = edit_game.street,
    city = edit_game.city,
    state = edit_game.state,
    zip = edit_game.zip,
    loc = coords
  where game_locations.game_id = edit_game.game_id;

  select 
    g.current_players
  into current_players
  from public.games as g
  where g.id = edit_game.game_id;

  -- return updated data
  select (
    edit_game.game_id,
    auth.uid(), 
    title, 
    description, 
    datetime,
    street, 
    city, 
    state,
    zip,
    sport,
    skill_level,
    max_players,
    current_players,
    is_public,
    st_distance(coords, st_point(long, lat)::geography)
  )
  into updated_data;
  return updated_data;
end;
$$ language plpgsql;

-- sort games from closest to farthest given lat, long
create or replace function nearby_games("lat" double precision, "long" double precision, "dist_limit" double precision, "offset" int, "limit" int, "sport_filter" varchar default null, "skill_level_filter" int default null) 
returns table(
  id "uuid", 
  organizer_id "uuid", 
  title text, 
  description text, 
  datetime timestamp with time zone, 
  sport text, 
  skill_level int, 
  max_players bigint, 
  current_players bigint, 
  is_public boolean, 
  has_requested boolean,
  dist_meters double precision,
  accepted_players jsonb,
  organizer jsonb
) language "sql" as $$
  with distances as (
    select 
      gl.game_id,
      st_distance(gl.loc, st_point(long, lat)::geography)/1609.344 as dist_meters
    from game_locations gl
  )
  select 
    g.id, 
    g.organizer_id, 
    g.title, 
    g.description, 
    g.datetime, 
    g.sport, 
    g.skill_level, 
    g.max_players, 
    g.current_players, 
    g.is_public, 
    auth.uid() in (
      select player_id 
      from game_requests
      where game_requests.game_id = g.id
    ) as has_requested,
    d.dist_meters,
    (
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'username', p.username,
          'displayName', p.display_name,
          'avatarUrl', p.avatar_url
        )
      )
      from public.joined_game as jg
      join public.profiles as p on jg.player_id = p.id and jg.player_id != g.organizer_id
      where jg.game_id = g.id
    ) as accepted_players,
    (
      select
        jsonb_build_object(
          'id', p.id,
          'username', p.username,
          'displayName', p.display_name,
          'avatarUrl', p.avatar_url
        )
      from public.profiles as p
      where p.id = g.organizer_id
    ) as organizer
  from public.games as g
  inner join distances d on g.id = d.game_id
  where 
    g.is_public -- public game
    and d.dist_meters <= dist_limit -- within distance limit
    and (sport_filter is null or g.sport = sport_filter) -- apply sport filter
    and (skill_level_filter is null or g.skill_level = skill_level_filter) -- apply skill level filter
    and not auth.uid() in (
      select player_id from joined_game where joined_game.game_id = g.id -- not joined yet
    )
    and g.organizer_id != auth.uid() -- not organizer
    and g.datetime > CURRENT_TIMESTAMP - INTERVAL '1 day' -- only show games from yesterday on
  order by d.dist_meters
  offset "offset"
  limit "limit";
$$;

create or replace function friends_only_games("lat" double precision, "long" double precision, "dist_limit" double precision, "offset" int, "limit" int, "sport_filter" varchar default null, "skill_level_filter" int default null)
returns table (
  id "uuid", 
  organizer_id "uuid", 
  title text, 
  description text, 
  datetime timestamp with time zone, 
  sport text, 
  skill_level int, 
  max_players bigint, 
  current_players bigint, 
  is_public boolean, 
  has_requested boolean,
  dist_meters double precision,
  accepted_players jsonb,
  organizer jsonb
) language "sql" as $$
  with distances as (
    select 
      gl.game_id,
      st_distance(gl.loc, st_point($2, $1)::geography)/1609.344 as dist_meters
    from game_locations gl
  )
  select 
    g.id, 
    g.organizer_id, 
    g.title, 
    g.description, 
    g.datetime, 
    g.sport, 
    g.skill_level, 
    g.max_players, 
    g.current_players, 
    g.is_public, 
    auth.uid() in (
      select player_id 
      from game_requests
      where game_requests.game_id = g.id
    ) as has_requested,
    d.dist_meters,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'username', p.username,
          'displayName', p.display_name,
          'avatarUrl', p.avatar_url 
        )
      )
      FROM public.joined_game AS jg
      JOIN public.profiles AS p ON jg.player_id = p.id and jg.player_id != g.organizer_id
      WHERE jg.game_id = g.id
    ) AS accepted_players,
    (
      select
        jsonb_build_object(
          'id', p.id,
          'username', p.username,
          'displayName', p.display_name,
          'avatarUrl', p.avatar_url
        )
      FROM public.profiles AS p
      where p.id = g.organizer_id
    ) as organizer
  from public.games as g
  join friends f on (
    (f.player1_id = g.organizer_id and f.player2_id = auth.uid()) 
    or (f.player1_id = auth.uid() and f.player2_id =g.organizer_id)
  ) -- friends with the organizer
  join distances d on g.id = d.game_id
  where 
    g.is_public is false -- friends-only
    and d.dist_meters <= dist_limit -- within distance limit
    and (sport_filter is null or g.sport = sport_filter) -- apply sport filter
    and (skill_level_filter is null or g.skill_level = skill_level_filter) -- apply skill level filter
    and not auth.uid() in (
      select player_id from joined_game where joined_game.game_id = g.id -- not joined yet
    )
    and g.organizer_id != auth.uid() -- not organizer
    and g.datetime > CURRENT_TIMESTAMP - INTERVAL '1 day' -- only show games from yesterday on
  order by d.dist_meters
  offset "offset"
  limit "limit";
$$;

create or replace function my_games("lat" double precision, "long" double precision) 
returns table(
  id "uuid", 
  organizer_id "uuid", 
  title text, 
  description text, 
  datetime timestamp with time zone, 
  sport text, 
  skill_level int, 
  max_players bigint, 
  current_players bigint, 
  is_public boolean, 
  street text, 
  city text, 
  state text, 
  zip text, 
  "dist_meters" double precision, 
  join_requests jsonb,
  accepted_players jsonb
) language "sql" as $$
  select 
    g.id,
    g.organizer_id, 
    g.title, 
    g.description, 
    g.datetime, 
    g.sport,
    g.skill_level, 
    g.max_players, 
    g.current_players, 
    g.is_public, 
    gl.street, 
    gl.city, 
    gl.state, 
    gl.zip, 
    st_distance(gl.loc, st_point(long, lat)::geography)/1609.344 as dist_meters, 
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'username', p.username,
          'displayName', p.display_name,
          'avatarUrl', p.avatar_url
        )
      )
      FROM public.game_requests AS gr
      JOIN public.profiles AS p ON gr.player_id = p.id
      WHERE gr.game_id = g.id
    ) AS join_requests,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'username', p.username,
          'displayName', p.display_name,
          'avatarUrl', p.avatar_url
        )
      )
      FROM public.joined_game AS jg
      JOIN public.profiles AS p ON jg.player_id = p.id
      WHERE jg.game_id = g.id and jg.player_id != auth.uid()
    ) AS accepted_players
  from public.games as g
  join public.game_locations as gl on g.id = gl.game_id
  where g.organizer_id = auth.uid() and datetime > CURRENT_TIMESTAMP - INTERVAL '1 day'
  order by datetime ASC;
$$;

create or replace function joined_games("lat" double precision, "long" double precision) 
returns table(
  id "uuid", 
  organizer_id "uuid", 
  title text, 
  description text, 
  datetime timestamp with time zone, 
  sport text, 
  skill_level int, 
  max_players bigint, 
  current_players bigint, 
  is_public boolean, 
  street text, 
  city text, 
  state text, 
  zip text, 
  "dist_meters" double precision,
  accepted_players jsonb,
  organizer jsonb
) language "sql" as $$
  select 
    g.id, 
    g.organizer_id, 
    g.title, 
    g.description, 
    g.datetime,
    g.sport, 
    g.skill_level, 
    g.max_players, 
    g.current_players, 
    g.is_public, 
    gl.street, 
    gl.city, 
    gl.state, 
    gl.zip, 
    st_distance(gl.loc, st_point(long, lat)::geography)/1609.344 as dist_meters,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'username', p.username,
          'displayName', p.display_name,
          'avatarUrl', p.avatar_url
        )
      )
      FROM public.joined_game AS jg
      JOIN public.profiles AS p ON jg.player_id = p.id and jg.player_id != g.organizer_id
      WHERE jg.game_id = g.id
    ) AS accepted_players,
    (
      select jsonb_build_object(
        'id', p.id,
        'username', p.username,
        'displayName', p.display_name,
        'avatarUrl', p.avatar_url
      )
      FROM public.profiles AS p
      where p.id = g.organizer_id
    ) as organizer
  from public.games as g
  join public.game_locations as gl on g.id = gl.game_id
  join public.joined_game as jg on g.id = jg.game_id
  where jg.player_id = auth.uid() and g.organizer_id != auth.uid() and datetime > CURRENT_TIMESTAMP - INTERVAL '1 day'
  order by datetime ASC;
$$;

-- accept player join request
create or replace function accept_join_request(game_id "uuid", player_id "uuid")
returns void as $$
begin
  -- remove join request from game_requests table
  delete from game_requests
  where game_requests.player_id = accept_join_request.player_id and game_requests.game_id = accept_join_request.game_id;

  -- add entry to joined_game table
  insert into joined_game (player_id, game_id)
  values (player_id, game_id);

  -- increment current players in games table
  update games 
  set current_players = current_players + 1
  where id = game_id;
end;
$$ language plpgsql;

-- reject player join request
create or replace function reject_join_request(game_id "uuid", player_id "uuid")
returns void as $$
begin
  -- remove join request from game_requests table
  delete from game_requests
  where game_requests.player_id = reject_join_request.player_id and game_requests.game_id = reject_join_request.game_id;
end;
$$ language plpgsql;

-- remove player from game
create or replace function remove_player(game_id "uuid", player_id "uuid")
returns void as $$
begin
  -- remove entry from joined_game table
  delete from joined_game
  where joined_game.player_id = remove_player.player_id and joined_game.game_id = remove_player.game_id;

  -- decrement current players in games table
  update games 
  set current_players = current_players - 1
  where id = game_id;
end;
$$ language plpgsql;

-- get another user profile (includes has_requested and is_friend fields)
create or replace function get_other_profile(player_id "uuid")
returns jsonb as $$
declare 
  data jsonb;
begin
  select jsonb_build_object(
    'id', p.id,
    'username', p.username,
    'displayName', p.display_name,
    'bio', p.bio,
    'avatarUrl', p.avatar_url,
    'sports', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'sport', s.name,
          'skillLevel', s.skill_level
        )
      )
      from public.sports as s
      where p.id = s.user_id
    ),
    'hasRequested', auth.uid() in (
      select fr.request_sent_by
      from friend_requests as fr
      where fr.request_sent_to = player_id
    ),
    'isFriend', exists (
      select 1
      from friends as f
      where (f.player1_id = auth.uid() and f.player2_id = p.id)
        or (f.player1_id = p.id and f.player2_id = auth.uid())
    )
  )
  from public.profiles as p
  where p.id = player_id
  into data;
  return data;
end;
$$ language plpgsql;

-- accept friend request
create or replace function accept_friend_request(sent_by "uuid")
returns void as $$
begin
  -- remove friend request from friend_requests table
  delete from friend_requests as fr
  where (
    (
      fr.request_sent_to = auth.uid()
      and fr.request_sent_by = sent_by
    ) or (
      fr.request_sent_to = sent_by
      and fr.request_sent_by = auth.uid()
    )
  );

  -- add entry to friends table
  insert into friends (player1_id, player2_id)
  values (auth.uid(), sent_by);
end;
$$ language plpgsql;

-- reject friend request
create or replace function reject_friend_request(request_sent_to "uuid")
returns void as $$
begin
  -- remove friend request from friend_requests table
  delete from friend_requests
  where friend_requests.request_sent_by = auth.uid()
  and friend_requests.request_sent_to = reject_friend_request.request_sent_to;
end;
$$ language plpgsql;

-- get all friends for a player
-- only return id, username, and avatar url for ProfileThumbnail
create or replace function get_friends()
returns jsonb as $$
declare
  data jsonb;
begin
    select jsonb_agg (
      case
        when f.player1_id = auth.uid() then jsonb_build_object (
          'id', p2.id,
          'username', p2.username,
          'displayName', p2.display_name,
          'avatarUrl', p2.avatar_url,
          'bio', p.bio
        )
        else jsonb_build_object (
          'id', p1.id,
          'username', p1.username,
          'displayName', p1.display_name,
          'avatarUrl', p1.avatar_url,
          'bio', p.bio
        )
      end
    )
    from public.friends as f
    join public.profiles as p2 on (f.player2_id = p2.id)
    join public.profiles as p1 on (f.player1_id = p1.id)
    where f.player1_id = auth.uid() or f.player2_id = auth.uid()
    into data;
    return data;
end;
$$ language plpgsql;

-- get all incoming friend requests for a player
-- only return id, username, and avatar url for ProfileThumbnail
create or replace function get_friend_requests()
returns jsonb as $$
declare
  data jsonb;
begin
    select jsonb_agg (
      jsonb_build_object (
        'id', p.id,
        'username', p.username,
        'displayName', p.display_name,
        'avatarUrl', p.avatar_url,
        'bio', p.bio
      )
    )
    from public.friend_requests as fr
    join public.profiles as p on fr.request_sent_by = p.id
    where fr.request_sent_to = auth.uid()
    into data;
    return data;
end;
$$ language plpgsql;

create or replace function add_message(game_id "uuid", content text)
returns jsonb as $$
declare
  message_id "uuid";
  sent_at timestamp with time zone;
  data jsonb;
begin
  message_id := uuid_generate_v4();
  sent_at := CURRENT_TIMESTAMP;
  insert into messages (id, sent_at, content, game_id, player_id)
  values (message_id, sent_at, content, game_id, auth.uid());

  select jsonb_build_object (
    'id', message_id,
    'roomCode', game_id,
    'sentAt', sent_at,
    'content', content,
    'user', jsonb_build_object (
      'id', p.id,
      'username', p.username,
      'displayName', p.display_name,
      'avatarUrl', p.avatar_url
    )
  )
  from profiles as p
  where p.id = auth.uid()
  into data;
  return data;
end;
$$ language plpgsql;

create or replace function is_game_overlap(city_param text, state_param text, street_param text, zip_param text, datetime_param timestamp with time zone)
returns boolean as $$
DECLARE
    game_exists BOOLEAN := false;
BEGIN
    -- Check if there are any matching games at the given location within the specified time interval
    SELECT EXISTS (
        SELECT 1
        FROM game_locations gl
        JOIN games g ON gl.game_id = g.id
        WHERE gl.city = city_param
        AND gl.state = state_param
        AND gl.street = street_param
        AND gl.zip = zip_param
        AND g.datetime >= datetime_param - interval '30 minutes'
        AND g.datetime <= datetime_param + interval '30 minutes'
    ) INTO game_exists;

    RETURN game_exists;
END;
$$ language plpgsql;