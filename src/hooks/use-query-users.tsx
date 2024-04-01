import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { User, OtherUser, UserSport, ThumbnailUser } from "../lib/types";
import * as Location from "expo-location";

function useQueryUsers() {
  const [
    session,
    setLoading,
    setLocation,
    setOtherUser,
    setFriends,
    setFriendRequests,
  ] = useStore((state) => [
    state.session,
    state.setLoading,
    state.setLocation,
    state.setOtherUser,
    state.setFriends,
    state.setFriendRequests,
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
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error } = await supabase.rpc("get_friends");
      if (error) console.error(error);

      if (data) {
        const friends = data.map((friend: any) => {
          const myFriend: ThumbnailUser = {
            id: friend.id,
            username: friend.username,
            displayName: friend.displayName,
            avatarUrl: friend.avatarUrl,
          };
          return myFriend;
        });

        setFriends(friends);
      } else {
        throw new Error("Error fetching friends! Please try again later.");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error fetching friends! Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getFriendRequests = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error } = await supabase.rpc("get_friend_requests");
      if (error) console.error(error);

      if (data) {
        const friendRequests = data.map((friendRequest: any) => {
          const myFriendRequest: ThumbnailUser = {
            id: friendRequest.id,
            username: friendRequest.username,
            displayName: friendRequest.displayName,
            avatarUrl: friendRequest.avatarUrl,
          };
          return myFriendRequest;
        });

        setFriendRequests(friendRequests);
      } else {
        throw new Error(
          "Error fetching friend requests! Please try again later.",
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        Alert.alert("Error fetching friend requests! Please try again later.");
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

  return {
    getOtherProfile,
    getFriends,
    getFriendRequests,
    setUserLocation,
    getUserLocation,
  };
}

export default useQueryUsers;
