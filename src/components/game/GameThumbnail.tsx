import { Game } from "../../lib/types";
import { Button, Card, H3, H4, H5, H6, Separator, Text, Image } from 'tamagui';

export default function GameThumbnail({
  navigation,
  game,
}: {
  navigation: any;
  game: Game;
}) {
  const datetime = new Date(game.datetime);
  const time = datetime.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  const date = datetime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return (
    <Card elevate size="$5">
      <Card.Header padded>
        <H3>{game.title}</H3>
        <Separator alignSelf="stretch" vertical />
        <H4>{date}</H4>
        <Separator alignSelf="stretch" vertical />
        <H5>{time}</H5>
      </Card.Header>
      <Button onPress={() => navigation.navigate("MyGameView", { game })}>
        <H5>View</H5>
      </Button>
      <Card.Footer padded>
        <H6>{game.description}</H6>
      </Card.Footer>
      <Card.Background>
      </Card.Background>
    </Card>
  );
}

/*<Image
          resizeMode="contain"
          alignSelf="center"
          source={require('../../../assets/basketball.png')}
        />* */
