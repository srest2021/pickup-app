import { Paragraph, Text, View, XStack, YStack, Image } from "tamagui";
import { Message } from "../../lib/types";
import { useStore } from "../../lib/store";
import { useEffect, useState } from "react";

const OtherMessage = ({ message }: { message: Message }) => {
  const [avatarUrls] = useStore((state) => [state.avatarUrls]);

  const [avatarUrl, setAvatarUrl] = useState(undefined);

  useEffect(() => {
    console.log("finding avatar url for @", message.user.username)
    setAvatarUrl(avatarUrls.find((elem) => elem.userId === message.user.id).avatarUrl);
  }, [avatarUrls])
  
  return (
    <View>
      <YStack style={{ maxWidth: "70%" }}>
        <XStack space="$2" alignItems="center">
          {avatarUrl && (
                    <Image
                      source={{ uri: avatarUrl, width: 35, height: 35 }}
                      style={{ width: 35, height: 35, borderRadius: 17.5 }}
                      accessibilityLabel="Avatar"
                    />
          )}
          <Paragraph>@{message.user.username}</Paragraph>
        </XStack>
        <Text>{message.content}</Text>
      </YStack>
    </View>
  );
};

export default OtherMessage;
