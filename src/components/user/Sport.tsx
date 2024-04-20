import { View, Text } from "react-native";
import { UserSport, capitalizeFirstLetter } from "../../lib/types";
import SportSkill from "../SportSkill";
import { XStack } from "tamagui";

export default function Sport({ sport }: { sport: UserSport }) {
  const sportName = capitalizeFirstLetter(sport.name);
  return (
    <View className="flex flex-row p-2">
      <XStack>
        <View
          style={{
            backgroundColor: "#e90d52",
            borderRadius: 50,
            padding: 8,
            marginRight: 10, // Adjust margin as needed
          }}
        >
          <Text key={sport.id} className="text-lg" style={{ color: "white" }}>
            {sportName}
          </Text>
        </View>
        <SportSkill sport={sport} />
      </XStack>
    </View>
  );
}
