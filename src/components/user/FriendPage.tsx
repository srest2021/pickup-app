import { ScrollView, Text } from "react-native";
import {
  H4,
  Separator,
  Spinner,
  Tabs,
  View,
  ListItem,
  YGroup,
  YStack,
  SizableText,
} from "tamagui";
import { useEffect, useState } from "react";
import OtherUserThumbnail from "./OtherUserThumbnail";
import SearchProfiles from "./SearchProfiles";
import useQueryUsers from "../../hooks/use-query-users";
import { useStore } from "../../lib/store";

export default function FriendPage({ navigation }: { navigation: any }) {
  const [session, myFriends, myFriendReqs] = useStore((state) => [
    state.session,
    state.friends,
    state.friendRequests,
  ]);

  const { getFriends } = useQueryUsers();
  const { getFriendRequests } = useQueryUsers();

  const [refreshing, setRefreshing] = useState(false);
  const [toggle, setToggle] = useState("friends");

  // on component render, get all friends and friend requests
  useEffect(() => {
    const getAll = async () => {
      setRefreshing(true);
      await getFriends();
      await getFriendRequests();
      setRefreshing(false);
    };
    getAll();
  }, []);

  // on refresh, just refresh the tab we're on
  const handleRefresh = async () => {
    setRefreshing(true);
    if (toggle === "friends") {
      await getFriends();
    } else if (toggle === "friendRequests") {
      await getFriendRequests();
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
            <Tabs.List paddingTop="$2">
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

          {toggle === "searchForFriends" ? (
            <SearchProfiles navigation={navigation} />
          ) : (
            <YStack flex={1} space="$3">
              <View flex={1} paddingTop="$5" paddingHorizontal="$5" space="$3">
                {refreshing && (
                  <Spinner size="large" color="#ff7403" testID="spinner" />
                )}
                <ScrollView
                  scrollEventThrottle={16}
                  showsVerticalScrollIndicator={false}
                  onScroll={(e) => {
                    const { contentOffset } = e.nativeEvent;
                    if (contentOffset.y < -50 && !refreshing) {
                      handleRefresh();
                    }
                  }}
                >
                  <View space="$3">
                    {toggle === "friends" && myFriends ? (
                      <View flex={1}>
                        {myFriends.length > 0 ? (
                          <YGroup
                            alignSelf="center"
                            width="100%"
                            size="$4"
                            flex={1}
                            space="$3"
                          >
                            {myFriends.map((friend) => (
                              <YGroup.Item key={`friend-${friend.id}`}>
                                <OtherUserThumbnail
                                  navigation={navigation}
                                  user={friend}
                                  isFriend={true}
                                  isSearch={false}
                                />
                              </YGroup.Item>
                            ))}
                          </YGroup>
                        ) : refreshing ? (
                          <View
                            flex={1}
                            alignSelf="center"
                            justifyContent="center"
                          >
                            <H4 textAlign="center">Loading friends...</H4>
                          </View>
                        ) : (
                          <View
                            flex={1}
                            alignSelf="center"
                            justifyContent="center"
                          >
                            <H4 textAlign="center">No friends yet</H4>
                          </View>
                        )}
                      </View>
                    ) : (
                      toggle === "friendRequests" &&
                      myFriendReqs &&
                      (myFriendReqs.length > 0 ? (
                        <YGroup
                          alignSelf="center"
                          bordered
                          width="100%"
                          size="$4"
                          flex={1}
                          space="$3"
                        >
                          {myFriendReqs.map(
                            (friendReq) =>
                              friendReq.id !== session.user.id && (
                                <YGroup.Item key={`req-${friendReq.id}`}>
                                  <OtherUserThumbnail
                                    navigation={navigation}
                                    user={friendReq}
                                    isFriend={false}
                                    isSearch={false}
                                  />
                                </YGroup.Item>
                              ),
                          )}
                        </YGroup>
                      ) : refreshing ? (
                        <View
                          flex={1}
                          alignSelf="center"
                          justifyContent="center"
                        >
                          <H4 textAlign="center">Loading friend requests...</H4>
                        </View>
                      ) : (
                        <View
                          flex={1}
                          alignSelf="center"
                          justifyContent="center"
                        >
                          <H4 textAlign="center">No friend requests yet</H4>
                        </View>
                      ))
                    )}
                  </View>
                </ScrollView>
              </View>
              <View paddingBottom="$5">
                {toggle === "friends" && myFriends && myFriends.length > 0 && (
                  <SizableText size="$5" textAlign="center">
                    {myFriends.length}{" "}
                    {myFriends.length === 1 ? "friend" : "friends"}
                  </SizableText>
                )}

                {toggle === "friendRequests" &&
                  myFriendReqs &&
                  myFriendReqs.length > 0 && (
                    <SizableText size="$5" textAlign="center">
                      {myFriendReqs.length} pending friend{" "}
                      {myFriendReqs.length === 1 ? "request" : "requests"}
                    </SizableText>
                  )}
              </View>
            </YStack>
          )}
        </View>
      ) : (
        <View padding="$7" flex={1} alignSelf="center" justifyContent="center">
          <H4 textAlign="center">Loading...</H4>
        </View>
      )}
    </>
  );
}
