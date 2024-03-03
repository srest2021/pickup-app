import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./user/Profile";
import EditProfile from "./user/EditProfile";

export default function EditProfileNavigator() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Profile", headerShown: true }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: "Edit Profile", headerShown: true }}
      />
    </Stack.Navigator>
  );
}
