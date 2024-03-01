import { GameSport } from "../../lib/types";
import { Circle, H6, XStack } from "tamagui";

export default function GameSkillView({ sport }: { sport: GameSport }) {
  const level = sport.skillLevel;
  let color1 = "white";
  let color2 = "white";
  let color3 = "white";
  switch (level) {
    case 0:
      color1 = "black";
      break;
    case 1:
      color1 = "black";
      color2 = "black";
      break;
    case 2:
      color1 = "black";
      color2 = "black";
      color3 = "black";
      break;
  }
  return (
    <XStack padding="$1.5" space="$1.5" alignItems="center">
      <H6>Skill:</H6>
      <Circle
        size={8}
        borderColor="black"
        borderWidth={1}
        backgroundColor={color1}
      ></Circle>
      <Circle
        size={8}
        borderColor="black"
        borderWidth={1}
        backgroundColor={color2}
      ></Circle>
      <Circle
        size={8}
        borderColor="black"
        borderWidth={1}
        backgroundColor={color3}
      ></Circle>
    </XStack>
  );
}
