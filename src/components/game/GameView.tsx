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
  View,
} from "tamagui";
import { useStore } from "../../lib/store";
import { Alert } from "react-native";
import SportSkill from "../SportSkill";
import useMutationGame from "../../hooks/use-mutation-game";
import GamePlayers from "./GamePlayers";

const GameView = ({ navigation, route }: { navigation: any; route: any }) => {
  const { gameId, username } = route.params;
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
    <View flex={1}>
      {session && session.user && user ? (
        selectedFeedGame ? (
          <View padding="$7" flex={1}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack space="$3" flex={1}>
                <YStack space="$3">
                  <YStack alignItems="center">
                    <H4 textAlign="center">{selectedFeedGame.title}</H4>
                  </YStack>

                  <YStack alignItems="center">
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
                    <SizableText
                     alignItems="center" size="$4"
                     onPress={() => {
                      navigation.navigate("OtherProfileView", { userId: user.id });
                    }}
                  >
                      by @{username}
                    </SizableText>
                  </YStack>
                </YStack>

                {selectedFeedGame.description && (
                  <YStack paddingTop="$3">
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

                <YStack space="$4" paddingVertical="$3">
                  <XStack space="$2" alignItems="center">
                    <Label size="$5" width={90}>
                      <H6>Status: </H6>
                    </Label>
                    <SizableText size="$5">
                      {selectedFeedGame.isPublic ? "public" : "friends-only"}
                    </SizableText>
                  </XStack>

                  <XStack space="$2" alignItems="center" flex={1} space="$5">
                    <Label size="$5">
                      <H6>Distance Away:</H6>
                    </Label>
                    <SizableText size="$5">
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

                <XStack paddingTop="$5">
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
                      ? "Loading..."
                      : selectedFeedGame.hasRequested
                        ? "Requested"
                        : "Request to Join"}
                  </Button>
                </XStack>
              </YStack>
            </ScrollView>
          </View>
        ) : (
          <View
            padding="$7"
            flex={1}
            alignSelf="center"
            justifyContent="center"
          >
            <H4 textAlign="center">Loading...</H4>
          </View>
        )
      ) : (
        <View padding="$7" flex={1} alignSelf="center" justifyContent="center">
          <H4 textAlign="center">Log in to view this game!</H4>
        </View>
      )}
    </View>
  );
};

export default GameView;
