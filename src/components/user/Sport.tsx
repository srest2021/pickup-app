import { View, Text } from "react-native";
import { UserSport } from "../../lib/types";
import GameSkillView from "../game/GameSkillView";
import { XStack } from "tamagui";

export default function Sport({ sport }: { sport: UserSport }) {
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
          <Text className="text-lg" style={{ color: "white" }}>
            {sport.name}
          </Text>
        </View>
        <GameSkillView sport={sport} />
      </XStack>
    </View>
  );
}
