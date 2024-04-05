import { ScrollView, Text } from "react-native";
import {
  Button,
  Card,
  H4,
  Separator,
  SizableText,
  Spinner,
  Tabs,
  XStack,
  YStack,
  View,
} from "tamagui";
import useMutationUser from "../../hooks/use-mutation-user";
import { useStore } from "../../lib/store";
import { useEffect, useState } from "react";
import OtherUserThumbnail from "./OtherUserThumbnail";
import SearchProfiles from "./SearchProfiles";
import useQueryUsers from "../../hooks/use-query-users";

export default function FriendPage({ navigation }: { navigation: any }) {
  const [session, myFriends = [], myFriendReqs] = useStore((state) => [
    state.session,
    state.friends,
    state.friendRequests,
  ]);

  //mock friend list for now
  //const friendsList: string[] = ["maddie", "clarissa", "kate"];
  const { getFriends } = useQueryUsers();
  const { getFriendRequests } = useQueryUsers();
  const { acceptFriendRequestById } = useMutationUser();
  const { rejectFriendRequestById } = useMutationUser();

  //const { fetchFeedGames } = useQueryGames(); Joe is making this but for friends
  //const [session, friendList] = useStore((state) => [
  //state.session,
  //state.friendList,
  //]);
  const [refreshing, setRefreshing] = useState(false);
  //const [hasLocation, setHasLocation] = useState(true);
  const [toggle, setToggle] = useState("friends");

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (toggle === "friends") {
      const loadedFriends = await getFriends();
    } else if (toggle === "friendRequests") {
      const loadedReqs = await getFriendRequests();
    } else if (toggle === "searchForFriends") {
    }
    setRefreshing(false);
  };

  return (
    <>
      {session && session.user ? (
        <View flex={1}>
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
            <View flex={1}>
              {refreshing && (
                <Spinner size="small" color="#ff7403" testID="spinner" />
              )}

              {toggle === "friends" && myFriends ? (
                <View>
                  <H4 style={{ textAlign: "center" }}>
                    {myFriends.length}{" "}
                    {myFriends.length == 1 ? "friend" : "friends"}
                  </H4>
                  {myFriends.map((friend) => (
                    <View key={friend.id}>
                      <OtherUserThumbnail
                        navigation={navigation}
                        user={friend}
                        isFriend={true}
                      />
                    </View>
                  ))}
                </View>
              ) : toggle === "friendRequests" ? (
                myFriendReqs.length > 0 ? (
                  <View>
                    <H4 style={{ textAlign: "center" }}>
                      {myFriendReqs.length} pending friend requests
                    </H4>
                    {myFriendReqs.map((friendReq) => (
                      <View>
                        <Text key={friendReq.id}>{friendReq.username}</Text>
                        <XStack justifyContent="flex-end" space="$2">
                          <Button
                            testID="reject-button"
                            size="$2"
                            style={{
                              backgroundColor: "#e90d52",
                              color: "white",
                            }}
                            onPress={() =>
                              rejectFriendRequestById(friendReq.id)
                            }
                          />
                          <Button
                            testID="accept-button"
                            size="$2"
                            style={{
                              backgroundColor: "#05a579",
                              color: "white",
                            }}
                            onPress={() =>
                              acceptFriendRequestById(friendReq.id)
                            }
                          />
                        </XStack>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View flex={1} alignSelf="center" justifyContent="center">
                    <H4 textAlign="center">No friend requests</H4>
                  </View>
                )
              ) : toggle === "searchForFriends" ? (
                <SearchProfiles navigation={navigation} />
              ) : (
                <View flex={1} alignSelf="center" justifyContent="center">
                  <H4 textAlign="center">No search results</H4>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View padding="$7" flex={1} alignSelf="center" justifyContent="center">
          <H4 textAlign="center">Loading...</H4>
        </View>
      )}
    </>
  );
}
