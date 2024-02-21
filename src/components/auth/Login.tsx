import { useState } from "react";
import { Alert, View, AppState } from "react-native";
import { supabase } from "../../lib/supabase";
//import { Button, Input } from "react-native-elements";
import {
  Input,
  Button,
  Label,
  TextArea,
  XStack,
  YStack,
  SizeTokens,
  SizableText,
} from "tamagui";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View className="p-12">
      <SizableText size="$10" paddingBottom="$5" paddingTop="$10">
        Welcome to Pickup!
      </SizableText>

      <YStack overflow="hidden" space="$2" paddingBottom="$2">
        <Input
          size="$5"
          placeholder="email@address.com"
          value={email}
          onChangeText={(text: string) => setEmail(text)}
          autoCapitalize={"none"}
        />

        <Input
          size="$5"
          placeholder={`Password`}
          secureTextEntry={true}
          value={password}
          onChangeText={(text: string) => setPassword(text)}
          autoCapitalize={"none"}
        />
      </YStack>

      <YStack space="$6">
        <Button
          theme="active"
          disabled={loading}
          onPress={() => signInWithEmail()}
          size="$5"
        >
          Login
        </Button>

        <Button
          variant="outlined"
          disabled={loading}
          onPress={() => navigation.navigate("Register")}
          size="$5"
        >
          Register
        </Button>
      </YStack>
    </View>
  );
}
