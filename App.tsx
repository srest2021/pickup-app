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
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feed from "./src/components/Feed";
import AddGame from "./src/components/AddGame";
import MyGames from "./src/components/MyGames";
import { Text } from 'react-native'; //will eventually not need this
import EditProfileNavigator from "./src/components/EditProfileNavigator";
import { useFonts } from 'expo-font'
import { useEffect } from "react";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const { session } = useMutationUser();
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      // can hide splash screen here
    }
  }, [loaded])

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={appConfig}>
          {session && session.user ? (
            <NavigationContainer>
            <Tab.Navigator
            initialRouteName="Feed"
            screenOptions={{
              tabBarActiveTintColor: '#e91e63',
            }}>
              <Tab.Screen
                name="Feed"
                component={Feed}
                options={{ tabBarLabel: "Feed",
                tabBarIcon: ({ color, size }) => (
                  <Text> Feed </ Text>
                ),}}
                initialParams={{ key: session.user.id }}
              />
              <Tab.Screen
                name="MyGames"
                component={MyGames}
                options={{ tabBarLabel: "MyGames",
                tabBarIcon: ({ color, size }) => (
                  <Text> My Games </ Text>
                ),}}
                initialParams={{ key: session.user.id }}
              />
              <Tab.Screen
                name="AddGame"
                component={AddGame}
                options={{ tabBarLabel: "AddGame",
                tabBarIcon: ({ color, size }) => (
                  <Text> Add Game </Text>
                ),}}
                initialParams={{ key: session.user.id }}
              />
              <Tab.Screen
                name="ProfileOptions"
                component={EditProfileNavigator}
                options={{ tabBarLabel: "Profile",
                tabBarIcon: ({ color, size }) => (
                  <Text>Profile </ Text>
                ),}}
                initialParams={{ key: session.user.id }}
              />

            </Tab.Navigator>
      </NavigationContainer>
          ) : (
            <NavigationContainer>
              <Stack.Navigator>
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
              </Stack.Navigator>
            </NavigationContainer>
          )}
        
    </TamaguiProvider>
  );
}


