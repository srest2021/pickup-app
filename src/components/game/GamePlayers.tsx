import { View, ScrollView, Alert } from "react-native";
import useMutationGame from "../../hooks/use-mutation-game";
import {
  Adapt,
  Button,
  Label,
  Input,
  RadioGroup,
  Select,
  Sheet,
  TextArea,
  XStack,
  YStack,
  Text,
  H4,
  H6,
  Card,
  SizableText,
} from "tamagui";
import { useMemo, useState } from "react";
import { useStore } from "../../lib/store";
import { Check, ChevronDown } from "@tamagui/lucide-icons";
import { SkillLevel, sports } from "../../lib/types";
import { ToastViewport, useToastController } from "@tamagui/toast";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ToastDemo } from "../Toast";
import { User, UserSport } from "../../lib/types";
import AcceptedPlayer from "./AcceptedPlayer";
import NonAcceptedPlayer from "./NonAcceptedPlayers";

const GamePlayers = ({ navigation }: { navigation: any }) => {
  const [session, selectedMyGame] = useStore((state) => [
    state.session,
    state.selectedMyGame
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
              <H6>Accepted Players</H6>
            </Label>
            <Card style={{ width: "100%", height: 240 }} elevate size="$5">
              <ScrollView>
                {(acceptedPlayers && acceptedPlayers.length > 0) ? (
                  <YStack>
                    {acceptedPlayers.map((user, index) => (
                      <AcceptedPlayer key={index} user={user} />
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
                {(joinRequests && joinRequests.length > 0) ? (
                  <YStack>
                    {joinRequests.map((user, index) => (
                      <NonAcceptedPlayer key={index} user={user} />
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

export default GamePlayers;
