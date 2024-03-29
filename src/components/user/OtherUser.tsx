import { ScrollView, View, Text } from "react-native";
import Avatar from "./Avatar";
import Sports from "./Sports";
import { Button, Card, SizableText, YStack } from "tamagui";
import { useStore } from "../../lib/store";
import { Dimensions } from "react-native";
import { ToastViewport, useToastController } from "@tamagui/toast";
import { ToastDemo } from "../Toast";

// Get the height of the screen
const windowHeight = Dimensions.get("window").height;

// Calculate the height for the top third
const topThirdHeight = windowHeight / 4;

export default function OtherProfile({ navigation }: { navigation: any }) {
  const [
    loading,
    setLoading,
    otherUser,
    user,
  ] = useStore((state) => [
    state.loading,
    state.setLoading,
    state.otherUser,
    state.user
  ]);
  const toast = useToastController();

 
  function handleRequestLogic() {
    // TODO
  }
  

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

        <View className="p-12">
          {otherUser && user ? (
            <View>
              <View
                className="items-center mb-10"
                style={{ marginTop: -topThirdHeight / 2 }}
              >
                <Avatar
                  url={otherUser.avatarUrl}
                  onUpload={() => {}}
                  allowUpload={false}
                />
              </View>

              <View className="self-stretch py-0">
                <Text className="text-2xl text-center">
                  {otherUser.displayName ? otherUser.displayName : "No display name"}
                </Text>
              </View>
              <View className="self-stretch py-2">
                <Text className="text-xl text-center">@{otherUser.username}</Text>
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
            </View>
          ) : (
            <Text>No user on the session.</Text>
          )}

          <YStack space="$6" paddingTop="$5" alignItems="center">
            <Button
              variant="outlined"
              onPress={() => handleRequestLogic()}
              size="$5"
              color="#ff7403"
              borderColor="#ff7403"
              backgroundColor={"#ffffff"}
              width="100%"
            >
              Request
            </Button>
          </YStack>
        </View>
      </ScrollView>
    </View>
  );
}
