import {
  Paragraph,
  Text,
  View,
  XStack,
  YStack,
  Image,
  Avatar,
  SizableText,
} from "tamagui";
import { Message } from "../../lib/types";
import { useStore } from "../../lib/store";
import { useEffect, useState } from "react";

const OtherMessage = ({ message }: { message: Message }) => {
  const [avatarUrls] = useStore((state) => [state.avatarUrls]);

  const [avatarUrl, setAvatarUrl] = useState(undefined);

  const sentAt = new Date(message.sentAt).toLocaleString([], {
    weekday: "short",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  useEffect(() => {
    setAvatarUrl(
      avatarUrls.find((elem) => elem.userId === message.user.id).avatarUrl,
    );
  }, [avatarUrls]);

  return (
    <View>
      <YStack space="$1">
        <Text style={{ maxWidth: "70%", marginLeft: 42 }}>
          @{message.user.username}
        </Text>

        <YStack space="$0">
          <XStack style={{ maxWidth: "70%" }} space="$2">
            <Avatar circular size="$3">
              <Avatar.Image
                accessibilityLabel={message.user.username}
                src={avatarUrl}
              />
              <Avatar.Fallback
                backgroundColor="#08348c"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="#ffffff">
                  {message.user.username.substring(0, 2).toUpperCase()}
                </Text>
              </Avatar.Fallback>
            </Avatar>

            <View backgroundColor="#20d18a" padding="$3" borderRadius={20}>
              <Text>{message.content}</Text>
            </View>
          </XStack>

          <SizableText
            size="$2"
            marginLeft={45}
            justifyContent="flex-end"
            color="gray"
          >
            {sentAt}
          </SizableText>
        </YStack>
      </YStack>
    </View>
  );
};

export default OtherMessage;
