import { useEffect } from "react";
import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { Message, ThumbnailUser } from "../lib/types";

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
        //if (!(payload.userId == user.id)) {
        addMessage(payload);
        //}
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

  const getChatroomUsers = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("joined_game")
        .select(
          `
          player_id,
          profiles (
            avatar_url
          )
          `,
        )
        .eq("game_id", roomCode);
      if (error) throw error;

      if (data) {
        // setMessages(messages);
      } else {
        throw new Error(
          "Error getting chatroom users! Please try again later.",
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getChatroomMessages = async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          id,
          sent_at,
          game_id,
          player_id,
          content,
          profiles (
            username,
            display_name,
            avatar_url
          )
        `,
        )
        .eq("game_id", roomCode)
        .order("sent_at", { ascending: true });
      if (error) throw error;

      if (data) {
        const messages: Message[] = data.map((message: any) => ({
          id: message.id,
          roomCode: message.game_id,
          sentAt: message.sent_at,
          content: message.content,
          user: {
            id: message.player_id,
            username: message.profiles.username,
            displayName: message.profiles.display_name,
            avatarUrl: message.profiles.avatarUrl,
          } as ThumbnailUser,
        }));
        setMessages(messages);
      } else {
        throw new Error("Error getting messages! Please try again later.");
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
    getChatroomMessages,
  };
}

export default useQueryMessages;
