import { View, Text, ScrollView } from "react-native";
import useMutationUser from "../../hooks/use-mutation-user";
import useMutationGame from "../../hooks/use-mutation-game";
import { Input } from "react-native-elements";
import {
  Adapt,
  Button,
  Label,
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
import { Game, SkillLevel, GameSport, sports } from "../../lib/types";
import { Toast, ToastProvider, ToastViewport, useToastController, useToastState } from '@tamagui/toast'

const AddGame = () => {
  const { user } = useMutationUser();
  const { createGame } = useMutationGame();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [sport, setSport] = useState(sports[0].name);
  const [skillLevel, setSkillLevel] = useState("0");
  const [playerLimit, setPlayerLimit] = useState("0");
  const [description, setDescription] = useState("");
  const [loading] = useStore((state) => [state.loading]);
  const [isToastVisible, setToastVisible] = useState(false);
  let stringSkillLevel: string = "0";

  useEffect(() => {
    let timer: number;
    if (isToastVisible) {
      let timer = setTimeout(() => {
        setToastVisible(false);
      }, 7000); // Hide toast after 7 seconds
    }
    return () => clearTimeout(timer);
  }, [isToastVisible]);

   // Radio group value is only string. Convert string skill level to number
  function convertSkillLevel() : number {
    if (skillLevel === "0") {
      return SkillLevel.Beginner;
    } else if (skillLevel === "1") {
      return SkillLevel.Intermediate;
    } else {
      return SkillLevel.Advanced;
    }
  }

  function createNewGame() {
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
      setToastVisible(true); 
      return;
    }

    // Convert the date + time into timestampz type
    const combinedDateTime = new Date(`${date}T${time}:00.000Z`);
    const isoDateTimeString = combinedDateTime.toISOString();

    // const mySport: GameSport = {
    //   name: sport,
    //   skillLevel
    // }
    // const myGame: Game = {
    //   title,
    //   description,

    //   sport: mySport,
    // }

    createGame(
      title,
      isoDateTimeString,
      address,
      sport,
      convertSkillLevel(),
      playerLimit,
      description,
    );
  }

  return (
    <ToastProvider>
    <View>
      {user ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="p-12 mt-0">
          <View className="py-4 self-stretch">
            <Input
              label="Game Title"
              value={title}
              onChangeText={(text: string) => setTitle(text)}
            />
          </View>

          <View className="py-4 self-stretch">
            <Input
              placeholder="YYYY-MM-DD"
              label="Date"
              value={date}
              onChangeText={(text: string) => setDate(text)}
            />
          </View>

          <View className="py-4 self-stretch">
            <Input
              placeholder="HH:MM"
              label="Time"
              value={time}
              onChangeText={(text: string) => setTime(text)}
            />
          </View>

          <View className="py-4 self-stretch">
            <Input
              label="Address"
              value={address}
              onChangeText={(text: string) => setAddress(text)}
            />
          </View>

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

                <Label size={2} htmlFor={`skill-level-${SkillLevel.Beginner}`}>
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
                  value={"3"}
                  id={`skill-level-${SkillLevel.Advanced}`}
                  size={2}
                >
                  <RadioGroup.Indicator />
                </RadioGroup.Item>

                <Label size={2} htmlFor={`skill-level-${SkillLevel.Advanced}`}>
                  {"Advanced"}
                </Label>
              </XStack>
            </YStack>
          </RadioGroup>

          {/*TODO: Make number selector */}
          <View className="py-4 self-stretch">
            <Input
              label="Player Limit"
              value={playerLimit}
              keyboardType="numeric"
              onChangeText={(text: string) => setPlayerLimit(text)}
            />
          </View>

          <View className="py-4 self-stretch">
            <TextArea
              placeholder="Enter your game details..."
              value={description}
              onChangeText={(text: string) => setDescription(text)}
            />
          </View>

          <YStack space="$6" paddingTop="$5">
            <Button
              theme="active"
              disabled={loading}
              onPress={() => createNewGame()}
              size="$5"
            >
              {loading ? "Loading..." : "Create"}
            </Button>
          </YStack>
        </ScrollView>
      ) : (
        <Text>Log in to create a new game!</Text>
      )}
      {isToastVisible && (
        <Toast>
          <YStack>
            <Toast.Title>Sorry! Required fields cannot be empty! 🙁</Toast.Title>
            <Toast.Description>Please enter all the content for your game.</Toast.Description>
          </YStack>
          <Toast.Close onPress={() => setToastVisible(false)} />
        </Toast>
      )}
      
      <ToastViewport />
      </View>
      </ToastProvider>
  );
};

export default AddGame;
