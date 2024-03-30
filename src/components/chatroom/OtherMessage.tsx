import { Paragraph, Text, View, XStack, YStack } from "tamagui";
import { useStore } from "../../lib/store";
import { Message } from "../../lib/types";

const OtherMessage = ({ message }: { message: Message }) => {
  return (
    <View>
      <YStack>
        <XStack space="$2" alignItems="center">
          {/* {avatarUrl && (
                    <Image
                      source={{ uri: avatarUrl, width: 35, height: 35 }}
                      style={{ width: 35, height: 35, borderRadius: 17.5 }}
                      accessibilityLabel="Avatar"
                    />
          )} */}
          <Paragraph>@{message.user.username}</Paragraph>
        </XStack>
        <Text>{message.content}</Text>
      </YStack>
    </View>
  );
};

export default OtherMessage;
