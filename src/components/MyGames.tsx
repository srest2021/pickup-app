import { YStack, ScrollView, H4, Spinner, Separator } from "tamagui";
import { Alert, View } from "react-native";
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
  }, [myGamesToggle]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (myGamesToggle === "myGames") {
      await fetchMyGames(); // error handling happens inside
    } else if (myGamesToggle === "joinedGames") {
      await fetchJoinedGames(); // error handling happens inside
    }
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

            {myGamesToggle === "myGames" ? (
              myGames.length > 0 ? (
                <YStack space="$5" paddingTop={5} paddingBottom="$5">
                  {myGames.map((myGame) => (
                    <GameThumbnail
                      navigation={navigation}
                      game={myGame}
                      gametype='my'
                      key={myGame.id}
                    />
                  ))}
                </YStack>
              ) : (
                <View className="items-center justify-center flex-1 p-12 text-center">
                  <H4>No published games yet</H4>
                </View>
              )
            ) : joinedGames.length > 0 ? (
              <View className="items-center justify-center flex-1 p-12 text-center">
                <YStack space="$5" paddingTop={5} paddingBottom="$5">
                  {joinedGames.map((joinedGame)=>(
                    <GameThumbnail
                    navigation={navigation}
                    game={joinedGame}
                    gametype='joined'
                    key={joinedGame.id}
                    />
                  ))}
                </YStack>
              </View>
            ) : (
              <View className="items-center justify-center flex-1 p-12 text-center">
                <H4>No joined games yet</H4>
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
