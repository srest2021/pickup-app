import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import FeedGameView from "./game/GameView";
import { Separator, SizableText, Tabs } from "tamagui";
import Games from "./game/Games";

// 
// add event listener so that page is constantly updating! 
// add switch so that you can go between myGame and AllGames 
// PICK A MINWIDTH SO THAT text always shown 
const MyGames = () => {
    const {fetchMyGames} = useQueryGames();
    // const fetchJoinedGames = useQueryGames();


  const toMyGames = () => {
    fetchMyGames();
  }

  const toJoinedGames = () => {
    // Figure out how to swtich to AllGames (probably useStore) 
  }

  // Navigate to myGames view after create game 

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
        <Tabs.List
        disablePassBorderRadius="bottom">
          <Tabs.Tab value = "MyGames" onInteraction={toMyGames}>
          <SizableText>My Games</SizableText>
          </Tabs.Tab>
          <Tabs.Tab value = "JoinedGames" onInteraction={toJoinedGames}>
          <SizableText>Joined Games</SizableText>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Games></Games>
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

export default MyGames;
