import { H4, Text, YStack } from "tamagui";
import { useStore } from "../../lib/store";
import { View } from "react-native";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import { useEffect } from "react";

const Chatroom = ({ navigation, route }: { navigation: any; route: any }) => {
  const { gametype } = route.params;

  const [session, user, loading, roomCode, clearMessages] = useStore(
    (state) => [
      state.session,
      state.user,
      state.loading,
      state.roomCode,
      state.clearMessages,
    ],
  );

  useEffect(() => {
    clearMessages();
  }, [roomCode]);

  return (
    <View className="p-8">
      {session && session.user && user ? (
        <YStack space="$3">
          <ChatWindow />
          <MessageInput />
        </YStack>
      ) : (
        <View className="items-center justify-center flex-1 p-12 text-center">
          <H4>Log in to chat!</H4>
        </View>
      )}
    </View>
  );
};

export default Chatroom;
