import { View, Text } from "react-native";
import {
  getSkillLevelString,
  SkillLevel,
  UserSport as SportType,
} from "../lib/types";

export default function Sport({ sport }: { sport: SportType }) {
  return (
    <View className="flex flex-row p-2">
      <View className="flex flex-grow">
        <Text className="text-lg" style={{ color: "#e90d52", paddingLeft: 12 }}>
          {sport.name}
        </Text>
      </View>

      <View className="flex flex-none">
        <Text className="text-lg" style={{ color: "#e90d52" }}>
          {getSkillLevelString(sport.skillLevel)}
        </Text>
      </View>
    </View>
  );
}
