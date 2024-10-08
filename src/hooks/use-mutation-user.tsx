import { useStore } from "../lib/store";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { SkillLevel, User, UserSport } from "../lib/types";
import {
  updateIsFriendInCache,
  updatehasRequestedInCache,
} from "../lib/upstash-redis";

function useMutationUser() {
  const [
    session,
    user,
    setSession,
    setLoading,
    setUser,
    editUser,
    setUserSports,
    addFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    addAvatarUrls,
    editAvatarPath,
  ] = useStore((state) => [
    state.session,
    state.user,
    state.setSession,
    state.setLoading,
    state.setUser,
    state.editUser,
    state.setUserSports,
    state.addFriendRequest,
    state.acceptFriendRequest,
    state.rejectFriendRequest,
    state.removeFriend,
    state.addAvatarUrls,
    state.editAvatarPath,
  ]);

  const htmlContent1 = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
          <style>
              /* Center the content horizontally and vertically */
              body {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background-color: #f0f0f0; /* Set background color */
              }
              
              .container {
                  text-align: center; /* Center the text horizontally */
              }
      
              .image-container {
                  display: flex;
                  justify-content: center;
                  align-items: center;
              }
      
              /* Style the message */
              .message {
                  text-align: center; 
              }
              
              /* Style the username */
              .username {
                  color: #e54b07;
                  font-weight: bold;
              }
              
              /* Style the game name */
              .gamename {
                  color: #e54b07; 
                  font-weight: bold;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="image-container">
              <a href="https://ibb.co/4ts0xD0"><img src="https://i.ibb.co/F3sdtfd/pickupimg.png" alt="pickupimg" border="0" /></a>
              </div>
      
              You just received a friend request from <span class="username">__USER__</span><br><br>
              Open the app to view the request!
          </div>
      </body>
      </html>
      `;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      getProfile();
    }
  }, [session?.access_token]);

  const getProfile = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(
          `
            id,
            username, 
            display_name, 
            bio, 
            avatar_url,
            sports (
                id,
                name,
                skill_level
            )
        `,
        )
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        const user: User = {
          id: data.id,
          username: data.username,
          displayName: data.display_name,
          bio: data.bio,
          avatarUrl: data.avatar_url,
          sports: data.sports.map(
            (sport) =>
              ({
                id: sport.id,
                name: sport.name,
                skillLevel: sport.skill_level,
              }) as UserSport,
          ),
        };
        setUser(user);
        setUserSports(user.sports);
        addAvatarUrls([
          { userId: user.id, avatarPath: user.avatarUrl, avatarUrl: null },
        ]);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (
    username: string,
    display_name: string,
    bio: string,
    avatar_url: string,
  ) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        username_param: username,
        display_name_param: display_name,
        bio_param: bio,
        avatar_url_param: avatar_url,
        updated_at_param: new Date(),
      };
      const { error } = await supabase.rpc("update_profile", updates);
      if (error) throw error;

      const updatedUser = {
        displayName: display_name,
        bio: bio,
        avatarUrl: avatar_url,
      };
      editUser(updatedUser);
      editAvatarPath(session?.user.id, avatar_url);
      return updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error updating profile! Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const sendEmailForRequest = async (
    username: string | undefined,
    userId: string,
  ) => {
    try {
      const { data: email, error: error1 } = await supabase.rpc(
        "get_user_email",
        { user_id: userId },
      );
      if (error1) {
        throw error1;
      }
      const formattedUsername = username ? `@${username}` : "a user";

      const formattedHtml = htmlContent1.replace("__USER__", formattedUsername);

      const { data, error: error2 } = await supabase.functions.invoke(
        "resend2",
        {
          body: {
            to: email,
            subject: "PickupApp: Someone sent you a friend request!",
            html: formattedHtml,
          },
        },
      );
      if (error2) throw error2;
    } catch (error) {
      Alert.alert("Error sending email notifications to friend requests!");
      // don't do anything else if email notifications failed;
      // just alert and continue with creating the game as usual
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const friendRequest = {
        request_sent_by: session.user.id,
        request_sent_to: userId,
      };

      const { data, error } = await supabase
        .from("friend_requests")
        .insert(friendRequest)
        .select();
      if (error) throw error;

      if (data) {
        addFriendRequest();
        updatehasRequestedInCache(userId, true);
        await sendEmailForRequest(user?.username, userId);
        return friendRequest;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const acceptFriendRequestById = async (userId: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error } = await supabase.rpc("accept_friend_request", {
        sent_by: userId,
      });
      if (error) throw error;

      // Friend Request successfully accepted.
      acceptFriendRequest(userId);
      updateIsFriendInCache(userId, true);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const rejectFriendRequestById = async (userId: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error } = await supabase.rpc("reject_friend_request", {
        request_sent_to: userId,
      });
      if (error) throw error;

      // Friend Request successfully rejected.
      rejectFriendRequest(userId);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFriendById = async (userId: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error } = await supabase.rpc("remove_friend", {
        user1_id: user?.id,
        user2_id: userId,
      });
      if (error) throw error;

      // friend successfully removed
      removeFriend(userId);
      updateIsFriendInCache(userId, false);
      return userId;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    user,
    getProfile,
    updateProfile,
    sendFriendRequest,
    acceptFriendRequestById,
    rejectFriendRequestById,
    removeFriendById,
  };
}

export default useMutationUser;
