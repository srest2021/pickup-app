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
import { Alert, View } from "react-native";
import SportSkill from "../SportSkill";
import useMutationGame from "../../hooks/use-mutation-game";
import GamePlayers from "./GamePlayers";

const GameView = ({ navigation, route }: { navigation: any; route: any }) => {
  const { gameId, displayName } = route.params;
  const [session, user, loading, selectedFeedGame] = useStore((state) => [
    state.session,
    state.user,
    state.loading,
    state.selectedFeedGame,
  ]);
  const { requestToJoinById } = useMutationGame();

  // Request to Join Game Logic:
  function requestToJoinGame() {
    if (
      selectedFeedGame &&
      selectedFeedGame?.currentPlayers >= selectedFeedGame?.maxPlayers
    ) {
      Alert.alert("This game is already full!");
    } else {
      requestToJoinById(gameId, user!.id);
      // Go back to feed once request is sent.
      navigation.goBack();
    }
  }

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
                    by @{displayName}
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
                  <XStack space="$2" alignItems="center">
                    <Label size="$5" width={90}>
                      <H6>Status: </H6>
                    </Label>
                    <SizableText flex={1} size="$5">
                      {selectedFeedGame.isPublic ? "public" : "friends-only"}
                    </SizableText>
                  </XStack>

                  <XStack space="$2" alignItems="left">
                    <Label size="$5" width={90}>
                      <H6>Distance Away:</H6>
                    </Label>
                    <SizableText flex={1} size="$5">
                      {`${selectedFeedGame.distanceAway} miles`}
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

                <GamePlayers
                  navigation={undefined}
                  game={selectedFeedGame}
                  gametype="feed"
                />

                <XStack space="$3" paddingTop="$6">
                  <Button
                    variant="outlined"
                    size="$5"
                    color="#ff7403"
                    borderColor="#ff7403"
                    backgroundColor="#ffffff"
                    disabled={selectedFeedGame.hasRequested ? true : false}
                    flex={1}
                    onPress={() => requestToJoinGame()}
                  >
                    {loading
                      ? "Requesting..."
                      : selectedFeedGame.hasRequested
                        ? "Requested"
                        : "Request to Join"}
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
