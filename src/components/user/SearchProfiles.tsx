import {
  YStack,
  ScrollView,
  Spinner,
  Button,
  View,
  XStack,
  YGroup,
  SizableText,
} from "tamagui";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input, Form } from "tamagui";
import { UserSearch } from "@tamagui/lucide-icons";
import useQueryUsers from "../../hooks/use-query-users";
import { ThumbnailUser } from "../../lib/types";
import OtherUserThumbnail from "./OtherUserThumbnail";
import { useStore } from "../../lib/store";
import { debounce } from "lodash";
import { Alert } from "react-native";

const SearchProfiles = ({ navigation }: { navigation: any }) => {
  const [loading, results, setResults] = useStore((state) => [
    state.loading,
    state.searchResults,
    state.setSearchResults,
  ]);
  const { searchByUsername } = useQueryUsers();
  const [currentInput, setCurrentInput] = useState<string>("");
  const [searching, setSearching] = useState(false);
  const latestInputRef = useRef('');

  const debouncedSearch = useCallback(
    debounce(async (input: string) => {
      setSearching(true);
      console.log("debounced search: ",input)
      const users = await searchByUsername(input.trim(), true);
      if (users && input.trim() === latestInputRef.current) {
        console.log(`setting results for: ${input.trim()} ${latestInputRef.current}`)
        setResults(users);
      } else {
        console.log(`skipping results for: ${input.trim()} ${currentInput.trim()}`)
      }
      setSearching(false);
    }, 300),
    [],
  );

  const regularSearch = async () => {
    if (currentInput.trim().length > 0) {
      setSearching(true);
      await searchByUsername(currentInput.trim(), false);
      setSearching(false);
    } else {
      Alert.alert("Search field cannot be empty!");
    }
  };

  const handleTextChange = async (input: string) => {
    console.log("HELLO?")
    setCurrentInput(input);
    latestInputRef.current = input.trim();
    if (input.trim().length > 0) {
      debouncedSearch(input);
    } else {
      console.log("no")
    }
  };

  // clear pending debounced calls on component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  return (
    <View flex={1} padding="$5">
      <YStack flex={1} space="$3">
        <Form flexDirection="row" onSubmit={regularSearch}>
          <XStack flex={1} space="$3">
            <Input
              flex={1}
              borderWidth={2}
              placeholder="Search for other users"
              autoCapitalize="none"
              onChangeText={(text: string) => handleTextChange(text)}
              value={currentInput}
            />
            <Form.Trigger asChild>
              <Button
                disabled={searching}
                size="$4"
                width={50}
                testID="search-button"
                backgroundColor="#e54b07"
                icon={
                  searching ? (
                    () => <Spinner color="#ffffff" />
                  ) : (
                    <UserSearch color="#ffffff" />
                  )
                }
              ></Button>
            </Form.Trigger>
          </XStack>
        </Form>
        <YStack flex={1}>
          {results ? (
            results.length > 0 ? (
              <View flex={1}>
                <ScrollView>
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
                </ScrollView>
              </View>
            ) : (
              <View flex={1} alignSelf="center" justifyContent="center">
                <SizableText size="$5" textAlign="center">
                  No search results.
                </SizableText>
              </View>
            )
          ) : (
            !searching && (
              <View flex={1} alignSelf="center" justifyContent="center">
                <SizableText size="$5" textAlign="center">
                  No search yet.
                </SizableText>
              </View>
            )
          )}
        </YStack>

        <Button
          backgroundColor="#e54b07"
          color="#ffffff"
          onPress={() => {
            setResults(null);
            setCurrentInput("");
          }}
        >
          Clear All
        </Button>
      </YStack>
    </View>
  );
};

export default SearchProfiles;
