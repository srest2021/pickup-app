import { useMemo, useState } from "react";
import {
  Adapt,
  Dialog,
  Label,
  RadioGroup,
  Select,
  Sheet,
  Slider,
  XStack,
  YStack,
  Button,
  View,
} from "tamagui";
import { Check, ChevronDown, Filter, Loader } from "@tamagui/lucide-icons";
import {
  SkillLevel,
  capitalizeFirstLetter,
  capitalizedSports,
} from "../lib/types";
import { useStore } from "../lib/store";

const FeedFilter = (props: { handleRefresh: () => void }) => {
  const [
    loading,
    setFilterSport,
    setFilterDist,
    setFilterLevel,
    getFilterSport,
    getFilterDist,
    getFilterLevel,
  ] = useStore((state) => [
    state.loading,
    state.setFilterSport,
    state.setFilterDist,
    state.setFilterLevel,
    state.getFilterSport,
    state.getFilterDist,
    state.getFilterLevel,
  ]);

  const [distance, setDistance] = useState(getFilterDist());
  const [skillLevel, setSkillLevel] = useState("-1");
  const filterSport = getFilterSport();
  const [sport, setSport] = filterSport
    ? useState(filterSport)
    : useState("any");

  const handleSave = async () => {
    setFilterDist(distance);
    sport === "any" ? setFilterSport(null) : setFilterSport(sport);
    skillLevel === "-1" ? setFilterLevel(null) : setFilterLevel(skillLevel);
    props.handleRefresh();
  };

  const handleCancel = () => {
    // Reset state to original values
    const filterSport = getFilterSport();
    const filterLevel = getFilterLevel();
    setDistance(getFilterDist());
    setSport(filterSport ? filterSport : "any");
    setSkillLevel(filterLevel ? filterLevel : "-1");
  };

  return (
    <View paddingHorizontal="$2">
      <Dialog modal>
        <Dialog.Trigger asChild id="feed-filter-trigger">
          <Button
            size="$4"
            color="#ffffff"
            borderColor="#08348c"
            backgroundColor="#08348c"
            width={50}
            icon={<Filter size="$1" />}
            variant="outlined"
            style={{ alignSelf: "flex-start" }}
          />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay key="dialog-overlay" />
          <Dialog.Content>
            <Dialog.Title>Apply filters</Dialog.Title>
            <YStack space="$2">
              <YStack>
                <Label>Set the maximum distance away from you:</Label>
                <XStack space="$5" alignItems="center">
                  <Slider
                    size="$2"
                    width={270}
                    defaultValue={[distance]}
                    max={30}
                    step={1}
                    onValueChange={(value: number[]) => setDistance(value[0])}
                  >
                    <Slider.Track>
                      <Slider.TrackActive />
                    </Slider.Track>
                    <Slider.Thumb circular index={0} />
                  </Slider>
                  <Label>{distance} mi</Label>
                </XStack>
              </YStack>

              <YStack>
                <Label>Select a sport:</Label>
                <Select
                  value={sport}
                  onValueChange={(selectedSport) => setSport(selectedSport)}
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
                        <Select.Item index={-1} value={"any"}>
                          <Select.ItemText>All sports</Select.ItemText>
                        </Select.Item>
                        {useMemo(
                          () =>
                            capitalizedSports.map((sport, i) => {
                              return (
                                <Select.Item
                                  index={i}
                                  key={sport.name}
                                  value={sport.name}
                                >
                                  <Select.ItemText>
                                    {sport.name}
                                  </Select.ItemText>
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
                <Label>Select a skill level:</Label>
                <Label width={160} justifyContent="flex-end">
                  <RadioGroup
                    aria-labelledby="Select one item"
                    defaultValue={!skillLevel ? "-1" : skillLevel}
                    name="form"
                    onValueChange={setSkillLevel}
                  >
                    <YStack width={300} alignItems="center" space="$0">
                      <XStack width={300} alignItems="center" space="$4">
                        <RadioGroup.Item
                          value={"-1"} // Set value to null to represent "None" or "Unselected"
                          id={`filter-skill-level-any`}
                          size={2}
                        >
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>
                        <Label size={2}>{"All"}</Label>
                      </XStack>

                      <XStack width={300} alignItems="center" space="$4">
                        <RadioGroup.Item
                          value={"0"}
                          id={`filter-skill-level-${SkillLevel.Beginner}`}
                          size={2}
                        >
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>
                        <Label size={2}>{"Beginner"}</Label>
                      </XStack>

                      <XStack width={300} alignItems="center" space="$4">
                        <RadioGroup.Item
                          value={"1"}
                          id={`filter-skill-level-${SkillLevel.Intermediate}`}
                          size={2}
                        >
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>
                        <Label size={2}>{"Intermediate"}</Label>
                      </XStack>

                      <XStack width={300} alignItems="center" space="$4">
                        <RadioGroup.Item
                          value={"2"}
                          id={`filter-skill-level-${SkillLevel.Advanced}`}
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
                <Dialog.Close displayWhenAdapted asChild>
                  <Button
                    id="cancel-button"
                    theme="active"
                    aria-label="Cancel"
                    size="$4"
                    flexGrow={1}
                    color="#ff7403"
                    borderColor="#ff7403"
                    backgroundColor="#ffffff"
                    variant="outlined"
                    onPress={handleCancel}
                  >
                    Cancel
                  </Button>
                </Dialog.Close>
                <Dialog.Close displayWhenAdapted asChild>
                  <Button
                    id="apply-filter-button"
                    theme="active"
                    aria-label="Close"
                    onPress={handleSave}
                    flexGrow={1}
                    color="#ff7403"
                    borderColor="#ff7403"
                    backgroundColor="#ffffff"
                    variant="outlined"
                  >
                    Apply
                  </Button>
                </Dialog.Close>
              </XStack>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </View>
  );
};

export default FeedFilter;
