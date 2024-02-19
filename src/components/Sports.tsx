import { View, Text } from "react-native";
import { Sport as SportType } from "../lib/types";
import Sport from "./Sport";

export default function Sports({ sports }: { sports: any }) {
  return (
    <View>
      {sports ? (
        sports.map((sport: SportType) => <Sport sport={sport} />)
      ) : (
        <Text>No sports yet</Text>
      )}
    </View>
  );
}
