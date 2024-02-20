import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "./src/lib/supabase";
import { Session } from "@supabase/supabase-js";
import "./global.css";
import EditProfile from "./src/components/user/EditProfile";
import Profile from "./src/components/user/Profile";
import Login from "./src/components/auth/Login";
import Register from "./src/components/auth/Register";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TamaguiProvider } from 'tamagui'
import appConfig from './tamagui.config'

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

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
              initialParams={{ key: session.user.id, session: session }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{ title: "Edit Profile" }}
              initialParams={{ key: session.user.id, session: session }}
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
