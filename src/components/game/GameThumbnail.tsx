import { Game, sports } from "../../lib/types";
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
    weekday: "short",
    month: "numeric",
    day: "numeric",
  });

  const sportName = game.sport.name;
  let image=null
  for (const sport of sports){
    if(sport.name.toLowerCase() === sportName.toLowerCase()){
      image = sport.image
    }
  }

  return (
    <Card elevate size="$5">
      <Card.Header padded>
        <H4>{game.title}</H4>
        <H4>{date}</H4>
        <H5>{time}</H5>
      </Card.Header>
      {<H6>{game.description}</H6>}
      <Card.Footer padded>
      <Button onPress={() => navigation.navigate("MyGameView", { game })}>
        <H5>View</H5>
      </Button>
      </Card.Footer>
      <Card.Background>
        {image && (<Image
          resizeMode="contain"
          alignSelf="center"
          source={{
            width:225,
            height:225,
            uri:`${image}`}}
        />)}
      </Card.Background>
    </Card>
  );
}

/*<Image
          resizeMode="contain"
          alignSelf="center"
          source={{
            width:200,
            height:200,
            uri:require('../../../assets/basketball.png')}}
        />* */
