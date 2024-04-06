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

// Get the height of the screen
const windowHeight = Dimensions.get("window").height;

// Calculate the height for the top third
const topThirdHeight = windowHeight / 4;

export default function OtherProfile({ navigation }: { navigation: any }) {
  const [loading, setLoading, otherUser, user] = useStore((state) => [
    state.loading,
    state.setLoading,
    state.otherUser,
    state.user,
  ]);
  const toast = useToastController();
  const { addFriendRequest } = useMutationUser();

  // Returns true if the user has requested
  const handleRequestLogic = async () => {
    // Send friend request
    // using !, otherUser should never be null if this page appears.
    const friendRequest = await addFriendRequest(otherUser!.id);

    if (friendRequest) {
      toast.show("Success!", {
        message: "Request sent.",
      });
    }

    // No navigation, since user can choose to continue viewing the profile.
  };

  return (
    <View style={{ flex: 1 }}>
      <ToastViewport />
      <ToastDemo />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
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
            <View>
              <View
                className="items-center mb-10"
                style={{ marginTop: -topThirdHeight / 2 }}
              >
                <Avatar
                  url={otherUser.avatarUrl}
                  user={otherUser}
                  onUpload={() => {}}
                  allowUpload={false}
                />
              </View>

              <View className="self-stretch py-0">
                <Text className="text-2xl text-center">
                  {otherUser.displayName ? (
                    otherUser.displayName
                  ) : (
                    <Text> "No display name" </Text>
                  )}
                </Text>
              </View>
              <View className="self-stretch py-2">
                <Text className="text-xl text-center">
                  @{otherUser.username}
                </Text>
              </View>

              <YStack paddingTop="$3" paddingBottom="$4">
                <Card elevate size="$5">
                  <View marginLeft={25} marginRight={25}>
                    <SizableText
                      size="$5"
                      fontWeight="500"
                      paddingTop="$3"
                      paddingBottom="$3"
                    >
                      {otherUser.bio ? otherUser.bio : "No bio yet"}
                    </SizableText>
                  </View>
                </Card>
              </YStack>

              <Sports sports={otherUser.sports} />

              <YStack space="$6" paddingTop="$5" alignItems="center">
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
            </View>
          ) : (
            <Text>Loading user profile...</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
