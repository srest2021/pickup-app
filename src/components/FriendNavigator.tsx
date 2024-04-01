import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./user/Profile";
import EditProfile from "./user/EditProfile";
import FriendPage from "./user/FriendPage";

export default function EditProfileNavigator() {
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
    </Stack.Navigator>
  );
}