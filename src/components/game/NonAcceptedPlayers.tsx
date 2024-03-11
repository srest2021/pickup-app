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
}: {
  user: User;
  gameId: string;
}) => {
  const { acceptJoinRequestById, rejectJoinRequestById } = useMutationGame();

  const handleAccept = async () => {
    await acceptJoinRequestById(gameId, user.id);
  };

  const handleReject = async () => {
    await rejectJoinRequestById(gameId, user.id);
  };

  return (
    <View margin={10}>
      <XStack>
        <Text fontSize={20} marginRight={30}>
          {user.username}
        </Text>
        <Button
          icon={X}
          style={{ backgroundColor: "red", color: "white", marginRight: 10 }}
          onPress={() => handleReject()}
        />
        <Button
          icon={Check}
          style={{ backgroundColor: "green", color: "white" }}
          onPress={() => handleAccept()}
        />
      </XStack>
    </View>
  );
};

export default NonAcceptedPlayer;
