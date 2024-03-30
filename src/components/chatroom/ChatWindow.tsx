import { H4, Text, YStack } from "tamagui";
import { useStore } from "../../lib/store";
import { useEffect, useRef } from "react";
import useQueryMessages from "../../hooks/use-query-messages";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";
import { View, ScrollView, Alert } from "react-native";
import { supabase } from "../../lib/supabase";

const ChatWindow = () => {
  const [user, loading, messages, setAvatarUrl] = useStore((state) => [
    state.user,
    state.loading,
    state.messages,
    state.setAvatarUrl
  ]);
  const { getChatroomMessages, getChatroomUsers } = useQueryMessages();

  const scrollViewRef = useRef();

  const fetchData = async (userId: string, avatarPath: string) => {
    if (avatarPath) {
      try {
        await downloadImage(userId, avatarPath);
      } catch (error) {
        //Alert.alert("Error getting avatar");
        setAvatarUrl(userId, null);
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
      console.log(`successfully downloaded avatar for ${userId}`)
      setAvatarUrl(userId, fr.result as string);
    };
  }

  useEffect(() => {
    const getData = async () => {
      const avatarUrls = await getChatroomUsers();
      await getChatroomMessages();

      if (avatarUrls && avatarUrls.length > 0) {
        avatarUrls.forEach((avatarUrl) => {
          if (avatarUrl.avatarPath) {
            console.log("downloading for ",avatarUrl.userId)
            fetchData(avatarUrl.userId, avatarUrl.avatarPath);
          }
        })
      }
    };
    console.log("useeffect in chat window triggered")
    getData();
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
