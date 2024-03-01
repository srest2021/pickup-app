import {
  YStack,
  Card,
  Paragraph,
  H4,
  H5,
  SizableText,
  XStack,
  Label,
  Text,
  Button,
  ScrollView,
  H6,
  Circle,
} from "tamagui";
import { useStore } from "../../lib/store";
import { View } from "react-native";
import { SkillLevel, getSkillLevelColor } from "../../lib/types";
import useMutationGame from "../../hooks/use-mutation-game";
import GameSkillView from "./GameSkillView";

const MyGameView = ({ navigation, route }: { navigation: any; route: any }) => {
  const { game } = route.params;
  const { title, description, datetime, address, sport, maxPlayers } = game;
  const color = getSkillLevelColor(sport.skillLevel);

  const [session, user] = useStore((state) => [state.session, state.user]);
  const { removeGameById } = useMutationGame();

  // Convert datetime to a readable string
  const displayDate = new Date(datetime).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    // hour: "2-digit",
    // minute: "2-digit",
  });
  const displayTime = new Date(datetime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  function getSkillLevelString(skillLevel: SkillLevel): string {
    switch (skillLevel) {
      case SkillLevel.Beginner:
        return "Beginner";
      case SkillLevel.Intermediate:
        return "Intermediate";
      case SkillLevel.Advanced:
        return "Advanced";
      default:
        return "Unknown";
    }
  }

  function deleteGame() {
    removeGameById(game.id);

    // If successful navigate back to myGames list.
    navigation.goBack();
    // TODO: Add success toast
  }

  return (
    <View>
      {session && session.user && user ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="p-12">
            <YStack>
              <YStack alignItems="center">
                <H4 textAlign="center">{game.title}</H4>
              </YStack>

              <YStack paddingTop="$3" alignItems="center">
                <H5>{displayDate}</H5>
                <H5>at {displayTime}</H5>
              </YStack>

              <YStack alignItems="center">
                <SizableText alignItems="center" padding="$5" size="$4">
                  by @{user.username}
                </SizableText>
              </YStack>

              {description && (
                <YStack paddingTop="$3" paddingBottom="$7">
                  <Card elevate size="$5">
                    <View marginLeft={25} marginRight={25}>
                      <SizableText
                        size="$5"
                        fontWeight="500"
                        paddingTop="$3"
                        paddingBottom="$3"
                      >
                        {description}
                      </SizableText>
                    </View>
                  </Card>
                </YStack>
              )}

              <YStack space="$4">
                <XStack space="$2" alignItems="left">
                  <Label size="$5" width={90}>
                    <H6>Address:</H6>
                  </Label>
                  <SizableText flex={1} size="$5">
                    {game.address}
                  </SizableText>
                </XStack>

                <XStack space="$2" alignItems="center">
                  <Label size="$5" width={90}>
                    <H6>Sport:</H6>
                  </Label>
                  <SizableText flex={1} size="$5">
                    {game.sport.name}
                  </SizableText>
                </XStack>

                <XStack space="$2" alignItems="center">
                  <Label size="$5" width={90}>
                    <H6>Skill:</H6>
                  </Label>
                  <Circle
                    size={8}
                    borderColor={color}
                    borderWidth={1}
                    backgroundColor={color}
                  ></Circle>
                  <Circle
                    size={8}
                    borderColor={color}
                    borderWidth={1}
                    backgroundColor={color}
                  ></Circle>
                  <Circle
                    size={8}
                    borderColor={color}
                    borderWidth={1}
                    backgroundColor={color}
                  ></Circle>
                </XStack>
              </YStack>

              <XStack space="$3" paddingTop="$5">
                <Button
                  theme="active"
                  flex={1}
                  onPress={() => navigation.navigate("EditGame", { game })}
                >
                  Edit
                </Button>
                <Button theme="active" flex={1} onPress={() => deleteGame()}>
                  Delete
                </Button>
              </XStack>
            </YStack>
          </View>
        </ScrollView>
      ) : (
        <View className="p-12 text-center items-center flex-1 justify-center">
          <H4>Log in to view and edit this game!</H4>
        </View>
      )}
    </View>
  );
};

export default MyGameView;
