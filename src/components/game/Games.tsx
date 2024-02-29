import { useStore } from "../../lib/store"
import { View, Text } from "tamagui";
import GameView from "./GameView";


const Games = () => {
    const games = useStore((state)=> state.myGames)

    return (
        <View className="">
          {games ? (
            games.map((game) => (
              <GameView game={game} />
            ))
          ) : (
            <Text>No Games Yet</Text>
          )}
        </View>
      );
      
};

export default Games;
