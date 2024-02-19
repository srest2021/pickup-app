import { View, Text } from "react-native";
import { Sport as SportType } from "../lib/types";

export default function Sport({ sport }: { sport: SportType }) {
  return (
    <View className="py-2">
      <View className="">
        <Text>{sport.name}</Text>
      </View>
      <View className="">
        <Text>{sport.skillLevel}</Text>
      </View>
    </View>
  );
}
