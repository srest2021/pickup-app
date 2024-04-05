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

  const { getFriends } = useQueryUsers();
  const { getFriendRequests } = useQueryUsers();

  // Create a set to store unique user IDs
  const uniqueUserIds = new Set<string>();

  // Remove duplicate users from myFriends array
  const uniqueFriends = myFriends.filter((friend) => {
    if (uniqueUserIds.has(friend.id)) {
      return false; // Skip this user, it's a duplicate
    }
    uniqueUserIds.add(friend.id); // Add user ID to set
    return true; // Include this user in the unique friends list
  });

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

  const filteredFriendReqs = myFriendReqs.filter(
    (friendReq) => friendReq.id !== session.user.id,
  );
  const pendingRequestsCount = filteredFriendReqs.length;

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

              {toggle === "friends" && uniqueFriends ? (
                <View>
                  <H4 style={{ textAlign: "center" }}>
                    {uniqueFriends.length}{" "}
                    {uniqueFriends.length == 1 ? "friend" : "friends"}
                  </H4>
                  {uniqueFriends.map((friend) => (
                    <View>
                      <OtherUserThumbnail
                        navigation={navigation}
                        user={friend}
                        isFriend={true}
                        isSearch={false}
                      />
                    </View>
                  ))}
                </View>
              ) : toggle === "friendRequests" ? (
                myFriendReqs.length > 0 ? (
                  <View>
                    <H4 style={{ textAlign: "center" }}>
                      {" "}
                      {pendingRequestsCount} pending friend requests
                    </H4>
                    {myFriendReqs.map(
                      (friendReq) =>
                        friendReq.id !== session.user.id && (
                          <View>
                            <OtherUserThumbnail
                              navigation={navigation}
                              user={friendReq}
                              isFriend={false}
                              isSearch={false}
                            />
                          </View>
                        ),
                    )}
                  </View>
                ) : (
                  <View flex={1} alignSelf="center" justifyContent="center">
                    <H4 textAlign="center">
                      Refresh to check for friend requests
                    </H4>
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
