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
import useMutationGame from "../../hooks/use-mutation-game";
import SportSkill from "../SportSkill";
import MyGamePlayers from "./MyGamePlayers";
import { MessageCircle } from "@tamagui/lucide-icons";

const MyGameView = ({ navigation, route }: { navigation: any; route: any }) => {
  const { gameId } = route.params;

  const [selectedMyGame] = useStore((state) => [state.selectedMyGame]);
  const [session, user, loading, setRoomCode] = useStore((state) => [
    state.session,
    state.user,
    state.loading,
    state.setRoomCode,
  ]);
  const { removeMyGameById } = useMutationGame();

  const deleteGame = async () => {
    const removedId = await removeMyGameById(gameId);
    // navigate back to myGames list.
    if (removedId) {
      navigation.goBack();
    }
    // TODO: Add success toast
  };

  return (
    <View flex={1}>
      {session && session.user && user ? (
        selectedMyGame ? (
          <View padding="$7" flex={1}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack space="$3" flex={1}>
                <YStack space="$3">
                  <YStack alignItems="center">
                    <H4 textAlign="center">{selectedMyGame.title}</H4>
                  </YStack>

                  <YStack alignItems="center">
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
                    <SizableText alignItems="center" size="$4">
                      by @{user.username}
                    </SizableText>
                  </YStack>
                </YStack>

                {selectedMyGame.description && (
                  <YStack paddingTop="$3">
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

                <YStack space="$4" paddingVertical="$3">
                  <XStack space="$2" alignItems="center">
                    <Label size="$5" width={90}>
                      <H6>Status: </H6>
                    </Label>
                    <SizableText flex={1} size="$5">
                      {selectedMyGame.isPublic ? "public" : "friends-only"}
                    </SizableText>
                  </XStack>

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

                <MyGamePlayers navigation={undefined} />

                <XStack space="$3" paddingTop="$5">
                  <Button
                    variant="outlined"
                    size="$5"
                    color="#ff7403"
                    borderColor="#ff7403"
                    backgroundColor="#ffffff"
                    flex={1}
                    onPress={() => {
                      navigation.navigate("EditGame", { gameId });
                    }}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Edit"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="$5"
                    color="#ff7403"
                    borderColor="#ff7403"
                    backgroundColor="#ffffff"
                    flex={1}
                    onPress={() => deleteGame()}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Delete"}
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

export default MyGameView;
