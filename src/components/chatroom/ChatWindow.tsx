import { H4, Text, YStack } from "tamagui";
import { useStore } from "../../lib/store";
import { useEffect, useRef } from "react";
import useQueryMessages from "../../hooks/use-query-messages";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";
import { View, ScrollView } from "react-native";

const ChatWindow = () => {
  const [user, loading, messages] = useStore((state) => [
    state.user,
    state.loading,
    state.messages,
  ]);
  const { getChatroomMessages } = useQueryMessages();

  const scrollViewRef = useRef();

  useEffect(() => {
    const getMessages = async () => {
      await getChatroomMessages();
    };
    getMessages();
  }, []);

  return (
    <View style={{ minHeight: "87%", maxHeight: "87%" }}>
      <ScrollView
        style={{ flexGrow: 0 }}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        {messages.length > 0 ? (
          <YStack space="$2">
            {messages.map((message) =>
              message.user.id === user?.id ? (
                <MyMessage key={message.id} message={message} />
              ) : (
                <OtherMessage key={message.id} message={message} />
              ),
            )}
          </YStack>
        ) : (
          <Text>No messages yet</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ChatWindow;
