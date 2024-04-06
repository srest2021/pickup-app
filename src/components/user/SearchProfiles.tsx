import {
  YStack,
  ScrollView,
  Spinner,
  Button,
  View,
  XStack,
  YGroup,
  ListItem,
} from "tamagui";
import { Alert } from "react-native";
import { Text } from "tamagui";
import { useState } from "react";
import { Input, Form } from "tamagui";
import { UserSearch } from "@tamagui/lucide-icons";
import useQueryUsers from "../../hooks/use-query-users";
import { ThumbnailUser } from "../../lib/types";
import OtherUserThumbnail from "./OtherUserThumbnail";
import { useStore } from "../../lib/store";

const SearchProfiles = ({ navigation }: { navigation: any }) => {
  const [results, setResults] = useStore((state) => [
    state.searchResults,
    state.setSearchResults,
  ]);
  const { searchByUsername } = useQueryUsers();
  const [currentInput, setCurrentInput] = useState<string>("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    // if (currentInput.trim().length < 1) {
    //   setCurrentInput("");
    //   Alert.alert("Please enter a search first!");
    //   return;
    // }
    setResults([]);

    setSearching(true);
    await searchByUsername(currentInput.trim());
    setSearching(false);
  };

  return (
    <View flex={1} padding="$5">
      <YStack flex={1} space="$3">
        <Form flexDirection="row" onSubmit={handleSearch}>
          <XStack flex={1} space="$3">
            <Input
              flex={1}
              borderWidth={2}
              placeholder="Search by username"
              autoCapitalize="none"
              onChangeText={(text: string) => setCurrentInput(text)}
              value={currentInput}
            />
            <Form.Trigger asChild>
              <Button
                backgroundColor="#e54b07"
                icon={searching ? () => <Spinner /> : UserSearch}
              ></Button>
            </Form.Trigger>
          </XStack>
        </Form>
        <ScrollView>
          <YStack space="$3">
            {results ? (
              <YGroup
                alignSelf="center"
                bordered
                width="100%"
                size="$4"
                flex={1}
                space="$3"
              >
                {results.map((user: ThumbnailUser) => (
                  <YGroup.Item key={`search-${user.id}`}>
                    <OtherUserThumbnail
                      navigation={navigation}
                      user={user}
                      isFriend={false}
                      isSearch={true}
                    />
                  </YGroup.Item>
                ))}
              </YGroup>
            ) : (
              <Text>No Search Yet</Text>
            )}
          </YStack>
        </ScrollView>
        {results.length > 0 && (
          <Button
            backgroundColor="#e54b07"
            onPress={() => {
              setResults([]);
              setCurrentInput("");
            }}
          >
            Clear All
          </Button>
        )}
      </YStack>
    </View>
  );
};

export default SearchProfiles;
