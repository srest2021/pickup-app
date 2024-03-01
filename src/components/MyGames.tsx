import { YStack, ScrollView, H4, Spinner, Separator } from "tamagui";
import { Alert, View } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import { SizableText, Tabs, Text } from "tamagui";
import GameThumbnail from "./game/GameThumbnail";
import { useStore } from "../lib/store";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  useToastController,
  useToastState,
} from "@tamagui/toast";
import { useEffect, useState } from "react";

const MyGames = ({ navigation }: { navigation: any }) => {
  const [session] = useStore((state) => [state.session]);
  const { myGames, fetchMyGames, fetchAllGames } = useQueryGames();
  const [refreshing, setRefreshing] = useState(false);
  const [myGamesToggle, setMyGamesToggle] = useState("myGames");
  //const [isErrorToastVisible, setErrorToastVisible] = useState(false);

  useEffect(() => {
    handleRefresh();
  }, [myGamesToggle]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (myGamesToggle === "myGames") {
      try {
        await fetchMyGames();
      } catch (error) {
        Alert.alert("Error fetching games! Please try again later.");
        //setErrorToastVisible(true);
      }
    } else if (myGamesToggle === "joinedGames") {
      try {
        await fetchAllGames();
        // temporary for right now until we do query for joined games.
      } catch (error) {
        Alert.alert("Error fetching games! Please try again later.");
        //setErrorToastVisible(true);
      }
    }
    setRefreshing(false);
  };

  return (
    <>
      {session && session.user ? (
        <View style={{ flex: 1 }}>
          <Tabs
            alignSelf="center"
            justifyContent="center"
            flex={0}
            defaultValue="MyGames"
          >
            <Tabs.List>
              <Tabs.Tab
                width={200}
                value="MyGames"
                onInteraction={() => {
                  setMyGamesToggle("myGames");
                }}
              >
                <Text>My Games</Text>
              </Tabs.Tab>
              <Separator vertical></Separator>
              <Tabs.Tab
                width={200}
                value="JoinedGames"
                onInteraction={() => {
                  setMyGamesToggle("joinedGames");
                }}
              >
                <Text>Joined Games</Text>
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
            {refreshing && <Spinner size="small" color="#ff7403" />}
            <YStack space="$5" paddingTop={5} paddingBottom="$5">
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
