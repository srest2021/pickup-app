import { Button, H4, Input, Text, XStack } from "tamagui";
import { useStore } from "../../lib/store";
import { View } from "react-native";
import useMutationMessages from "../../hooks/use-mutation-messages";
import { useState } from "react";
import { Loader, SendHorizontal } from "@tamagui/lucide-icons";

const MessageInput = () => {
  const [loading, roomCode] = useStore((state) => [
    state.loading,
    state.roomCode,
  ]);

  const [message, setMessage] = useState("");

  const { addChatroomMessage } = useMutationMessages();

  const sendMessage = async () => {
    const result = await addChatroomMessage(message);
    if (result) {
      setMessage("");
    }
  };

  return (
    <View>
      <H4>Message input</H4>
      <XStack>
        <Input
          size="$4"
          placeholder="Enter your message"
          value={message}
          onChangeText={(text: string) => setMessage(text)}
          autoCapitalize={"none"}
        />
        <Button
          icon={loading ? Loader : SendHorizontal}
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
