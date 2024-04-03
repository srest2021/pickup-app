import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { User, OtherUser, UserSport, ThumbnailUser } from "../lib/types";
import * as Location from "expo-location";

function useQueryUsers() {
  const [session, setLoading, setLocation, setOtherUser] = useStore((state) => [
    state.session,
    state.setLoading,
    state.setLocation,
    state.setOtherUser,
  ]);

  const searchByUsername = async (
    username: string,
  ): Promise<ThumbnailUser[] | undefined> => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, display_name, bio, avatar_url")
        .ilike("username", `%${username}%`)
        .order("username", { ascending: true });
      if (error) throw error;

      if (data) {
        const users = data.map((elem: any) => {
          const user: ThumbnailUser = {
            id: elem.id,
            username: elem.username,
            displayName: elem.display_name,
            bio: elem.bio,
            avatarUrl: elem.avatar_url,
          };
          return user;
        });
        return users;
      } else {
        throw new Error("Error processing your search! Please try again later");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
        setOtherUser(user);
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
  };

  const getFriendRequests = async () => {
    // use custom SQL function get_friend_requests()
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

  return {
    getOtherProfile,
    getFriends,
    getFriendRequests,
    setUserLocation,
    getUserLocation,
    searchByUsername,
  };
}

export default useQueryUsers;
