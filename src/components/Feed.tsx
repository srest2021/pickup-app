import { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import FeedGameView from "./game/GameThumbnail";
import {
  H4,
  ScrollView,
  Separator,
  SizableText,
  Spinner,
  Tabs,
  YStack,
} from "tamagui";
import { supabase } from "../lib/supabase";
import GameThumbnail from "./game/GameThumbnail";
import { useStore } from "../lib/store";
import useQueryUsers from "../hooks/use-query-users";
import FeedFilter from "./FeedFilter";

//
// add event listener so that page is constantly updating!
// add switch so that you can go between myGame and AllGames
// PICK A MINWIDTH SO THAT text always shown
const Feed = ({ navigation }: { navigation: any }) => {
  const { fetchFeedGames } = useQueryGames();
  const [session, feedGames] = useStore((state) => [
    state.session,
    state.feedGames,
  ]);
  const { setUserLocation } = useQueryUsers();
  const [refreshing, setRefreshing] = useState(false);
  const [toggle, setToggle] = useState("publicGames");

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (toggle === "publicGames") {
      try {
        setUserLocation();
        await fetchFeedGames();
      } catch (error) {
        Alert.alert("Error fetching games! Please try again later.");
      }
    } else if (toggle === "friendsOnlyGames") {
      //await fetchFriendsOnlyGames();
    }
    setRefreshing(false);
  };

  // can I use a store?
  return (
    <>
      {session && session.user ? (
        <View style={{ flex: 1 }}>
          <Tabs
            alignSelf="center"
            justifyContent="center"
            flex={0}
            defaultValue="PublicGames"
          >
            <Tabs.List>
              <Tabs.Tab
                width={200}
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
                width={200}
                testID="friends-only-games"
                value="FriendsOnlyGames"
                onInteraction={() => {
                  setToggle("friendsOnlyGames");
                }}
              >
                <Text>Friends-Only Games</Text>
              </Tabs.Tab>
              <FeedFilter handleRefresh={handleRefresh}/>
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

            {toggle === "publicGames" ? (
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
              <View className="items-center justify-center flex-1 p-12 text-center">
                <H4>No friends-only games yet</H4>
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

export default Feed;
