import { YStack, ScrollView, H4, Spinner, Separator } from "tamagui";
import { Alert, View } from "react-native";
import useQueryGames from "../../hooks/use-query-games";
import { Tabs, Text } from "tamagui";
import GameThumbnail from "./GameThumbnail";
import { useStore } from "../../lib/store";
import { useEffect, useState } from "react";

const MyGames = ({ navigation }: { navigation: any }) => {
  const [session, myGames, clearMyGames] = useStore((state) => [
    state.session,
    state.myGames,
    state.clearMyGames,
  ]);
  const { fetchMyGames, fetchAllGames } = useQueryGames();
  const [refreshing, setRefreshing] = useState(false);
  const [myGamesToggle, setMyGamesToggle] = useState("myGames");

  const [selectedMyGame] = useStore((state) => [state.selectedMyGame]);

  useEffect(() => {
    //console.log("the store in my games list: ",myGames)
    handleRefresh();
  }, [myGamesToggle, selectedMyGame]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (myGamesToggle === "myGames") {
      try {
        //console.log("FETCHING GAMES")
        await fetchMyGames();
      } catch (error) {
        Alert.alert("Error fetching games! Please try again later.");
        clearMyGames();
      }
    } else if (myGamesToggle === "joinedGames") {
      try {
        await fetchAllGames();
        // temporary for right now until we do query for joined games.
      } catch (error) {
        Alert.alert("Error fetching games! Please try again later.");
        clearMyGames();
      }
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
            {refreshing && <Spinner size="small" color="#ff7403" testID="spinner" />}
            {myGames.length > 0 ? (
              <YStack space="$5" paddingTop={5} paddingBottom="$5">
                {myGames.map((myGame) => (
                  <GameThumbnail
                    navigation={navigation}
                    game={myGame}
                    key={myGame.id}
                  />
                ))}
              </YStack>
            ) : (
              <View className="p-12 text-center items-center flex-1 justify-center">
                <H4>No games yet</H4>
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
        <View className="p-12 text-center items-center flex-1 justify-center">
          <H4>Loading...</H4>
        </View>
      )}
    </>
  );
};

export default MyGames;
