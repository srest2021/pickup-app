import { Text, Button, YStack, ScrollView, H4 } from "tamagui";
import { View } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import GameThumbnail from "./game/GameThumbnail";
import { useStore } from "../lib/store";

const MyGames = ({ navigation }: { navigation: any }) => {
  const [session] = useStore((state) => [state.session]);
  const { myGames } = useQueryGames();

  return (
    session && session.user ? (
    <View className="p-12">
      <ScrollView showsVerticalScrollIndicator={false}>
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
    ) : (
      <View className="p-12 text-center items-center flex-1 justify-center">
        <H4>Loading...</H4>
      </View>
    )
  );
};

export default MyGames;
