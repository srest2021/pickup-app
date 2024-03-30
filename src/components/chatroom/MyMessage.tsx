import { Text, View, YStack } from "tamagui";
import { Message } from "../../lib/types";

const MyMessage = ({ message }: { message: Message }) => {
  return (
    <View alignSelf="flex-end">
      <YStack style={{ maxWidth: "70%" }}>
        {/* <Text alignSelf="flex-end">@{message.user.username} FROM ME</Text> */}
        <Text alignSelf="flex-end" textAlign="right">
          {message.content}
        </Text>
      </YStack>
    </View>
  );
};

export default MyMessage;
