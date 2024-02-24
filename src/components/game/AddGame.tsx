import { View, Text, ScrollView } from "react-native";
import useMutationUser from "../../hooks/use-mutation-user";
import { Input } from "react-native-elements";
import {
  Adapt,
  Button,
  Label,
  RadioGroup,
  Select,
  Sheet,
  XStack,
  YStack,
} from "tamagui";
import { useMemo, useState } from "react";
import { useStore } from "../../lib/store";
import { Check, ChevronDown } from "@tamagui/lucide-icons";
import { SkillLevel, sports } from "../../lib/types";

const AddGame = () => {
  // const { session, user, updateProfile } = useMutationUser();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [sport, setSport] = useState(sports[0].name);
  const [skillLevel, setSkillLevel] = useState("");
  const [playerLimit, setPlayerLimit] = useState("0");
  const [loading] = useStore((state) => [state.loading]);

  function createNewGame(): string {
    return "Temporary Hold!";
  }

  return (
    <View>
      {user ? (
        <ScrollView className="p-12 mt-0">
          <View className="py-4 self-stretch">
            <Input
              label="Game Title"
              value={title}
              onChangeText={(text: string) => setTitle(text)}
            />
          </View>

          <View className="py-4 self-stretch">
            <Input
              label="Date"
              value={date}
              onChangeText={(text: string) => setDate(text)}
            />
          </View>

          <View className="py-4 self-stretch">
            <Input
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
          >
            <YStack>
              <XStack width={300} alignItems="center" space="$4">
                <RadioGroup.Item
                  value={"Beginner"}
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
                  value={"Intermediate"}
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
                  value={"Advanced"}
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
              onChangeText={(text: string) => setPlayerLimit(text)}
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
    </View>
  );
};

export default AddGame;
