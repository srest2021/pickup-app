import { useStore } from "../lib/store";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { SkillLevel, User, UserSport } from "../lib/types";

function useMutationUser() {
  const [
    session,
    user,
    userSports,
    setSession,
    setLoading,
    setUser,
    editUser,
    addUserSport,
    editUserSport,
    setUserSports,
  ] = useStore((state) => [
    state.session,
    state.user,
    state.userSports,
    state.setSession,
    state.setLoading,
    state.setUser,
    state.editUser,
    state.addUserSport,
    state.editUserSport,
    state.setUserSports,
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
    if (session) getProfile();
  }, [session]);

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
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const editSport = async (sport: UserSport) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: sport.id,
        user_id: session?.user.id,
        name: sport.name,
        skill_level: sport.skillLevel,
      };
      const { data, error } = await supabase
        .from("sports")
        .upsert(updates)
        .select();
      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const userSport: UserSport = {
          id: data[0].id,
          name: data[0].name,
          skillLevel: data[0].skill_level,
        };
        editUserSport(userSport);
        return userSport;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const addSport = async (sportName: string, sportSkillLevel: SkillLevel) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        user_id: session?.user.id,
        name: sportName,
        skill_level: Number(sportSkillLevel),
      };
      const { data, error } = await supabase
        .from("sports")
        .insert(updates)
        .select();
      if (error) {
        throw error;
      }

      if (data && data[0]) {
        const userSport: UserSport = {
          id: data[0].id,
          name: data[0].name,
          skillLevel: data[0].skill_level,
        };
        addUserSport(userSport);
        return userSport;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const setSport = async (sportName: string, sportSkillLevel: SkillLevel) => {
    const userSport = userSports.find(
      (userSport) => userSport.name === sportName,
    );
    if (!userSport) {
      return addSport(sportName, sportSkillLevel);
    } else {
      let updatedSport = userSport;
      updatedSport.skillLevel = sportSkillLevel;
      return editSport(updatedSport);
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
      return updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const addFriendRequest = async (userId: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const friendRequest = {
        request_sent_by: session.user.id,
        request_sent_to: userId
      }

      const { data, error } = await supabase
        .from("friend_requests")
        .insert(friendRequest)
        .select();
      if (error) throw error;

      if (data) {
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

  const acceptFriendRequest = async (userId: string) => {
    // use custom SQL function accept_friend_request(userId)
  }

  const rejectFriendRequest = async (userId: string) => {
    // use custom SQL function reject_friend_request(userId)
  }

  return { session, user, getProfile, updateProfile, setSport, addFriendRequest, acceptFriendRequest, rejectFriendRequest };
}

export default useMutationUser;
