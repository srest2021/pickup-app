import { ScrollView, View, Text } from "react-native";
import Avatar from "./Avatar";
import Sports from "./Sports";
import {
  Button,
  Card,
  H4,
  SizableText,
  Spinner,
  YStack,
  View as TamaguiView,
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

  // Get the height of the screen
  const windowHeight = Dimensions.get("window").height;

  // Calculate the height for the top third
  const topThirdHeight = windowHeight / 5;

  return (
    <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      {otherUser && user ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#08348c",
              flexDirection: "column",
            }}
          />
          <View style={{ flex: 1, flexDirection: "column" }} />
          <ScrollView
            style={{
              flex: 1,
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
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
              style={{
                backgroundColor: "#08348c",
                height: topThirdHeight,
                position: "absolute",
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "flex-start",
                padding: 12,
              }}
            />
            {refreshing && (
              <Spinner
                paddingTop="$5"
                size="large"
                color="#f2f2f2"
                backgroundColor="#08348c"
                testID="spinner"
              />
            )}
            <View
              className="p-12"
              //style={{ position: "absolute", width: "100%", height: "100%" }}
            >
              <YStack space="$4">
                <View
                  className="items-center"
                  style={{ marginTop: topThirdHeight / 4 }}
                >
                  <Avatar
                    url={otherUser.avatarUrl}
                    user={otherUser}
                    onUpload={() => {}}
                    allowUpload={false}
                  />
                </View>

                <YStack space="$2" paddingVertical="$3">
                  {otherUser.displayName &&
                    otherUser.displayName.trim().length > 0 && (
                      <View className="self-stretch">
                        <Text className="text-2xl text-center">
                          {otherUser.displayName}
                        </Text>
                      </View>
                    )}

                  <View className="self-stretch">
                    <Text className="text-xl text-center">
                      @{otherUser.username}
                    </Text>
                  </View>
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
                  {!otherUser.isFriend ? (
                    <Button
                      variant="outlined"
                      disabled={otherUser.hasRequested || otherUser.isFriend}
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
                  ) : (
                    <Text>You are friends!</Text>
                  )}
                </YStack>
              </YStack>
            </View>
          </ScrollView>
        </View>
      ) : (
        <TamaguiView
          padding="$7"
          flex={1}
          alignSelf="center"
          justifyContent="center"
        >
          <H4 textAlign="center">Loading profile...</H4>
        </TamaguiView>
      )}
    </View>
  );
}
