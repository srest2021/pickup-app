import "react-native-url-polyfill/auto";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TamaguiProvider, Text } from "tamagui";
import appConfig from "./tamagui.config";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import {
  AlignJustify,
  CircleUser,
  GalleryVerticalEnd,
  PersonStanding,
} from "@tamagui/lucide-icons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const { session } = useMutationUser();
  const { setUserLocation } = useQueryUsers();
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  const focusedColor = "#ff7403";
  const notFocusedColor = "#ffffff";

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
        {session && session.user ? (
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="Feed"
              screenOptions={{
                tabBarActiveTintColor: focusedColor,
                tabBarInactiveTintColor: notFocusedColor,
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
                    <GalleryVerticalEnd
                      color={focused ? focusedColor : notFocusedColor}
                    />
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
    </TamaguiProvider>
  );
}
