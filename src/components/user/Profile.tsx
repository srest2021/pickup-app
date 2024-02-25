import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { ScrollView, View, Alert, Text } from "react-native";
import Avatar from "./Avatar";
import Sports from "../Sports";
import { Button, YStack } from "tamagui";
import useMutationUser from "../../hooks/use-mutation-user";
import { useStore } from "../../lib/store";
import { Dimensions } from 'react-native';
import { AddSport } from "./AddSport";


// Get the height of the screen
const windowHeight = Dimensions.get('window').height;

//const avatarMidpoint = avatarHeight / 2;

// Calculate the height for the top third
const topThirdHeight = windowHeight / 4;

export default function Profile({ navigation }) {
  const [loading] = useStore((state) => [state.loading]);
  const [isAddSportOpen, setAddSportOpen] = useState(false);

  const { user } = useMutationUser();

  const openAddSport = () => {
    setAddSportOpen(true);
  };

  const closeAddSport = () => {
    setAddSportOpen(false);
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingBottom: '100%',
        backgroundColor: "#ffffff",
      }}
    >
      <View style={{ backgroundColor: "#08348c", height: topThirdHeight, width: '100%'}} />
      {user ? (
        <View>
          
          <View className="items-center mb-10" style={{ marginTop: -topThirdHeight/3}}> 
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
          <Text style={{ fontSize: 25, fontWeight: 'bold', paddingLeft: 12 }}>Bio</Text>
            <Text className="p-2 text-lg">
              {user.bio ? user.bio : "No bio yet"}
            </Text>
          </View>

          <Sports sports={user.sports} />
          <AddSport />
          
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
    </View>
  );
}
