import { useEffect } from "react";
import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";

function useQueryMessages() {
  const [
    session,
    user,
    setLoading,
    roomCode,
    setMessages,
    addMessage,
    channel,
    setChannel,
  ] = useStore((state) => [
    state.session,
    state.user,
    state.setLoading,
    state.roomCode,
    state.setMessages,
    state.addMessage,
    state.channel,
    state.setChannel,
  ]);

  const username = user?.username;

  useEffect(() => {
    if (roomCode && username) {
      const channel = supabase.channel(`room:${roomCode}`, {
        config: {
          broadcast: {
            self: true,
          },
        },
      });

      // listen to broadcast messages with a "message" event
      channel.on("broadcast", { event: "message" }, ({ payload }) => {
        addMessage(payload);
      });

      channel.subscribe();
      console.log("SUBSCRIBED TO CHANNEL");
      setChannel(channel);
      return () => {
        console.log("UNSUBSCRIBED FROM CHANNEL");
        channel.unsubscribe();
        setChannel(undefined);
      };
    }
  }, [roomCode, username]);

  const getChatroomMessages = async (roomCode: string) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      // const { data, error } = await supabase.rpc("get_messages", {
      //   room_code: roomCode,
      // });
      // if (error) throw error;

      // if (data) {
      //   setMessages(data);
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
    getChatroomMessages,
  };
}

export default useQueryMessages;
