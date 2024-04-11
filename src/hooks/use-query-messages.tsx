import { useEffect } from "react";
import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";
import { Message, ThumbnailUser } from "../lib/types";
import { redis } from "../lib/upstash-redis";

function useQueryMessages() {
  const [
    session,
    user,
    setLoading,
    roomCode,
    setMessages,
    addMessage,
    addMessages,
    setChannel,
    addAvatarUrls,
  ] = useStore((state) => [
    state.session,
    state.user,
    state.setLoading,
    state.roomCode,
    state.setMessages,
    state.addMessage,
    state.addMessages,
    state.setChannel,
    state.addAvatarUrls,
  ]);

  const MESSAGE_LIMIT = 50

  const username = user?.username;

  const addMessageToCache = async (payload: any) => {
    if (roomCode) {
      //console.log("adding payload to cache: ",payload)
      await redis.lpush(roomCode, payload);
      await redis.ltrim(roomCode, 0, MESSAGE_LIMIT);
    }
  }

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
        // add message to store
        addMessage(payload);

        // add message to cache
        addMessageToCache(payload);
      });

      channel.subscribe();
      setChannel(channel);
      return () => {
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
        const avatarUrls: any[] = data.map((res: any) => ({
          userId: res.player_id,
          avatarPath: res.profiles.avatar_url,
          avatarUrl: null,
        }));
        addAvatarUrls(avatarUrls);
        return avatarUrls;
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

      //edis.flushall()
      // setMessages([]);

      // get messages from cache
      if (!roomCode) throw new Error("Error getting messages! Please try again later.");
      // var startTime = performance.now()
      const cachedData: Message[] | null = await redis.lrange(roomCode, 0, MESSAGE_LIMIT);
      // var endTime = performance.now()
      // console.log("cached results: ",cachedData.length);
      // console.log(endTime-startTime, 'ms')
      
      let mostRecentSentAt = null;
      if (cachedData && cachedData.length > 0) {
        // set store 
        setMessages(cachedData.reverse());

        // get most recent sent_at 
        mostRecentSentAt = cachedData[cachedData.length-1].sentAt;
      }
      //cachedData.forEach((message) => console.log(`message ${message.content} at ${message.sentAt}`))
      //console.log("cached most recent sentAt: ", mostRecentSentAt)

      // implement spinner at bottom until query complete

      // get all messages from supabase past that sent_at (where sent_at > date)
      const query = supabase.from("messages").select(
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
      .eq("game_id", roomCode);
      if (mostRecentSentAt) query.gt('sent_at', mostRecentSentAt);
      query.order("sent_at", { ascending: true }).limit(MESSAGE_LIMIT);
      //startTime = performance.now()
      const { data, error } = await query;
      //endTime = performance.now()
      if (error) throw error;
      // console.log("supabase results: ",data.length)
      // console.log(endTime-startTime, 'ms')

      if (data) {
        if (data.length > 0) {
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
          //console.log("queried most recent sentAt: ", messages[messages.length-1].sentAt)
  
          // add to store
          addMessages(messages); 
  
          // add to cache
          await redis.lpush(roomCode, ...messages);
          await redis.ltrim(roomCode, 0, MESSAGE_LIMIT);
        }
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
    getChatroomUsers,
  };
}

export default useQueryMessages;
