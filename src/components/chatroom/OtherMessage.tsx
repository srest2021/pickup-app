import {
  Paragraph,
  Text,
  View,
  XStack,
  YStack,
  Image,
  Avatar,
  Row,
  Column,
} from "tamagui";
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
        <XStack style={{ maxWidth: "80%" }}>
          <Text>@{message.user.username}</Text>
        </XStack>

        <XStack style={{ maxWidth: "80%" }}>
          <Avatar circular size="$3">
            <Avatar.Image
              accessibilityLabel={message.user.username}
              src={avatarUrl}
            />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>

          <Text>{message.content}</Text>
        </XStack>
      </YStack>
    </View>
  );
};

export default OtherMessage;
