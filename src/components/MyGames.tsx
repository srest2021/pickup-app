import { YStack, ScrollView, H4 } from "tamagui";
import { Alert, View } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import { SizableText, Tabs } from "tamagui";
import GameThumbnail from "./game/GameThumbnail";
import { useStore } from "../lib/store";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  useToastController,
  useToastState,
} from "@tamagui/toast";
import { useState } from "react";

const MyGames = ({ navigation }: { navigation: any }) => {
  const [session] = useStore((state) => [state.session]);
  const { myGames, fetchMyGames } = useQueryGames();
  const [refreshing, setRefreshing] = useState(false);
  const [myGamesToggle, setMyGamesToggle] = useState("myGames");
  //const [isErrorToastVisible, setErrorToastVisible] = useState(false);

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
    try {
      await fetchMyGames();
    } catch (error) {
      Alert.alert("Error fetching games! Please try again later.");
      //setErrorToastVisible(true);
    }
  };

  const toJoinedGames = () => {
    setMyGamesToggle("joinedGames");
    // Figure out how to swtich to AllGames (probably useStore)
  };

  return (
    <>
      {session && session.user ? (
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
            <YStack space="$5" paddingTop="$5" paddingBottom="$5">
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
      ) : (
        <View className="p-12 text-center items-center flex-1 justify-center">
          <H4>Loading...</H4>
        </View>
      )}
      {/* {isErrorToastVisible && (
        <Toast>
          <YStack>
            <Toast.Title>
              Error fetching games
            </Toast.Title>
            <Toast.Description>
              Please try again later.
            </Toast.Description>
          </YStack>
          <Toast.Close onPress={() => setErrorToastVisible(false)} />
        </Toast>
      )} */}
    </>
  );
};

export default MyGames;
