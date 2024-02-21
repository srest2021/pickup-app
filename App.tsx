import "react-native-url-polyfill/auto";
import "./global.css";
import EditProfile from "./src/components/user/EditProfile";
import Profile from "./src/components/user/Profile";
import Login from "./src/components/auth/Login";
import Register from "./src/components/auth/Register";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TamaguiProvider } from "tamagui";
import appConfig from "./tamagui.config";
import useMutationUser from "./src/hooks/use-mutation-user";

const Stack = createNativeStackNavigator();

export default function App() {
  const { session } = useMutationUser();

  return (
    <TamaguiProvider config={appConfig}>
      <NavigationContainer>
        <Stack.Navigator>
          {session && session.user ? (
            <>
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={{ title: "Profile" }}
                initialParams={{ key: session.user.id }}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{ title: "Edit Profile" }}
                initialParams={{ key: session.user.id }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ title: "Login" }}
              />
              <Stack.Screen
                name="Register"
                component={Register}
                options={{ title: "Register" }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}
