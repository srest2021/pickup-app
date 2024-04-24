import { supabase } from "../../lib/supabase";
import { ScrollView, Text } from "react-native";
import Avatar from "./Avatar";
import Sports from "./Sports";
import { Button, Card, SizableText, YStack, View, H4 } from "tamagui";
import { useStore } from "../../lib/store";
import { Dimensions } from "react-native";
import { Edit3, Loader } from "@tamagui/lucide-icons";
import AddSport from "./AddSport";
import { ToastViewport } from "@tamagui/toast";
import { ToastDemo } from "../Toast";

export default function Profile({ navigation }: { navigation: any }) {
  const [
    loading,
    setLoading,
    user,
    userSports,
    setUser,
    clearUserSports,
    clearMyGames,
    clearSelectedMyGame,
    clearFeedGames,
    clearSelectedFeedGame,
    clearJoinedGames,
    clearSelectedJoinedGame,
    clearMessages,
    clearAvatarUrls,
    setChannel,
  ] = useStore((state) => [
    state.loading,
    state.setLoading,
    state.user,
    state.userSports,
    state.setUser,
    state.clearUserSports,
    state.clearMyGames,
    state.clearSelectedMyGame,
    state.clearFeedGames,
    state.clearSelectedFeedGame,
    state.clearJoinedGames,
    state.clearSelectedJoinedGame,
    state.clearMessages,
    state.clearAvatarUrls,
    state.setChannel,
  ]);

  const handleLogOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();

    // clear store
    setUser(null);
    clearUserSports();
    clearMyGames();
    clearSelectedMyGame();
    clearFeedGames();
    clearSelectedFeedGame();
    clearJoinedGames();
    clearSelectedJoinedGame();
    clearMessages();
    clearAvatarUrls();
    setChannel(undefined);
    setLoading(false);
  };

  // Calculate the banner height and the top margin for the avatar
  const windowHeight = Dimensions.get("window").height;
  const bannerHeight = windowHeight / 5;
  const avatarHeight = 170;
  const paddingHeight = 39;
  const bannerMargin = bannerHeight - avatarHeight / 2 - paddingHeight;

  return (
    <View flex={1} backgroundColor="#f2f2f2">
      <ToastViewport />
      <ToastDemo />
      {user ? (
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
              justifyContent: "space-between",
              backgroundColor: "#f2f2f2",
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
                  url={user.avatarUrl}
                  user={user}
                  onUpload={() => {}}
                  allowUpload={false}
                />
              </View>
            </View>

            <Button
              icon={Edit3}
              position="absolute"
              alignSelf="flex-end"
              right="$7"
              top="$7"
              style={{
                padding: "$4",
                height: 50,
                borderColor: "#ffffff",
                color: "#ffffff",
                borderRadius: 50,
              }}
              theme="active"
              onPress={() => navigation.navigate("EditProfile")}
              size="$6"
              variant="outlined"
            ></Button>

            <View padding="$7">
              <YStack space="$4" flex={1}>
                <YStack
                  marginTop={bannerMargin + 15}
                  space="$1"
                  paddingVertical="$3"
                  flex={1}
                >
                  <SizableText size="$7" textAlign="center">
                    {user.displayName
                      ? user.displayName
                      : "No display name yet"}
                  </SizableText>

                  <SizableText size="$5" textAlign="center">
                    @{user.username}
                  </SizableText>
                </YStack>

                <YStack>
                  <Card elevate size="$5">
                    <View marginLeft={25} marginRight={25}>
                      <SizableText
                        size="$5"
                        fontWeight="500"
                        paddingTop="$3"
                        paddingBottom="$3"
                      >
                        {user.bio ? user.bio : "No bio yet"}
                      </SizableText>
                    </View>
                  </Card>
                </YStack>

                <YStack>
                  <Sports sports={userSports} otherUser={false} />
                  <AddSport />
                </YStack>

                <YStack space="$6" alignItems="center" paddingTop="$3">
                  <Button
                    variant="outlined"
                    onPress={() => handleLogOut()}
                    size="$5"
                    color="#ff7403"
                    borderColor="#ff7403"
                    backgroundColor={"#ffffff"}
                    width="100%"
                  >
                    Log Out
                  </Button>
                </YStack>
              </YStack>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View flex={1} alignSelf="center" justifyContent="center">
          <H4 textAlign="center">No user on the session.</H4>
        </View>
      )}
    </View>
  );
}
