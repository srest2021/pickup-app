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
import useMutationGame from "../../hooks/use-mutation-game";
import GamePlayers from "./GamePlayers";
import { MessageCircle } from "@tamagui/lucide-icons";

const JoinedGameView = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { gameId, username } = route.params;

  const [selectedJoinedGame] = useStore((state) => [state.selectedJoinedGame]);
  const [session, user, setRoomCode] = useStore((state) => [
    state.session,
    state.user,
    state.setRoomCode,
  ]);
  const { leaveJoinedGameById } = useMutationGame();

  // Leaving a Joined Game Logic:
  function leaveJoinedGame() {
    leaveJoinedGameById(gameId, user!.id);
    //navigate back to myGames
    navigation.goBack();
  }

  return (
    <View>
      {session && session.user && user ? (
        selectedJoinedGame ? (
          <View className="p-12">
            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack space="$3">
                <YStack space="$3">
                  <YStack alignItems="center">
                    <H4 textAlign="center">{selectedJoinedGame.title}</H4>
                  </YStack>

                  <YStack alignItems="center">
                    <H5>
                      {new Date(selectedJoinedGame.datetime).toLocaleDateString(
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
                      {new Date(selectedJoinedGame.datetime).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </H5>
                  </YStack>

                  <YStack alignItems="center">
                    <SizableText alignItems="center" size="$4">
                      by @{username}
                    </SizableText>
                  </YStack>
                </YStack>

                {selectedJoinedGame.description && (
                  <YStack paddingTop="$3">
                    <Card elevate size="$5">
                      <View marginLeft={25} marginRight={25}>
                        <SizableText
                          size="$5"
                          fontWeight="500"
                          paddingTop="$3"
                          paddingBottom="$3"
                        >
                          {selectedJoinedGame.description}
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
                    <SizableText flex={1} size="$5">
                      {selectedJoinedGame.isPublic ? "public" : "friends-only"}
                    </SizableText>
                  </XStack>

                  <XStack space="$2" alignItems="left">
                    <Label size="$5" width={90}>
                      <H6>Address:</H6>
                    </Label>
                    <SizableText flex={1} size="$5">
                      {`${selectedJoinedGame.address.street}, ${selectedJoinedGame.address.city}, ${selectedJoinedGame.address.state} ${selectedJoinedGame.address.zip}`}
                    </SizableText>
                  </XStack>

                  <XStack space="$2" alignItems="center">
                    <Label size="$5" width={90}>
                      <H6>Sport:</H6>
                    </Label>
                    <SizableText flex={1} size="$5">
                      {selectedJoinedGame.sport.name}
                    </SizableText>
                  </XStack>

                  <XStack space="$2" alignItems="center">
                    <Label size="$5" width={90}>
                      <H6>Skill:</H6>
                    </Label>
                    <SportSkill sport={selectedJoinedGame.sport} />
                  </XStack>
                </YStack>

                <YStack paddingBottom="$4">
                  <GamePlayers
                    navigation={undefined}
                    game={selectedJoinedGame}
                    gametype="joined"
                  />
                </YStack>

                <YStack>
                  <Button
                    variant="outlined"
                    size="$5"
                    color="#ff7403"
                    borderColor="#ff7403"
                    backgroundColor="#ffffff"
                    flex={1}
                    onPress={() => leaveJoinedGame()}
                  >
                    Leave Game
                  </Button>
                </YStack>
              </YStack>
            </ScrollView>
            <Button
              icon={MessageCircle}
              style={{
                borderRadius: 50,
                borderColor: "#ff7403",
                backgroundColor: "#ff7403",
                color: "#ffffff",
              }}
              variant="outlined"
              theme="active"
              size="$5"
              position="absolute"
              alignSelf="flex-end"
              right="$7"
              top="$7"
              onPress={() => {
                setRoomCode(gameId);
                navigation.navigate("Chatroom");
              }}
            />
          </View>
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

export default JoinedGameView;
