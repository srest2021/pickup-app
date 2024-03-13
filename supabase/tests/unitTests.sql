begin;
select plan( 56 );

-- table existence
select has_table('games');
select has_table('joined_game');
select has_table('game_locations');
select has_table('game_requests');
select has_table('profiles');
select has_table('sports');

-- games table columns
select has_column('games', 'id' );
select has_column('games', 'created_at');
select has_column('games', 'sport');
select has_column('games', 'max_players');
select has_column('games', 'current_players');
select has_column('games', 'organizer_id');
select has_column('games', 'title');
select has_column('games', 'description');
select has_column('games', 'datetime');
select has_column('games', 'skill_level');
select col_is_pk('games', 'id');
select col_is_fk('games', 'organizer_id');
select col_type_is('games', 'datetime', 'timestamp with time zone');

-- joined_game table columns
select has_column('joined_game', 'id');
select has_column('joined_game', 'game_id');
select has_column('joined_game', 'player_id');
select col_is_pk('joined_game', 'id');
select col_is_fk('joined_game', 'game_id');
select col_is_fk('joined_game', 'player_id');

-- profiles table columns
select has_column('profiles', 'id');
select has_column('profiles', 'updated_at');
select has_column('profiles', 'display_name');
select has_column('profiles', 'avatar_url');
select has_column('profiles', 'bio');
select has_column('profiles', 'username');
select col_is_pk('profiles', 'id');
select col_is_fk('profiles', 'id');
select col_type_is('profiles', 'updated_at', 'timestamp with time zone');

-- sports table columns
select has_column('sports', 'id' );
select has_column('sports', 'name');
select has_column('sports', 'skill_level');
select has_column('sports', 'user_id');
select col_is_pk('sports', 'id');
select col_is_fk('sports', 'user_id');

-- game_locations table columns
select has_column('game_locations', 'id');
select has_column('game_locations', 'game_id');
select has_column('game_locations', 'street');
select has_column('game_locations', 'city');
select has_column('game_locations', 'state');
select has_column('game_locations', 'zip');
select has_column('game_locations', 'loc');
select col_is_pk('game_locations', 'id');
select col_is_fk('game_locations', 'game_id');
select col_type_is('game_locations', 'loc', 'geography(Point,4326)');

-- game_requests table columns
select has_column('game_requests', 'id');
select has_column('game_requests', 'created_at');
select has_column('game_requests', 'game_id');
select has_column('game_requests', 'player_id');
select col_is_pk('game_requests', 'id');
select col_type_is('game_requests', 'created_at', 'timestamp with time zone');

select * from finish();
rollback;