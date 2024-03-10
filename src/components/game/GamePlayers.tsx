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

const gamePlayers: User[] = [
  { username: 'user1', displayName: 'user1', bio: 'bio', avatarUrl: '', sports: [] },
  { username: 'user2', displayName: 'user2', bio: 'bio', avatarUrl: '', sports: [] },
  { username: 'user3', displayName: 'user3', bio: 'bio', avatarUrl: '', sports: [] },
  { username: 'user4', displayName: 'user4', bio: 'bio', avatarUrl: '', sports: [] },
  { username: 'user5', displayName: 'user5', bio: 'bio', avatarUrl: '', sports: [] },
  // Add more users as needed
];


const GamePlayers = ({ navigation }: { navigation: any }) => {
    const { createGame } = useMutationGame();
    const [loading, session] = useStore((state) => [
      state.loading,
      state.session,
    ]);
  
    // game attributes
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [sport, setSport] = useState(sports[0].name);
    const [skillLevel, setSkillLevel] = useState("0");
    const [playerLimit, setPlayerLimit] = useState("1");
    const [description, setDescription] = useState("");
  
    // Toasts
    const toast = useToastController();
  
    function clearGameAttributes() {
      setTitle("");
      setDate(new Date());
      setTime(new Date());
      setAddress("");
      setCity("");
      setState("");
      setZip("");
      setSport(sports[0].name);
      setSkillLevel("0");
      setPlayerLimit("1");
      setDescription("");
    }

  
    return (
      <View className="border-2 border-blue-500" style={{ display: 'flex', height: 700}}>
        <ToastViewport />
        <ToastDemo />
        {session && session.user ? (

        <YStack style={{ flex: 1 }} >
          <YStack style={{ flex: 1, marginRight: 5 }}>
            <Label size={5} width={100} style={{ justifyContent: 'center'}}>
                  <H6>Accepted Players</H6>
            </Label>
            <Card style={{ width: '100%', height: 240}} elevate size="$5">
              {gamePlayers.length > 0 ? (
                <YStack style={{ overflowY: 'auto' }}>
                {gamePlayers.map((user, index) => (
                  <AcceptedPlayer index={index} user={user}/>
                ))}
                </YStack>
              ) : (
                <Text>No Accepted Players</Text>
              )}
            </Card>
          </YStack>

          <YStack style={{ flex: 1, marginLeft: 5 }}>
            <Label size={5} width={100} style={{ justifyContent: 'center' }}>
                  <H6>Join Requests</H6>
            </Label>
            <Card style={{ width: '100%', height: 240, overflowY: 'auto' }} elevate size="$5">
              <Text>card 2</Text>
            </Card>
          </YStack>
        </YStack>
              
        ) : (
        <View className="items-center justify-center flex-1 p-12 text-center">
        </View>
    )}
    </View>
    );
};
  
  export default GamePlayers;