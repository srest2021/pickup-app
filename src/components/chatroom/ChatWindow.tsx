import { H4, Text, YStack } from "tamagui";
import { useStore } from "../../lib/store";
import { View } from "react-native";
import { useEffect } from "react";
import useQueryMessages from "../../hooks/use-query-messages";

const ChatWindow = () => {
  const [loading, messages] = useStore((state) => [
    state.loading,
    state.messages,
  ]);
  const { getChatroomMessages } = useQueryMessages();

  useEffect(() => {
    const getMessages = async () => {
      await getChatroomMessages();
    };
    getMessages();
  }, []);

  return (
    <View>
      <H4>Chat window</H4>
      <View>
        {messages.length > 0 ? (
          <YStack space="$2">
            {messages.map((message) => (
              <Text key={message.id}>
                @{message.user.username}: {message.content}
              </Text>
            ))}
          </YStack>
        ) : (
          <Text>No messages yet</Text>
        )}
      </View>
    </View>
  );
};

export default ChatWindow;
