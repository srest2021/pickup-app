
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

CREATE OR REPLACE FUNCTION "public"."add_organizer_id_to_game"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into "public"."joined_game" (id, player_id, game_id)
  values (uuid_generate_v4(), new.organizer_id, new.id);
  return new;
end;
$$;

ALTER FUNCTION "public"."add_organizer_id_to_game"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") RETURNS "record"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  select
      into status, content
           result.status, result.content
      from public.delete_storage_object('avatars', avatar_url) as result;
end;
$$;

ALTER FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_old_avatar"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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

ALTER FUNCTION "public"."delete_old_avatar"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_old_profile"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  delete from public.joined_game where player_id = old.id;
  delete from public.games where organizer_id = old.id;
  delete from public.profiles where id = old.id;
  return old;
end;
$$;

ALTER FUNCTION "public"."delete_old_profile"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") RETURNS "record"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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

ALTER FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."nearby_games"("lat" double precision, "long" double precision) RETURNS TABLE("id" "uuid", "title" "text", "lat" double precision, "long" double precision, "dist_meters" double precision)
    LANGUAGE "sql"
    AS $$
  select id, title, st_y(location::geometry) as lat, st_x(location::geometry) as long, st_distance(location, st_point(long, lat)::geography) as dist_meters
  from public.games
  order by location <-> st_point(long, lat)::geography;
$$;

ALTER FUNCTION "public"."nearby_games"("lat" double precision, "long" double precision) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."games" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organizer_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "datetime" timestamp with time zone NOT NULL,
    "sport" "text" NOT NULL,
    "skill_level" integer NOT NULL,
    "address" "text" NOT NULL,
    "location" "extensions"."geography"(Point,4326) NOT NULL,
    "max_players" bigint NOT NULL,
    "current_players" bigint DEFAULT '1'::bigint NOT NULL,
    "city" "text",
    "state" "text",
    "zip" "text",
    CONSTRAINT "game_skill_level_range" CHECK ((("skill_level" >= 0) AND ("skill_level" <= 2))),
    CONSTRAINT "games_description_check" CHECK (("length"("description") < 500)),
    CONSTRAINT "games_max_players_check" CHECK (("max_players" >= 1))
);

ALTER TABLE "public"."games" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."joined_game" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "player_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "game_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."joined_game" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "updated_at" timestamp with time zone,
    "display_name" "text",
    "avatar_url" "text",
    "bio" "text",
    "username" "text" NOT NULL,
    CONSTRAINT "profiles_bio_check" CHECK (("length"("bio") < 500)),
    CONSTRAINT "profiles_username_check" CHECK ((("length"("username") < 20) AND "regexp_like"("username", '^[A-Za-z0-9_]+$'::"text")))
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."sports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "skill_level" integer NOT NULL,
    CONSTRAINT "skill_level_range" CHECK ((("skill_level" >= 0) AND ("skill_level" <= 2)))
);

ALTER TABLE "public"."sports" OWNER TO "postgres";

ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."joined_game"
    ADD CONSTRAINT "joined_game_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");

ALTER TABLE ONLY "public"."sports"
    ADD CONSTRAINT "sports_pkey" PRIMARY KEY ("id");

CREATE INDEX "games_geo_index" ON "public"."games" USING "gist" ("location");

CREATE OR REPLACE TRIGGER "after_add_game" AFTER INSERT ON "public"."games" FOR EACH ROW EXECUTE FUNCTION "public"."add_organizer_id_to_game"();

CREATE OR REPLACE TRIGGER "before_profile_changes" BEFORE DELETE OR UPDATE OF "avatar_url" ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."delete_old_avatar"();

ALTER TABLE ONLY "public"."games"
    ADD CONSTRAINT "games_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."joined_game"
    ADD CONSTRAINT "public_joined_game_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."joined_game"
    ADD CONSTRAINT "public_joined_game_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."sports"
    ADD CONSTRAINT "sports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

CREATE POLICY "Games are viewable by everyone." ON "public"."games" FOR SELECT USING (true);

CREATE POLICY "Joined games are viewable by everyone." ON "public"."joined_game" FOR SELECT USING (true);

CREATE POLICY "Public profiles are viewable by everyone." ON "public"."profiles" FOR SELECT USING (true);

CREATE POLICY "Sports are viewable by everyone." ON "public"."sports" FOR SELECT USING (true);

CREATE POLICY "Users can delete their own games." ON "public"."games" FOR DELETE USING (("auth"."uid"() = "organizer_id"));

CREATE POLICY "Users can delete their own sports." ON "public"."sports" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Users can insert their own games." ON "public"."games" FOR INSERT WITH CHECK (("auth"."uid"() = "organizer_id"));

CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Users can insert their own sports." ON "public"."sports" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));

CREATE POLICY "Users can update their own games." ON "public"."games" FOR UPDATE USING (("auth"."uid"() = "organizer_id"));

CREATE POLICY "Users can update their own sports." ON "public"."sports" FOR UPDATE USING (("auth"."uid"() = "user_id"));

ALTER TABLE "public"."games" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."joined_game" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."sports" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."add_organizer_id_to_game"() TO "anon";
GRANT ALL ON FUNCTION "public"."add_organizer_id_to_game"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_organizer_id_to_game"() TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_old_avatar"() TO "anon";
GRANT ALL ON FUNCTION "public"."delete_old_avatar"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_old_avatar"() TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_old_profile"() TO "anon";
GRANT ALL ON FUNCTION "public"."delete_old_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_old_profile"() TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."nearby_games"("lat" double precision, "long" double precision) TO "anon";
GRANT ALL ON FUNCTION "public"."nearby_games"("lat" double precision, "long" double precision) TO "authenticated";
GRANT ALL ON FUNCTION "public"."nearby_games"("lat" double precision, "long" double precision) TO "service_role";

GRANT ALL ON TABLE "public"."games" TO "anon";
GRANT ALL ON TABLE "public"."games" TO "authenticated";
GRANT ALL ON TABLE "public"."games" TO "service_role";

GRANT ALL ON TABLE "public"."joined_game" TO "anon";
GRANT ALL ON TABLE "public"."joined_game" TO "authenticated";
GRANT ALL ON TABLE "public"."joined_game" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."sports" TO "anon";
GRANT ALL ON TABLE "public"."sports" TO "authenticated";
GRANT ALL ON TABLE "public"."sports" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
