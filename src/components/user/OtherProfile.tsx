import { ScrollView, View, Text } from "react-native";
import Avatar from "./Avatar";
import Sports from "./Sports";
import { Button, Card, SizableText, YStack } from "tamagui";
import { useStore } from "../../lib/store";
import { Dimensions } from "react-native";
import { ToastViewport, useToastController } from "@tamagui/toast";
import { ToastDemo } from "../Toast";
import useMutationUser from "../../hooks/use-mutation-user";
import { OtherUser } from "../../lib/types";
import useQueryUsers from "../../hooks/use-query-users";
import { useEffect } from "react";

// Get the height of the screen
const windowHeight = Dimensions.get("window").height;

// Calculate the height for the top third
const topThirdHeight = windowHeight / 4;

export default function OtherProfile({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { userId } = route.params;

  const [otherUser, setOtherUser, user] = useStore((state) => [
    state.otherUser,
    state.setOtherUser,
    state.user,
  ]);
  const toast = useToastController();

  const { sendFriendRequest } = useMutationUser();
  const { getOtherProfile } = useQueryUsers();

  useEffect(() => {
    getOtherProfile(userId, false);
    return () => {
      setOtherUser(null);
    };
  }, []);

  // Returns true if the user has requested
  const handleRequestLogic = async () => {
    // Send friend request
    // using !, otherUser should never be null if this page appears.
    const friendRequest = await sendFriendRequest(otherUser!.id);

    if (friendRequest) {
      toast.show("Success!", {
        message: "Request sent.",
      });
    }

    // No navigation, since user can choose to continue viewing the profile.
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#08348c" }}>
      <ToastViewport />
      <ToastDemo />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          backgroundColor: "#f2f2f2",
        }}
      >
        <View
          style={{
            backgroundColor: "#08348c",
            height: topThirdHeight,
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            padding: 12,
          }}
        ></View>
        <View className="p-12">
          {otherUser && user ? (
            <YStack space="$4">
              <View
                className="items-center"
                style={{ marginTop: -topThirdHeight / 1.3 }}
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
                {!otherUser?.isFriend ? (
                  <Button
                    variant="outlined"
                    disabled={otherUser?.hasRequested}
                    onPress={() => handleRequestLogic()}
                    size="$5"
                    color="#ff7403"
                    borderColor="#ff7403"
                    backgroundColor={"#ffffff"}
                    width="100%"
                  >
                    {otherUser?.hasRequested
                      ? "Requested"
                      : "Send Friend Request"}
                  </Button>
                ) : (
                  <Text>You are friends!</Text>
                )}
              </YStack>
            </YStack>
          ) : (
            <Text>Loading user profile...</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
