begin;
select no_plan();

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
select has_column('games', 'is_public');
select col_is_pk('games', 'id');
select col_is_fk('games', 'organizer_id');
select col_type_is('games', 'created_at', 'timestamp with time zone');
select col_type_is('games', 'datetime', 'timestamp with time zone');
select col_type_is('games', 'is_public', 'boolean');

-- joined_game table columns
select has_column('joined_game', 'id');
select has_column('joined_game', 'game_id');
select has_column('joined_game', 'player_id');
select has_column('joined_game', 'plus_one');
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
select results_eq(
  'select username from profiles',
  $$VALUES ('username1'), ('username2')$$,
  'profiles should return all users'
);

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
select has_column('game_requests', 'plus_one');
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

-- username_search()
select results_eq(
  'select * from username_search($$username$$)', 
  $$VALUES ('[{"id": "273dc833-4e44-4f22-bdc9-3b13c9253d2a", "username": "username1", "displayName":null, "bio":null, "avatarUrl":null}, {"id": "373dc833-4e44-4f22-bdc9-3b13c9253d2a", "username": "username2", "displayName":null, "bio":null, "avatarUrl":null}]'::jsonb) $$,
  'username search should return like users'
);
select results_eq(
  'select * from username_search($$username1$$)', 
  $$VALUES ('[{"id": "273dc833-4e44-4f22-bdc9-3b13c9253d2a", "username": "username1", "displayName":null, "bio":null, "avatarUrl":null}]'::jsonb) $$,
  'username search should return like users'
);

-- get_coordinates()
select results_eq(
  'select * from get_coordinates($$Homewood$$, $$Baltimore$$, $$MD$$, $$21218$$)',
  $$VALUES (st_point(-76.6191118, 39.3293085)::geography) $$,
  'coordinates should be accurate'
);

-- create_game()
do $$
begin
  perform pg_sleep(1.0); -- wait for get_coordinates() to run
  set role authenticated;
  set local "request.jwt.claims" to '{ "sub": "273dc833-4e44-4f22-bdc9-3b13c9253d2a", "email": "user1@email.com" }';
  perform create_game('Baltimore', now(), 'test description', true, 10, 0, 'soccer', 'Homewood', 'MD', 'my new test game', '21218', 39.3293085, -76.6191118);
  
  perform ok(
    exists (
      select 1 from games
        where title = 'my new test game'
    ),
    'Created game should be added to games table'
  );
end $$;

-- accept_join_request()
do $$
begin
    perform accept_join_request('a9b2e8f6-39eb-49d0-b9c0-92d97a82c20e', '373dc833-4e44-4f22-bdc9-3b13c9253d2a');

    -- request removed from game_requests table
    perform ok(
        not exists (
            select 1 from game_requests
            where game_id = 'a9b2e8f6-39eb-49d0-b9c0-92d97a82c20e'
              and player_id = '373dc833-4e44-4f22-bdc9-3b13c9253d2a'
        ),
        'Join request should be removed from table after accepting'
    );

    -- row added to joined_game table
    perform ok(
        exists (
            select 1 from joined_game
            where game_id = 'a9b2e8f6-39eb-49d0-b9c0-92d97a82c20e'
              and player_id = '373dc833-4e44-4f22-bdc9-3b13c9253d2a'
        ),
        'Player should be added to joined_game after accepting'
    );

    -- current_players is incremented in games table
    perform ok(
        (select current_players from games where id = 'a9b2e8f6-39eb-49d0-b9c0-92d97a82c20e') = 2,
        'Current players should be incremented in games table after accepting'
    );
end $$;

-- reject_join_request()
do $$
begin
    perform reject_join_request('a9b2e8f6-39eb-49d0-b9c0-92d97a82c20e', '373dc833-4e44-4f22-bdc9-3b13c9253d2a');

    -- request removed from game_requests table
    perform ok(
        not exists (
            select 1 from game_requests
            where game_id = 'a9b2e8f6-39eb-49d0-b9c0-92d97a82c20e'
              and player_id = '373dc833-4e44-4f22-bdc9-3b13c9253d2a'
        ),
        'Join request should be removed from table after accepting'
    );

    -- no row added to joined_game table
    perform ok(
        not exists (
            select 1 from joined_game
            where game_id = 'a9b2e8f6-39eb-49d0-b9c0-92d97a82c20e'
              and player_id = '373dc833-4e44-4f22-bdc9-3b13c9253d2a'
        ),
        'Player should be added to joined_game after accepting'
    );

    -- current_players is not incremented in games table
    perform ok(
        (select current_players from games where id = 'a9b2e8f6-39eb-49d0-b9c0-92d97a82c20e') = 1,
        'Current players should be incremented in games table after accepting'
    );
END $$;

-- get_game_by_id()
select results_eq(
  'select * from get_game_by_id($$a9b2e8f6-39eb-49d0-b9c0-92d97a82c20e$$)', 
  $$VALUES ('{"title": "public game", "organizerId": "273dc833-4e44-4f22-bdc9-3b13c9253d2a"}'::jsonb)$$,
  'The correct game information should be returned'
);

-- check_game_capacity()
select results_eq(
  'select * from check_game_capacity($$373dc833-4e44-4f22-bdc9-3b13c9253d2a$$, $$a9b2e8f6-39eb-49d0-b9c0-92d97a82c20e$$, false)', 
  $$VALUES (true)$$,
  'Game should not be full for a regular request for a 9/10 game'
);
select results_eq(
  'select * from check_game_capacity($$373dc833-4e44-4f22-bdc9-3b13c9253d2a$$, $$a9b2e8f6-39eb-49d0-b9c0-92d97a82c20e$$, true)', 
  $$VALUES (false)$$,
  'Game should be full for a +1 request for a 9/10 game'
);

-- remove_player()
do $$
begin
    insert into joined_game
      (id, game_id, player_id, plus_one)
    values
      (uuid_generate_v4(), '78d89525-46bf-4032-8572-5428bec482eb', '373dc833-4e44-4f22-bdc9-3b13c9253d2a', false);

    perform remove_player('78d89525-46bf-4032-8572-5428bec482eb', '373dc833-4e44-4f22-bdc9-3b13c9253d2a');

    -- row removed from joined_game table
    perform ok(
        not exists (
            select 1 from joined_game
            where game_id = '78d89525-46bf-4032-8572-5428bec482eb'
              and player_id = '373dc833-4e44-4f22-bdc9-3b13c9253d2a'
        ),
        'Player should be removed from joined_game'
    );

    -- current_players is decremented by 1 in games table
    perform ok(
        (select current_players from games where id = '78d89525-46bf-4032-8572-5428bec482eb') = 1,
        'Current players should be decremented in games table after removing player'
    );
END $$;
do $$
begin
    insert into joined_game
      (id, game_id, player_id, plus_one)
    values
      (uuid_generate_v4(), '78d89525-46bf-4032-8572-5428bec482eb', '373dc833-4e44-4f22-bdc9-3b13c9253d2a', true);

    perform remove_player('78d89525-46bf-4032-8572-5428bec482eb', '373dc833-4e44-4f22-bdc9-3b13c9253d2a');

    -- row removed from joined_game table
    perform ok(
        not exists (
            select 1 from joined_game
            where game_id = '78d89525-46bf-4032-8572-5428bec482eb'
              and player_id = '373dc833-4e44-4f22-bdc9-3b13c9253d2a'
        ),
        'Player should be removed from joined_game'
    );

    -- current_players is decremented by 2 in games table
    perform ok(
        (select current_players from games where id = '78d89525-46bf-4032-8572-5428bec482eb') = 1,
        'Current players should be decremented in games table after removing player'
    );
END $$;

-- accept_friend_request()
do $$
begin
    set role authenticated;
    set local "request.jwt.claims" to '{ "sub": "273dc833-4e44-4f22-bdc9-3b13c9253d2a", "email": "user1@email.com" }';
    perform accept_friend_request('373dc833-4e44-4f22-bdc9-3b13c9253d2a');

    -- row removed from friend_requests table
    perform ok(
        not exists (
            select 1 from friend_requests
            where request_sent_by = '373dc833-4e44-4f22-bdc9-3b13c9253d2a'
              and request_sent_to = '273dc833-4e44-4f22-bdc9-3b13c9253d2a'
        ),
        'Row should be removed from friend_requests'
    );

    -- row added to friends table
    perform ok(
        exists (
            select 1 from friends
            where player1_id = '273dc833-4e44-4f22-bdc9-3b13c9253d2a'
              and player2_id = '373dc833-4e44-4f22-bdc9-3b13c9253d2a'
        ),
        'Row should be added to friends'
    );
END $$;

-- reject_friend_request()
do $$
begin
    set role authenticated;
    set local "request.jwt.claims" to '{ "sub": "273dc833-4e44-4f22-bdc9-3b13c9253d2a", "email": "user1@email.com" }';
    perform reject_friend_request('373dc833-4e44-4f22-bdc9-3b13c9253d2a');

    -- row removed from friend_requests table
    perform ok(
        not exists (
            select 1 from friend_requests
            where request_sent_by = '373dc833-4e44-4f22-bdc9-3b13c9253d2a'
              and request_sent_to = '273dc833-4e44-4f22-bdc9-3b13c9253d2a'
        ),
        'Row should be removed from friend_requests'
    );

    -- row not added to friends table
    perform ok(
        not exists (
            select 1 from friends
            where player1_id = '273dc833-4e44-4f22-bdc9-3b13c9253d2a'
              and player2_id = '373dc833-4e44-4f22-bdc9-3b13c9253d2a'
        ),
        'Row should not be added to friends'
    );
END $$;

-- get_user_email()
select results_eq(
  'select * from get_user_email($$273dc833-4e44-4f22-bdc9-3b13c9253d2a$$)', 
  $$VALUES ('user1@example.com')$$,
  'The correct user email should be returned'
);

-- add_message()
do $$
begin
    set role authenticated;
    set local "request.jwt.claims" to '{ "sub": "273dc833-4e44-4f22-bdc9-3b13c9253d2a", "email": "user1@email.com" }';
    perform add_message('78d89525-46bf-4032-8572-5428bec482eb','hello world');

    -- row added to messages table
    perform ok(
        exists (
            select 1 from messages
            where content = 'hello world'
        ),
        'Row should be added to messages'
    );
END $$;

-- get_friend_requests()
set role authenticated;
set local "request.jwt.claims" to '{ "sub": "273dc833-4e44-4f22-bdc9-3b13c9253d2a", "email": "user1@email.com" }';
select results_eq(
  'select * from get_friend_requests()', 
  $$VALUES ('[{"id": "373dc833-4e44-4f22-bdc9-3b13c9253d2a", "username": "username2", "displayName": null, "avatarUrl": null, "bio": null}]'::jsonb)$$,
  'The correct friend requests should be returned'
);

-- get_has_requested()

-- get_accepted_players()

-- get_join_requests()


select * from finish();
rollback;