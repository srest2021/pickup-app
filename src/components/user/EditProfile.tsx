import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Input } from "react-native-elements";
import Avatar from "./Avatar";
import { Button, Text, YStack } from "tamagui";
import { useStore } from "../../lib/store";
import useMutationUser from "../../hooks/use-mutation-user";

export default function EditProfile() {
  const [loading] = useStore((state) => [state.loading]);

  const { session, user, updateProfile } = useMutationUser();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");

  return (
    <View>
      {user ? (
        <ScrollView className="p-12 mt-0">
          <View className="py-4 self-stretch">
            <Input label="Email" value={session?.user?.email} disabled />
          </View>

          <View className="py-4 self-stretch">
            <Input
              label="Display Name"
              value={displayName}
              onChangeText={(text: string) => setDisplayName(text)}
            />
          </View>

          <View className="py-4 self-stretch">
            <Input
              label="Bio"
              value={bio}
              onChangeText={(text: string) => setBio(text)}
            />
          </View>

          <View className="items-center">
            <Avatar
              url={user.avatarUrl}
              onUpload={(url: string) => {
                setAvatarUrl(url);
                updateProfile(displayName, bio, avatarUrl);
              }}
              allowUpload={true}
            />
          </View>

          <YStack space="$6" paddingTop="$5">
            <Button
              theme="active"
              disabled={loading}
              onPress={() => updateProfile(displayName, bio, avatarUrl)}
              size="$5"
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
