import { View, Text } from "react-native";
import { UserSport } from "../lib/types";
import Sport from "./Sport";

export default function Sports({ sports }: { sports: any }) {
  return (
    <View>
      <Text className="text-lg font-bold" style={{paddingLeft: 12}}>My Sports</Text>
      <View>
        {sports && sports.length > 0 ? (
          sports.map((sport: UserSport) => (
            <Sport key={sport.id} sport={sport} />
          ))
        ) : (
          <Text className="text-lg" style={{ paddingLeft: 12 }}>No sports yet</Text>
        )}
      </View>
    </View>
  );
}
