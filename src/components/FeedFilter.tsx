import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { Adapt, Dialog, Label, RadioGroup, Select, Sheet, Slider, XStack, YStack, Button } from 'tamagui';
import { Check, ChevronDown, Plus } from "@tamagui/lucide-icons";
import { SkillLevel, sports } from "../lib/types";
import { useStore } from '../lib/store';


const FeedFilter = (props: { handleRefresh: () => void; }) => {
  const [distance, setDistance] = useState(15);
  const [skillLevel, setSkillLevel] = useState("-1");
  const [
            setFilterSport,
            setFilterDist,
            setFilterLevel,
            filterSport,
            filterDist,
            filterLevel,
             ] = useStore((state) => [
                state.setFilterSport,
                state.setFilterDist,
                state.setFilterLevel,
                state.filterSport,
                state.filterDist,
                state.filterLevel,
             ])
  const [sport, setSport] = filterSport === null ? useState('any') : useState(filterSport);


  const handleSportChange = (value) => {
    setSport(value);
  };

  const handleSkillLevelChange = (value) => {
    setSkillLevel(value);
  };


  const handleDistanceChange = (value: number[]) => {
    setDistance(value[0]); // Update distance to the start of the range
  };

  const handleSave = async () => {
    //TODO implement
    
    console.log(`distance: ${distance}`);
    console.log(`sport: ${sport}`);
    console.log(`skillLevel: ${skillLevel}`);
    await new Promise<void>((resolve) => {
        sport === "any" ?  setFilterSport(null) : setFilterSport(sport);
        setFilterDist(distance);
        skillLevel === "-1" ? setFilterLevel(null) : setFilterLevel(skillLevel);
        resolve();
      });
      props.handleRefresh();
    
    
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
        size="$4" width={200} defaultValue={[filterDist]} max={30} step={1}
        onValueChange={handleDistanceChange}
      >
        <Slider.Track>
      <Slider.TrackActive />
    </Slider.Track>
    <Slider.Thumb circular index={0} />
  </Slider>
      
      <Text style={styles.label}>Sport:</Text>
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
                    <Select.ItemText>all sports</Select.ItemText>
                    </Select.Item>
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
              defaultValue={filterLevel == null ? "-1" : filterLevel}
              name="form"
              value={skillLevel == null ? "-1" : skillLevel}
              onValueChange={setSkillLevel}
            >
              <YStack width={300} alignItems="center" space="$3">
                <XStack width={300} alignItems="center" space="$4">
                <RadioGroup.Item
                value={"-1"} // Set value to null to represent "None" or "Unselected"
                id={`skill-level-any`}
                size={2}
                >
                <RadioGroup.Indicator />
                </RadioGroup.Item>
                <Label
                size={2}
                //htmlFor={`skill-level-none`}
                >
                {"All Skill Levels"} 
                </Label>
                 </XStack>
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
