import React, { useMemo, useState } from 'react';
import { View, Text, Picker, StyleSheet, GestureResponderEvent } from 'react-native';
import { Adapt, Dialog, Label, RadioGroup, Select, Sheet, Slider, XStack, YStack, Button } from 'tamagui';
import { Check, ChevronDown, Plus } from "@tamagui/lucide-icons";
import { SkillLevel, sports } from "../lib/types";


const FeedFilter = () => {
  const [distance, setDistance] = useState(0);
  const [sport, setSport] = useState('soccer');
  const [skillLevel, setSkillLevel] = useState("0");
  const [sportName, setSportName] = useState(sports[0].name);

  const handleDistanceChange = (value) => {
    setDistance(value);
  };

  const handleSportChange = (value) => {
    setSport(value);
  };

  const handleSkillLevelChange = (value) => {
    setSkillLevel(value);
  };

  const handleSave = () => {
    //TODO implement
  }

  return (
    <Dialog modal>
        <Dialog.Trigger asChild>
        <Button
          size="$3"
          icon={Plus}
          variant="outlined"
          style={{ alignSelf: "flex-start" }}
        >
          Filter
        </Button>

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

      </Dialog.Trigger>
      
      <Dialog.Portal>
      
      <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
        >
      
      <Text style={styles.label}>Distance: {distance} miles</Text>
      <Slider
        style={styles.slider}
        //minimumValue={0}
        //maximumValue={100}
        step={1}
        value={[0, distance]}
        onValueChange={handleDistanceChange}
      />
      
      <Text style={styles.label}>Sport:</Text>
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
      
      <Text style={styles.label}>Skill Level:</Text>
      
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
          </Dialog.Content>
          </Dialog.Portal>
          
    </Dialog>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  slider: {
    marginBottom: 20,
  },
  picker: {
    marginBottom: 20,
  },
});

export default FeedFilter;
