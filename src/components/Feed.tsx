import { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import { H4, ScrollView, Separator, Spinner, Tabs, YStack } from "tamagui";
import GameThumbnail from "./game/GameThumbnail";
import { useStore } from "../lib/store";
import FeedFilter from "./FeedFilter";

const Feed = ({ navigation }: { navigation: any }) => {
  const { fetchFeedGames } = useQueryGames();

  const [
    session,
    publicGames,
    clearPublicGames,
    friendsOnlyGames,
    clearFriendsOnlyGames,
  ] = useStore((state) => [
    state.session,
    state.feedGames,
    state.clearFeedGames,
    state.feedGamesFriendsOnly,
    state.clearFeedGamesFriendsOnly,
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [hasLocation, setHasLocation] = useState(true);
  const [toggle, setToggle] = useState("publicGames");

  const [publicOffset, setPublicOffset] = useState(publicGames.length);
  const [friendsOnlyOffset, setFriendsOnlyOffset] = useState(
    friendsOnlyGames.length,
  );
  const [allPublicGamesFetched, setAllPublicGamesFetched] = useState(false);
  const [allFriendsOnlyGamesFetched, setAllFriendsOnlyGamesFetched] =
    useState(false);

  
  // on component render, clear state and get all games
  useEffect(() => {
    const getAllGames = async () => {
      setRefreshing(true);
      await handlePublicGamesRefresh();
      await handleFriendsOnlyGamesRefresh();
      setRefreshing(false);
    };
    getAllGames();
  }, []);

  // clear public games state and get public games
  const handlePublicGamesRefresh = async () => {
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
  };

  // clear friends-only games state and get friends-only games
  const handleFriendsOnlyGamesRefresh = async () => {
    clearFriendsOnlyGames();
    setAllFriendsOnlyGamesFetched(false);
    setFriendsOnlyOffset(0);
    const games = await fetchFeedGames(true, friendsOnlyOffset);
    if (games) {
      setFriendsOnlyOffset(games.length);
      setHasLocation(true);
    } else {
      setHasLocation(false);
    }
  };

  // on refresh, clear state and get games only for current toggle
  const handleRefresh = async () => {
    setRefreshing(true);
    if (toggle === "publicGames") {
      await handlePublicGamesRefresh();
    } else if (toggle === "friendsOnlyGames") {
      await handleFriendsOnlyGamesRefresh();
    }
    setRefreshing(false);
  };

  // once reach bottom, get more games using corresponding offset
  const handleLoadMore = async () => {
    let games;
    if (toggle === "publicGames") {
      if (!refreshing && !allPublicGamesFetched) {
        setRefreshing(true);
        games = await fetchFeedGames(false, publicOffset);
        setRefreshing(false);

        setPublicOffset(publicOffset + games.length);
        if (!games || games.length === 0) {
          setAllPublicGamesFetched(true);
        }
      }
    } else if (toggle === "friendsOnlyGames") {
      if (!refreshing && !allFriendsOnlyGamesFetched) {
        setRefreshing(true);
        games = await fetchFeedGames(true, friendsOnlyOffset);
        setRefreshing(false);

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

            <FlatList
              data={toggle === "publicGames" ? publicGames : friendsOnlyGames}
              renderItem={({ item }) => (
                <GameThumbnail
                  navigation={navigation}
                  game={item}
                  gametype="feed"
                  key={item.id}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={() => { handleLoadMore(); }}
              onEndReachedThreshold={0.05}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={["#ff7403"]}
                  tintColor="#ff7403"
                  titleColor="#ff7403"
                />
              }
              ListFooterComponent={() =>
                refreshing && (
                  <Spinner size="small" color="#ff7403" testID="spinner" />
                )
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
