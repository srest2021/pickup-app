import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditGame from "./game/EditGame";
import JoinedGameView from "./game/JoinedGameView";
import Feed from "./Feed";
import GameView from "./game/GameView";
import OtherProfile from "./user/OtherProfile";

export default function FeedNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{
          title: "Feed",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#08348c",
          },
          headerTitleStyle: {
            color: "#ffffff",
          },
        }}
      />
      <Stack.Screen
        name="GameView"
        component={GameView}
        options={{
          title: "Feed Game",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#08348c",
          },
          headerTitleStyle: {
            color: "#ffffff",
          },
          headerTintColor: "#ffffff",
        }}
      />
    
    <Stack.Screen
    name="OtherProfileView"
    component={OtherProfile}
    options={{
      title: "Other Profile",
      headerShown: true,
      headerStyle: {
        backgroundColor: "#08348c",
      },
      headerTitleStyle: {
        color: "#ffffff",
      },
      headerTintColor: "#ffffff",
    }}
  />
</Stack.Navigator>
  );
}
