import { H4, Text, YStack, View } from "tamagui";
import { useStore } from "../../lib/store";
import { useEffect, useRef } from "react";
import useQueryMessages from "../../hooks/use-query-messages";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";
import { ScrollView, Alert } from "react-native";
import { supabase } from "../../lib/supabase";

const ChatWindow = () => {
  const [user, loading, messages, addAvatarUrl] = useStore((state) => [
    state.user,
    state.loading,
    state.messages,
    state.addAvatarUrl,
  ]);
  const { getChatroomMessages, getChatroomUsers } = useQueryMessages();

  const scrollViewRef = useRef();

  const fetchData = async (userId: string, avatarPath: string) => {
    if (avatarPath) {
      try {
        await downloadImage(userId, avatarPath);
      } catch (error) {
        //Alert.alert("Error getting avatar");
        addAvatarUrl(userId, null);
      }
    }
  };

  async function downloadImage(userId: string, path: string) {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(path);
    if (error) throw error;

    const fr = new FileReader();
    fr.readAsDataURL(data);
    fr.onload = () => {
      addAvatarUrl(userId, fr.result as string);
    };
  }

  useEffect(() => {
    const getData = async () => {
      const avatarUrls = await getChatroomUsers();
      await getChatroomMessages();

      if (avatarUrls && avatarUrls.length > 0) {
        avatarUrls.forEach((avatarUrl) => {
          if (avatarUrl.avatarPath) {
            fetchData(avatarUrl.userId, avatarUrl.avatarPath);
          }
        });
      }
    };
    getData();
  }, []);

  return (
    <View flex={3}>
      {messages.length > 0 ? (
        <ScrollView
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
                <OtherMessage key={message.id} message={message} />
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
