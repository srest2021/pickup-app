import { MyGame, Game, sports, FeedGame, JoinedGame } from "../../lib/types";
import {
  Button,
  Card,
  H4,
  H5,
  H6,
  Image,
  View,
  Paragraph,
  XStack,
} from "tamagui";
import SportSkill from "../SportSkill";
import { useStore } from "../../lib/store";
import useQueryUsers from "../../hooks/use-query-users";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import Avatar from "../user/Avatar";

export default function GameThumbnail({
  navigation,
  game,
  gametype,
}: {
  navigation: any;
  game: Game;
  gametype: string;
}) {
  const [setSelectedMyGame] = useStore((state) => [state.setSelectedMyGame]);
  const [setSelectedFeedGame] = useStore((state)=>[state.setSelectedFeedGame]);
  const [setSelectedJoinedGame] = useStore((state)=>[state.setSelectedJoinedGame]);
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(''); 
  const {getOtherProfile} = useQueryUsers();
  const datetime = new Date(game.datetime);
  const time = datetime.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const date = datetime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
  });
  const sportName = game.sport.name;
  let image = null;
  for (const sport of sports) {
    if (sport.name.toLowerCase() === sportName.toLowerCase()) {
      image = sport.image;
    }
  }
  const abbrevDescription =
    game.description.length > 100
      ? game.description.substring(0, 100) + "..."
      : game.description;
  
      useEffect(() => {
        const fetchData = async () => {
          try {
            const organizer = await getOtherProfile(game.organizerId);
            if (organizer) {
              setDisplayName(organizer.displayName);
              await downloadImage(organizer.avatarUrl);
            }
          } catch (error) {
            Alert.alert("Error getting organizer");
          }
        };
        fetchData();
      }, []);

      async function downloadImage(path: string) {
          const { data, error } = await supabase.storage
            .from("avatars")
            .download(path);
          if (error) {
            throw error;
          }
          const fr = new FileReader();
          fr.readAsDataURL(data);
          fr.onload = () => {
            setAvatarUrl(fr.result as string);
          };
      }

  return (
    <View paddingLeft="$5" paddingRight="$5">
      <Card elevate size="$5">
        <Card.Header padded>
          <XStack
            style={{ justifyContent: "space-between", overflow: "hidden" }}
          >
            <View style={{ flex: 1 }}>
              <H4 testID="game-title">{game.title}</H4>
              <H4 testID="game-date">{date}</H4>
              <H5>{time}</H5>
              <XStack space='$2' alignItems='center'>
              {avatarUrl &&( <Image source={{ uri: avatarUrl, width: 35,
                  height: 35, }} style={{width:35,height:35,borderRadius:17.5}} accessibilityLabel="Avatar"/>)}
                <Paragraph>@{displayName}</Paragraph>
              </XStack>
            </View>
            <View style={{ objectPosition: "absolute" }}>
              <Button
                style={{ backgroundColor: "#ff7403" }}
                onPress={() => {
                  const gameId = game.id;
                  if (gametype === 'my'){
                    setSelectedMyGame(game as MyGame);
                    navigation.navigate("MyGameView", { gameId });
                  } else if (gametype === 'feed'){
                    setSelectedFeedGame(game as FeedGame);
                    navigation.navigate("GameView", {gameId});
                  } else if (gametype === 'joined'){
                    setSelectedJoinedGame(game as JoinedGame);
                    navigation.navigate("GameView", {gameId});
                  }
                }}
              >
                <H5 testID="view-button">View</H5>
              </Button>
            </View>
          </XStack>
        </Card.Header>
        <View
          space="$2"
          alignSelf="baseline"
          marginLeft={25}
          style={{ flex: 0.5 }}
        >
          <Paragraph fontWeight="600" fontSize="$6">
            {game.distanceAway} miles away
          </Paragraph>
          <Paragraph
            fontWeight="500"
            marginRight={95}
            testID="game-description"
          >
            {abbrevDescription}
          </Paragraph>
        </View>
        <Card.Footer padded>
          <View
            alignItems="center"
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <XStack padding="$1.5" space="$1.5">
              <H6>Skill:</H6>
              <SportSkill sport={game.sport} />
            </XStack>

            <H6 style={{ position: "absolute", right: 0 }}>
              {game.currentPlayers}/{game.maxPlayers} players
            </H6>
          </View>
        </Card.Footer>
        <Card.Background>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            {image && (
              <Image
                resizeMode="contain"
                alignSelf="center"
                testID="game-thumbnail-image"
                source={{
                  width: 170,
                  height: 170,
                  uri: `${image}`,
                }}
                style={{ opacity: 0.4 }}
              />
            )}
          </View>
        </Card.Background>
      </Card>
    </View>
  );
}
