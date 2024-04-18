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
      <Dialog.Trigger asChild id="add-sport-trigger">
        <Button
          size="$3"
          icon={loading ? Loader : Plus}
          color="#ff7403"
          variant="outlined"
          disabled={loading}
          borderColor="#ff7403"
          backgroundColor={"#ffffff"}
          style={{ alignSelf: "flex-start" }}
        >
          {loading ? "Loading" : "Add Sport"}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Add sport</Dialog.Title>

          <YStack>
            <Label>Select a sport:</Label>
            <Select
              data-testid="sportInput"
              value={sportName}
              onValueChange={(selectedSport) => setSportName(selectedSport)}
              native
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

              <Select.Content zIndex={200000}>
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
            <Label>Select a skill level:</Label>
            <Label width={160} justifyContent="flex-end">
              <RadioGroup
                testID="skillInput"
                aria-labelledby="Select one item"
                defaultValue="3"
                name="form"
                value={skillLevel}
                onValueChange={setSkillLevel}
              >
                <YStack width={300} alignItems="center" space="$0">
                  <XStack width={300} alignItems="center" space="$4">
                    <RadioGroup.Item
                      value={"0"}
                      id={`profile-skill-level-${SkillLevel.Beginner}`}
                      size={2}
                    >
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>
                    <Label size={2}>{"Beginner"}</Label>
                  </XStack>

                  <XStack width={300} alignItems="center" space="$4">
                    <RadioGroup.Item
                      value={"1"}
                      id={`profile-skill-level-${SkillLevel.Intermediate}`}
                      size={2}
                    >
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>
                    <Label size={2}>{"Intermediate"}</Label>
                  </XStack>

                  <XStack width={300} alignItems="center" space="$4">
                    <RadioGroup.Item
                      value={"2"}
                      id={`profile-skill-level-${SkillLevel.Advanced}`}
                      size={2}
                    >
                      <RadioGroup.Indicator />
                    </RadioGroup.Item>
                    <Label size={2}>{"Advanced"}</Label>
                  </XStack>
                </YStack>
              </RadioGroup>
            </Label>
          </YStack>

          <XStack space="$3" justifyContent="space-between">
            <Dialog.Close displayWhenAdapted asChild id="cancel-button">
              <Button
                theme="active"
                aria-label="Cancel"
                size="$4"
                flexGrow={1}
                color="#ff7403"
                borderColor="#ff7403"
                backgroundColor="#ffffff"
                variant="outlined"
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close displayWhenAdapted asChild id="add-sport-button">
              <Button
                theme="active"
                aria-label="Close"
                onPress={handleSave}
                flexGrow={1}
                color="#ff7403"
                borderColor="#ff7403"
                backgroundColor="#ffffff"
                variant="outlined"
                testID="save-btn"
              >
                Add sport
              </Button>
            </Dialog.Close>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default AddSport;
