import { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import { H4, ScrollView, Separator, Spinner, Tabs, YStack } from "tamagui";
import GameThumbnail from "./game/GameThumbnail";
import { useStore } from "../lib/store";
import FeedFilter from "./FeedFilter";

//
// add event listener so that page is constantly updating!
// add switch so that you can go between myGame and AllGames
// PICK A MINWIDTH SO THAT text always shown
const Feed = ({ navigation }: { navigation: any }) => {
  const { fetchFeedGames } = useQueryGames();
  const [session, feedGames, feedGamesFriendsOnly] = useStore((state) => [
    state.session,
    state.feedGames,
    state.feedGamesFriendsOnly,
  ]);
  const [refreshing, setRefreshing] = useState(false);
  const [hasLocation, setHasLocation] = useState(true);
  const [toggle, setToggle] = useState("publicGames");
  const [feedOffset, setFeedOffset] = useState(feedGames.length);
  const [friendsOnlyOffset, setFriendsOnlyOffset] = useState(feedGamesFriendsOnly.length);
  const [allGamesFetched, setAllGamesFetched] = useState(false);

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setAllGamesFetched(false);
    if (toggle === "publicGames") {
      let games = feedGames;
      games = await fetchFeedGames(false);
      setFeedOffset(games.length);
      if (!games) {
        setHasLocation(false);
      } else {
        setHasLocation(true);
      }
    } else if (toggle === "friendsOnlyGames") {
      //await fetchFriendsOnlyGames();
      let games = feedGamesFriendsOnly;
      games = await fetchFeedGames(true);
      setFriendsOnlyOffset(games.length);
      if (!games) {
        setHasLocation(false);
      } else {
        setHasLocation(true);
      }
    }
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (!refreshing && !allGamesFetched) {
      let games;
      if (toggle === "publicGames") {
        games = await fetchFeedGames(false, feedOffset);
        setFeedOffset(feedOffset + games.length);
        if (!games || games.length === 0) {
          setAllGamesFetched(true);
        } 
      } else if (toggle === "friendsOnlyGames") {
        games = await fetchFeedGames(true, friendsOnlyOffset);
        setFriendsOnlyOffset(friendsOnlyOffset + games.length);
        if (!games || games.length === 0) {
          setAllGamesFetched(true);
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
                  //width={150}
                  testID="public-games"
                  value="PublicGames"
                  onInteraction={() => {
                    setToggle("publicGames");
                    handleRefresh();
                  }}
                >
                  <Text>All Games</Text>
                </Tabs.Tab>
                <Separator vertical></Separator>
                <Tabs.Tab
                  //width={150}
                  testID="friends-only-games"
                  value="FriendsOnlyGames"
                  onInteraction={() => {
                    setToggle("friendsOnlyGames");
                    handleRefresh();
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
            
            <FlatList
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
            />
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
