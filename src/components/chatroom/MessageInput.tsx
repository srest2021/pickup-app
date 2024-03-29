import { H4, Text } from "tamagui";
import { useStore } from "../../lib/store";
import { View } from "react-native";
import useMutationMessages from "../../hooks/use-mutation-messages";

const MessageInput = () => {
  const [loading, addMessage] = useStore((state) => [
    state.loading,
    state.addMessage,
  ]);

  const { addChatroomMessage } = useMutationMessages();

  return (
    <View>
      <H4>Message input</H4>
    </View>
  );
};

export default MessageInput;
