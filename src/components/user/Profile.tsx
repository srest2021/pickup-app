import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { ScrollView, View, Alert, Text } from "react-native";
//import { Button } from "react-native-elements";
import Avatar from "./Avatar";
import Sports from "../Sports";
import { Sport as SportType } from "../../lib/types";
import { Button, YStack } from "tamagui";

export default function Profile({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [bio, setBio] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [sports, setSports] = useState<SportType | null>(null);

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
        .select(
          `
            username, 
            display_name, 
            bio, 
            avatar_url,
            sports (
                id,
                name,
                skill_level
            )
        `,
        )
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }
      //console.log(data);

      if (data) {
        setUsername(data.username);
        setDisplayName(data.display_name);
        setBio(data.bio);
        setAvatarUrl(data.avatar_url);
        setSports(
          data.sports.map((sport) => ({
            id: sport.id,
            name: sport.name,
            skillLevel: sport.skill_level,
          })),
        );
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
    <ScrollView className="p-12">
      <View className="mb-10 items-center">
        <Avatar url={avatarUrl} onUpload={() => {}} allowUpload={false} />
      </View>

      <View className="py-0 self-stretch">
        <Text className="text-2xl text-center">
          {displayName ? displayName : "No display name"}
        </Text>
      </View>
      <View className="py-2 self-stretch">
        <Text className="text-xl text-center">@{username}</Text>
      </View>

      <View className="py-6 self-stretch">
        <Text className="text-lg font-bold">Bio</Text>
        <Text className="p-2 text-lg">{bio ? bio : "No bio yet"}</Text>
      </View>

      <Sports sports={sports} />

      <YStack space="$6" paddingTop="$5">
        <Button
          theme="active"
          disabled={loading}
          onPress={() => navigation.navigate("EditProfile")}
          size="$5"
        >
          Edit Profile
        </Button>

        <Button
          variant="outlined"
          onPress={() => supabase.auth.signOut()}
          size="$5"
        >
          Log Out
        </Button>
      </YStack>
    </ScrollView>
  );
}
