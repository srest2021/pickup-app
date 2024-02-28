import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import FeedGameView from "./FeedGameView";
import { Separator, SizableText, Tabs } from "tamagui";


// add event listener so that page is constantly updating! 
// add switch so that you can go between myGame and AllGames 
// PICK A MINWIDTH SO THAT text always shown 
const Feed = () => {

  const toMyGames = () => {
    // Figure out a way to switch to MyGames
  }

  const toAllGames = () => {
    // Figure out how to swtich to AllGames
  }

  // can I use a store? 
  return (
    <View style={styles.container}>
      
      <Tabs
      defaultValue="AllGames"
      orientation="horizontal"
      flexDirection="column"
      height={150}
      minWidth={200} 
      borderRadius="$4"
      borderWidth="$0.25"
      overflow="hidden"
      >
        <Tabs.List
        disablePassBorderRadius="bottom">
          <Tabs.Tab value = "MyGames" onInteraction={toMyGames}>
          <SizableText>My Games</SizableText>
          </Tabs.Tab>
          <Tabs.Tab value = "AllGames" onInteraction={toAllGames}>
          <SizableText>All Games</SizableText>
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
