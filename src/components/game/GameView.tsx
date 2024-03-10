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
import SportSkill from "../SportSkill";

const GameView = ({ navigation, route }: { navigation: any; route: any }) => {
  const { gameId } = route.params;

  const [selectedFeedGame] = useStore((state) => [state.selectedFeedGame]);
  const [session, user] = useStore((state) => [state.session, state.user]);

  // Request to Join Game Logic TODO:
  function requestToJoinGame() {}

  return (
    <View>
      {session && session.user && user ? (
        selectedFeedGame ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="p-12">
              <YStack>
                <YStack alignItems="center">
                  <H4 textAlign="center">{selectedFeedGame.title}</H4>
                </YStack>

                <YStack paddingTop="$3" alignItems="center">
                  <H5>
                    {new Date(selectedFeedGame.datetime).toLocaleDateString(
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
                    {new Date(selectedFeedGame.datetime).toLocaleTimeString(
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
                    by @{selectedFeedGame.organizerId}
                  </SizableText>
                </YStack>

                {selectedFeedGame.description && (
                  <YStack paddingTop="$3" paddingBottom="$7">
                    <Card elevate size="$5">
                      <View marginLeft={25} marginRight={25}>
                        <SizableText
                          size="$5"
                          fontWeight="500"
                          paddingTop="$3"
                          paddingBottom="$3"
                        >
                          {selectedFeedGame.description}
                        </SizableText>
                      </View>
                    </Card>
                  </YStack>
                )}

                <YStack space="$4">
                  <XStack space="$2" alignItems="left">
                    <Label size="$5" width={90}>
                      <H6>Distance Away:</H6>
                    </Label>
                    <SizableText flex={1} size="$5">
                      {`${selectedFeedGame.distanceAway}`}
                    </SizableText>
                  </XStack>

                  <XStack space="$2" alignItems="center">
                    <Label size="$5" width={90}>
                      <H6>Sport:</H6>
                    </Label>
                    <SizableText flex={1} size="$5">
                      {selectedFeedGame.sport.name}
                    </SizableText>
                  </XStack>

                  <XStack space="$2" alignItems="center">
                    <Label size="$5" width={90}>
                      <H6>Skill:</H6>
                    </Label>
                    <SportSkill sport={selectedFeedGame.sport} />
                  </XStack>
                </YStack>

                <XStack space="$3" paddingTop="$6">
                  <Button
                    theme="active"
                    flex={1}
                    onPress={() => requestToJoinGame()}
                  >
                    Request to Join
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
          <H4>Log in to view this game!</H4>
        </View>
      )}
    </View>
  );
};

export default GameView;
