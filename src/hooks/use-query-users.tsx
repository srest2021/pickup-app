import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { User, OtherUser, UserSport } from "../lib/types";
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

      const { data, error } = await supabase.rpc("get_other_profile", {
        player_id: userId,
      });
      if (error) throw error;

      if (data) {
        const user: OtherUser = data;
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

  const getFriends = async () => {
    // use custom SQL function get_friends()
  }

  const getFriendRequests = async () => {
    // use custom SQL function get_friend_requests()
  }

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

  return { getOtherProfile, getFriends, getFriendRequests, setUserLocation, getUserLocation };
}

export default useQueryUsers;
