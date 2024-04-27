import { XStack, Button } from "tamagui";
import { Alert, TouchableOpacity, View } from "react-native";
import { Text } from "tamagui";
import { useStore } from "../../lib/store";
import { Check, X, Loader } from "@tamagui/lucide-icons";
import { PlusOneUser } from "../../lib/types";
import useMutationGame from "../../hooks/use-mutation-game";
import { useState } from "react";

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
  const [session] = useStore((state) => [state.session]);

  const [clicked, setClicked] = useState(false);

  const { acceptJoinRequestById, rejectJoinRequestById } = useMutationGame();

  const handleAccept = async () => {
    if (currentPlayers + 1 > maxPlayers) {
      Alert.alert("This game is already full!");
      return;
    }
    setClicked(true);
    await acceptJoinRequestById(gameId, user.id, user.hasPlusOne);
    setClicked(false);
  };

  const handleReject = async () => {
    setClicked(true);
    await rejectJoinRequestById(gameId, user.id);
    setClicked(false);
  };

  return (
    <View>
      <XStack
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
      >
        <TouchableOpacity
          disabled={session?.user.id === user.id}
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
            icon={clicked ? <Loader size="$1" /> : <X size="$1" />}
            width={30}
            size="$2"
            style={{ backgroundColor: "#e90d52", color: "white" }}
            onPress={() => handleReject()}
          />
          <Button
            testID="accept-button"
            icon={clicked ? <Loader size="$1" /> : <Check size="$1" />}
            width={30}
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
