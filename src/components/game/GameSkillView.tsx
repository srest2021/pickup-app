import { GameSport, getSkillLevelColors } from "../../lib/types";
import { Circle, XStack } from "tamagui";

export default function GameSkillView({ sport }: { sport: GameSport }) {
  const [color1, color2, color3] = getSkillLevelColors(sport.skillLevel);

  return (
    <XStack space="$1.5" alignItems="center">
      <Circle
        size={8}
        borderColor={"black"}
        borderWidth={1}
        backgroundColor={color1}
      ></Circle>
      <Circle
        size={8}
        borderColor={"black"}
        borderWidth={1}
        backgroundColor={color2}
      ></Circle>
      <Circle
        size={8}
        borderColor={"black"}
        borderWidth={1}
        backgroundColor={color3}
      ></Circle>
    </XStack>
  );
}
