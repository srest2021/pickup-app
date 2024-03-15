import {
  YStack,
  ScrollView,
  H4,
  Spinner,
  Separator,
  XStack,
  Button,
} from "tamagui";
import { Alert, View } from "react-native";
import useQueryGames from "../../hooks/use-query-games";
import { Tabs, Text } from "tamagui";
import GameThumbnail from "./GameThumbnail";
import { useStore } from "../../lib/store";
import { useEffect, useState } from "react";
import { Check, Delete, X } from "@tamagui/lucide-icons";
import { User } from "../../lib/types";
import useMutationGame from "../../hooks/use-mutation-game";

const NonAcceptedPlayer = ({
  user,
  gameId,
  maxPlayers,
  currentPlayers,
}: {
  user: User;
  gameId: string;
  currentPlayers: number;
  maxPlayers: number;
}) => {
  const { acceptJoinRequestById, rejectJoinRequestById } = useMutationGame();

  const handleAccept = async () => {
    if (currentPlayers + 1 > maxPlayers) {
      Alert.alert("This game is already full!");
      return;
    }
    await acceptJoinRequestById(gameId, user.id);
  };

  const handleReject = async () => {
    await rejectJoinRequestById(gameId, user.id);
  };

  return (
    <View margin={10}>
      <XStack alignItems="center">
        <Text fontSize={20} marginRight={30}>
          {user.username}
        </Text>
        <Button
          icon={X}
          style={{ backgroundColor: "#e90d52", color: "white", marginRight: 10 }}
          onPress={() => handleReject()}
        />
        <Button
          icon={Check}
          style={{ backgroundColor: "#05a579", color: "white" }}
          onPress={() => handleAccept()}
        />
      </XStack>
    </View>
  );
};

export default NonAcceptedPlayer;
