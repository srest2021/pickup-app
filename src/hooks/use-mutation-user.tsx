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
        id: session?.user.id,
        username,
        display_name,
        bio,
        avatar_url,
        updated_at: new Date(),
      };
      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }

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
      const formattedUsername = username ? `@${username} ` : "a user";
      const formattedHtml = `<strong>You just recieved a friend request from ${formattedUsername}!</strong><br><br>Open the app to interact!`;
      const { data, error: error2 } = await supabase.functions.invoke(
        "resend2",
        {
          body: {
            to: email,
            subject: "You just recieved a friend request on Pickup!",
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
