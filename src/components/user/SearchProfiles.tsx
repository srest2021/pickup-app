import { YStack, ScrollView, Spinner, Button, View, XStack } from "tamagui";
import { Alert } from "react-native";
import { Text } from "tamagui";
import { useEffect, useState } from "react";
import { Input, Form } from "tamagui";
import { UserSearch } from "@tamagui/lucide-icons";
import useQueryUsers from "../../hooks/use-query-users";
import { ThumbnailUser } from "../../lib/types";
import OtherUserThumbnail from "./OtherUserThumbnail";
import { useStore } from "../../lib/store";

const SearchProfiles = ({ navigation }: { navigation: any }) => {
  const [loading, setLoading] = useStore((state) => [
    state.loading,
    state.setLoading,
  ]);
  const { searchByUsername } = useQueryUsers();
  const [currentInput, setCurrentInput] = useState<string>("");
  const [results, setResults] = useState<ThumbnailUser[]>([]);

  const handleSearch = async () => {
    // if (currentInput.length < 1) {
    //   Alert.alert("Please enter a search first!");
    //   return;
    // }

    setLoading(true);
    const results = await searchByUsername(currentInput);
    if (results) {
      setResults(results);
    }
    setLoading(false);
  };

  return (
    <View padding="$5">
      <Form flexDirection="row" onSubmit={handleSearch}>
        <XStack flex={1} space="$3">
          <Input
            flex={1}
            borderWidth={2}
            placeholder="Search by username"
            autoCapitalize="none"
            onChangeText={(text: string) => setCurrentInput(text)}
          />
          <Form.Trigger asChild>
            <Button
              backgroundColor="#e54b07"
              icon={loading ? () => <Spinner /> : UserSearch}
            ></Button>
          </Form.Trigger>
        </XStack>
      </Form>
      <ScrollView contentContainerStyle={{}}>
        <YStack paddingVertical="$3" space="$3">
          {results ? (
            results.map((user: ThumbnailUser) => (
              <OtherUserThumbnail
                key={user.id}
                navigation={navigation}
                user={user}
              />
            ))
          ) : (
            <Text>No Search Yet</Text>
          )}
        </YStack>
      </ScrollView>
    </View>
  );
};

export default SearchProfiles;
