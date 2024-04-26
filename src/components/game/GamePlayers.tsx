import { View, ScrollView, Alert } from "react-native";
import { Label, YStack, Text, H6, Card } from "tamagui";
import { useStore } from "../../lib/store";
import AcceptedPlayer from "./AcceptedPlayer";
import { FeedGame, Game, JoinedGame } from "../../lib/types";

const GamePlayers = ({
  navigation,
  game,
  gametype,
}: {
  navigation: any;
  game: Game;
  gametype: string;
}) => {
  const [session] = useStore((state) => [state.session]);

  const convertedGame =
    gametype === "feed" ? (game as FeedGame) : (game as JoinedGame);

  return (
    <View style={{ display: "flex" }}>
      {session && session.user ? (
        <YStack style={{ flex: 1 }}>
          <YStack style={{ flex: 1, alignItems: "center" }}>
            <Label size={5} paddingBottom="$2">
              <H6>
                Accepted Players ({convertedGame.currentPlayers}/
                {convertedGame.maxPlayers})
              </H6>
            </Label>
            <Card
              style={{
                width: "100%",
                maxHeight: 240,
                justifyContent: "center",
              }}
              elevate
              size="$5"
            >
              <ScrollView testID="accepted-players-container">
                {convertedGame.acceptedPlayers ? (
                  convertedGame.acceptedPlayers.length > 0 ? (
                    <YStack space="$2" padding="$3">
                      {convertedGame.acceptedPlayers.map((user, index) => (
                        <AcceptedPlayer
                          key={index}
                          user={user}
                          gameId={convertedGame.id}
                          isOrganizer={false}
                          navigation={navigation}
                        />
                      ))}
                    </YStack>
                  ) : (
                    <Text padding="$3">No accepted players yet</Text>
                  )
                ) : (
                  <Text padding="$3">Loading...</Text>
                )}
              </ScrollView>
            </Card>
          </YStack>
        </YStack>
      ) : (
        <View className="items-center justify-center flex-1 p-12 text-center"></View>
      )}
    </View>
  );
};

export default GamePlayers;
