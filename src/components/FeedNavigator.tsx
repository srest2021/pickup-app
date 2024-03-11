import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditGame from "./game/EditGame";
import JoinedGameView from "./game/JoinedGameView";
import Feed from "./Feed";
import GameView from "./game/GameView";

export default function FeedNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{ title: "Feed", headerShown: false }}
      />
      <Stack.Screen
        name="GameView"
        component={GameView}
        options={{ title: "Game View", headerShown: false }}
      />
    </Stack.Navigator>
  );
}
