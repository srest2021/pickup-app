import { View, Text } from "react-native";
import { SkillLevel, Game as GameType } from "../../lib/types";
import useQueryGames from "../../hooks/use-query-games";
import {Button, Card, H3,H4,H5, Separator} from 'tamagui';


export default function Game({ game }: { game: GameType }) {
  const time = game.datetime.toLocaleTimeString([],{hour: 'numeric', minute: '2-digit', hour12: true});
  const month = game.datetime.getMonth();
  const date = game.datetime.getDate();
  return (
    <Card elevate size = "$5">
        <Card.Header padded>
        <H3>`${game.title}`</H3> 
        <Separator alignSelf= "stretch" vertical />
        <H4> `${month}/{date}`</H4>
        <Separator alignSelf= "stretch" vertical />
        <H5> `${time}`</H5>
        </Card.Header>
        <Card.Footer padded> 

        </Card.Footer>.
        <Text>`${game.description}`</Text>
        <Button>Edit Button </Button>
        <Button>Delete Button</Button>

        {/** Add other components here for the game  */}
        <Card.Background />
    </Card> 
  );
}
