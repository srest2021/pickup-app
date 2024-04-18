import { useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, Button } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import {
  H4,
  Separator,
  Spinner,
  Tabs,
  Text,
  View,
  Button as TamaguiButton,
} from "tamagui";
import GameThumbnail from "./game/GameThumbnail";
import { useStore } from "../lib/store";
import FeedFilter from "./FeedFilter";
import { ChevronsUp } from "@tamagui/lucide-icons";

const Feed = ({ navigation }: { navigation: any }) => {
  const { fetchFeedGames } = useQueryGames();

  const [session, publicGames, friendsOnlyGames] = useStore((state) => [
    state.session,
    state.feedGames,
    state.feedGamesFriendsOnly,
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

  // for scroll to top
  const flatListRef = useRef();
  const scrollToTop = async () => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

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
    setAllPublicGamesFetched(false);
    setPublicOffset(0);
    const games = await fetchFeedGames(false, 0);
    if (games) {
      setPublicOffset(games.length);
      setHasLocation(true);
    } else {
      setHasLocation(false);
    }
  };

  // clear friends-only games state and get friends-only games
  const handleFriendsOnlyGamesRefresh = async () => {
    setAllFriendsOnlyGamesFetched(false);
    setFriendsOnlyOffset(0);
    const games = await fetchFeedGames(true, 0);
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
              paddingBottom="$3"
              defaultValue="PublicGames"
            >
              <Tabs.List paddingTop="$2">
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
            {(toggle === "publicGames" && publicGames.length > 0) ||
            (toggle === "friendsOnlyGames" && friendsOnlyGames.length > 0) ? (
              <View style={{ flex: 1 }}>
                <FlatList
                  ref={flatListRef}
                  data={
                    toggle === "publicGames" ? publicGames : friendsOnlyGames
                  }
                  renderItem={({ item }) => (
                    <GameThumbnail
                      navigation={navigation}
                      game={item}
                      gametype="feed"
                      key={item.id}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  onEndReached={() => handleLoadMore()}
                  onEndReachedThreshold={0.05}
                  refreshControl={
                    <RefreshControl
                      size={10}
                      refreshing={refreshing}
                      onRefresh={handleRefresh}
                      colors={["#ff7403"]}
                      tintColor="#ff7403"
                      titleColor="#ff7403"
                    />
                  }
                  ListFooterComponent={() =>
                    refreshing && (
                      <Spinner size="large" color="#ff7403" testID="spinner" />
                    )
                  }
                  contentContainerStyle={{ gap: 23, paddingTop: 20 }}
                />
                <TamaguiButton
                  icon={ChevronsUp}
                  style={{
                    borderRadius: 50,
                    borderColor: "#08348c",
                    backgroundColor: "#08348c",
                    color: "#ffffff",
                    width: 45,
                  }}
                  variant="outlined"
                  theme="active"
                  size="$4"
                  position="absolute"
                  alignSelf="flex-end"
                  right="$7"
                  bottom="$7"
                  onPress={scrollToTop}
                />
              </View>
            ) : refreshing ? (
              toggle === "publicGames" ? (
                <View
                  padding="$7"
                  flex={1}
                  alignSelf="center"
                  justifyContent="center"
                >
                  <H4 textAlign="center">Loading public games...</H4>
                </View>
              ) : (
                <View
                  padding="$7"
                  flex={1}
                  alignSelf="center"
                  justifyContent="center"
                >
                  <H4 textAlign="center">Loading friends-only games...</H4>
                </View>
              )
            ) : (
              <View
                padding="$7"
                flex={1}
                alignSelf="center"
                justifyContent="center"
              >
                <H4 textAlign="center">No games nearby.</H4>
                <Button title="Click to Refresh" onPress={handleRefresh} />
              </View>
            )}
          </View>
        ) : (
          <View
            padding="$7"
            flex={1}
            alignSelf="center"
            justifyContent="center"
          >
            <H4 textAlign="center">
              Allow location permissions to view games near you!
            </H4>
          </View>
        )
      ) : (
        <View padding="$7" flex={1} alignSelf="center" justifyContent="center">
          <H4 textAlign="center">Loading...</H4>
        </View>
      )}
    </>
  );
};

export default Feed;
