import { ScrollView } from "react-native";
import Avatar from "./Avatar";
import Sports from "./Sports";
import {
  Button,
  Card,
  H4,
  SizableText,
  Spinner,
  YStack,
  Text,
  View,
} from "tamagui";
import { useStore } from "../../lib/store";
import { Dimensions } from "react-native";
import useMutationUser from "../../hooks/use-mutation-user";
import useQueryUsers from "../../hooks/use-query-users";
import { useEffect, useState } from "react";

export default function OtherProfile({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { userId } = route.params;

  const [loading, otherUser, setOtherUser, user] = useStore((state) => [
    state.loading,
    state.otherUser,
    state.setOtherUser,
    state.user,
  ]);

  const { sendFriendRequest } = useMutationUser();
  const { getOtherProfile } = useQueryUsers();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getOtherProfile(userId, false);
    return () => {
      setOtherUser(null);
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await getOtherProfile(userId, true);
    setRefreshing(false);
  };

  // Returns true if the user has requested
  const handleRequestLogic = async () => {
    // Send friend request
    // using !, otherUser should never be null if this page appears.
    const friendRequest = await sendFriendRequest(otherUser!.id);
  };

  // Calculate the banner height and the top margin for the avatar
  const windowHeight = Dimensions.get("window").height;
  const bannerHeight = windowHeight / 5;
  const avatarHeight = 170;
  const paddingHeight = 39;
  const bannerMargin = bannerHeight - avatarHeight / 2 - paddingHeight;

  return (
    <View flex={1} backgroundColor="#f2f2f2">
      {otherUser && user ? (
        <View flex={1}>
          <View flex={1} backgroundColor="#08348c" flexDirection="column" />
          <View flex={1} flexDirection="column" />
          <ScrollView
            style={{
              flex: 1,
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
            contentContainerStyle={{
              flexGrow: 1,
              backgroundColor: "#f2f2f2",
            }}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const { contentOffset } = e.nativeEvent;
              if (contentOffset.y < -50 && !refreshing) {
                handleRefresh();
              }
            }}
          >
            <View
              backgroundColor="#08348c"
              height={bannerHeight}
              padding="$7"
              overflow="visible"
            >
              <View marginTop={bannerMargin}>
                <Avatar
                  url={otherUser.avatarUrl}
                  user={otherUser}
                  onUpload={() => {}}
                  allowUpload={false}
                />
              </View>
            </View>

            {refreshing && (
              <Spinner
                position="absolute"
                paddingTop="$5"
                width="100%"
                size="large"
                color="#f2f2f2"
                backgroundColor="#08348c"
                testID="spinner"
              />
            )}

            <View padding="$7">
              <YStack space="$4" flex={1}>
                <YStack
                  marginTop={bannerMargin + 15}
                  space="$1"
                  paddingVertical="$3"
                  flex={1}
                >
                  {otherUser.displayName &&
                    otherUser.displayName.trim().length > 0 && (
                      <SizableText size="$7" textAlign="center">
                        {otherUser.displayName}
                      </SizableText>
                    )}

                  <SizableText size="$5" textAlign="center">
                    @{otherUser.username}
                  </SizableText>

                  {otherUser.isFriend && (
                    <View
                      flex={1}
                      alignItems="center"
                      justifyContent="center"
                      paddingTop="$2"
                    >
                      <SizableText
                        textAlign="center"
                        color="#ffffff"
                        backgroundColor="#ff7403"
                        paddingVertical="$2"
                        paddingHorizontal="$3"
                        style={{ borderRadius: 17, overflow: "hidden" }}
                      >
                        Friends
                      </SizableText>
                    </View>
                  )}
                </YStack>

                {otherUser.bio && otherUser.bio.trim().length > 0 && (
                  <YStack>
                    <Card elevate size="$5">
                      <View marginLeft={25} marginRight={25}>
                        <SizableText
                          size="$5"
                          fontWeight="500"
                          paddingTop="$3"
                          paddingBottom="$3"
                        >
                          {otherUser.bio}
                        </SizableText>
                      </View>
                    </Card>
                  </YStack>
                )}

                <Sports sports={otherUser.sports} otherUser={true} />

                <YStack space="$6" alignItems="center">
                  {!otherUser.isFriend && (
                    <Button
                      variant="outlined"
                      disabled={otherUser.hasRequested || otherUser.isFriend || loading}
                      onPress={() => handleRequestLogic()}
                      size="$5"
                      color="#ff7403"
                      borderColor="#ff7403"
                      backgroundColor={"#ffffff"}
                      width="100%"
                    >
                      {loading
                        ? "Loading..."
                        : otherUser.hasRequested
                          ? "Requested"
                          : "Send Friend Request"}
                    </Button>
                  )}
                </YStack>
              </YStack>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View padding="$7" flex={1} alignSelf="center" justifyContent="center">
          <H4 textAlign="center">Loading profile...</H4>
        </View>
      )}
    </View>
  );
}
