import { XStack, Button } from "tamagui";
import { Alert, View } from "react-native";
import { Tabs, Text } from "tamagui";
import { X } from "@tamagui/lucide-icons";
import { User } from "../../lib/types";
import useMutationGame from "../../hooks/use-mutation-game";

const AcceptedPlayer = ({ user, gameId }: { user: User; gameId: string }) => {
  const { removePlayerById } = useMutationGame();

  const handleRemove = async () => {
    await removePlayerById(gameId, user.id);
  };

  return (
    <View margin={10}>
      <XStack>
        <Text fontSize={20} marginRight={30}>
          {user.username}
        </Text>
        <Button
          icon={X}
          testID="remove-button"
          style={{ backgroundColor: "red", color: "white" }}
          onPress={() => handleRemove()}
        />
      </XStack>
    </View>
  );
};

export default AcceptedPlayer;
