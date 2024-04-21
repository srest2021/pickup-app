import { UserSport, capitalizeFirstLetter } from "../../lib/types";
import SportSkill from "../SportSkill";
import { XStack, Text, View } from "tamagui";

export default function Sport({ sport }: { sport: UserSport }) {
  const sportName = capitalizeFirstLetter(sport.name);
  return (
    <View className="flex flex-row p-2">
      <XStack space="$3">
        <Text
          key={sport.id}
          textAlign="center"
          color="#ffffff"
          backgroundColor="#e90d52"
          paddingVertical="$2"
          paddingHorizontal="$3"
          style={{ borderRadius: 16, overflow: "hidden" }}
        >
          {sportName}
        </Text>
        <SportSkill sport={sport} />
      </XStack>
    </View>
  );
}
