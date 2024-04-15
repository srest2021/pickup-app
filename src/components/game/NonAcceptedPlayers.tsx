import { XStack, Button } from "tamagui";
import { Alert, TouchableOpacity, View } from "react-native";
import { Text } from "tamagui";
import { useStore } from "../../lib/store";
import { Check, X, Loader } from "@tamagui/lucide-icons";
import { PlusOneUser, ThumbnailUser } from "../../lib/types";
import useMutationGame from "../../hooks/use-mutation-game";

const NonAcceptedPlayer = ({
  user,
  gameId,
  maxPlayers,
  currentPlayers,
  navigation,
}: {
  user: PlusOneUser;
  gameId: string;
  currentPlayers: number;
  maxPlayers: number;
  navigation: any;
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
    <View>
      <XStack
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("OtherProfileView", { userId: user.id });
          }}
        >
          <Text fontSize="$5" ellipsizeMode="tail">
            <Text style={{ textDecorationLine: "none" }}>@</Text>
            <Text style={{ textDecorationLine: "underline" }}>
              {user.username}
            </Text>
          </Text>
        </TouchableOpacity>
        { user.hasPlusOne ? <Text fontSize="$5" ellipsizeMode="tail"> + 1 </Text> : <Text></Text>}
        <XStack justifyContent="flex-end" space="$2">
          <Button
            testID="reject-button"
            icon={loading ? Loader : X}
            disabled={loading}
            size="$2"
            style={{ backgroundColor: "#e90d52", color: "white" }}
            onPress={() => handleReject()}
          />
          <Button
            testID="accept-button"
            icon={loading ? Loader : Check}
            disabled={loading}
            size="$2"
            style={{ backgroundColor: "#05a579", color: "white" }}
            onPress={() => handleAccept()}
          />
        </XStack>
      </XStack>
    </View>
  );
};

export default NonAcceptedPlayer;
