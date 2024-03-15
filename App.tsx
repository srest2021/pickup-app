import "react-native-url-polyfill/auto";
import "./global.css";
import Login from "./src/components/auth/Login";
import Register from "./src/components/auth/Register";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TamaguiProvider } from "tamagui";
import appConfig from "./tamagui.config";
import useMutationUser from "./src/hooks/use-mutation-user";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddGame from "./src/components/game/AddGame";
import EditProfileNavigator from "./src/components/EditProfileNavigator";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import {
  PlusCircle,
  AlignJustify,
  CircleUser,
  GalleryVerticalEnd,
} from "@tamagui/lucide-icons";
import MyGamesNavigator from "./src/components/MyGamesNavigator";
import FeedNavigator from "./src/components/FeedNavigator";
import { ToastProvider } from "@tamagui/toast";
import useQueryUsers from "./src/hooks/use-query-users";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const { session } = useMutationUser();
  const { setUserLocation } = useQueryUsers();
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    if (loaded) {
      // can hide splash screen here
    }
  }, [loaded]);

  useEffect(() => {
    if (session && session.user) {
      setUserLocation();
    }
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={appConfig}>
      <ToastProvider>
        {session && session.user ? (
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="Feed"
              screenOptions={{
                tabBarActiveTintColor: "grey",
                tabBarInactiveTintColor: "white",
                tabBarStyle: {
                  backgroundColor: "#08348c", // Set background color of the tab bar to blue
                },
                headerStyle: {
                  backgroundColor: "#08348c",
                },
                headerTintColor: "#ffffff",
                headerTitleStyle: {
                  color: "#ffffff",
                },
              }}
            >
              <Tab.Screen
                name="Games Feed"
                component={FeedNavigator}
                options={{
                  tabBarLabel: "Feed",
                  tabBarIcon: ({ color, size, focused }) => (
                    <GalleryVerticalEnd color={focused ? "grey" : "#ffffff"} />
                  ),
                  headerShown: false,
                }}
                initialParams={{ key: session.user.id }}
              />
              <Tab.Screen
                name="My Games"
                component={MyGamesNavigator}
                options={{
                  tabBarLabel: "My Games",
                  tabBarIcon: ({ color, size, focused }) => (
                    <AlignJustify color={focused ? "grey" : "#ffffff"} />
                  ),
                  headerShown: false,
                }}
                initialParams={{ key: session.user.id }}
              />
              <Tab.Screen
                name="Add Game"
                component={AddGame}
                options={{
                  tabBarLabel: "Add Game",
                  tabBarIcon: ({ color, size, focused }) => (
                    <PlusCircle color={focused ? "grey" : "#ffffff"} />
                  ),
                }}
                initialParams={{ key: session.user.id }}
              />
              <Tab.Screen
                name="My Profile"
                component={EditProfileNavigator}
                options={{
                  tabBarLabel: "Profile",
                  tabBarIcon: ({ color, size, focused }) => (
                    <CircleUser color={focused ? "grey" : "#ffffff"} />
                  ),
                  headerShown: false,
                }}
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
      </ToastProvider>
    </TamaguiProvider>
  );
}
