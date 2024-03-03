import { View, ScrollView, Alert } from "react-native";
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
} from "tamagui";
import { useMemo, useState } from "react";
import { useStore } from "../../lib/store";
import { Check, ChevronDown } from "@tamagui/lucide-icons";
import { SkillLevel, sports } from "../../lib/types";
import { ToastViewport, useToastController } from "@tamagui/toast";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ToastDemo } from "../Toast";

const AddGame = ({ navigation }: { navigation: any }) => {
  const { createGame } = useMutationGame();
  const [loading, session] = useStore((state) => [
    state.loading,
    state.session,
  ]);

  // game attributes
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [sport, setSport] = useState(sports[0].name);
  const [skillLevel, setSkillLevel] = useState("0");
  const [playerLimit, setPlayerLimit] = useState("1");
  const [description, setDescription] = useState("");

  // Toasts
  const toast = useToastController();

  function clearGameAttributes() {
    setTitle("");
    setDate(new Date());
    setTime(new Date());
    setAddress("");
    setCity("");
    setState("");
    setZip("");
    setSport(sports[0].name);
    setSkillLevel("0");
    setPlayerLimit("1");
    setDescription("");
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
    if (
      !title ||
      !date ||
      !time ||
      !address ||
      !sport ||
      !skillLevel ||
      !playerLimit
    ) {
      Alert.alert("Error: Please fill out all required fields.");
      toast.show("Error!", {
        message: "Please fill out all required fields.",
      });
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
      Alert.alert("Error: Date and time are in the past.");
      toast.show("Error!", {
        message: "Date and time are in the past.",
      });

      return;
    }

    const myNewGame = await createGame(
      title,
      combinedDateTime,
      address,
      city,
      state,
      zip,
      sport,
      convertSkillLevel(),
      playerLimit,
      description,
    );

    if (myNewGame) {
      toast.show("Successfully saved!", {
        message: "Don't worry, we've got your data.",
      });
      clearGameAttributes();
      navigation.navigate("MyGames");
    }
  };

  return (
    <View className="p-12">
      <ToastViewport />
      <ToastDemo />
      {session && session.user ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <YStack space="$4" paddingBottom="$4">
            <XStack space="$2" alignItems="center">
              <Label size="$5" width={60}>
                Title
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
              <Label size="$5" width={60}>
                Date
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
              <Label size="$5" width={60}>
                Time
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

            <YStack space="$1">
              <Label size="$5">Address</Label>
              <Input
                flex={1}
                size="$5"
                placeholder="Address"
                testID="addressInput"
                value={address}
                onChangeText={(text: string) => setAddress(text)}
              />
            </YStack>

            <YStack space="$1">
              <Label size="$5">City</Label>
              <Input
                flex={1}
                size="$5"
                placeholder="City"
                testID="cityInput"
                value={city}
                onChangeText={(text: string) => setCity(text)}
              />
            </YStack>

            <YStack space="$1">
              <Label size="$5">State/ZIP</Label>
              <XStack space="$3">
                <Input
                  flex={1}
                  size="$5"
                  placeholder="State"
                  value={state}
                  testID="stateInput"
                  onChangeText={(text: string) => setState(text)}
                />
                <Input
                  flex={1}
                  size="$5"
                  placeholder="Zip"
                  value={zip}
                  keyboardType="numeric"
                  testID="zipInput"
                  onChangeText={(text: string) => setZip(text)}
                />
              </XStack>
            </YStack>

            <YStack>
              <Label size="$5">Sport</Label>
              <Select value={sport} onValueChange={setSport} id="sportInput">
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
                    <Select.Group>
                      <Select.Label>Sports</Select.Label>
                      {useMemo(
                        () =>
                          sports.map((sport, i) => {
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
                        [sports],
                      )}
                    </Select.Group>
                  </Select.Viewport>
                  <Select.ScrollDownButton />
                </Select.Content>
              </Select>
            </YStack>

            <YStack>
              <Label size="$5">Skill Level</Label>
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
              <Label flex={1} size="$5" width={90}>
                Player Limit
              </Label>
              <Input
                flex={1}
                size="$5"
                defaultValue="1"
                keyboardType="numeric"
                testID="maxPlayerInput"
                onChangeText={(text: string) => setZip(text)}
              />
            </XStack>

            <YStack space="$1">
              <Label size="$5">Description</Label>
              <TextArea
                size="$5"
                placeholder="Enter your game details (optional)"
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
              >
                {loading ? "Loading..." : "Publish"}
              </Button>
            </YStack>
          </YStack>
        </ScrollView>
      ) : (
        <View className="p-12 text-center items-center flex-1 justify-center">
          <H4>Log in to create a new game!</H4>
        </View>
      )}
    </View>
  );
};

export default AddGame;
