import { useStore } from "../lib/store";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { SkillLevel, User, UserSport } from "../lib/types";

function useMutationSports() {
  const [session, userSports, setLoading, addUserSport, editUserSport] =
    useStore((state) => [
      state.session,
      state.userSports,
      state.setLoading,
      state.addUserSport,
      state.editUserSport,
    ]);

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

  return {
    setSport,
  };
}

export default useMutationSports;
