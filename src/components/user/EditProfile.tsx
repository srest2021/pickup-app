import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { ScrollView, View, Alert } from "react-native";
import { Input } from "react-native-elements";
import Avatar from "./Avatar";
import { Button, YStack } from "tamagui";

export default function EditProfile({ route }) {
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const { session } = route.params;

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`display_name, bio, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setDisplayName(data.display_name);
        setBio(data.bio);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    display_name,
    bio,
    avatar_url,
  }: {
    display_name: string;
    bio: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        display_name,
        bio,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="p-12 mt-0">
      <View className="py-4 self-stretch">
        <Input label="Email" value={session?.user?.email} disabled />
      </View>

      <View className="py-4 self-stretch">
        <Input
          label="Display Name"
          value={displayName || ""}
          onChangeText={(text: string) => setDisplayName(text)}
        />
      </View>

      <View className="py-4 self-stretch">
        <Input
          label="Bio"
          value={bio || ""}
          onChangeText={(text: string) => setBio(text)}
        />
      </View>
      
      <View className="items-center">
        <Avatar
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({
              display_name: displayName,
              bio,
              avatar_url: url,
            });
          }}
          allowUpload={true}
        />
      </View>

      <YStack space="$6" paddingTop="$5">
        <Button
          theme="active"
          disabled={loading}
          onPress={() =>
            updateProfile({
              display_name: displayName,
              bio,
              avatar_url: avatarUrl,
            })
          }
          size="$5"
        >
          {loading ? "Loading..." : "Update"}
        </Button>
      </YStack>
    </ScrollView>
  );
}
