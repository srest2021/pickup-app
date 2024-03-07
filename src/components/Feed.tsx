import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import FeedGameView from "./game/GameThumbnail";
import { Separator, SizableText, Tabs } from "tamagui";
import { supabase } from "../lib/supabase";

//
// add event listener so that page is constantly updating!
// add switch so that you can go between myGame and AllGames
// PICK A MINWIDTH SO THAT text always shown
const Feed = () => {
  // const toMyGames = () => {
  //   // Figure out a way to switch to MyGames (probably use Store)
  // };
  
  const { fetchFeedGames } = useQueryGames();

  useEffect(() => {
    fetchFeedGames();
  }, []);

  // const toJoinedGames = () => {
  //   // Figure out how to swtich to AllGames (probably useStore)
  // };

  // can I use a store?
  return (
    <View style={styles.container}>
      <Tabs
        defaultValue="MyGames"
        orientation="horizontal"
        flexDirection="column"
        height={150}
        minWidth={200}
        borderRadius="$4"
        borderWidth="$0.25"
        overflow="hidden"
      >
        <Tabs.List disablePassBorderRadius="bottom">
          {/* <Tabs.Tab value="All Games" onInteraction={toMyGames}> */}
          <Tabs.Tab value="All Games">
            <SizableText>All Games</SizableText>
          </Tabs.Tab>
          {/* <Tabs.Tab value="JoinedGames" onInteraction={toJoinedGames}> */}
          <Tabs.Tab value="Friends-Only Games">
            <SizableText>Friends-Only Games</SizableText>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Text style={styles.text}>Feed here</Text>
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
