import { View, Text, ScrollView, Alert } from "react-native";
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
import { Game, SkillLevel, sports, getSkillLevelString } from "../../lib/types";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  useToastController,
  useToastState,
} from "@tamagui/toast";
import DateTimePicker from "@react-native-community/datetimepicker";
import useQueryGames from "../../hooks/use-query-games";
import { ToastDemo } from "../Toast";

const EditGame = ({ navigation, route }: { navigation: any; route: any }) => {
  const { gameId } = route.params;
  const [selectedMyGame] = useStore((state) => [state.selectedMyGame]);

  const { user } = useMutationUser();
  const { editGameById } = useMutationGame();

  const loading = useStore((state) => state.loading);

  // existing game attributes
  const [title, setTitle] = useState(
    selectedMyGame ? selectedMyGame.title : "",
  );
  const [date, setDate] = useState(
    selectedMyGame ? new Date(selectedMyGame?.datetime) : new Date(),
  );
  const [time, setTime] = useState(
    selectedMyGame ? new Date(selectedMyGame?.datetime) : new Date(),
  );
  const [street, setStreet] = useState(
    selectedMyGame ? selectedMyGame.address.street : "",
  );
  const [city, setCity] = useState(
    selectedMyGame ? selectedMyGame.address.city : "",
  );
  const [state, setState] = useState(
    selectedMyGame ? selectedMyGame.address.state : "",
  );
  const [zip, setZip] = useState(
    selectedMyGame ? selectedMyGame.address.zip : "",
  );
  const [sport, setSport] = useState(
    selectedMyGame && selectedMyGame.sport ? selectedMyGame.sport.name : "",
  );
  const [skillLevel, setSkillLevel] = useState(
    selectedMyGame && selectedMyGame.sport
      ? `${selectedMyGame?.sport.skillLevel}`
      : "",
  );
  const [playerLimit, setPlayerLimit] = useState(
    `${selectedMyGame?.maxPlayers}`,
  );
  const [description, setDescription] = useState(selectedMyGame?.description);
  const [isPublic, setIsPublic] = useState(selectedMyGame?.isPublic);

  // Toasts
  const toast = useToastController();

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

  const editGame = async () => {
    // Check that no fields are left blank (except description, optional)
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
      !zip ||
      !isPublic
    ) {
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
      toast.show("Error!", {
        message: "Date and time are in the past.",
      });
      return;
    }

    const myEditedGame = await editGameById(
      gameId,
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
      isPublic, // TODO fix isPublic
    );
    if (myEditedGame) {
      navigation.goBack();
    }
  };

  return (
    <View className="p-12">
      <ToastViewport />
      <ToastDemo />
      {user ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <YStack space="$4" paddingBottom="$4">
            <XStack space="$2" alignItems="center">
              <Label size="$5" width={60} color={"#08348c"}>
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
              <Label size="$5" width={60} color={"#08348c"}>
                Date
              </Label>
              <DateTimePicker
                value={date}
                minimumDate={new Date()}
                mode="date"
                display="calendar"
                testID="datePicker"
                onChange={(event, datetime) => {
                  if (datetime) setDate(datetime);
                }}
              />
            </XStack>

            <XStack space="$2" alignItems="center">
              <Label size="$5" width={60} color={"#08348c"}>
                Time
              </Label>
              <DateTimePicker
                value={time}
                mode="time"
                display="clock"
                testID="timePicker"
                onChange={(event, datetime) => {
                  if (datetime) setTime(datetime);
                }}
              />
            </XStack>

            <YStack space="$1">
              <Label size="$5" color={"#08348c"}>
                Street
              </Label>
              <Input
                flex={1}
                size="$5"
                placeholder="Address"
                testID="addressInput"
                value={street}
                onChangeText={(text: string) => setStreet(text)}
              />
            </YStack>

            <YStack space="$1">
              <Label size="$5" color={"#08348c"}>
                City
              </Label>
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
              <Label size="$5" color={"#08348c"}>
                State/ZIP
              </Label>
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
                  placeholder="ZIP code"
                  value={zip}
                  testID="zipInput"
                  keyboardType="numeric"
                  onChangeText={(text: string) => setZip(text)}
                />
              </XStack>
            </YStack>

            <Label size="$5" color={"#08348c"}>
              Sport
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
                  <Select.Group>
                    <Select.Label color={`orange`}>Sports</Select.Label>
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

            <Label size="$5" color={"#08348c"}>
              Skill Level
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
                  <RadioGroup.Item value={"0"} size={2}>
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>

                  <Label size={2}>{"Beginner"}</Label>
                </XStack>
                <XStack width={300} alignItems="center" space="$4">
                  <RadioGroup.Item value={"1"} size={2}>
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>

                  <Label size={2}>{"Intermediate"}</Label>
                </XStack>

                <XStack width={300} alignItems="center" space="$4">
                  <RadioGroup.Item value={"2"} size={2}>
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <Label size={2}>{"Advanced"}</Label>
                </XStack>
              </YStack>
            </RadioGroup>

            <XStack space="$4" alignItems="center">
              <Label flex={1} size="$5" width={90} color={"#08348c"}>
                Player Limit
              </Label>
              <Input
                flex={1}
                size="$5"
                defaultValue="1"
                keyboardType="numeric"
                testID="maxPlayerInput"
                value={playerLimit}
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
                onPress={() => editGame()}
                size="$5"
                color="#ff7403"
                borderColor="#ff7403"
                testID="editButton"
                variant="outlined"
              >
                {loading ? "Loading..." : "Edit"}
              </Button>
            </YStack>
          </YStack>
        </ScrollView>
      ) : (
        <Text>Log in to edit an existing game!</Text>
      )}
    </View>
  );
};

export default EditGame;
