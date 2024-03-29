import { supabase } from "../../lib/supabase";
import { ScrollView, View, Text } from "react-native";
import Avatar from "./Avatar";
import Sports from "./Sports";
import { Button, Card, SizableText, YStack } from "tamagui";
import useMutationUser from "../../hooks/use-mutation-user";
import { useStore } from "../../lib/store";
import { Dimensions } from "react-native";
import { Edit3, Loader } from "@tamagui/lucide-icons";
import AddSport from "./AddSport";
import { ToastViewport, useToastController } from "@tamagui/toast";
import { ToastDemo } from "../Toast";

export default function FriendPage({ navigation }: { navigation: any }) {

  return (
    <View style={{ flex: 1 }}>
      <ToastViewport />
      <ToastDemo />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            backgroundColor: "#08348c",
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            padding: 12,
          }}
        >
          <Text>Hi friends!</Text>
        </View>
      </ScrollView>
    </View>
  );
}
