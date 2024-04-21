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
  Text,
} from "tamagui";
import SportSkill from "../SportSkill";
import { useStore } from "../../lib/store";
import { useEffect, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { supabase } from "../../lib/supabase";

export default function GameThumbnail({
  navigation,
  game,
  gametype,
}: {
  navigation: any;
  game: Game;
  gametype: string;
}) {
  const [
    user,
    loading,
    setSelectedMyGame,
    setSelectedFeedGame,
    setSelectedJoinedGame,
  ] = useStore((state) => [
    state.user,
    state.loading,
    state.setSelectedMyGame,
    state.setSelectedFeedGame,
    state.setSelectedJoinedGame,
  ]);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
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
    if (gametype === "my") {
      setUsername(user ? user.username : null);
      user && fetchData(user.avatarUrl);
    } else {
      const gameWithOrganizer =
        gametype === "feed" ? (game as FeedGame) : (game as JoinedGame);
      setUsername(gameWithOrganizer.organizer.username);
      setUserId(gameWithOrganizer.organizerId);
      gameWithOrganizer.organizer.avatarUrl &&
        fetchData(gameWithOrganizer.organizer.avatarUrl);
    }
  }, []);

  const fetchData = async (avatarPath: string) => {
    if (avatarPath) {
      try {
        await downloadImage(avatarPath);
      } catch (error) {
        Alert.alert("Error getting game organizer");
      }
    }
  };

  async function downloadImage(path: string) {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(path);
    if (error) throw error;

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
              {(gametype === "feed" || gametype === "joined") && (
                <XStack space="$2" alignItems="center">
                  {avatarUrl && (
                    <Image
                      source={{ uri: avatarUrl, width: 35, height: 35 }}
                      style={{ width: 35, height: 35, borderRadius: 17.5 }}
                      accessibilityLabel="Avatar"
                    />
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("OtherProfileView", {
                        userId: userId,
                      });
                    }}
                  >
                    <Text fontSize="$5" ellipsizeMode="tail">
                      <Text textDecorationLine="none">@</Text>
                      <Text textDecorationLine="underline">{username}</Text>
                    </Text>
                  </TouchableOpacity>
                </XStack>
              )}
            </View>
            <View style={{ objectPosition: "absolute" }}>
              <Button
                style={{ backgroundColor: "#ff7403" }}
                onPress={() => {
                  const gameId = game.id;
                  if (gametype === "my") {
                    setSelectedMyGame(game as MyGame);
                    navigation.navigate("MyGameView", { gameId });
                  } else if (gametype === "feed") {
                    setSelectedFeedGame(game as FeedGame);
                    navigation.navigate("GameView", {
                      gameId,
                      username,
                      userId,
                    });
                  } else if (gametype === "joined") {
                    setSelectedJoinedGame(game as JoinedGame);
                    navigation.navigate("JoinedGameView", {
                      gameId,
                      username,
                      userId,
                    });
                  }
                }}
              >
                <H5 testID="view-button" style={{ color: "#ffffff" }}>
                  View
                </H5>
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
