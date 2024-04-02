import { supabase } from "../../lib/supabase";
import { ScrollView, View, Text } from "react-native";
import Avatar from "./Avatar";
import Sports from "./Sports";
import { Button, Card, SizableText, YStack } from "tamagui";
import useMutationUser from "../../hooks/use-mutation-user";
import { useStore } from "../../lib/store";
import { Dimensions } from "react-native";
import { Edit3, Loader } from "@tamagui/lucide-icons";
import AddSport from "./AddSport";
import { ToastViewport, useToastController } from "@tamagui/toast";
import { ToastDemo } from "../Toast";

// Get the height of the screen
const windowHeight = Dimensions.get("window").height;

// Calculate the height for the top third
const topThirdHeight = windowHeight / 4;

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
    setAvatarUrls,
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
    state.setAvatarUrls,
    state.setChannel,
  ]);
  const { setSport } = useMutationUser();
  const toast = useToastController();

  const handleSportSelect = async (
    sportName: string,
    sportSkillLevel: number,
  ) => {
    // Handle the new sport as needed
    const userSport = await setSport(sportName, sportSkillLevel);
    // Comment out this toast, because if you go to My Game View,
    // it will pop up there as well.
    // if (userSport) {
    //   toast.show("Success!", {
    //     message: "Sport added.",
    //   });
    // }
  };

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
    setAvatarUrls([]);
    setChannel(undefined);
    setLoading(false);
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
        >
          <Button
            icon={loading ? Loader : Edit3}
            theme="active"
            disabled={loading}
            onPress={() => navigation.navigate("EditProfile")}
            size="$5"
            color="#ffffff"
            borderColor="#ffffff"
            variant="outlined"
          ></Button>
        </View>

        <View className="p-12">
          {user ? (
            <View>
              <View
                className="items-center mb-10"
                style={{ marginTop: -topThirdHeight / 2 }}
              >
                <Avatar
                  url={user.avatarUrl}
                  onUpload={() => {}}
                  allowUpload={false}
                />
              </View>

              <View className="self-stretch py-0">
                <Text className="text-2xl text-center">
                  {user.displayName ? user.displayName : "No display name"}
                </Text>
              </View>
              <View className="self-stretch py-2">
                <Text className="text-xl text-center">@{user.username}</Text>
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
                      {user.bio ? user.bio : "No bio yet"}
                    </SizableText>
                  </View>
                </Card>
              </YStack>

              <Sports sports={userSports} />

              <AddSport onSportSelect={handleSportSelect} />
            </View>
          ) : (
            <Text>No user on the session.</Text>
          )}

          <YStack space="$6" paddingTop="$5" alignItems="center">
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
        </View>
      </ScrollView>
    </View>
  );
}
