import { H4, Text, YStack, View } from "tamagui";
import { useStore } from "../../lib/store";
import { useEffect, useRef } from "react";
import useQueryMessages from "../../hooks/use-query-messages";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";
import { ScrollView, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import useQueryAvatars from "../../hooks/use-query-avatars";

const ChatWindow = ({ navigation }: { navigation: any }) => {
  const [user, messages, setMessages] = useStore((state) => [
    state.user,
    state.messages,
    state.setMessages,
  ]);

  const { getChatroomMessages, getChatroomUsers } = useQueryMessages();
  const { fetchAvatar } = useQueryAvatars();

  const scrollViewRef = useRef();

  useEffect(() => {
    const getData = async () => {
      const avatarUrls = await getChatroomUsers();
      await getChatroomMessages();

      if (avatarUrls && avatarUrls.length > 0) {
        avatarUrls.forEach((avatarUrl) => {
          if (avatarUrl.avatarPath) {
            fetchAvatar(avatarUrl.userId, avatarUrl.avatarPath);
          }
        });
      }
    };
    getData();
    return () => {
      setMessages([]);
    };
  }, []);

  return (
    <View flex={3}>
      {messages.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          <YStack space="$2">
            {messages.map((message) =>
              message.user.id === user?.id ? (
                <MyMessage key={message.id} message={message} />
              ) : (
                <OtherMessage
                  key={message.id}
                  message={message}
                  navigation={navigation}
                />
              ),
            )}
          </YStack>
        </ScrollView>
      ) : (
        <Text>No messages yet</Text>
      )}
    </View>
  );
};

export default ChatWindow;
