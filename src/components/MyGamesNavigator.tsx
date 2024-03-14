import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyGames from "./game/MyGames";
import MyGameView from "./game/MyGameView";
import EditGame from "./game/EditGame";

export default function MyGamesNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyGames"
        component={MyGames}
        options={{ 
          title: "My Games", 
          headerShown: true,
          headerStyle: {
            backgroundColor: '#08348c',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          }, 
        }}
      />
      <Stack.Screen
        name="MyGameView"
        component={MyGameView}
        options={{ 
          title: "My Game View", 
          headerShown: true,
          headerStyle: {
            backgroundColor: '#08348c',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          }, 
          headerTintColor: '#ffffff',
        }}
      />
      <Stack.Screen
        name="EditGame"
        component={EditGame}
        options={{ 
          title: "Edit Game", 
          headerShown: true,
          headerStyle: {
            backgroundColor: '#08348c',
          },
          headerTitleStyle: {
            color: '#ffffff', 
          }, 
        }}
      />
    </Stack.Navigator>
  );
}
