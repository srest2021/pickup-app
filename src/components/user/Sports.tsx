//import { View, Text } from "react-native";
import { View, Text, H5, YStack } from "tamagui";
import { UserSport } from "../../lib/types";
import Sport from "./Sport";

export default function Sports({
  sports,
  otherUser,
}: {
  sports: any;
  otherUser: boolean;
}) {
  return (
    <YStack paddingBottom="$3" paddingTop="$3" space="$2">
      <H5>{otherUser ? "Sports" : "My Sports"}</H5>
      <YStack space="$3">
        {sports && sports.length > 0 ? (
          sports.map((sport: UserSport) => (
            <Sport key={sport.id} sport={sport} />
          ))
        ) : (
          <Text>No sports yet</Text>
        )}
      </YStack>
    </YStack>
  );
}
