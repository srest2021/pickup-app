import { useEffect } from "react";
import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { Message } from "../lib/types";

function useMutationMessages() {
  const [session, setLoading, channel, roomCode, addMessage] = useStore(
    (state) => [
      state.session,
      state.setLoading,
      state.channel,
      state.roomCode,
      state.addMessage,
    ],
  );

  const addChatroomMessage = async (content: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error } = await supabase.rpc("add_message", {
        game_id: roomCode,
        content,
      });
      if (error) throw error;

      if (data) {
        const message: Message = data;

        // broadcast message through channel
        channel?.send({
          type: "broadcast",
          event: "message",
          payload: {
            ...message,
          },
        });
        return message;
      } else {
        throw new Error("Error sending message! Please try again later.");
      }
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
