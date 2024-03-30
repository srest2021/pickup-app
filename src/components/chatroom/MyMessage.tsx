import { Text, View, YStack } from "tamagui";
import { useStore } from "../../lib/store";
import { Message } from "../../lib/types";

const MyMessage = ({ message }: { message: Message }) => {
  return (
    <View>
      <YStack>
        <Text>@{message.user.username}</Text>
        <Text>{message.content}</Text>
      </YStack>
    </View>
  );
};

export default MyMessage;
