import { View, ScrollView, Alert } from "react-native";
import { Label, YStack, Text, H6, Card } from "tamagui";
import { useStore } from "../../lib/store";
import AcceptedPlayer from "./AcceptedPlayer";
import NonAcceptedPlayer from "./NonAcceptedPlayers";

const MyGamePlayers = ({ navigation }: { navigation: any }) => {
  const [session, selectedMyGame] = useStore((state) => [
    state.session,
    state.selectedMyGame,
  ]);

  return (
    <View style={{ display: "flex" }}>
      {session && session.user ? (
        <YStack style={{ flex: 1 }}>
          <YStack style={{ flex: 1, alignItems: "center", paddingBottom: 20 }}>
            <Label size={5} paddingBottom="$2">
              <H6>
                Accepted Players ({selectedMyGame?.currentPlayers}/
                {selectedMyGame?.maxPlayers})
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
              <ScrollView>
                {selectedMyGame?.acceptedPlayers ? (
                  selectedMyGame?.acceptedPlayers.length > 0 ? (
                    <YStack
                      space="$2"
                      padding="$3"
                      testID="accepted-players-container"
                    >
                      {selectedMyGame?.acceptedPlayers.map((user, index) => (
                        <AcceptedPlayer
                          key={index}
                          user={user}
                          gameId={selectedMyGame.id}
                          isOrganizer={true}
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

          <YStack style={{ flex: 1, alignItems: "center" }}>
            <Label size={5} paddingBottom="$2">
              <H6>Join Requests</H6>
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
              <ScrollView>
                {selectedMyGame?.joinRequests ? (
                  selectedMyGame?.joinRequests.length > 0 ? (
                    <YStack
                      space="$2"
                      padding="$3"
                      testID="join-requests-container"
                    >
                      {selectedMyGame?.joinRequests.map((user, index) => (
                        <NonAcceptedPlayer
                          key={index}
                          user={user}
                          gameId={selectedMyGame?.id}
                          currentPlayers={selectedMyGame?.currentPlayers}
                          maxPlayers={selectedMyGame?.maxPlayers}
                          navigation={navigation}
                        />
                      ))}
                    </YStack>
                  ) : (
                    <Text padding="$3">No join requests yet</Text>
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

export default MyGamePlayers;
