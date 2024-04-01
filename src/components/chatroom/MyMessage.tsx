import { SizableText, Text, View, YStack } from "tamagui";
import { Message } from "../../lib/types";

const MyMessage = ({ message }: { message: Message }) => {
  const sentAt = new Date(message.sentAt).toLocaleString([], {
    weekday: "short",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <View>
      <YStack space="$0">
        <YStack style={{ maxWidth: "70%" }} alignSelf="flex-end">
          <View backgroundColor="#81e3bc" padding="$3" borderRadius={20}>
            <Text alignSelf="flex-end" textAlign="right">
              {message.content}
            </Text>
          </View>
        </YStack>

        <SizableText size="$2" alignSelf="flex-end" color="gray">
          {sentAt}
        </SizableText>
      </YStack>
    </View>
  );
};

export default MyMessage;
