import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FriendPage from "./user/FriendPage";
import OtherProfile from "./user/OtherProfile";

export default function FriendNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Friends"
        component={FriendPage}
        options={{
          title: "Friends",
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
