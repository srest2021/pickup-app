import { useEffect } from "react";
import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";

function useMutationMessages() {
  const [session, user, setLoading, roomCode, addMessage] = useStore(
    (state) => [
      state.session,
      state.user,
      state.setLoading,
      state.roomCode,
      state.addMessage,
    ],
  );

  const username = user?.username;

  const addChatroomMessage = async (roomCode: string, content: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      // const { data, error } = await supabase.rpc("add_message", {
      //   room_code: roomCode,
      //   content
      // });
      // if (error) throw error;

      // if (data) {
      //   addMessage(data);
      // }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    addChatroomMessage,
  };
}

export default useMutationMessages;
