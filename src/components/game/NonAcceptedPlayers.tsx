import { XStack, Button } from "tamagui";
import { Alert, View } from "react-native";
import { Text } from "tamagui";
import { useStore } from "../../lib/store";
import { Check, X, Loader } from "@tamagui/lucide-icons";
import { User } from "../../lib/types";
import useMutationGame from "../../hooks/use-mutation-game";

const NonAcceptedPlayer = ({
  user,
  gameId,
  maxPlayers,
  currentPlayers,
}: {
  user: User;
  gameId: string;
  currentPlayers: number;
  maxPlayers: number;
}) => {
  const [loading] = useStore((state) => [state.loading]);
  const { acceptJoinRequestById, rejectJoinRequestById } = useMutationGame();

  const handleAccept = async () => {
    if (currentPlayers + 1 > maxPlayers) {
      Alert.alert("This game is already full!");
      return;
    }
    await acceptJoinRequestById(gameId, user.id);
  };

  const handleReject = async () => {
    await rejectJoinRequestById(gameId, user.id);
  };

  return (
    <View margin={10}>
      <XStack alignItems="center">
        <Text fontSize={20} marginRight={30}>
          {user.username}
        </Text>
        <Button
          icon={loading ? Loader : X}
          disabled={loading}
          style={{ backgroundColor: "#e90d52", color: "white", marginRight: 10 }}
          onPress={() => handleReject()}
        />
        <Button
          icon={loading ? Loader : Check}
          disabled={loading}
          style={{ backgroundColor: "#05a579", color: "white" }}
          onPress={() => handleAccept()}
        />
      </XStack>
    </View>
  );
};

export default NonAcceptedPlayer;
