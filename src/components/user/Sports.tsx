//import { View, Text } from "react-native";
import { View, Text, H5 } from "tamagui";
import { UserSport } from "../../lib/types";
import Sport from "./Sport";

export default function Sports({ sports}: { sports: any}) {
  return (
    <View paddingBottom="$3" paddingTop="$3">
      <H5>My Sports</H5>
      <View>
        {sports && sports.length > 0 ? (
          sports.map((sport: UserSport) => (
            <Sport key={sport.id} sport={sport} />
          ))
        ) : (
          <Text>No sports yet</Text>
        )}
      </View>
    </View>
  );
}
