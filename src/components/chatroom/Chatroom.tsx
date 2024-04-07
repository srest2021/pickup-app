import { H4, Text, YStack, View } from "tamagui";
import { useStore } from "../../lib/store";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import { useEffect } from "react";
import { KeyboardAvoidingView } from "react-native";

const Chatroom = ({ navigation }: { navigation: any }) => {
  const [session, user, roomCode, clearMessages] = useStore((state) => [
    state.session,
    state.user,
    state.roomCode,
    state.clearMessages,
  ]);

  useEffect(() => {
    clearMessages();
  }, [roomCode]);

  return (
    <View padding="$5" flex={1}>
      {session && session.user && user ? (
        <KeyboardAvoidingView
          behavior="padding"
          enabled
          keyboardVerticalOffset={100}
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View flex={1}>
            <ChatWindow />
            <MessageInput />
          </View>
        </KeyboardAvoidingView>
      ) : (
        <H4>Log in to chat!</H4>
      )}
    </View>
  );
};

export default Chatroom;
