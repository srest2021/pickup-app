import { View, Text } from "react-native";
import { SkillLevel, Sport as SportType } from "../lib/types";

export default function Sport({ sport }: { sport: SportType }) {
  function getSkillLevelString(skillLevel: SkillLevel): string {
    switch (skillLevel) {
      case SkillLevel.Beginner:
        return "Beginner";
      case SkillLevel.Intermediate:
        return "Intermediate";
      case SkillLevel.Advanced:
        return "Advanced";
      default:
        return "Unknown";
    }
  }

  return (
    <View className="flex flex-row p-2">
      <View className="flex flex-grow">
        <Text className="text-lg" style={{ color: '#e90d52', paddingLeft: 12 }}>{sport.name}</Text>
      </View>

      <View className="flex flex-none">
        <Text className="text-lg" style={{ color: '#e90d52' }}>{getSkillLevelString(sport.skillLevel)}</Text>
      </View>
    </View>
  );
}
