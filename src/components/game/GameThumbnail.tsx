import { Game, sports } from "../../lib/types";
import { Button, Card, H3, H4, H5, H6, Text, Image, View, Paragraph } from 'tamagui';

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
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <View alignItems="Left" marginRight={30}>
        <H4>{game.title}</H4>
        <H4>{date}</H4>
        <H5>{time}</H5>
        </View>
        <View style={{alignItems:'flex-end'}}>
          <Button style={{backgroundColor:'#ff7403'}} onPress={() => navigation.navigate("MyGameView", { game })}>
            <H5>View</H5>
          </Button>
        </View>
      </View>
      </Card.Header>
      <View alignSelf="left" marginLeft={25} style={{ flex: 0.5 }}>
      <Paragraph fontWeight="500">{game.description}</Paragraph>
      </View>
      <Card.Footer padded>
        <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
          <H6>{game.sport.skillLevel}</H6>
          <H6>{game.maxPlayers}</H6>
        </View>
      </Card.Footer>
      <Card.Background>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        {image && (<Image
          resizeMode="contain"
          alignSelf="center"
          source={{
            width:200,
            height:200,
            uri:`${image}`}}
            style={{opacity:0.40}}
        />)}
        </View>
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
