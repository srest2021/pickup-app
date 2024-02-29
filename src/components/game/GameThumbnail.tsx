import { Game as GameType } from "../../lib/types";
import { Card, H3, H4, H5, Separator, Button } from "tamagui";

export default function GameThumbnail({ game }: { game: GameType }) {
  const datetime = new Date(game.datetime);
  const time = datetime.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return (
    <Card elevate size="$5">
      <Card.Header padded>
        <H3>{`${game.title}`}</H3>
        <Separator alignSelf="stretch" vertical />
        <H4>
          {datetime.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </H4>
        <Separator alignSelf="stretch" vertical />
        <H5>{`${time}`}</H5>
      </Card.Header>

      <Button>View</Button>

      <Card.Footer />
      {/** Add other components here for the game  */}
      <Card.Background />
    </Card>
  );
}
