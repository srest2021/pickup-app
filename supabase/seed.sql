insert into auth.users 
  (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,invited_at,confirmation_token,confirmation_sent_at,recovery_token,recovery_sent_at,email_change_token_new,email_change,email_change_sent_at,last_sign_in_at,raw_app_meta_data,raw_user_meta_data,is_super_admin,created_at,updated_at,phone,phone_confirmed_at,phone_change,phone_change_token,phone_change_sent_at,email_change_token_current,email_change_confirm_status,banned_until,reauthentication_token,reauthentication_sent_at,is_sso_user,deleted_at)
values 
  ('00000000-0000-0000-0000-000000000000','273dc833-4e44-4f22-bdc9-3b13c9253d2a','authenticated','authenticated','user1@example.com','$2a$10$YknGCPK8YAZkqgjlU8JVCO5.qbJx7mjTOdk62w7WEu42DGlgQwBMa',now(),null,'',now(),'',null,'','',null,now(),'{"provider":"email","providers":["email"]}','{"username":"username1"}',null,now(),now(),null,null,'','',null,'',0,null,'',null,false,null),
  ('00000000-0000-0000-0000-000000000000','373dc833-4e44-4f22-bdc9-3b13c9253d2a','authenticated','authenticated','user2@example.com','$2a$10$YknGCPK8YAZkqgjlU8JVCO5.qbJx7mjTOdk62w7WEu42DGlgQwBMa',now(),null,'',now(),'',null,'','',null,now(),'{"provider":"email","providers":["email"]}','{"username":"username2"}',null,now(),now(),null,null,'','',null,'',0,null,'',null,false,null);

insert into auth.identities
  (id,provider_id,user_id,identity_data,provider,last_sign_in_at,updated_at)
values
  (uuid_generate_v4(),'273dc833-4e44-4f22-bdc9-3b13c9253d2a','273dc833-4e44-4f22-bdc9-3b13c9253d2a','{"sub":"273dc833-4e44-4f22-bdc9-3b13c9253d2a","email":"user1@example.com","email_verified":false,"phone_verified":false}','email',now(),now()),
  (uuid_generate_v4(),'373dc833-4e44-4f22-bdc9-3b13c9253d2a','373dc833-4e44-4f22-bdc9-3b13c9253d2a','{"sub":"373dc833-4e44-4f22-bdc9-3b13c9253d2a","email":"user2@example.com","email_verified":false,"phone_verified":false}','email',now(),now());

UPDATE "public"."profiles" SET 
    "username" = 'username1',
    "email" = 'user1@example.com'
WHERE id = '273dc833-4e44-4f22-bdc9-3b13c9253d2a';

UPDATE "public"."profiles" SET 
    "username" = 'username2',
    "email" = 'user2@example.com'
WHERE id = '373dc833-4e44-4f22-bdc9-3b13c9253d2a';

insert into games
  (id, organizer_id, title, created_at, datetime, sport, skill_level, max_players, is_public, current_players)
values
  ('a9b2e8f6-39eb-49d0-b9c0-92d97a82c20e', '273dc833-4e44-4f22-bdc9-3b13c9253d2a', 'public game', now(), now(), 'soccer', 0, 10, true, 9),
  ('78d89525-46bf-4032-8572-5428bec482eb', '273dc833-4e44-4f22-bdc9-3b13c9253d2a', 'friends-only game', now(), now(), 'soccer', 0, 10, false, 1);

insert into game_locations
  (id, game_id, street, city, state, zip, loc)
values
  (uuid_generate_v4(),'a9b2e8f6-39eb-49d0-b9c0-92d97a82c20e', 'Homewood', 'Baltimore', 'MD', '21218', st_point(-76.6172978, 39.3289357)::geography),
  (uuid_generate_v4(),'78d89525-46bf-4032-8572-5428bec482eb', 'Homewood', 'Baltimore', 'MD', '21218', st_point(-76.6172978, 39.3289357)::geography);

insert into game_requests
  (id, game_id, player_id, plus_one)
values
  (uuid_generate_v4(), 'a9b2e8f6-39eb-49d0-b9c0-92d97a82c20e', '373dc833-4e44-4f22-bdc9-3b13c9253d2a', false);

insert into friend_requests
  (id, request_sent_by, request_sent_to)
values
  (uuid_generate_v4(), '373dc833-4e44-4f22-bdc9-3b13c9253d2a', '273dc833-4e44-4f22-bdc9-3b13c9253d2a')