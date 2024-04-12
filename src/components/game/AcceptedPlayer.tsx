import { XStack, Button } from "tamagui";
import { Alert, View } from "react-native";
import { Tabs, Text } from "tamagui";
import { X, Loader } from "@tamagui/lucide-icons";
import { ThumbnailUser } from "../../lib/types";
import useMutationGame from "../../hooks/use-mutation-game";
import { useStore } from "../../lib/store";

const AcceptedPlayer = ({
  user,
  gameId,
  isOrganizer,
  navigation,
}: {
  user: ThumbnailUser;
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
        <Text fontSize="$5" ellipsizeMode="tail"
        onPress={() => {
          navigation.navigate("OtherProfileView", { userId: user.id });
        }}>
          @{user.username}
        </Text>
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
