import {
  YStack,
  Card,
  Paragraph,
  H4,
  H5,
  SizableText,
  XStack,
  Label,
  Text,
  Button,
  ScrollView,
  H6,
  Circle,
} from "tamagui";
import { useStore } from "../../lib/store";
import { View } from "react-native";
import { Game } from "../../lib/types";
import useMutationGame from "../../hooks/use-mutation-game";
import GameSkillView from "./GameSkillView";
import useQueryGames from "../../hooks/use-query-games";
import { useEffect, useState } from "react";

const MyGameView = ({ navigation, route }: { navigation: any; route: any }) => {
  const { gameId } = route.params;
  console.log("GOING TO GAME VIEW");

  const { fetchGameById } = useQueryGames();
  const [myGames] = useStore((state) => [state.myGames]);
  const [myGame, setMyGame] = useState<Game | null>(null);

  const getMyGame = async (gameId: string) => {
    const myGame = await fetchGameById(gameId);
    if (!myGame) {
      navigation.goBack();
    } else {
      setMyGame(myGame);
    }
  };

  useEffect(() => {
    console.log("FETCHING GAME");
    getMyGame(gameId);
  }, [myGames]);

  const [session, user] = useStore((state) => [state.session, state.user]);
  const { removeGameById } = useMutationGame();

  function deleteGame() {
    removeGameById(gameId);
    // navigate back to myGames list.
    navigation.goBack();
    // TODO: Add success toast
  }

  return (
    <View>
      {session && session.user && user ? (
        myGame ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="p-12">
              <YStack>
                <YStack alignItems="center">
                  <H4 textAlign="center">{myGame.title}</H4>
                </YStack>

                <YStack paddingTop="$3" alignItems="center">
                  <H5>
                    {new Date(myGame.datetime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "short",
                      // hour: "2-digit",
                      // minute: "2-digit",
                    })}
                  </H5>
                  <H5>
                    at{" "}
                    {new Date(myGame.datetime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </H5>
                </YStack>

                <YStack alignItems="center">
                  <SizableText alignItems="center" padding="$5" size="$4">
                    by @{user.username}
                  </SizableText>
                </YStack>

                {myGame.description && (
                  <YStack paddingTop="$3" paddingBottom="$7">
                    <Card elevate size="$5">
                      <View marginLeft={25} marginRight={25}>
                        <SizableText
                          size="$5"
                          fontWeight="500"
                          paddingTop="$3"
                          paddingBottom="$3"
                        >
                          {myGame.description}
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
                      {myGame.address}
                    </SizableText>
                  </XStack>

                  <XStack space="$2" alignItems="center">
                    <Label size="$5" width={90}>
                      <H6>Sport:</H6>
                    </Label>
                    <SizableText flex={1} size="$5">
                      {myGame.sport.name}
                    </SizableText>
                  </XStack>

                  <XStack space="$2" alignItems="center">
                    <Label size="$5" width={90}>
                      <H6>Skill:</H6>
                    </Label>
                    <GameSkillView sport={myGame.sport} />
                  </XStack>
                </YStack>

                <XStack space="$3" paddingTop="$6">
                  <Button
                    theme="active"
                    flex={1}
                    onPress={() => navigation.navigate("EditGame", { myGame })}
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
          <View className="p-12 text-center items-center flex-1 justify-center">
            <H4>Loading...</H4>
          </View>
        )
      ) : (
        <View className="p-12 text-center items-center flex-1 justify-center">
          <H4>Log in to view and edit this game!</H4>
        </View>
      )}
    </View>
  );
};

export default MyGameView;
