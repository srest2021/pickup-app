import { YStack, Text, Theme, Button } from 'tamagui';
import { Game } from '../../lib/types';

const GameView = ({ route }) => {
  const game = route.params;
  const { title, description, datetime, address, sport, maxPlayers } = game.game;

  // Convert datetime to a readable string
  const displayDate = datetime.toLocaleDateString("en-US", {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <YStack 
      position="relative"
      padding="$4" 
      space="$2" 
      backgroundColor="$background" 
      borderRadius={10}
      alignItems="center"
    >
      {/* Edit button positioned on the top right of the view */}
      <Button 
          position="absolute"
          top={0}
          right={0}
          size="$2"
          onPress={() => console.log('Edit game')}>
          Edit
      </Button>

      <Text fontWeight="bold">
        {title}
      </Text>
      <Text fontStyle="italic">{displayDate}</Text> 
      <Text>Sport: {sport.name}</Text>
      <Text>Skill Level: {sport.skillLevel}</Text>
      <Text>Max Players: {maxPlayers}</Text>
      <Text>Address: {address}</Text>
      <YStack padding="$2" space="$1">
        <Text>Description:</Text>
        <Text>{description}</Text>
      </YStack>
    </YStack>
  );
};

export default GameView;
