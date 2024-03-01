import { GameSport, getSkillLevelColor } from "../../lib/types";
import { Circle, H6, XStack } from "tamagui";

export default function GameSkillView({ sport }: { sport: GameSport }) {
  const color = getSkillLevelColor(sport.skillLevel);

  return (
    <XStack padding="$1.5" space="$1.5" alignItems="center">
      <H6>Skill:</H6>
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
  );
}
