import { Paragraph, Text, View, XStack, YStack, Image, Avatar } from "tamagui";
import { Message } from "../../lib/types";
import { useStore } from "../../lib/store";
import { useEffect, useState } from "react";

const OtherMessage = ({ message }: { message: Message }) => {
  const [avatarUrls] = useStore((state) => [state.avatarUrls]);

  const [avatarUrl, setAvatarUrl] = useState(undefined);

  useEffect(() => {
    setAvatarUrl(
      avatarUrls.find((elem) => elem.userId === message.user.id).avatarUrl,
    );
  }, [avatarUrls]);

  return (
    <View>
      <YStack>
        <XStack style={{ maxWidth: "70%" }}>
          <Text>@{message.user.username}</Text>
        </XStack>

        <XStack style={{ maxWidth: "70%" }}>
          <Avatar circular size="$3">
            <Avatar.Image
              accessibilityLabel={message.user.username}
              src={avatarUrl}
            />
            <Avatar.Fallback
              backgroundColor="$blue10"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="#ffffff">
                {message.user.username.substring(0, 2).toUpperCase()}
              </Text>
            </Avatar.Fallback>
          </Avatar>

          <Text>{message.content}</Text>
        </XStack>
      </YStack>
    </View>
  );
};

export default OtherMessage;
