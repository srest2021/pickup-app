import { View, ScrollView, Alert, TouchableOpacity, Text } from "react-native";
import useMutationGame from "../../hooks/use-mutation-game";
import {
  Adapt,
  Button,
  Label,
  Input,
  RadioGroup,
  Select,
  Sheet,
  TextArea,
  XStack,
  YStack,
  H4,
  Switch,
  SizableText,
} from "tamagui";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "../../lib/store";
import { Check, ChevronDown, Unlock, Lock } from "@tamagui/lucide-icons";
import { SkillLevel, capitalizedSports } from "../../lib/types";
import DateTimePicker from "@react-native-community/datetimepicker";

const AddGame = ({ navigation }: { navigation: any }) => {
  const { createGame, checkGameOverlap } = useMutationGame();
  const [loading, setLoading, session] = useStore((state) => [
    state.loading,
    state.setLoading,
    state.session,
  ]);

  // game attributes
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [sport, setSport] = useState(capitalizedSports[0].name);
  const [skillLevel, setSkillLevel] = useState("0");
  const [playerLimit, setPlayerLimit] = useState("1");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  function clearGameAttributes() {
    setTitle("");
    setDate(new Date());
    setTime(new Date());
    setSearchTerm("");
    setSearchResults([]);
    setStreet("");
    setCity("");
    setState("");
    setZip("");
    setSport(capitalizedSports[0].name);
    setSkillLevel("0");
    setPlayerLimit("1");
    setDescription("");
    setIsPublic(true);
  }

  // Radio group value is only string. Convert string skill level to number
  function convertSkillLevel(): number {
    if (skillLevel === "0") {
      return SkillLevel.Beginner;
    } else if (skillLevel === "1") {
      return SkillLevel.Intermediate;
    } else {
      return SkillLevel.Advanced;
    }
  }

  const createNewGame = async () => {
    // Check that no fields are left blank (except description, optional)
    // No need to check isPublic. It is never empty, always public by default.
    if (
      !title ||
      !date ||
      !time ||
      !street ||
      !sport ||
      !skillLevel ||
      !playerLimit ||
      !city ||
      !state ||
      !zip
    ) {
      Alert.alert("Please fill out all required fields.");
      return;
    }

    // Combine date and time to one object
    const combinedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
    );

    if (combinedDateTime < new Date()) {
      Alert.alert("Error: Date and time are in the past!");
      return;
    }

    const isOverlap = await checkGameOverlap(
      combinedDateTime,
      street,
      city,
      state,
      zip,
    );
    let proceed = await handleAlert(isOverlap);
    if (!proceed) return;

    const myNewGame = await createGame(
      title,
      combinedDateTime,
      street,
      city,
      state,
      zip,
      sport,
      convertSkillLevel(),
      playerLimit,
      description,
      isPublic,
    );

    if (myNewGame) {
      clearGameAttributes();
      navigation.navigate("My Games", { screen: "MyGames" });
    }
  };

  const handleAlert = async (isOverlap: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      if (isOverlap) {
        Alert.alert(
          "This game overlaps in date and time with other games in nearby locations!",
          "Do you want to proceed?",
          [
            {
              text: "Cancel",
              onPress: () => {
                resolve(false);
              },
              style: "cancel",
            },
            {
              text: "Proceed",
              onPress: () => {
                resolve(true);
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        resolve(true);
      }
    });
  };

  const handleSelectLocation = (location: any) => {
    // Fill address fields with selected location's details
    if (location && location.address) {
      // handle edge case
      if (location.address.country !== "United States of America") {
        Alert.alert("Error: Address must be in the US!");
        return;
      }

      const { house_number, road, city, state, postcode } = location.address;

      // handle edge cases
      if (!house_number || !road) {
        Alert.alert("Error: Address must have a valid street!");
        return;
      }
      if (!city) {
        Alert.alert("Error: Address must have a valid city!");
        return;
      }
      if (!state) {
        Alert.alert("Error: Address must have a valid state!");
        return;
      }
      if (!postcode) {
        Alert.alert("Error: Address must have a valid postcode!");
        return;
      }

      // Update the state values with the selected location's details
      setStreet(house_number + " " + road);
      setCity(city);
      setState(state);
      setZip(postcode);
      setSelectedLocation(true);
      setSearchTerm(house_number + " " + road);
    } else {
      Alert.alert("Error selecting location! Please try again later.");
      return;
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const fetchLocations = async () => {
      try {
        const response = await fetch(
          `https://us1.locationiq.com/v1/autocomplete?key=${process.env.AUTOCOMPLETE_API_KEY}&q=${searchTerm}&countrycode=us&limit=5`,
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.log(error);
      }
    };

    const timeoutId = setTimeout(fetchLocations, 500); // debounce to avoid too many requests

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <View className="p-12">
      {session && session.user ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <YStack space="$4" paddingBottom="$4">
            <Label> * indicates required fields </Label>
            <XStack space="$2" alignItems="center">
              <Label size="$5" width={60} color={"#08348c"}>
                Title*
              </Label>
              <Input
                flex={1}
                size="$5"
                placeholder="Title"
                testID="titleInput"
                value={title}
                onChangeText={(text: string) => setTitle(text)}
              />
            </XStack>

            <XStack space="$2" alignItems="center">
              <Label size="$5" width={60} color={"#08348c"}>
                Date*
              </Label>
              <DateTimePicker
                value={date}
                minimumDate={new Date()}
                mode="date"
                display="calendar"
                testID="dateInput"
                onChange={(event, datetime) => {
                  if (datetime) setDate(datetime);
                }}
              />
            </XStack>

            <XStack space="$2" alignItems="center">
              <Label size="$5" width={60} color={"#08348c"}>
                Time*
              </Label>
              <DateTimePicker
                value={time}
                mode="time"
                display="clock"
                testID="timeInput"
                onChange={(event, datetime) => {
                  if (datetime) setTime(datetime);
                }}
              />
            </XStack>

            <XStack width={200} alignItems="center" padding="$2">
              <Label
                paddingRight="$0"
                minWidth={90}
                justifyContent="flex-end"
                size="$5"
                htmlFor={"switch-public-friends-only"}
                style={{
                  color: isPublic ? "#e90d52" : "#08348c",
                }}
              >
                Public
              </Label>
              <Switch
                testID="visibilityInput"
                size="$4"
                defaultChecked={false}
                onCheckedChange={(checked: boolean) => {
                  setIsPublic(!checked);
                }}
                style={{
                  backgroundColor: "#e90d52",
                }}
              >
                <Switch.Thumb
                  style={{ backgroundColor: "#b90a41" }}
                  animation="bouncy"
                />
              </Switch>
              <Label
                paddingLeft="$6"
                minWidth={90}
                justifyContent="flex-end"
                size="$5"
                htmlFor={"switch-public-friends-only"}
                style={{
                  color: isPublic ? "#08348c" : "#e90d52",
                }}
              >
                Friends-Only
              </Label>
            </XStack>

            <YStack space="$2">
              <Label size="$5" color={"#08348c"}>
                Address*
              </Label>
              <YStack space="$2">
                <Input
                  size="$5"
                  placeholder="Street"
                  testID="streetInput"
                  value={
                    isSearchFocused
                      ? searchTerm
                      : selectedLocation
                        ? street
                        : searchTerm
                  }
                  onChangeText={setSearchTerm}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />

                {searchTerm !== street && searchResults.length > 0 && (
                  <>
                    {searchResults.map((result, index) => (
                      <TouchableOpacity
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 10,
                          borderBottomWidth: 1,
                          borderBottomColor: "lightgray",
                        }}
                        key={index}
                        onPress={() => handleSelectLocation(result)}
                      >
                        <Text>{result.display_name}</Text>
                      </TouchableOpacity>
                    ))}
                  </>
                )}

                <Input
                  flex={1}
                  size="$5"
                  placeholder="City"
                  testID="cityInput"
                  value={city}
                  onChangeText={setCity}
                />

                <XStack
                  space="$2"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Input
                    flexGrow={1}
                    size="$5"
                    placeholder="State"
                    value={state}
                    testID="stateInput"
                    onChangeText={setState}
                  />

                  <Input
                    flexGrow={1}
                    size="$5"
                    placeholder="Zip"
                    value={zip}
                    keyboardType="numeric"
                    testID="zipInput"
                    onChangeText={setZip}
                  />
                </XStack>
              </YStack>
            </YStack>

            <YStack>
              <Label size="$5" color={"#08348c"}>
                Sport*
              </Label>
              <Select value={sport} onValueChange={setSport}>
                <Select.Trigger iconAfter={ChevronDown}>
                  <Select.Value placeholder="Select a sport..." />
                </Select.Trigger>

                <Adapt when="sm" platform="touch">
                  <Sheet
                    modal
                    dismissOnSnapToBottom
                    animationConfig={{
                      type: "spring",
                      damping: 20,
                      mass: 1.2,
                      stiffness: 250,
                    }}
                  >
                    <Sheet.Frame>
                      <Sheet.ScrollView>
                        <Adapt.Contents />
                      </Sheet.ScrollView>
                    </Sheet.Frame>
                    <Sheet.Overlay
                      animation="lazy"
                      enterStyle={{ opacity: 0 }}
                      exitStyle={{ opacity: 0 }}
                    />
                    <Sheet.Overlay />
                  </Sheet>
                </Adapt>

                <Select.Content>
                  <Select.ScrollUpButton />
                  <Select.Viewport>
                    <Select.Group testID="sportInput">
                      <Select.Label color={"orange"}>Sports</Select.Label>
                      {useMemo(
                        () =>
                          capitalizedSports.map((sport, i) => {
                            return (
                              <Select.Item
                                index={i}
                                key={sport.name}
                                value={sport.name}
                              >
                                <Select.ItemText>{sport.name}</Select.ItemText>
                                <Select.ItemIndicator marginLeft="auto">
                                  <Check size={16} />
                                </Select.ItemIndicator>
                              </Select.Item>
                            );
                          }),
                        [capitalizedSports],
                      )}
                    </Select.Group>
                  </Select.Viewport>
                  <Select.ScrollDownButton />
                </Select.Content>
              </Select>
            </YStack>

            <YStack>
              <Label size="$5" color={"#08348c"}>
                Skill Level*
              </Label>
              <RadioGroup
                aria-labelledby="Select one item"
                defaultValue="3"
                name="form"
                testID="skillInput"
                value={skillLevel}
                onValueChange={setSkillLevel}
              >
                <YStack>
                  <XStack width={300} alignItems="center" space="$4">
                    <RadioGroup.Item
                      value={"0"}
                      id={`skill-level-${SkillLevel.Beginner}`}
                      size={2}
                    >
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>

                    <Label
                      size={2}
                      htmlFor={`skill-level-${SkillLevel.Beginner}`}
                    >
                      {"Beginner"}
                    </Label>
                  </XStack>
                  <XStack width={300} alignItems="center" space="$4">
                    <RadioGroup.Item
                      value={"1"}
                      id={`skill-level-${SkillLevel.Intermediate}`}
                      size={2}
                    >
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>

                    <Label
                      size={2}
                      htmlFor={`skill-level-${SkillLevel.Intermediate}`}
                    >
                      {"Intermediate"}
                    </Label>
                  </XStack>

                  <XStack width={300} alignItems="center" space="$4">
                    <RadioGroup.Item
                      value={"2"}
                      id={`skill-level-${SkillLevel.Advanced}`}
                      size={2}
                    >
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>

                    <Label
                      size={2}
                      htmlFor={`skill-level-${SkillLevel.Advanced}`}
                    >
                      {"Advanced"}
                    </Label>
                  </XStack>
                </YStack>
              </RadioGroup>
            </YStack>

            <XStack space="$4" alignItems="center">
              <Label flex={1} size="$5" width={90} color={"#08348c"}>
                Player Limit*
              </Label>
              <Input
                flex={1}
                size="$5"
                defaultValue="1"
                keyboardType="numeric"
                testID="maxPlayerInput"
                onChangeText={(text: string) => setPlayerLimit(text)}
              />
            </XStack>

            <YStack space="$1">
              <Label size="$5" color={"#08348c"}>
                Description
              </Label>
              <TextArea
                size="$5"
                placeholder="Enter your game details..."
                testID="descriptionInput"
                value={description}
                onChangeText={(text: string) => setDescription(text)}
              />
            </YStack>

            <YStack paddingTop="$5">
              <Button
                theme="active"
                disabled={loading}
                onPress={createNewGame}
                testID="addGameButton"
                size="$5"
                color="#ff7403"
                borderColor="#ff7403"
                backgroundColor={"white"}
                variant="outlined"
              >
                {loading ? "Loading..." : "Publish"}
              </Button>
            </YStack>
          </YStack>
        </ScrollView>
      ) : (
        <View className="items-center justify-center flex-1 p-12 text-center">
          <H4>Log in to create a new game!</H4>
        </View>
      )}
    </View>
  );
};

export default AddGame;
