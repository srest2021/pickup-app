import { YStack, ScrollView, H4, Spinner, Separator } from "tamagui";
import { Alert, Button, View } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import { Tabs, Text } from "tamagui";
import GameThumbnail from "./game/GameThumbnail";
import { useStore } from "../lib/store";
import { useEffect, useState } from "react";

const MyGames = ({ navigation }: { navigation: any }) => {
  const [session, myGames, joinedGames] = useStore((state) => [
    state.session,
    state.myGames,
    state.joinedGames,
  ]);
  const { fetchMyGames, fetchJoinedGames } = useQueryGames();
  const [refreshing, setRefreshing] = useState(false);
  const [myGamesToggle, setMyGamesToggle] = useState("myGames");

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMyGames();
    await fetchJoinedGames();
    setRefreshing(false);
  };

  return (
    <>
      {session && session.user ? (
        <View style={{ flex: 1 }}>
          <Tabs
            alignSelf="center"
            justifyContent="center"
            flex={0}
            defaultValue="MyGames"
          >
            <Tabs.List>
              <Tabs.Tab
                width={200}
                testID="my-games"
                value="MyGames"
                onInteraction={() => {
                  setMyGamesToggle("myGames");
                }}
              >
                <Text>My Games</Text>
              </Tabs.Tab>
              <Separator vertical></Separator>
              <Tabs.Tab
                width={200}
                testID="joined-games"
                value="JoinedGames"
                onInteraction={() => {
                  setMyGamesToggle("joinedGames");
                }}
              >
                <Text>Joined Games</Text>
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
          <ScrollView
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onScroll={(e) => {
              const { contentOffset } = e.nativeEvent;
              if (contentOffset.y < -50 && !refreshing) {
                handleRefresh();
              }
            }}
            contentContainerStyle={{ paddingTop: 20 }}
          >
            {refreshing && (
              <Spinner size="small" color="#ff7403" testID="spinner" />
            )}

            {(myGamesToggle === "myGames" && myGames.length > 0) ||
            (myGamesToggle === "joinedGames" && joinedGames.length > 0) ? (
              myGamesToggle === "myGames" ? (
                <YStack space="$5" paddingTop={5} paddingBottom="$5">
                  {myGames.map((myGame) => (
                    <GameThumbnail
                      navigation={navigation}
                      game={myGame}
                      gametype="my"
                      key={myGame.id}
                    />
                  ))}
                </YStack>
              ) : (
                <YStack space="$5" paddingTop={5} paddingBottom="$5">
                  {joinedGames.map((joinedGame) => (
                    <GameThumbnail
                      navigation={navigation}
                      game={joinedGame}
                      gametype="joined"
                      key={joinedGame.id}
                    />
                  ))}
                </YStack>
              )
            ) : refreshing ? (
              myGamesToggle === "myGames" ? (
                <View className="items-center justify-center flex-1 p-12 text-center">
                  <H4>Fetching published games...</H4>
                </View>
              ) : (
                <View className="items-center justify-center flex-1 p-12 text-center">
                  <H4>Fetching joined games...</H4>
                </View>
              )
            ) : (
              <View className="items-center justify-center flex-1 p-12 text-center">
                <H4>
                  No {myGamesToggle === "myGames" ? "published" : "joined"}{" "}
                  games.
                </H4>
                <Button title="Click to Refresh" onPress={handleRefresh} />
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
        <View className="items-center justify-center flex-1 p-12 text-center">
          <H4>Loading...</H4>
        </View>
      )}
    </>
  );
};

export default MyGames;
