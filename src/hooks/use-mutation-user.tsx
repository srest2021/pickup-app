import { useStore } from "../lib/store";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { SkillLevel, User, UserSport } from "../lib/types";

function useMutationUser() {
  const [session, user, setSession, setLoading, setUser, editUser, addUserSport, setUserSports] = useStore(
    (state) => [
      state.session,
      state.user,
      state.setSession,
      state.setLoading,
      state.setUser,
      state.editUser,
      state.addUserSport,
      state.setUserSports
    ],
  );

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
          username: data.username,
          displayName: data.display_name,
          bio: data.bio,
          avatarUrl: data.avatar_url,
          sports: data.sports.map((sport) => ({
            id: sport.id,
            name: sport.name,
            skillLevel: sport.skill_level,
          } as UserSport)),
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

  const addSport = async (
    sportName: string,
    sportSkillLevel: SkillLevel
  ) => {
    try {
      console.log("ADDING SPORT")
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");
      
      const updates = {
        user_id: session?.user.id,
        name: sportName,
        skill_level: Number(sportSkillLevel),
      }
      //console.log("UPDATES: ",updates)
      const { data, error } = await supabase.from("sports").insert(updates).select();
      //console.log("ERROR: ", error?.message)
      if (error) {
        throw error;
      }
      console.log("DATA: ",data)

      if (data && data[0]) {
        const userSport: UserSport = {
            id: data[0].id,
            name: data[0].name,
            skillLevel: data[0].skill_level,
        };
        addUserSport(userSport);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const updateProfile = async (
    display_name: string,
    bio: string,
    avatar_url: string,
    //sports: Sport[]
  ) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
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
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { session, user, getProfile, updateProfile, addSport };
}

export default useMutationUser;
