import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import FeedGameView from "./game/GameThumbnail";
import { H4, ScrollView, Separator, SizableText, Spinner, Tabs, YStack } from "tamagui";
import { supabase } from "../lib/supabase";
import GameThumbnail from "./game/GameThumbnail";
import { useStore } from "../lib/store";
import useQueryUsers from "../hooks/use-query-users";

//
// add event listener so that page is constantly updating!
// add switch so that you can go between myGame and AllGames
// PICK A MINWIDTH SO THAT text always shown
const Feed = ({ navigation }: { navigation: any }) => {
  const toMyGames = () => {
    // Figure out a way to switch to MyGames (probably use Store)
  };

  const { fetchFeedGames } = useQueryGames();
  const { setUserLocation } = useQueryUsers();
  const feedGames = useStore((state) => state.feedGames);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setUserLocation();
    fetchFeedGames();
    //console.log(location);
  }, []);

  const toJoinedGames = () => {
    // Figure out how to swtich to AllGames (probably useStore)
  };

  // can this be its own function somewhere?
  const handleRefresh = async () => {
    setRefreshing(true);
      try {
        setUserLocation();
        await fetchFeedGames();
      } catch (error) {
        Alert.alert("Error fetching games! Please try again later.");
        
      }
    //console.log(feedGames); //delete
    setRefreshing(false);
  };

  // can I use a store?
  return (
    <View style={styles.container}>
      <Tabs
        defaultValue="All Games"
        orientation="horizontal"
        flexDirection="column"
        overflow="hidden"
      >
        <Tabs.List disablePassBorderRadius="bottom">
          {/* <Tabs.Tab value="All Games" onInteraction={toMyGames}> */}
          <Tabs.Tab value="All Games">
            <SizableText>All Games </SizableText>
          </Tabs.Tab>
          
          {/* <Tabs.Tab value="JoinedGames" onInteraction={toJoinedGames}> */}
          <Tabs.Tab value="Friends-Only Games">
            <SizableText>Friends-Only Games</SizableText>
          </Tabs.Tab>
        </Tabs.List>
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
            {feedGames.length > 0 ? (
              <YStack space="$5" paddingTop={5} paddingBottom="$5">
                {feedGames.map((myGame) => (
                  <GameThumbnail
                    navigation={navigation}
                    game={myGame}
                    key={myGame.id}
                  />
                ))}
              </YStack>
            ) : (
              <View className="items-center justify-center flex-1 p-12 text-center">
                <H4>No games yet</H4>
              </View>
            )}
          </ScrollView>
      </Tabs>
      
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Feed;
