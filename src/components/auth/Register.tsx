import { useState } from "react";
import { Alert, View, AppState, Text } from "react-native";
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

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useStore((state) => [
    state.loading,
    state.setLoading,
  ]);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username,
        },
      },
    });
    if (error) {
      Alert.alert(error.message);
    } else {
      if (!session)
        Alert.alert("Please check your inbox for email verification!");
    }
    setLoading(false);
  }

  return (
    <View className="p-12">
      <SizableText size="$9" paddingBottom="$5" paddingTop="$10">
        Create an account
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
          testID="username-input"
          size="$5"
          placeholder="Username"
          value={username}
          onChangeText={(text: string) => setUsername(text)}
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

      <YStack space="$6" paddingTop="$2">
        <Button
          testID="register-button"
          theme="active"
          disabled={loading}
          onPress={() => signUpWithEmail()}
          size="$5"
        >
          Register
        </Button>
      </YStack>
    </View>
  );
}
