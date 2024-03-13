import {
  Adapt,
  Button,
  Dialog,
  Label,
  Sheet,
  Unspaced,
  XStack,
  RadioGroup,
  YStack,
  Select,
} from "tamagui";
import { Check, ChevronDown, Plus, Loader } from "@tamagui/lucide-icons";
import { SkillLevel, sports } from "../../lib/types";
import { useState, useMemo } from "react";
import { useStore } from "../../lib/store";

const AddSport = ({ onSportSelect }: { onSportSelect: any }) => {
  const [skillLevel, setSkillLevel] = useState("0");
  const [sportName, setSportName] = useState(sports[0].name);
  const [loading] = useStore((state) => [state.loading]);

  const handleSave = () => {
    onSportSelect(sportName, convertSkillLevel());
  };

  function convertSkillLevel(): number {
    if (skillLevel === "0") {
      return SkillLevel.Beginner;
    } else if (skillLevel === "1") {
      return SkillLevel.Intermediate;
    } else {
      return SkillLevel.Advanced;
    }
  }

  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button
          size="$3"
          icon={loading ? Loader : Plus}
          color="#ff7403"
          borderColor="#ff7403"
          variant="outlined"
          disabled={loading}
          style={{ alignSelf: "flex-start" }}
        >
          {loading ? "Loading" : "Add Sport"}
        </Button>
      </Dialog.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
        >
          <Dialog.Title>Add sport</Dialog.Title>

          <Label width={160} justifyContent="flex-end" htmlFor="name">
            Select Sport
          </Label>

          <Select
            value={sportName}
            onValueChange={(selectedSport) => setSportName(selectedSport)}
          >
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

          <Label width={160} justifyContent="flex-end" htmlFor="name">
            Select Skill Level
          </Label>

          <Label width={160} justifyContent="flex-end">
            <RadioGroup
              aria-labelledby="Select one item"
              defaultValue="3"
              name="form"
              value={skillLevel}
              onValueChange={setSkillLevel}
            >
              <YStack width={300} alignItems="center" space="$3">
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
                    //htmlFor={`skill-level-${SkillLevel.Beginner}`}
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
                    //htmlFor={`skill-level-${SkillLevel.Intermediate}`}
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
                    //htmlFor={`skill-level-${SkillLevel.Advanced}`}
                  >
                    {"Advanced"}
                  </Label>
                </XStack>
              </YStack>
            </RadioGroup>
          </Label>

          <XStack alignSelf="flex-end" gap="$4">
            <Dialog.Close displayWhenAdapted asChild>
              <Button theme="active" aria-label="Close" onPress={handleSave}>
                Save
              </Button>
            </Dialog.Close>
          </XStack>

          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default AddSport;
