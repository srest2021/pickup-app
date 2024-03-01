import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { ScrollView, View, Alert, Text } from "react-native";
import Avatar from "./Avatar";
import Sports from "../Sports";
import { Button, YStack } from "tamagui";
import useMutationUser from "../../hooks/use-mutation-user";
import { useStore } from "../../lib/store";
import { Dimensions } from 'react-native';
import { Edit3 } from "@tamagui/lucide-icons";
import AddSport from "./AddSport";
import { SkillLevel, Sport } from "../../lib/types";



// Get the height of the screen
const windowHeight = Dimensions.get('window').height;

//const avatarMidpoint = avatarHeight / 2;

// Calculate the height for the top third
const topThirdHeight = windowHeight / 4;

export default function Profile({ navigation }) {
  const [loading] = useStore((state) => [state.loading]);
  const [isAddSportOpen, setAddSportOpen] = useState(false);

  //const { user } = useMutationUser();
  const { user, updateProfile } = useMutationUser();

  useEffect(() => {
    // Make sure user is not undefined to avoid unnecessary calls
    if (user) {
      // Your logic to update the user's profile
      console.log('User updated:', user);
    }
  }, [user]);

  const handleAddSport = (selectedSport: string) => {
    console.log("entered");
    // Check if the selected sport is not already in the user's sports array
    if (!user.sports.some((sport) => sport.name === selectedSport)) {

      const newSport: Sport = { id: "1", name: selectedSport, skillLevel: SkillLevel.Beginner };

      // Call the updateUser mutation to update the user's data
      updateProfile(undefined, undefined, undefined, [...user.sports, newSport]);
    }
  };

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
        flexGrow: 1, 
        justifyContent: 'space-between', 
        backgroundColor: "#ffffff",
      }}
    >
      <View style={{ backgroundColor: "#08348c", height: topThirdHeight, width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start', padding: 12}}>
      <Button
          icon = { Edit3 }
          theme="active"
          disabled={loading}
          onPress={() => navigation.navigate("EditProfile")}
          size="$5"
          color="#ffffff"
          borderColor="#ffffff"
          variant="outlined"
        >
        </Button>
      </View>
      {user ? (
        <View>
        
          <View className="items-center mb-10" style={{ marginTop: -topThirdHeight/2}}> 
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
          <AddSport onSportSelect={handleAddSport} userSports={user.sports} />
          
        </View>
      ) : (
        <Text>No user on the session.</Text>
      )}

      <YStack space="$6" paddingTop="$5" alignItems="center">

        <Button
          variant="outlined"
          onPress={() => supabase.auth.signOut()}
          size="$5"
          color="#ff7403"
          borderColor="#ff7403"
          width="94%"
        >
          Log Out
        </Button>
      </YStack>
    </ScrollView>
    </View>
  );
}
