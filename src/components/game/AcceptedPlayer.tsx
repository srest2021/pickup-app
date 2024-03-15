import { XStack, Button } from "tamagui";
import { Alert, View } from "react-native";
import { Tabs, Text } from "tamagui";
import { X, Loader } from "@tamagui/lucide-icons";
import { User } from "../../lib/types";
import useMutationGame from "../../hooks/use-mutation-game";
import { useStore } from "../../lib/store";

const AcceptedPlayer = ({ user, gameId, isOrganizer }: { user: User; gameId: string, isOrganizer: boolean }) => {
  const [loading] = useStore((state) => [state.loading]);

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
        {isOrganizer && (
          <Button
          icon={loading ? Loader : X}
          disabled={loading}
          style={{ backgroundColor: "red", color: "white" }}
          onPress={() => handleRemove()}
          />
        )}
      </XStack>
    </View>
  );
};

export default AcceptedPlayer;
