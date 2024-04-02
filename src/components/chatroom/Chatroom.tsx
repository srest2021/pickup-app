import { H4, Text, YStack, View } from "tamagui";
import { useStore } from "../../lib/store";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import { useEffect } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

const Chatroom = ({ navigation }: { navigation: any }) => {
  const [session, user, roomCode, clearMessages] = useStore(
    (state) => [
      state.session,
      state.user,
      state.roomCode,
      state.clearMessages,
    ],
  );

  useEffect(() => {
    clearMessages();
  }, [roomCode]);

  return (
    <View padding="$5" backgroundColor="#09e8e1" flex={1}>
      {session && session.user && user ? (
        // <KeyboardAvoidingView
        //   behavior={Platform.OS === "ios" ? "padding" : "height"}
        // >
        <View flex={1} backgroundColor="#6e09e8" justifyContent="space-between">
            <ChatWindow />
            <MessageInput />
        </View>
        //</KeyboardAvoidingView>
      ) : (
        <H4>Log in to chat!</H4>
      )}
    </View>
  );
};

export default Chatroom;