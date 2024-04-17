import { XStack, Button } from "tamagui";
import { Alert, TouchableOpacity, View } from "react-native";
import { Text } from "tamagui";
import { useStore } from "../../lib/store";
import { Check, X, Loader } from "@tamagui/lucide-icons";
import { PlusOneUser } from "../../lib/types";
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
  const [session, loading] = useStore((state) => [
    state.session,
    state.loading,
  ]);
  const { acceptJoinRequestById, rejectJoinRequestById } = useMutationGame();

  const handleAccept = async () => {
    if (currentPlayers + 1 > maxPlayers) {
      Alert.alert("This game is already full!");
      return;
    }
    await acceptJoinRequestById(gameId, user.id, user.hasPlusOne);
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
            <Text>@</Text>
            {session?.user.id !== user.id ? (
              <Text style={{ textDecorationLine: "underline" }}>
                {user.username}
              </Text>
            ) : (
              <Text>{user.username}</Text>
            )}
          </Text>
        </TouchableOpacity>
        {user.hasPlusOne ? (
          <Text fontSize="$5" justifyContent="flex-start">
            {" "}
            + 1{" "}
          </Text>
        ) : (
          <Text></Text>
        )}
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
            disabled={session?.user.id === user.id}
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
