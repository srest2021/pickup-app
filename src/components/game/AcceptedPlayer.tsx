import { XStack, Button } from "tamagui";
import { Alert, TouchableOpacity, View } from "react-native";
import { Tabs, Text } from "tamagui";
import { X, Loader } from "@tamagui/lucide-icons";
import { PlusOneUser, ThumbnailUser } from "../../lib/types";
import useMutationGame from "../../hooks/use-mutation-game";
import { useStore } from "../../lib/store";

const AcceptedPlayer = ({
  user,
  gameId,
  isOrganizer,
  navigation,
}: {
  user: PlusOneUser;
  gameId: string;
  isOrganizer: boolean;
  navigation: any;
}) => {
  const [loading] = useStore((state) => [state.loading]);

  const { removePlayerById } = useMutationGame();

  const handleRemove = async () => {
    await removePlayerById(gameId, user.id);
  };

  return (
    <View>
      <XStack
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between"
      >
        {/*<Text fontSize="$5" ellipsizeMode="tail" textDecorationLine="underline"
        onPress={() => {
          navigation.navigate("OtherProfileView", { userId: user.id });
        }}>
          @{user.username}
      </Text> */}
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
        {isOrganizer && (
          <Button
            testID="remove-button"
            icon={loading ? Loader : X}
            disabled={loading}
            size="$2"
            style={{ backgroundColor: "#e90d52", color: "white" }}
            onPress={() => handleRemove()}
          />
        )}
      </XStack>
    </View>
  );
};

export default AcceptedPlayer;
