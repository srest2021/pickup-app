import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyGames from "./MyGames";
import MyGameView from "./game/MyGameView";
import EditGame from "./game/EditGame";
import JoinedGameView from "./game/JoinedGameView";
import Chatroom from "./chatroom/Chatroom";
import OtherProfile from "./user/OtherProfile";

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
            backgroundColor: "#08348c",
          },
          headerTitleStyle: {
            color: "#ffffff",
          },
        }}
      />
      <Stack.Screen
        name="MyGameView"
        component={MyGameView}
        options={{
          title: "My Game",
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
        name="JoinedGameView"
        component={JoinedGameView}
        options={{
          title: "Joined Game",
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
        name="Chatroom"
        component={Chatroom}
        options={{
          title: "Chatroom",
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
        name="EditGame"
        component={EditGame}
        options={{
          title: "Edit Game",
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
