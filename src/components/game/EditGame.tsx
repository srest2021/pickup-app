import { View, Text, ScrollView } from "react-native";
import useMutationUser from "../../hooks/use-mutation-user";
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
} from "tamagui";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "../../lib/store";
import { Check, ChevronDown } from "@tamagui/lucide-icons";
import { Game, SkillLevel, sports } from "../../lib/types";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  useToastController,
  useToastState,
} from "@tamagui/toast";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditGame = (game: Game) => {
  const { user } = useMutationUser();
  const { editGameById } = useMutationGame();

  const loading = useStore((state) => state.loading);

  const [isErrorToastVisible, setErrorToastVisible] = useState(false);
  const [isDatetimeToastVisible, setDatetimeToastVisible] = useState(false);
  const [isSuccessToastVisible, setSuccessToastVisible] = useState(false);
  const [updateGameStatus, setUpdateGameStatus] = useStore((state) => [
    state.updateGameStatus,
    state.setUpdateGameStatus,
  ]);

  // existing game attributes
  const [title, setTitle] = useState(game.title);
  // TODO: Figure out how to make date picker show previously set date and time.
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [address, setAddress] = useState(game.address);
  const [sport, setSport] = useState(
    sports[sports.findIndex((sport) => sport.name === game.sport.name)].name,
  );
  const [skillLevel, setSkillLevel] = useState(`${game.sport.skillLevel}`);
  const [playerLimit, setPlayerLimit] = useState(`${game.maxPlayers}`);
  const [description, setDescription] = useState(game.description);

  function clearGameAttributes() {
    setTitle("");
    setDate(new Date());
    setTime(new Date());
    setAddress("");
    setSport(sports[0].name);
    setSkillLevel("0");
    setPlayerLimit("1");
    setDescription("");
    setUpdateGameStatus(false);
  }

  useEffect(() => {
    let timer: number;
    if (isErrorToastVisible) {
      let timer = setTimeout(() => {
        setErrorToastVisible(false);
      }, 7000); // Hide toast after 7 seconds
    }
    return () => clearTimeout(timer);
  }, [isErrorToastVisible]);

  useEffect(() => {
    let timer: number;
    if (isDatetimeToastVisible) {
      let timer = setTimeout(() => {
        setDatetimeToastVisible(false);
      }, 7000); // Hide toast after 7 seconds
    }
    return () => clearTimeout(timer);
  }, [isDatetimeToastVisible]);

  useEffect(() => {
    let timer: number;
    if (isSuccessToastVisible) {
      let timer = setTimeout(() => {
        setSuccessToastVisible(false);
      }, 7000); // Hide toast after 7 seconds
    }
    return () => clearTimeout(timer);
  }, [isSuccessToastVisible]);

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

  function editGame() {
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
      setErrorToastVisible(true);
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
      setDatetimeToastVisible(true);
    } else {
      editGameById(
        game.id,
        title,
        combinedDateTime,
        address,
        sport,
        convertSkillLevel(),
        playerLimit,
        description,
      );
      if (updateGameStatus) {
        setSuccessToastVisible(true);
      }
      clearGameAttributes();
    }
  }

  return (
    <ToastProvider>
      <View className="p-12">
        {user ? (
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
                  value={address}
                  onChangeText={(text: string) => setAddress(text)}
                />
              </YStack>

              <Label size="$5">Sport</Label>
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
                    <Select.Group>
                      <Select.Label>Sports</Select.Label>
                      {useMemo(
                        () =>
                          sports.map((sport, i) => {
                            return (
                              <Select.Item
                                index={i}
                                key={sport.name}
                                value={sport.name.toLowerCase()}
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

              <Label size="$5">Skill Level</Label>
              <RadioGroup
                aria-labelledby="Select one item"
                defaultValue="3"
                name="form"
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

              <XStack space="$4" alignItems="center">
                <Label flex={1} size="$5" width={90}>
                  Player Limit
                </Label>
                <Input
                  flex={1}
                  size="$5"
                  defaultValue="1"
                  keyboardType="numeric"
                  value={playerLimit}
                  onChangeText={(text: string) => setPlayerLimit(text)}
                />
              </XStack>

              <YStack space="$1">
                <Label size="$5">Description</Label>
                <TextArea
                  size="$5"
                  placeholder="Enter your game details..."
                  value={description}
                  onChangeText={(text: string) => setDescription(text)}
                />
              </YStack>

              <YStack paddingTop="$5">
                <Button
                  theme="active"
                  disabled={loading}
                  onPress={() => editGame()}
                  size="$5"
                >
                  {loading ? "Loading..." : "Edit"}
                </Button>
              </YStack>
            </YStack>
          </ScrollView>
        ) : (
          <Text>Log in to edit an existing game!</Text>
        )}
        {isErrorToastVisible && (
          <Toast>
            <YStack>
              <Toast.Title>
                Sorry! Required fields cannot be empty! 🙁
              </Toast.Title>
              <Toast.Description>
                Please enter all the content for your game.
              </Toast.Description>
            </YStack>
            <Toast.Close onPress={() => setErrorToastVisible(false)} />
          </Toast>
        )}

        {isSuccessToastVisible && (
          <Toast>
            <YStack>
              <Toast.Title>Data successfully saved. 🙂</Toast.Title>
              <Toast.Description>
                We've got your game edits saved!
              </Toast.Description>
            </YStack>
            <Toast.Close onPress={() => setSuccessToastVisible(false)} />
          </Toast>
        )}

        {isDatetimeToastVisible && (
          <Toast>
            <YStack>
              <Toast.Title>
                Selected date and time cannot be in the past!
              </Toast.Title>
              <Toast.Description>
                Please reenter your game's time.
              </Toast.Description>
            </YStack>
            <Toast.Close onPress={() => setDatetimeToastVisible(false)} />
          </Toast>
        )}

        <ToastViewport />
      </View>
    </ToastProvider>
  );
};

export default EditGame;
