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
import useMutationGame from "../../hooks/use-mutation-game";
import SportSkill from "../SportSkill";
import MyGamePlayers from "./MyGamePlayers";
import { Lock, MessageCircle, Unlock } from "@tamagui/lucide-icons";
import { capitalizeFirstLetter } from "../../lib/types";
import { useEffect, useState } from "react";
import useQueryGames from "../../hooks/use-query-games";

const MyGameView = ({ navigation, route }: { navigation: any; route: any }) => {
  const { gameId } = route.params;

  const [
    session,
    user,
    loading,
    setRoomCode,
    selectedMyGame,
    clearSelectedMyGame,
  ] = useStore((state) => [
    state.session,
    state.user,
    state.loading,
    state.setRoomCode,
    state.selectedMyGame,
    state.clearSelectedMyGame,
  ]);

  const [deleteClicked, setDeleteClicked] = useState(false);

  const { removeMyGameById } = useMutationGame();
  const { fetchGameAddress, fetchGameAcceptedPlayers, fetchGameJoinRequests } =
    useQueryGames();

  let sportNameCapitalized = "";
  if (selectedMyGame) {
    sportNameCapitalized = capitalizeFirstLetter(selectedMyGame.sport.name);
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchGameAddress(gameId, "my");
      await fetchGameAcceptedPlayers(gameId, "my");
      await fetchGameJoinRequests(gameId);
    };
    fetchData();

    return () => {
      clearSelectedMyGame();
    };
  }, []);

  const deleteGame = async () => {
    setDeleteClicked(true);
    const removedId = await removeMyGameById(gameId);
    setDeleteClicked(false);
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
            <ScrollView
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
            >
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
                    {selectedMyGame.isPublic ? (
                      <XStack flex={1} space="$2">
                        <Unlock />
                        <SizableText flex={1} size="$5">
                          Public
                        </SizableText>
                      </XStack>
                    ) : (
                      <XStack flex={1} space="$2">
                        <Lock />
                        <SizableText flex={1} size="$5">
                          Friends-Only
                        </SizableText>
                      </XStack>
                    )}
                  </XStack>

                  <XStack space="$2" alignItems="left">
                    <Label size="$5" width={90}>
                      <H6>Address:</H6>
                    </Label>
                    <SizableText flex={1} size="$5">
                      {selectedMyGame.address
                        ? `${selectedMyGame.address.street}, ${selectedMyGame.address.city}, ${selectedMyGame.address.state} ${selectedMyGame.address.zip}`
                        : "Loading..."}
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
                    <SportSkill sport={selectedMyGame.sport} />
                  </XStack>
                </YStack>

                <MyGamePlayers navigation={navigation} />

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
                    Edit
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
                    {deleteClicked ? "Loading..." : "Delete"}
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

export default MyGameView;
