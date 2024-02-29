import { Text, Button, YStack, ScrollView } from "tamagui";
import { View } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import FeedGameView from "./game/GameThumbnail";
import { Separator, SizableText, Tabs } from "tamagui";
import GameThumbnail from "./game/GameThumbnail";
import { useState } from "react";

const MyGames = ({ navigation }: { navigation: any }) => {
  const { myGames, fetchMyGames } = useQueryGames();
  const [refreshing, setRefreshing] = useState(false);
  const [myGamesToggle, setMyGamesToggle] = useState("myGames");

  const handleRefresh = async () => {
    setRefreshing(true);
    if (myGamesToggle === "myGames") {
      toMyGames();
    } else if (myGamesToggle === "joinedGames") {
      toJoinedGames();
    }
    setRefreshing(false);
  };
  // const fetchJoinedGames = useQueryGames();

  const toMyGames = async () => {
    setMyGamesToggle("myGames");
    await fetchMyGames();
  };

  const toJoinedGames = () => {
    setMyGamesToggle("joinedGames");
    // Figure out how to swtich to AllGames (probably useStore)
  };

  // Navigate to myGames view after create game

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        defaultValue="MyGames"
        orientation="horizontal"
        flexDirection="column"
        borderRadius="$0.25"
        borderWidth="$0.25"
        style={{ width: "100%" }}
      >
        <Tabs.List>
          <Tabs.Tab value="MyGames" onInteraction={toMyGames}>
            <SizableText>My Games</SizableText>
          </Tabs.Tab>
          <Tabs.Tab value="JoinedGames" onInteraction={toJoinedGames}>
            <SizableText>Joined Games</SizableText>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <ScrollView
        scrollEventThrottle={50}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const { layoutMeasurement, contentOffset, contentSize } =
            e.nativeEvent;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 20; // Adjust this threshold as needed
          if (isCloseToBottom && !refreshing) {
            handleRefresh();
          }
        }}
      >
        <YStack space="$5" padding="12">
          {myGames.map((myGame) => (
            <GameThumbnail
              navigation={navigation}
              game={myGame}
              key={myGame.id}
            />
          ))}
        </YStack>
      </ScrollView>
    </View>
  );
};

export default MyGames;

/*<Tabs
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
      <Games></Games>*/
