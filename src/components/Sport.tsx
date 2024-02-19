import { View, Text } from "react-native";
import { SkillLevel, Sport as SportType } from "../lib/types";

//import { styled } from 'nativewind';

//const StyledView = styled(View)
//const StyledText = styled(Text)

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
    <View className="p-2 flex flex-row">
      <View className="flex flex-grow">
        <Text className="text-lg">{sport.name}</Text>
      </View>

      <View className="flex flex-none">
        <Text className="text-lg">{getSkillLevelString(sport.skillLevel)}</Text>
      </View>
    </View>
  );
}
