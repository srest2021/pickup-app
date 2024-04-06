import { ScrollView, Text } from "react-native";
import { H4, Separator, Spinner, Tabs, View, ListItem, YGroup } from "tamagui";
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
          {toggle === "searchForFriends" ? (
            <SearchProfiles navigation={navigation} />
          ) : (
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
              <View flex={1} padding="$5">
                {refreshing && (
                  <Spinner size="small" color="#ff7403" testID="spinner" />
                )}

                {toggle === "friends" && myFriends ? (
                  <View flex={1}>
                    {myFriends.length > 0 ? (
                      <View flex={1} space="$3">
                        <H4 style={{ textAlign: "center" }}>
                          {myFriends.length}{" "}
                          {myFriends.length == 1 ? "friend" : "friends"}
                        </H4>
                        <YGroup
                          alignSelf="center"
                          bordered
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
                      </View>
                    ) : refreshing ? (
                      <View flex={1} alignSelf="center" justifyContent="center">
                        <H4 textAlign="center">Loading friends...</H4>
                      </View>
                    ) : (
                      <View flex={1} alignSelf="center" justifyContent="center">
                        <H4 textAlign="center">No friends yet</H4>
                      </View>
                    )}
                  </View>
                ) : (
                  toggle === "friendRequests" &&
                  myFriendReqs &&
                  (myFriendReqs.length > 0 ? (
                    <View space="$3">
                      <H4 style={{ textAlign: "center" }}>
                        {myFriendReqs.length} pending friend requests
                      </H4>
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
                    </View>
                  ) : refreshing ? (
                    <View flex={1} alignSelf="center" justifyContent="center">
                      <H4 textAlign="center">Loading friend requests...</H4>
                    </View>
                  ) : (
                    <View flex={1} alignSelf="center" justifyContent="center">
                      <H4 textAlign="center">No friend requests yet</H4>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          )}
          {/* //     // ) : (
          //     //   <View flex={1} alignSelf="center" justifyContent="center">
          //     //     <H4 textAlign="center">No search results</H4>
          //     //   </View>
          //     // )} */}
        </View>
      ) : (
        <View padding="$7" flex={1} alignSelf="center" justifyContent="center">
          <H4 textAlign="center">Loading...</H4>
        </View>
      )}
    </>
  );
}
