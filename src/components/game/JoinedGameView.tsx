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
  Text,
} from "tamagui";
import { useStore } from "../../lib/store";
import SportSkill from "../SportSkill";
import useMutationGame from "../../hooks/use-mutation-game";
import GamePlayers from "./GamePlayers";
import { MessageCircle } from "@tamagui/lucide-icons";
import { TouchableOpacity } from "react-native";
import { capitalizeFirstLetter } from "../../lib/types";

const JoinedGameView = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { gameId, username, userId } = route.params;

  const [selectedJoinedGame] = useStore((state) => [state.selectedJoinedGame]);
  const [session, user, loading, setRoomCode] = useStore((state) => [
    state.session,
    state.user,
    state.loading,
    state.setRoomCode,
  ]);
  const { leaveJoinedGameById } = useMutationGame();

  let sportNameCapitalized = "";
  if (selectedJoinedGame) {
    sportNameCapitalized = capitalizeFirstLetter(selectedJoinedGame.sport.name);
  }

  // Leaving a Joined Game Logic:
  const leaveJoinedGame = async () => {
    const res = await leaveJoinedGameById(gameId, user!.id);
    //wait for call to complete, then navigate back to myGames
    if (res) navigation.goBack();
  };

  return (
    <View flex={1}>
      {session && session.user && user ? (
        selectedJoinedGame ? (
          <View padding="$7" flex={1}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
            >
              <YStack space="$3" flex={1}>
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
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("OtherProfileView", {
                          userId: userId,
                        });
                      }}
                    >
                      <Text fontSize="$5" ellipsizeMode="tail">
                        <Text style={{ textDecorationLine: "none" }}>@</Text>
                        <Text style={{ textDecorationLine: "underline" }}>
                          {username}
                        </Text>
                      </Text>
                    </TouchableOpacity>
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
                      {selectedJoinedGame.isPublic ? "Public" : "Friends-Only"}
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
                      {sportNameCapitalized}
                    </SizableText>
                  </XStack>

                  <XStack space="$2" alignItems="center">
                    <Label size="$5" width={90}>
                      <H6>Skill:</H6>
                    </Label>
                    <SportSkill sport={selectedJoinedGame.sport} />
                  </XStack>
                </YStack>

                <GamePlayers
                  navigation={navigation}
                  game={selectedJoinedGame}
                  gametype="joined"
                />

                <XStack paddingTop="$4">
                  <Button
                    variant="outlined"
                    size="$5"
                    color="#ff7403"
                    borderColor="#ff7403"
                    backgroundColor="#ffffff"
                    flex={1}
                    onPress={() => leaveJoinedGame()}
                  >
                    {loading ? "Loading..." : "Leave Game"}
                  </Button>
                </XStack>
              </YStack>
            </ScrollView>

            <Button
              icon={MessageCircle}
              style={{
                borderRadius: 50,
                borderColor: "#ff7403",
                backgroundColor: "#ff7403",
                color: "#ffffff",
                width: 55,
              }}
              variant="outlined"
              theme="active"
              size="$6"
              position="absolute"
              alignSelf="flex-end"
              right="$7"
              bottom="$7"
              onPress={() => {
                setRoomCode(gameId);
                navigation.navigate("Chatroom");
              }}
            />
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

export default JoinedGameView;
