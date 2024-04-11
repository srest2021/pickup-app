import { useState } from "react";
import { Alert, View, AppState } from "react-native";
import { supabase } from "../../lib/supabase";
import { Input, Button, YStack, SizableText } from "tamagui";
import { useStore } from "../../lib/store";

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

export default function Login({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useStore((state) => [
    state.loading,
    state.setLoading,
  ]);

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
          testID="email-input"
          size="$5"
          placeholder="email@address.com"
          value={email}
          onChangeText={(text: string) => setEmail(text)}
          autoCapitalize={"none"}
        />

        <Input
          testID="password-input"
          size="$5"
          placeholder={`Password`}
          secureTextEntry={true}
          value={password}
          onChangeText={(text: string) => setPassword(text)}
          autoCapitalize={"none"}
        />
      </YStack>

      <YStack space="$3" paddingTop="$2">
        <Button
          testID="signin-button"
          theme="active"
          disabled={loading}
          onPress={() => signInWithEmail()}
          size="$5"
          color="#ff7403"
          borderColor="#ff7403"
          backgroundColor={"white"}
          variant="outlined"
        >
          {loading ? "Loading..." : "Login"}
        </Button>

        <Button
          testID="register-button"
          disabled={loading}
          onPress={() => navigation.navigate("Register")}
          size="$5"
          color="#ff7403"
          backgroundColor="#f2f2f2"
        >
          Create an account instead
        </Button>
      </YStack>
    </View>
  );
}
