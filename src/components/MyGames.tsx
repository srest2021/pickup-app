import { Text, Button, YStack, ScrollView } from "tamagui";
import { View } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import GameThumbnail from "./game/GameThumbnail";

const MyGames = ({ navigation }: { navigation: any }) => {
  const { myGames } = useQueryGames();

  return (
    <View className="p-12">
      <ScrollView>
        <YStack space="$5" padding="12">
          {myGames.map((myGame) => (
            <GameThumbnail
              navigation={navigation}
              game={myGame}
              key={myGame.id}
            />
          ))}
        </YStack>
      </ScrollView>
    </View>
  );
};

export default MyGames;
