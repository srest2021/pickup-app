import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { User, UserSport } from "../lib/types";
import * as Location from "expo-location";

function useQueryUsers() {
  const [session, setLoading, setLocation] = useStore((state) => [
    state.session,
    state.setLoading,
    state.setLocation,
  ]);

  const getOtherProfile = async (userId: string) => {
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
        .eq("id", userId)
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
        return user;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const setUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return {
        location: null,
        error1: new Error("Permission to access location was denied"),
      };
    }

    let location = await Location.getCurrentPositionAsync({});
    if (!location) {
      return { location: null, error1: new Error("Error getting location") };
    }

    setLocation(location);
  };

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return {
        location: null,
        error1: new Error("Permission to access location was denied"),
      };
    }

    let location = await Location.getCurrentPositionAsync({});
    if (!location) {
      return { location: null, error1: new Error("Error getting location") };
    }

    setLocation(location);
    return { location, error1: null };
  };

  return { getOtherProfile, setUserLocation, getUserLocation };
}

export default useQueryUsers;
