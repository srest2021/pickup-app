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
} from "tamagui";
import { useStore } from "../../lib/store";
import { View } from "react-native";
import { SkillLevel } from "../../lib/types";

const MyGameView = ({ navigation, route }: { navigation: any; route: any }) => {
  const { game } = route.params;
  const { title, description, datetime, address, sport, maxPlayers } = game;

  const [session, user] = useStore((state) => [state.session, state.user]);

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

  return (
    <View>
      {session && session.user && user ? (
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

            <XStack space="$2" alignItems="center">
              <Label size="$5" width={90}>
                Address
              </Label>
              <SizableText flex={1} size="$5">
                {game.address}
              </SizableText>
            </XStack>

            <XStack space="$2" alignItems="center">
              <Label size="$5" width={90}>
                Sport
              </Label>
              <SizableText flex={1} size="$5">
                {game.sport.name}
              </SizableText>
            </XStack>

            <XStack space="$2" alignItems="center">
              <Label size="$5" width={90}>
                Skill Level
              </Label>
              <SizableText flex={1} size="$5">
                {getSkillLevelString(game.sport.skillLevel)}
              </SizableText>
            </XStack>
          </YStack>
        </View>
      ) : (
        <View className="p-12 text-center items-center flex-1 justify-center">
          <H4>Log in to view and edit this game!</H4>
        </View>
      )}
    </View>

    // <YStack
    //   position="relative"
    //   padding="$4"
    //   space="$2"
    //   backgroundColor="$background"
    //   borderRadius={10}
    //   alignItems="center"
    // >
    //   {/* Edit button positioned on the top right of the view */}
    //   <Button
    //     position="absolute"
    //     top={0}
    //     right={0}
    //     size="$2"
    //     onPress={() => navigation.navigate("EditGame", { game })}
    //   >
    //     Edit
    //   </Button>

    //   <Text fontWeight="bold">{title}</Text>
    //   <Text fontStyle="italic">{displayDate}</Text>
    //   <Text>Sport: {sport.name}</Text>
    //   <Text>Skill Level: {sport.skillLevel}</Text>
    //   <Text>Max Players: {maxPlayers}</Text>
    //   <Text>Address: {address}</Text>
    //   <YStack>
    //     <Text>Description:</Text>
    //     <Text>{description}</Text>
    //   </YStack>
    // </YStack>
  );
};

export default MyGameView;
