import {
  YStack,
  Card,
  H4,
  H5,
  SizableText,
  XStack,
  Label,
  Button,
  ScrollView,
  H6,
} from "tamagui";
import { useStore } from "../../lib/store";
import { View } from "react-native";
import useMutationGame from "../../hooks/use-mutation-game";
import SportSkill from "../SportSkill";

const MyGameView = ({ navigation, route }: { navigation: any; route: any }) => {
  const { gameId } = route.params;

  const [selectedMyGame] = useStore((state) => [state.selectedMyGame]);
  const [session, user] = useStore((state) => [state.session, state.user]);
  const { removeMyGameById } = useMutationGame();

  function deleteGame() {
    removeMyGameById(gameId);
    // navigate back to myGames list.
    navigation.goBack();
    // TODO: Add success toast
  }

  return (
    <View>
      {session && session.user && user ? (
        selectedMyGame ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="p-12">
              <YStack>
                <YStack alignItems="center">
                  <H4 textAlign="center">{selectedMyGame.title}</H4>
                </YStack>

                <YStack paddingTop="$3" alignItems="center">
                  <H5>
                    {new Date(selectedMyGame.datetime).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "short",
                      },
                    )}
                  </H5>
                  <H5>
                    at{" "}
                    {new Date(selectedMyGame.datetime).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </H5>
                </YStack>

                <YStack alignItems="center">
                  <SizableText alignItems="center" padding="$5" size="$4">
                    by @{user.username}
                  </SizableText>
                </YStack>

                {selectedMyGame.description && (
                  <YStack paddingTop="$3" paddingBottom="$7">
                    <Card elevate size="$5">
                      <View marginLeft={25} marginRight={25}>
                        <SizableText
                          size="$5"
                          fontWeight="500"
                          paddingTop="$3"
                          paddingBottom="$3"
                        >
                          {selectedMyGame.description}
                        </SizableText>
                      </View>
                    </Card>
                  </YStack>
                )}

                <YStack space="$4">
                  <XStack space="$2" alignItems="left">
                    <Label size="$5" width={90}>
                      <H6>Address:</H6>
                    </Label>
                    <SizableText flex={1} size="$5">
                      {`${selectedMyGame.address.street}, ${selectedMyGame.address.city}, ${selectedMyGame.address.state} ${selectedMyGame.address.zip}`}
                    </SizableText>
                  </XStack>

                  <XStack space="$2" alignItems="center">
                    <Label size="$5" width={90}>
                      <H6>Sport:</H6>
                    </Label>
                    <SizableText flex={1} size="$5">
                      {selectedMyGame.sport.name}
                    </SizableText>
                  </XStack>

                  <XStack space="$2" alignItems="center">
                    <Label size="$5" width={90}>
                      <H6>Skill:</H6>
                    </Label>
                    <SportSkill sport={selectedMyGame.sport} />
                  </XStack>
                </YStack>

                <XStack space="$3" paddingTop="$6">
                  <Button
                    theme="active"
                    flex={1}
                    onPress={() => {
                      navigation.navigate("EditGame", { gameId });
                    }}
                  >
                    Edit
                  </Button>
                  <Button theme="active" flex={1} onPress={() => deleteGame()}>
                    Delete
                  </Button>
                </XStack>
              </YStack>
            </View>
          </ScrollView>
        ) : (
          <View className="items-center justify-center flex-1 p-12 text-center">
            <H4>Loading...</H4>
          </View>
        )
      ) : (
        <View className="items-center justify-center flex-1 p-12 text-center">
          <H4>Log in to view and edit this game!</H4>
        </View>
      )}
    </View>
  );
};

export default MyGameView;
