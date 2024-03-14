import { Sport, getSkillLevelColors } from "../lib/types";
import { Circle, XStack } from "tamagui";

export default function SportSkill({ sport }: { sport: Sport }) {
  const [color1, color2, color3] = getSkillLevelColors(sport.skillLevel);

  return (
    <XStack space="$1.5" alignItems="center">
      <Circle
        size={10}
        borderColor={"black"}
        borderWidth={1}
        backgroundColor={color1}
      ></Circle>
      <Circle
        size={10}
        borderColor={"black"}
        borderWidth={1}
        backgroundColor={color2}
      ></Circle>
      <Circle
        size={10}
        borderColor={"black"}
        borderWidth={1}
        backgroundColor={color3}
      ></Circle>
    </XStack>
  );
}
