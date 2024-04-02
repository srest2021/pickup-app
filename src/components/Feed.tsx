import { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import { H4, ScrollView, Separator, Spinner, Tabs, YStack } from "tamagui";
import GameThumbnail from "./game/GameThumbnail";
import { useStore } from "../lib/store";
import FeedFilter from "./FeedFilter";

const Feed = ({ navigation }: { navigation: any }) => {
  const { fetchFeedGames } = useQueryGames();

  const [session, publicGames, clearPublicGames, friendsOnlyGames, clearFriendsOnlyGames] = useStore((state) => [
    state.session,
    state.feedGames,
    state.clearFeedGames,
    state.feedGamesFriendsOnly,
    state.clearFeedGamesFriendsOnly
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [hasLocation, setHasLocation] = useState(true);
  const [toggle, setToggle] = useState("publicGames");

  const [publicOffset, setPublicOffset] = useState(publicGames.length);
  const [friendsOnlyOffset, setFriendsOnlyOffset] = useState(friendsOnlyGames.length);
  const [allPublicGamesFetched, setAllPublicGamesFetched] = useState(false);
  const [allFriendsOnlyGamesFetched, setAllFriendsOnlyGamesFetched] = useState(false);

  useEffect(() => {
    const getAllGames = async () => {
      setRefreshing(true);
      await handlePublicGamesRefresh();
      await handleFriendsOnlyGamesRefresh();
      setRefreshing(false);
    }
    getAllGames();
  }, []);

  const handlePublicGamesRefresh = async () => {
    console.log("call handlePublicGamesRefresh")
    clearPublicGames();
    setAllPublicGamesFetched(false);
    setPublicOffset(0);
    const games = await fetchFeedGames(false, publicOffset);
    if (games) {
      setPublicOffset(games.length);
      setHasLocation(true);
    } else {
      setHasLocation(false);
    }
  }
   
  const handleFriendsOnlyGamesRefresh = async () => {
    console.log("call handleFriendsOnlyGamesRefresh")
    clearFriendsOnlyGames();
    setAllFriendsOnlyGamesFetched(false);
    setFriendsOnlyOffset(0);
    const games = await fetchFeedGames(true, friendsOnlyOffset);
    if (games) {
      setFriendsOnlyOffset(games.length);
      setHasLocation(true)
    } else {
      setHasLocation(false);
    }
  }

  const handleRefresh = async () => {
    console.log("call handleRefresh")
    setRefreshing(true);
    if (toggle === "publicGames") {
      await handlePublicGamesRefresh();
    } else if (toggle === "friendsOnlyGames") {
      await handleFriendsOnlyGamesRefresh();
    }
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (!refreshing && !allGamesFetched) {
      let games;
      if (toggle === "publicGames") {
        games = await fetchFeedGames(false, publicOffset);
        setPublicOffset(publicOffset + games.length);
        if (!games || games.length === 0) {
          setAllPublicGamesFetched(true);
        } 
      } else if (toggle === "friendsOnlyGames") {
        games = await fetchFeedGames(true, friendsOnlyOffset);
        setFriendsOnlyOffset(friendsOnlyOffset + games.length);
        if (!games || games.length === 0) {
          setAllFriendsOnlyGamesFetched(true);
        }
      }
    }
  };

  return (
    <>
      {session && session.user ? (
        hasLocation ? (
          <View style={{ flex: 1 }}>
            <Tabs
              alignSelf="center"
              justifyContent="space-between"
              flex={0}
              defaultValue="PublicGames"
            >
              <Tabs.List>
                <FeedFilter handleRefresh={handleRefresh} />
                <Tabs.Tab
                  testID="public-games"
                  value="PublicGames"
                  onInteraction={() => {
                    setToggle("publicGames");
                  }}
                >
                  <Text>All Games</Text>
                </Tabs.Tab>
                <Separator vertical></Separator>
                <Tabs.Tab
                  testID="friends-only-games"
                  value="FriendsOnlyGames"
                  onInteraction={() => {
                    setToggle("friendsOnlyGames");
                  }}
                >
                  <Text>Friends-Only Games</Text>
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
            { /*<ScrollView
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

              { toggle === "publicGames" ? (
                feedGames.length > 0 ? ( 
                  <YStack space="$5" paddingTop={5} paddingBottom="$5">
                    {feedGames.map((game) => (
                      <GameThumbnail
                        navigation={navigation}
                        game={game}
                        gametype="feed"
                        key={game.id}
                      />
                    ))}
                  </YStack>
                ) : (
                  <View className="items-center justify-center flex-1 p-12 text-center">
                    <H4>No games nearby</H4>
                  </View>
                )
                ) : (
                  feedGamesFriendsOnly.length > 0 ? (
                    <YStack space="$5" paddingTop={5} paddingBottom="$5">
                    {feedGamesFriendsOnly.map((game) => (
                      <GameThumbnail
                        navigation={navigation}
                        game={game}
                        gametype="feed"
                        key={game.id}
                      />
                    ))}
                  </YStack>
                  ) : (
                <View className="items-center justify-center flex-1 p-12 text-center">
                  <H4>No friends-only games yet</H4>
                </View>
                  )
                )}
            </ScrollView>
                  */}
            
            {/* <FlatList
              data={toggle === "publicGames" ? feedGames : feedGamesFriendsOnly}
              renderItem={({ item }) => (
                <GameThumbnail
                  navigation={navigation}
                  game={item}
                  gametype="feed"
                  key={item.id}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={["#ff7403"]}
                  tintColor="#ff7403"
                  title="Pull to Refresh"
                  titleColor="#ff7403"
                />
              }
              ListFooterComponent={() =>
                refreshing && <Spinner size="small" color="#ff7403" testID="spinner" />
              }
              contentContainerStyle={{ paddingVertical: 20 }}
            /> */}
          </View>
        ) : (
          <View className="items-center justify-center flex-1 p-12 text-center">
            <H4>Allow location permissions to view games near you!</H4>
          </View>
        )
      ) : (
        <View className="items-center justify-center flex-1 p-12 text-center">
          <H4>Loading...</H4>
        </View>
      )}
    </>
  );
};

export default Feed;
