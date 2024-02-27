import { View, Text } from "react-native";
import { SkillLevel, Game as GameType } from "../lib/types";
import useQueryGames from "../hooks/use-query-games";
import {Card} from 'tamagui';


export default function Game({ game }: { game: GameType }) {
    
    useQueryGames();

  return (
    <Card>
        <Card.Header />
        <Card.Footer />
        {/** Add other components here for the game  */}
        <Card.Background />
    </Card> 
  );
}
