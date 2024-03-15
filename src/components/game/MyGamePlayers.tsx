import { View, ScrollView, Alert } from "react-native";
import { Label, YStack, Text, H6, Card } from "tamagui";
import { useStore } from "../../lib/store";
import { ToastViewport, useToastController } from "@tamagui/toast";
import { ToastDemo } from "../Toast";
import AcceptedPlayer from "./AcceptedPlayer";
import NonAcceptedPlayer from "./NonAcceptedPlayers";

const MyGamePlayers = ({ navigation }: { navigation: any }) => {
  const [session, selectedMyGame] = useStore((state) => [
    state.session,
    state.selectedMyGame,
  ]);

  const acceptedPlayers = selectedMyGame?.acceptedPlayers;
  const joinRequests = selectedMyGame?.joinRequests;

  return (
    <View style={{ display: "flex", height: 700, marginTop: 20 }}>
      <ToastViewport />
      <ToastDemo />
      {session && session.user ? (
        <YStack style={{ flex: 1 }}>
          <YStack style={{ flex: 1, alignItems: "center" }}>
            <Label size={5}>
              <H6>
                Accepted Players ({selectedMyGame?.currentPlayers}/
                {selectedMyGame?.maxPlayers})
              </H6>
            </Label>
            <Card style={{ width: "100%", height: 240 }} elevate size="$5">
              <ScrollView>
                {acceptedPlayers && acceptedPlayers.length > 0 ? (
                  <YStack>
                    {acceptedPlayers.map((user, index) => (
                      <AcceptedPlayer
                        key={index}
                        user={user}
                        gameId={selectedMyGame.id}
                        isOrganizer={true}
                      />
                    ))}
                  </YStack>
                ) : (
                  <Text>No Accepted Players</Text>
                )}
              </ScrollView>
            </Card>
          </YStack>

          <YStack style={{ flex: 1, marginLeft: 5, alignItems: "center" }}>
            <Label size={5} style={{ justifyContent: "center" }}>
              <H6>Join Requests</H6>
            </Label>
            <Card style={{ width: "100%", height: 240 }} elevate size="$5">
              <ScrollView>
                {joinRequests && joinRequests.length > 0 ? (
                  <YStack>
                    {joinRequests.map((user, index) => (
                      <NonAcceptedPlayer
                        key={index}
                        user={user}
                        gameId={selectedMyGame.id}
                        currentPlayers={selectedMyGame.currentPlayers}
                        maxPlayers={selectedMyGame.maxPlayers}
                      />
                    ))}
                  </YStack>
                ) : (
                  <Text>No Join Requests</Text>
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
