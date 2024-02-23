import { View, Text, ScrollView } from "react-native";
import useMutationUser from "../../hooks/use-mutation-user";
import { Input } from "react-native-elements";
import { Button, Select, YStack } from "tamagui";
import { useMemo, useState } from "react";
import { useStore } from "../../lib/store";
import { Check } from "@tamagui/lucide-icons";

const AddGame = () => {
  const { session, user, updateProfile } = useMutationUser();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  // const [sport, setSport] = useState(SportTypes[0].name);
  const [skillLevel, setSkillLevel] = useState("");
  const [playerLimit, setPlayerLimit] = useState("");
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

          <Select defaultValue="">
            <Select.Trigger>
              <Select.Value placeholder="Search..." />
            </Select.Trigger>
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

const sports = [{ name: "Soccer" }, { name: "Basketball" }, { name: "Tennis" }];
