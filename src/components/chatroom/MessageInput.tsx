import { Button, H4, Input, Text, TextArea, XStack, View } from "tamagui";
import { useStore } from "../../lib/store";
import useMutationMessages from "../../hooks/use-mutation-messages";
import { useState } from "react";
import { Loader, SendHorizontal } from "@tamagui/lucide-icons";

const MessageInput = () => {
  const [loading] = useStore((state) => [state.loading]);
  const [message, setMessage] = useState("");
  const { addChatroomMessage } = useMutationMessages();

  const sendMessage = async () => {
    const result = await addChatroomMessage(message);
    if (result) {
      setMessage("");
    }
  };

  return (
    <View paddingTop="$3">
      <XStack alignItems="center" space="$3">
        <Input
          flex={1}
          maxHeight={57}
          multiline={true}
          size="$5"
          placeholder="Enter your message"
          value={message}
          onChangeText={(text: string) => setMessage(text)}
          autoCapitalize={"none"}
        />
        <Button
          size="$5"
          icon={loading ? Loader : SendHorizontal}
          disabled={loading}
          style={{
            borderColor: "#ff7403",
            backgroundColor: "#ff7403",
            color: "#ffffff",
          }}
          variant="outlined"
          theme="active"
          onPress={() => sendMessage()}
        />
      </XStack>
    </View>
  );
};

export default MessageInput;
