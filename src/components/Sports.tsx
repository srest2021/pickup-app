import { View, Text } from "react-native";
import { Sport as SportType } from "../lib/types";
import Sport from "./Sport";

export default function Sports({ sports }: { sports: any }) {
  return (
    <View>
      <Text className="text-lg font-bold">My Sports</Text>
      <View className="bg-gray-200">
        {sports ? (
          sports.map((sport: SportType) => (
            <Sport key={sport.id} sport={sport} />
          ))
        ) : (
          <Text className="text-lg">No sports yet</Text>
        )}
      </View>
    </View>
  );
}
