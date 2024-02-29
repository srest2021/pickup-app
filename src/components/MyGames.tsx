import { Text, Button, YStack, ScrollView } from "tamagui";
import { View } from "react-native";
import useQueryGames from "../hooks/use-query-games";
import FeedGameView from "./game/GameView";
import { Separator, SizableText, Tabs } from "tamagui";
import Games from "./game/Games";
import GameThumbnail from "./game/GameThumbnail";

// 
// add event listener so that page is constantly updating! 
// add switch so that you can go between myGame and AllGames 
// PICK A MINWIDTH SO THAT text always shown 
const MyGames = ({navigation}:{navigation:any}) => {
    const {myGames, fetchMyGames} = useQueryGames();
    // const fetchJoinedGames = useQueryGames();


  const toMyGames = async() => {
    try{
        const games =  await fetchMyGames();
    } catch (error){
        console.log(error);
    }
   
  };

  const toJoinedGames = () => {
    // Figure out how to swtich to AllGames (probably useStore) 
  }

  // Navigate to myGames view after create game 

  return (
    <View className="p-12">
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack space="$5" padding="12">
          {myGames.map((myGame) => (
            <GameThumbnail
              navigation={navigation}
              game={myGame}
              key={myGame.id}
            />
          ))}
        </YStack>
      </ScrollView>
      <Tabs
      defaultValue="MyGames"
      orientation="horizontal"
      flexDirection="column"
      height={150}
      minWidth={200} 
      borderRadius="$4"
      borderWidth="$0.25"
      overflow="hidden"
      >
        <Tabs.List
        disablePassBorderRadius="bottom">
          <Tabs.Tab value = "MyGames" onInteraction={toMyGames}>
          <SizableText>My Games</SizableText>
          </Tabs.Tab>
          <Tabs.Tab value = "JoinedGames" onInteraction={toJoinedGames}>
          <SizableText>Joined Games</SizableText>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Games></Games>
    </View>
  );
};

export default MyGames;
