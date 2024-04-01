import { useEffect, useState } from "react";
import { View, Text } from "react-native";
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

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (toggle === "publicGames") {
      let games = feedGames;
      games = await fetchFeedGames(false);
      if (!games) {
        setHasLocation(false);
      } else {
        setHasLocation(true);
      }
    } else if (toggle === "friendsOnlyGames") {
      //await fetchFriendsOnlyGames();
      let games = feedGamesFriendsOnly;
      games = await fetchFeedGames(true);
      if (!games) {
        setHasLocation(false);
      } else {
        setHasLocation(true);
      }
    }
    setRefreshing(false);
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
