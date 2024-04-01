import { supabase } from "../../lib/supabase";
import { ScrollView, View, Text } from "react-native";
import Avatar from "./Avatar";
import Sports from "./Sports";
import { Button, Card, H4, Separator, SizableText, Spinner, Tabs, YStack } from "tamagui";
import useMutationUser from "../../hooks/use-mutation-user";
import { useStore } from "../../lib/store";
import { Dimensions } from "react-native";
import { Edit3, Loader } from "@tamagui/lucide-icons";
import AddSport from "./AddSport";
import { ToastViewport, useToastController } from "@tamagui/toast";
import { ToastDemo } from "../Toast";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import useQueryUsers from "../../hooks/use-query-users";


export default function FriendPage({ navigation }: { navigation: any }) {
  const [session] = useStore((state) => [
    state.session,
  ]);

  //mock friend list for now
  const friendsList: string[] = ["maddie", "clarissa", "kate"]
  const { getFriends } = useQueryUsers()

  //const { fetchFeedGames } = useQueryGames(); Joe is making this but for friends
  //const [session, friendList] = useStore((state) => [
    //state.session,
    //state.friendList,
  //]);
  const [refreshing, setRefreshing] = useState(false);
  const [hasLocation, setHasLocation] = useState(true);
  const [toggle, setToggle] = useState("friends");

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (toggle === "friends") {
      //const games = await fetchFeedGames();
    } else if (toggle === "friendRequests") {
      //await fetchFriendsOnlyGames();
    } else if (toggle === "searchForFriends") {

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
              defaultValue="Friends"
            >
              <Tabs.List>
                <Tabs.Tab
                  width="33.33%"
                  testID="friends"
                  value="Friends"
                  onInteraction={() => {
                    setToggle("friends");
                  }}
                >
                  <Text>Friends</Text>
                </Tabs.Tab>
                <Separator vertical></Separator>
                <Tabs.Tab
                  width="33.33%"
                  testID="friend-requests"
                  value="Requests"
                  onInteraction={() => {
                    setToggle("friendRequests");
                  }}
                >
                  <Text>Requests</Text>
                </Tabs.Tab>
                <Separator vertical></Separator>
                <Tabs.Tab
                  width="33.33%"
                  testID="search-friends"
                  value="Search"
                  onInteraction={() => {
                    setToggle("searchForFriends");
                  }}
                >
                  <Text>Search</Text>
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
              {refreshing && (
                <Spinner size="small" color="#ff7403" testID="spinner" />
              )}
              
              {toggle === "friends" ? (
                friendsList.length > 0 ? (
                <View>
                  
                  <H4 style={{ textAlign: 'center' }}> {friendsList.length} friends</H4>
                  {friendsList.map((friend, index) => (
                      <Text key={index}>{friend}</Text>
                      /*<Button onPress={() => handleButtonClick(friend)}>Button</Button>*/
                  ))}

                </View>
                ) : (
                  <View className="items-center justify-center flex-1 p-12 text-center">
                    <H4>No friends</H4>
                  </View>
                )
              ) : toggle === "friendRequests" ? (
                <View className="items-center justify-center flex-1 p-12 text-center">
                  <H4>No friends requests yet</H4>
                </View>
              ) : (
                <View className="items-center justify-center flex-1 p-12 text-center">
                  <H4>No friends search results</H4>
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
}

