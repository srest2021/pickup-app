import { useStore } from "../../lib/store"
import { View } from "tamagui";
import GameView from "./GameView";


const Games = () => {
    const games = useStore((state)=> state.myGames)

    return (
        <View className="">
          {games.map((game) => (
              <GameView game={game} />
          ))}
        </View>
      );
};

export default Games;
