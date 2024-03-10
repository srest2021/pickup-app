import { YStack, ScrollView, H4, Spinner, Separator, XStack, Button } from "tamagui";
import { Alert, View } from "react-native";
import useQueryGames from "../../hooks/use-query-games";
import { Tabs, Text } from "tamagui";
import GameThumbnail from "./GameThumbnail";
import { useStore } from "../../lib/store";
import { useEffect, useState } from "react";
import { Check, Delete, X } from "@tamagui/lucide-icons";

const NonAcceptedPlayer = ({ index, user }: { index: any; user: any }) => {

  return (
    <View margin={10}>
        <XStack>
            <Text fontSize={20} index={index} marginRight={30}>{user.username}</Text>
            <Button icon={X} style={{ backgroundColor: 'red', color: 'white', marginRight: 10  }}> </Button>
            <Button icon={Check} style={{ backgroundColor: 'green', color: 'white' }}> </Button>
        </XStack>
    </View>
  );
};

export default NonAcceptedPlayer;