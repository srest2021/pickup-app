import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { ScrollView, View, Alert, Text } from "react-native";
import Avatar from "./Avatar";
import Sports from "../Sports";
import { Button, YStack } from "tamagui";
import useMutationUser from "../../hooks/use-mutation-user";
import { useStore } from "../../lib/store";

export default function Profile({ navigation }) {
  const [loading] = useStore((state) => [state.loading]);
  const { user } = useMutationUser();

  return (
    <ScrollView style={{ backgroundColor: "#1270a5" }} contentContainerStyle={{ padding: 12 }}>
      {user ? (
        <View>
          <View className="items-center mb-10">
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

          

          <View className="self-stretch py-6">
            <Text className="text-lg font-bold">Bio</Text>
            <Text className="p-2 text-lg">
              {user.bio ? user.bio : "No bio yet"}
            </Text>
          </View>

          <Sports sports={user.sports} />
          <Button size="$3" style={{ alignSelf: "flex-start" }}>Add Sport</Button>
          
        </View>
      ) : (
        <Text>No user on the session.</Text>
      )}

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
