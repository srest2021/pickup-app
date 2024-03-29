import { H4, Text } from "tamagui";
import { useStore } from "../../lib/store";
import { View } from "react-native";
import { useEffect } from "react";
import useQueryMessages from "../../hooks/use-query-messages";

const ChatWindow = () => {
  const [loading, roomCode] = useStore((state) => [
    state.loading,
    state.roomCode,
  ]);
  const { getChatroomMessages } = useQueryMessages();

  return (
    <View>
      <H4>Chat window</H4>
      {!loading ? (
        <Text>Room code: {roomCode}</Text>
      ) : (
        <View>
          <Text>Loading...</Text>
        </View>
      )}
    </View>
  );
};

export default ChatWindow;
