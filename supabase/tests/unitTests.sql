begin;
select plan( 94 );

-- table existence
select has_table('games');
select has_table('joined_game');
select has_table('game_locations');
select has_table('game_requests');
select has_table('profiles');
select has_table('sports');
select has_table('friends');
select has_table('friend_requests');
select has_table('messages');

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

-- friends table columns
select has_column('friends', 'id');
select has_column('friends', 'created_at');
select has_column('friends', 'player1_id');
select has_column('friends', 'player2_id');
select col_is_pk('friends', 'id');
select col_is_fk('friends', 'player1_id');
select col_is_fk('friends', 'player2_id');
select col_type_is('friends', 'id', 'uuid');
select col_type_is('friends', 'player1_id', 'uuid');
select col_type_is('friends', 'player2_id', 'uuid');
select col_type_is('friends', 'created_at', 'timestamp with time zone');

-- friend requests table columns
select has_column('friend_requests', 'id');
select has_column('friend_requests', 'created_at');
select has_column('friend_requests', 'request_sent_by');
select has_column('friend_requests', 'request_sent_to');
select col_is_pk('friend_requests', 'id');
select col_is_fk('friend_requests', 'request_sent_by');
select col_is_fk('friend_requests', 'request_sent_to');
select col_type_is('friend_requests', 'id', 'uuid');
select col_type_is('friend_requests', 'request_sent_by', 'uuid');
select col_type_is('friend_requests', 'request_sent_to', 'uuid');
select col_type_is('friend_requests', 'created_at', 'timestamp with time zone');

-- messages table columns
select has_column('messages', 'id');
select has_column('messages', 'sent_at');
select has_column('messages', 'game_id');
select has_column('messages', 'player_id');
select has_column('messages', 'content');
select col_is_pk('messages', 'id');
select col_is_fk('messages', 'game_id');
select col_is_fk('messages', 'player_id');
select col_type_is('messages', 'id', 'uuid');
select col_type_is('messages', 'game_id', 'uuid');
select col_type_is('messages', 'player_id', 'uuid');
select col_type_is('messages', 'content', 'text');
select col_type_is('messages', 'sent_at', 'timestamp with time zone');

select * from finish();
rollback;