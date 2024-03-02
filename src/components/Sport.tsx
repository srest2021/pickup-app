import { View, Text } from "react-native";
import {
  getSkillLevelString,
  SkillLevel,
  UserSport as SportType,
} from "../lib/types";

export default function Sport({ sport }: { sport: SportType }) {
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
