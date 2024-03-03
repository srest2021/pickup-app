begin;
select plan( 41 );

select has_table( 'games' );
select has_table( 'joined_game' );
select has_table( 'profiles' );
select has_table( 'sports' );
select has_table( 'auth' );
select has_column( 'games', 'id' );
select col_is_pk('games', 'id');
select has_column('games', 'created_at');
select has_column('games', 'sport');
select has_column('games', 'location');
select col_type_is('games', 'location', 'geography');
select has_column('games', 'max_players');
select has_column('games', 'current_players');
select has_column('games', 'organizer_id');
select col_is_fk('games', 'organizer_id');
select has_column('games', 'title');
select has_column('games', 'description' );
select has_column('games', 'datetime');
select col_type_is('games', 'datetime', 'timestampz');
select has_column('games', 'skill_level');
select has_column('games', 'address');
select has_column('joined_game', 'id');
select col_is_pk('joined_game', 'id');
select has_column('joined_game', 'game_id');
select has_column('joined_game', 'player_id' );
select col_is_fk('joined_game', ARRAY['game_id', 'player_id']);
select has_column('profiles', 'id');
select col_is_fk('profiles', 'id');
select col_is_pk('profiles', 'id');
select has_column('profiles', 'updated_at');
select col_type_is('profiles', 'updated_at', 'timestampz');
select has_column('profiles', 'display_name');
select has_column('profiles', 'avatar_url');
select has_column('profiles', 'bio');
select has_column('profiles', 'username');
select has_column('sports', 'is' );
select col_is_pk('sports', 'id');
select has_column('sports', 'name');
select has_column('sports', 'skill_level');
select has_column('sports', 'user_id');
select col_is_fk('sports', 'user_id');



select * from finish();
rollback;