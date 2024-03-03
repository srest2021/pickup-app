import { useState } from "react";
import { ScrollView, View } from "react-native";
import Avatar from "./Avatar";
import { Input, Button, Text, YStack, XStack, Label, TextArea } from "tamagui";
import { useStore } from "../../lib/store";
import useMutationUser from "../../hooks/use-mutation-user";
import { ToastViewport, useToastController } from "@tamagui/toast";
import { ToastDemo } from "../Toast";

export default function EditProfile() {
  const [session, loading, user] = useStore((state) => [
    state.session,
    state.loading,
    state.user,
  ]);

  const { updateProfile } = useMutationUser();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");

  const toast = useToastController();

  const handleUpdate = async (
    username: string,
    displayName: string,
    bio: string,
    avatarUrl: string,
  ) => {
    const updatedUser = await updateProfile(
      username,
      displayName,
      bio,
      avatarUrl,
    );

    if (updatedUser) {
      toast.show("Success!", {
        message: "Your profile was updated.",
      });
    } else {
      toast.show("Error!", {
        message: "Please try again later",
      });
    }
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1, padding: 35 }}>
      <ToastViewport />
      <ToastDemo />
      {user ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
          }}
        >
          <XStack space="$5" alignItems="center" justifyContent="space-between">
            <Label size="$5" color={"#08348c"}>
              Email
            </Label>
            <Input
              disabled={true}
              flex={1}
              size="$5"
              value={session?.user?.email}
            />
          </XStack>

          <XStack space="$5" alignItems="center" justifyContent="space-between">
            <Label size="$5" color={"#08348c"}>
              Display Name
            </Label>
            <Input
              flex={1}
              size="$5"
              value={displayName}
              onChangeText={(text: string) => setDisplayName(text)}
            />
          </XStack>

          <YStack space="$1">
            <Label size="$5" color={"#08348c"}>
              Bio
            </Label>
            <TextArea
              size="$5"
              placeholder="Enter your game details (optional)"
              testID="descriptionInput"
              value={bio}
              onChangeText={(text: string) => setBio(text)}
            />
          </YStack>

          <View className="items-center">
            <Avatar
              url={user.avatarUrl}
              onUpload={(url: string) => {
                setAvatarUrl(url);
                handleUpdate(user.username, displayName, bio, avatarUrl);
              }}
              allowUpload={true}
            />
          </View>

          <YStack space="$6" paddingTop="$5" alignItems="center">
            <Button
              theme="active"
              color="#ff7403"
              borderColor="#ff7403"
              variant="outlined"
              disabled={loading}
              onPress={() =>
                handleUpdate(user.username, displayName, bio, avatarUrl)
              }
              size="$5"
              width="94%"
            >
              {loading ? "Loading..." : "Update"}
            </Button>
          </YStack>
        </ScrollView>
      ) : (
        <Text>No user on the session.</Text>
      )}
    </View>
  );
}
