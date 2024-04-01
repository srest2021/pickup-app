import { supabase } from "../../lib/supabase";
import { ScrollView, View, Text } from "react-native";
import Avatar from "./Avatar";
import Sports from "./Sports";
import {
  Button,
  Card,
  H4,
  Separator,
  SizableText,
  Tabs,
  YStack,
} from "tamagui";
import useMutationUser from "../../hooks/use-mutation-user";
import { useStore } from "../../lib/store";
import { Dimensions } from "react-native";
import { Edit3, Loader } from "@tamagui/lucide-icons";
import AddSport from "./AddSport";
import { ToastViewport, useToastController } from "@tamagui/toast";
import { ToastDemo } from "../Toast";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function FriendPage({ navigation }: { navigation: any }) {
  const [session] = useStore((state) => [state.session]);

  return (
    <>
      {session && session.user ? (
        <View style={{ flex: 1 }}>
          <Tabs
            alignSelf="center"
            justifyContent="center"
            flex={0}
            defaultValue="Friends"
          >
            <Tabs.List>
              <Tabs.Tab width="33.33%" testID="friends" value="Friends">
                <Text>Friends</Text>
              </Tabs.Tab>
              <Separator vertical></Separator>
              <Tabs.Tab
                width="33.33%"
                testID="friend-requests"
                value="Requests"
              >
                <Text>Requests</Text>
              </Tabs.Tab>
              <Separator vertical></Separator>
              <Tabs.Tab width="33.33%" testID="search-friends" value="Search">
                <Text>Search</Text>
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
          {/* <ScrollView
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
  
              {myGamesToggle === "myGames" ? (
                myGames.length > 0 ? (
                  <YStack space="$5" paddingTop={5} paddingBottom="$5">
                    {myGames.map((myGame) => (
                      <GameThumbnail
                        navigation={navigation}
                        game={myGame}
                        gametype="my"
                        key={myGame.id}
                      />
                    ))}
                  </YStack>
                ) : (
                  <View className="items-center justify-center flex-1 p-12 text-center">
                    <H4>No published games yet</H4>
                  </View>
                )
              ) : joinedGames.length > 0 ? (
                <YStack space="$5" paddingTop={5} paddingBottom="$5">
                  {joinedGames.map((joinedGame) => (
                    <GameThumbnail
                      navigation={navigation}
                      game={joinedGame}
                      gametype="joined"
                      key={joinedGame.id}
                    />
                  ))}
                </YStack>
              ) : (
                <View className="items-center justify-center flex-1 p-12 text-center">
                  <H4>No joined games yet</H4>
                </View>
              )}
            </ScrollView> */}
        </View>
      ) : (
        <View className="items-center justify-center flex-1 p-12 text-center">
          <H4>Loading...</H4>
        </View>
      )}
    </>
  );
}
