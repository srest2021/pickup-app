import { Game, sports } from "../../lib/types";
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
import GameSkillView from "./GameSkillView";
import { useStore } from "../../lib/store";

export default function GameThumbnail({
  navigation,
  game,
}: {
  navigation: any;
  game: Game;
}) {
  const [setSelectedMyGame] = useStore((state) => [state.setSelectedMyGame]);

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

  return (
    <View paddingLeft="$5" paddingRight="$5">
      <Card elevate size="$5">
        <Card.Header padded>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View alignItems="baseline" marginRight={30}>
              <H4 testID="game-title">{game.title}</H4>
              <H4 testID="game-date">{date}</H4>
              <H5>{time}</H5>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Button
                style={{ backgroundColor: "#ff7403" }}
                onPress={() => {
                  const gameId = game.id;
                  setSelectedMyGame(game);
                  navigation.navigate("MyGameView", { gameId });
                }}
              >
                <H5 testID="view-button">View</H5>
              </Button>
            </View>
          </View>
        </Card.Header>
        <View alignSelf="baseline" marginLeft={25} style={{ flex: 0.5 }}>
          <Paragraph
            fontWeight="500"
            marginRight={95}
            testID="game-description"
          >
            {game.description}
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
              <GameSkillView sport={game.sport} />
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
